<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\LlmProvider;
use App\Models\UserLlmSetting;
use App\Services\Llm\LlmService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LlmController extends Controller
{
    private LlmService $llmService;

    public function __construct(LlmService $llmService)
    {
        $this->llmService = $llmService;
    }

    public function index(): \Inertia\Response
    {
        $user = Auth::user();
        $providers = LlmProvider::where('is_active', true)->get();
        $settings = $this->llmService->getUserSettings($user->id);

        return Inertia::render('settings/llm', [
            'providers' => $providers->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'icon' => $p->icon,
                'config_schema' => json_decode($p->config_schema, true),
            ]),
            'settings' => $settings->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'provider' => [
                    'id' => $s->provider->id,
                    'name' => $s->provider->name,
                    'slug' => $s->provider->slug,
                ],
                'status' => $s->status,
                'status_label' => match ($s->status) {
                    'online' => 'Connected',
                    'testing' => 'Testing...',
                    'error' => 'Connection failed',
                    default => 'Not connected',
                },
                'is_default' => $s->is_default,
                'last_tested_at' => $s->last_tested_at?->toIso8601String(),
                'config' => $this->maskConfig($s->config, $s->provider->slug),
            ]),
        ]);
    }

    private function maskConfig(array $config, string $providerSlug): array
    {
        $masked = [];
        foreach ($config as $key => $value) {
            if ($key === 'api_key') {
                $masked[$key] = '';
            } else {
                $masked[$key] = $value;
            }
        }

        return $masked;
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $provider = LlmProvider::findOrFail($request->input('provider_id'));

        $validator = Validator::make($request->all(), [
            'provider_id' => 'required|exists:llm_providers,id',
            'name' => 'nullable|string|max:255',
            'config' => 'required|array',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors())->withInput();
        }

        $setting = new UserLlmSetting([
            'user_id' => $user->id,
            'provider_id' => $request->input('provider_id'),
            'name' => $request->input('name'),
            'config' => $request->input('config'),
            'is_default' => $request->input('is_default', false),
            'status' => 'offline',
        ]);

        $setting->save();

        return redirect()->route('llm.settings')->with('success', 'LLM provider connected successfully.');
    }

    public function update(Request $request, UserLlmSetting $setting)
    {
        $this->authorizeUser($setting);

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'config' => 'sometimes|array',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors())->withInput();
        }

        if ($request->has('name')) {
            $setting->name = $request->input('name');
        }

        if ($request->has('config')) {
            $newConfig = $request->input('config');
            $currentConfig = $setting->config;

            // Preserve existing api_key if new one is empty (masked from frontend)
            if (isset($newConfig['api_key']) && empty($newConfig['api_key']) && isset($currentConfig['api_key'])) {
                $newConfig['api_key'] = $currentConfig['api_key'];
            }

            $setting->config = $newConfig;
        }

        if ($request->has('is_default') && $request->input('is_default')) {
            $setting->is_default = true;
            UserLlmSetting::where('user_id', $setting->user_id)
                ->where('id', '!=', $setting->id)
                ->where('provider_id', $setting->provider_id)
                ->update(['is_default' => false]);
        }

        $setting->save();

        return redirect()->route('llm.settings')->with('success', 'LLM provider updated successfully.');
    }

    public function test(UserLlmSetting $setting)
    {
        $this->authorizeUser($setting);

        $result = $this->llmService->testConnection($setting);

        $setting->refresh();

        if ($result) {
            return redirect()->route('llm.settings')->with('success', 'Connection successful!');
        }

        return redirect()->route('llm.settings')->with('error', $setting->last_error ?? 'Connection failed.');
    }

    public function destroy(UserLlmSetting $setting)
    {
        $this->authorizeUser($setting);

        $this->llmService->deleteUserSetting($setting);

        return redirect()->route('llm.settings')->with('success', 'LLM provider disconnected successfully.');
    }

    public function models(UserLlmSetting $setting): JsonResponse
    {
        $this->authorizeUser($setting);

        $models = $this->llmService->getModels($setting);

        return response()->json([
            'models' => $models,
        ]);
    }

    public function availableProviders(): JsonResponse
    {
        $providers = LlmProvider::where('is_active', true)->get();

        return response()->json([
            'providers' => $providers->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'icon' => $p->icon,
                'config_schema' => $this->getConfigSchema($p->slug),
            ]),
        ]);
    }

    private function getConfigSchema(string $slug): array
    {
        return match ($slug) {
            'ollama' => LlmService::getOllamaConfigSchema(),
            'deepseek' => LlmService::getDeepSeekConfigSchema(),
            default => [],
        };
    }

    private function authorizeUser(UserLlmSetting $setting): void
    {
        if ($setting->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
    }
}
