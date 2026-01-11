<?php

namespace App\Services\Prompt;

use App\Models\PromptTemplate;
use App\Models\PromptTest;
use App\Models\UserLlmSetting;
use App\Services\Llm\LlmService;
use Illuminate\Support\Collection;

class PromptService
{
    public function __construct(
        private LlmService $llmService
    ) {}

    /**
     * Render a prompt template by replacing ${variable} placeholders with provided values.
     */
    public function renderPrompt(PromptTemplate $template, array $variables): string
    {
        $content = $template->content;

        foreach ($variables as $key => $value) {
            $content = str_replace('${'.$key.'}', $value, $content);
        }

        return $content;
    }

    /**
     * Extract variable names from template content using regex.
     * Returns array of unique variable names found in ${variable} format.
     */
    public function extractVariables(string $content): array
    {
        preg_match_all('/\$\{([a-zA-Z0-9_]+)\}/', $content, $matches);

        return array_unique($matches[1] ?? []);
    }

    /**
     * Test a prompt template against an LLM connection.
     * Returns the PromptTest record with results.
     */
    public function testPrompt(
        PromptTemplate $template,
        array $variables,
        UserLlmSetting $llmSetting
    ): PromptTest {
        $startTime = microtime(true);
        $renderedPrompt = $this->renderPrompt($template, $variables);

        $test = new PromptTest([
            'user_id' => $template->user_id ?? $llmSetting->user_id,
            'prompt_template_id' => $template->id,
            'user_llm_setting_id' => $llmSetting->id,
            'rendered_prompt' => $renderedPrompt,
            'input_variables' => $variables,
        ]);

        try {
            $response = $this->llmService->generate($llmSetting, $renderedPrompt);

            $test->response = $response;
            $test->status = 'success';
            $test->duration_ms = (int) ((microtime(true) - $startTime) * 1000);
        } catch (\Exception $e) {
            $test->status = 'error';
            $test->error_message = $e->getMessage();
            $test->duration_ms = (int) ((microtime(true) - $startTime) * 1000);
        }

        $test->save();

        // Increment template usage count
        $template->incrementUsage();

        return $test;
    }

    /**
     * Get categories with template counts for a user.
     * Returns collection with category names and counts.
     */
    public function getCategories(int $userId): Collection
    {
        return PromptTemplate::query()
            ->userTemplates($userId)
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('category')
            ->get();
    }

    /**
     * Get available prompting frameworks.
     */
    public static function getPromptingFrameworks(): array
    {
        return [
            'tcrei' => [
                'name' => 'TCREI',
                'description' => 'Task, Context, References, Evaluate, Iterate',
                'template' => "Please rewrite the following prompt using the TCREI framework:\n\n**Original Prompt:** {prompt}\n\nRewrite it with these sections:\n1. **Task**: Clearly define what needs to be done\n2. **Context**: Provide relevant background and constraints\n3. **References**: Include examples or standards to follow\n4. **Evaluate**: Define success criteria\n5. **Iterate**: Suggest how to refine the output\n\nProvide only the rewritten prompt in a clear, structured format.",
            ],
            'crispe' => [
                'name' => 'CRISPE',
                'description' => 'Capacity and Role, Insight, Statement, Personality, Experiment',
                'template' => "Please rewrite the following prompt using the CRISPE framework:\n\n**Original Prompt:** {prompt}\n\nRewrite it with these sections:\n1. **Capacity and Role**: Define the AI's role and expertise\n2. **Insight**: Provide context and background information\n3. **Statement**: Clear task or question\n4. **Personality**: Define tone and style\n5. **Experiment**: Encourage creative solutions\n\nProvide only the rewritten prompt in a clear, structured format.",
            ],
            'risen' => [
                'name' => 'RISEN',
                'description' => 'Role, Instructions, Steps, End Goal, Narrowing',
                'template' => "Please rewrite the following prompt using the RISEN framework:\n\n**Original Prompt:** {prompt}\n\nRewrite it with these sections:\n1. **Role**: Define the AI's role\n2. **Instructions**: Clear, specific directions\n3. **Steps**: Break down the process\n4. **End Goal**: Define the desired outcome\n5. **Narrowing**: Add constraints and specifications\n\nProvide only the rewritten prompt in a clear, structured format.",
            ],
            'race' => [
                'name' => 'RACE',
                'description' => 'Role, Action, Context, Expectation',
                'template' => "Please rewrite the following prompt using the RACE framework:\n\n**Original Prompt:** {prompt}\n\nRewrite it with these sections:\n1. **Role**: Define what the AI should act as\n2. **Action**: Specify what the AI should do\n3. **Context**: Provide necessary background\n4. **Expectation**: Define the desired output format and quality\n\nProvide only the rewritten prompt in a clear, structured format.",
            ],
            'care' => [
                'name' => 'CARE',
                'description' => 'Context, Action, Result, Example',
                'template' => "Please rewrite the following prompt using the CARE framework:\n\n**Original Prompt:** {prompt}\n\nRewrite it with these sections:\n1. **Context**: Set the scene and background\n2. **Action**: What needs to be done\n3. **Result**: What the output should look like\n4. **Example**: Provide a sample or reference\n\nProvide only the rewritten prompt in a clear, structured format.",
            ],
        ];
    }

