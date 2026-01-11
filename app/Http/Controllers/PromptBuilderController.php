<?php

namespace App\Http\Controllers;

use App\Http\Requests\Prompt\StorePromptTemplateRequest;
use App\Http\Requests\Prompt\TestPromptRequest;
use App\Http\Requests\Prompt\UpdatePromptTemplateRequest;
use App\Models\PromptTemplate;
use App\Models\UserLlmSetting;
use App\Services\Llm\LlmService;
use App\Services\Prompt\PromptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PromptBuilderController extends Controller
{
    public function __construct(
        private PromptService $promptService,
        private LlmService $llmService
    ) {}

    /**
     * Display the prompt builder interface.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $templates = PromptTemplate::query()
            ->userTemplates($user->id)
            ->with('user')
            ->orderByRaw('is_system DESC')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'category' => $t->category,
                'description' => $t->description,
                'content' => $t->content,
                'variables' => $t->variables,
                'intent' => $t->intent,
                'expected_output_format' => $t->expected_output_format,
                'is_system' => $t->is_system,
                'is_favorite' => $t->is_favorite,
                'usage_count' => $t->usage_count,
                'created_at' => $t->created_at?->toIso8601String(),
            ]);

        $llmSettings = UserLlmSetting::query()
            ->where('user_id', $user->id)
            ->where('status', 'online')
            ->with('provider')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'provider' => [
                    'name' => $s->provider->name,
                    'slug' => $s->provider->slug,
                ],
                'is_default' => $s->is_default,
            ]);

        $categories = $this->promptService->getCategories($user->id)
            ->map(fn ($c) => [
                'name' => $c->category,
                'count' => $c->count,
            ]);

        return Inertia::render('prompts/builder', [
            'templates' => $templates,
            'llmSettings' => $llmSettings,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new prompt template.
     */
    public function store(StorePromptTemplateRequest $request)
    {
        $user = Auth::user();

        $template = PromptTemplate::create([
            'user_id' => $user->id,
            'name' => $request->input('name'),
            'category' => $request->input('category'),
            'description' => $request->input('description'),
            'content' => $request->input('content'),
            'variables' => $request->input('variables', []),
            'intent' => $request->input('intent'),
            'expected_output_format' => $request->input('expected_output_format'),
            'is_system' => false,
            'is_favorite' => $request->input('is_favorite', false),
            'usage_count' => 0,
        ]);

        return redirect()
            ->route('prompts.builder')
            ->with('success', 'Template created successfully.');
    }

    /**
     * Update an existing prompt template.
     */
    public function update(UpdatePromptTemplateRequest $request, PromptTemplate $template)
    {
        $template->update([
            'name' => $request->input('name'),
            'category' => $request->input('category'),
            'description' => $request->input('description'),
            'content' => $request->input('content'),
            'variables' => $request->input('variables', []),
            'intent' => $request->input('intent'),
            'expected_output_format' => $request->input('expected_output_format'),
            'is_favorite' => $request->input('is_favorite', false),
        ]);

        return redirect()
            ->route('prompts.builder')
            ->with('success', 'Template updated successfully.');
    }

    /**
     * Delete a prompt template.
     */
    public function destroy(PromptTemplate $template)
    {
        $this->authorizeUser($template);

        // System templates cannot be deleted
        if ($template->is_system) {
            return redirect()
                ->route('prompts.builder')
                ->with('error', 'System templates cannot be deleted.');
        }

        $template->delete();

        return redirect()
            ->route('prompts.builder')
            ->with('success', 'Template deleted successfully.');
    }

    /**
     * Test a prompt template against an LLM.
     */
    public function test(TestPromptRequest $request, PromptTemplate $template): JsonResponse
    {
        // Increase execution time for LLM requests
        set_time_limit(120);

        $this->authorizeUser($template);

        $llmSetting = UserLlmSetting::findOrFail($request->input('user_llm_setting_id'));

        // Ensure the LLM setting belongs to the user
        if ($llmSetting->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $variables = $request->input('variables', []);

        try {
            $test = $this->promptService->testPrompt($template, $variables, $llmSetting);

            return response()->json([
                'success' => $test->status === 'success',
                'test' => [
                    'id' => $test->id,
                    'rendered_prompt' => $test->rendered_prompt,
                    'response' => $test->response,
                    'status' => $test->status,
                    'error_message' => $test->error_message,
                    'duration_ms' => $test->duration_ms,
                    'created_at' => $test->created_at->toIso8601String(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Prompt test failed', [
                'template_id' => $template->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get test history for a prompt template.
     */
    public function tests(PromptTemplate $template): JsonResponse
    {
        $this->authorizeUser($template);

        $tests = $template->tests()
            ->with('llmSetting.provider')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'rendered_prompt' => $t->rendered_prompt,
                'input_variables' => $t->input_variables,
                'response' => $t->response,
                'status' => $t->status,
                'error_message' => $t->error_message,
                'tokens_used' => $t->tokens_used,
                'duration_ms' => $t->duration_ms,
                'llm_setting' => [
                    'name' => $t->llmSetting->name,
                    'provider' => $t->llmSetting->provider->name,
                ],
                'created_at' => $t->created_at->toIso8601String(),
            ]);

        return response()->json([
            'tests' => $tests,
        ]);
    }

    /**
     * Preview a prompt with variables (real-time rendering).
     */
    public function preview(Request $request): JsonResponse
    {
        $content = $request->input('content', '');
        $variables = $request->input('variables', []);

        // Create a temporary template object for rendering
        $template = new PromptTemplate([
            'content' => $content,
        ]);

        $renderedPrompt = $this->promptService->renderPrompt($template, $variables);
        $extractedVariables = $this->promptService->extractVariables($content);

        return response()->json([
            'rendered_prompt' => $renderedPrompt,
            'variables' => $extractedVariables,
        ]);
    }

    /**
     * Improve a prompt using a prompting framework.
     */
    public function improve(Request $request): JsonResponse
    {
        set_time_limit(120);

        $request->validate([
            'prompt' => ['required', 'string'],
            'framework' => ['required', 'string', 'in:tcrei,crispe,risen,race,care'],
            'user_llm_setting_id' => ['required', 'integer', 'exists:user_llm_settings,id'],
        ]);

        $llmSetting = UserLlmSetting::findOrFail($request->input('user_llm_setting_id'));

        // Ensure the LLM setting belongs to the user
        if ($llmSetting->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        try {
            $result = $this->promptService->improvePrompt(
                $request->input('prompt'),
                $request->input('framework'),
                $llmSetting
            );

            return response()->json($result);
        } catch (\Exception $e) {
            \Log::error('Prompt improvement failed', [
                'framework' => $request->input('framework'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Refine a prompt based on user feedback.
     */
    public function refine(Request $request): JsonResponse
    {
        set_time_limit(120);

        $request->validate([
            'current_prompt' => ['required', 'string'],
            'feedback' => ['required', 'string'],
            'user_llm_setting_id' => ['required', 'integer', 'exists:user_llm_settings,id'],
        ]);

        $llmSetting = UserLlmSetting::findOrFail($request->input('user_llm_setting_id'));

        // Ensure the LLM setting belongs to the user
        if ($llmSetting->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        try {
            $result = $this->promptService->refinePrompt(
                $request->input('current_prompt'),
                $request->input('feedback'),
                $llmSetting
            );

            return response()->json($result);
        } catch (\Exception $e) {
            \Log::error('Prompt refinement failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Authorize the user can access this template.
     */
    private function authorizeUser(PromptTemplate $template): void
    {
        // System templates are accessible to everyone
        if ($template->is_system) {
            return;
        }

        // Only the owner can access their templates
        if ($template->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
    }
}