    /**
     * Improve a prompt using a specific prompting framework.
     */
    public function improvePrompt(string $prompt, string $framework, UserLlmSetting $llmSetting): array
    {
        $frameworks = self::getPromptingFrameworks();

        if (! isset($frameworks[$framework])) {
            throw new \InvalidArgumentException("Invalid framework: {$framework}");
        }

        $frameworkData = $frameworks[$framework];
        $improverPrompt = str_replace('{prompt}', $prompt, $frameworkData['template']);

        $startTime = microtime(true);

        try {
            $improvedPrompt = $this->llmService->generate($llmSetting, $improverPrompt);
            $duration = (int) ((microtime(true) - $startTime) * 1000);

            return [
                'success' => true,
                'original_prompt' => $prompt,
                'framework' => $framework,
                'framework_name' => $frameworkData['name'],
                'improved_prompt' => $improvedPrompt,
                'duration_ms' => $duration,
            ];
        } catch (\Exception $e) {
            $duration = (int) ((microtime(true) - $startTime) * 1000);

            return [
                'success' => false,
                'original_prompt' => $prompt,
                'framework' => $framework,
                'framework_name' => $frameworkData['name'],
                'error' => $e->getMessage(),
                'duration_ms' => $duration,
            ];
        }
    }

    /**
     * Refine a prompt based on user feedback.
     */
    public function refinePrompt(string $currentPrompt, string $feedback, UserLlmSetting $llmSetting): array
    {
        $refinePromptTemplate = "I have the following prompt:\n\n{prompt}\n\nPlease improve it based on this feedback:\n{feedback}\n\nProvide only the refined prompt with the improvements applied. Keep the same structure and framework, but incorporate the feedback to make it better.";

        $refineRequest = str_replace(
            ['{prompt}', '{feedback}'],
            [$currentPrompt, $feedback],
            $refinePromptTemplate
        );

        $startTime = microtime(true);

        try {
            $refinedPrompt = $this->llmService->generate($llmSetting, $refineRequest);
            $duration = (int) ((microtime(true) - $startTime) * 1000);

            return [
                'success' => true,
                'original_prompt' => $currentPrompt,
                'feedback' => $feedback,
                'refined_prompt' => $refinedPrompt,
                'duration_ms' => $duration,
            ];
        } catch (\Exception $e) {
            $duration = (int) ((microtime(true) - $startTime) * 1000);

            return [
                'success' => false,
                'original_prompt' => $currentPrompt,
                'feedback' => $feedback,
                'error' => $e->getMessage(),
                'duration_ms' => $duration,
            ];
        }
    }

    /**
     * Get system template definitions.
     * Returns array of template configurations for seeding.
     */
    public static function getSystemTemplates(): array
    {
        return [
            [
                'name' => 'Blog Writer',
                'category' => 'Content Creation',
                'description' => 'Generate engaging blog posts on any topic',
                'content' => 'Write a comprehensive blog post about ${topic}. The post should be ${tone} in tone and approximately ${length} words long. Include an engaging introduction, well-structured body paragraphs, and a strong conclusion.',
                'variables' => [
                    ['name' => 'topic', 'label' => 'Topic', 'type' => 'text', 'required' => true],
                    ['name' => 'tone', 'label' => 'Tone', 'type' => 'text', 'required' => true],
                    ['name' => 'length', 'label' => 'Word Count', 'type' => 'number', 'required' => true],
                ],
                'intent' => 'Generate high-quality blog content',
                'expected_output_format' => 'Formatted blog post with title, introduction, body paragraphs, and conclusion',
                'is_system' => true,
            ],
            [
                'name' => 'Code Review',
                'category' => 'Development',
                'description' => 'Review code for quality, security, and best practices',
                'content' => 'Review the following ${language} code and provide feedback on:\n1. Code quality and readability\n2. Potential bugs or security issues\n3. Performance optimizations\n4. Best practices and design patterns\n\nCode:\n${code}',
                'variables' => [
                    ['name' => 'language', 'label' => 'Programming Language', 'type' => 'text', 'required' => true],
                    ['name' => 'code', 'label' => 'Code to Review', 'type' => 'textarea', 'required' => true],
                ],
                'intent' => 'Provide constructive code review feedback',
                'expected_output_format' => 'Structured review with specific recommendations',
                'is_system' => true,
            ],
            [
                'name' => 'Data Analysis',
                'category' => 'Analysis',
                'description' => 'Analyze data and provide insights',
                'content' => 'Analyze the following data about ${subject} and provide:\n1. Key insights and patterns\n2. Statistical summary\n3. Actionable recommendations\n\nData:\n${data}\n\nContext: ${context}',
                'variables' => [
                    ['name' => 'subject', 'label' => 'Subject', 'type' => 'text', 'required' => true],
                    ['name' => 'data', 'label' => 'Data', 'type' => 'textarea', 'required' => true],
                    ['name' => 'context', 'label' => 'Context', 'type' => 'textarea', 'required' => false],
                ],
                'intent' => 'Extract meaningful insights from data',
                'expected_output_format' => 'Analysis report with insights, statistics, and recommendations',
                'is_system' => true,
            ],
            [
                'name' => 'Blank Template',
                'category' => 'General',
                'description' => 'Start from scratch with a blank template',
                'content' => '',
                'variables' => [],
                'intent' => 'Create a custom prompt from scratch',
                'expected_output_format' => 'User-defined',
                'is_system' => true,
            ],
        ];
    }
}
