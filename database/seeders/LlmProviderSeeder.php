<?php

namespace Database\Seeders;

use App\Models\LlmProvider;
use Illuminate\Database\Seeder;

class LlmProviderSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            [
                'name' => 'Ollama',
                'slug' => 'ollama',
                'description' => 'Run LLMs locally on your machine. Supports llama3.2, mistral, codellama, and more.',
                'is_active' => true,
                'icon' => '🔮',
                'config_schema' => json_encode([
                    'endpoint' => [
                        'type' => 'string',
                        'label' => 'Endpoint URL',
                        'placeholder' => 'http://localhost:11434',
                        'required' => true,
                        'validation' => 'url',
                    ],
                    'model' => [
                        'type' => 'select',
                        'label' => 'Model',
                        'required' => true,
                        'options' => [
                            ['value' => 'llama3.2', 'label' => 'Llama 3.2'],
                            ['value' => 'llama3.1', 'label' => 'Llama 3.1'],
                            ['value' => 'mistral', 'label' => 'Mistral'],
                            ['value' => 'codellama', 'label' => 'CodeLlama'],
                            ['value' => 'qwen2.5', 'label' => 'Qwen 2.5'],
                            ['value' => 'deepseek-coder', 'label' => 'DeepSeek Coder'],
                        ],
                    ],
                ]),
            ],
            [
                'name' => 'DeepSeek',
                'slug' => 'deepseek',
                'description' => 'Cloud-based LLM API with competitive pricing. Great for production use.',
                'is_active' => true,
                'icon' => '🟦',
                'config_schema' => json_encode([
                    'api_key' => [
                        'type' => 'password',
                        'label' => 'API Key',
                        'placeholder' => 'Enter your DeepSeek API key',
                        'required' => true,
                        'validation' => 'required|string',
                    ],
                    'model' => [
                        'type' => 'select',
                        'label' => 'Model',
                        'required' => true,
                        'options' => [
                            ['value' => 'deepseek-chat', 'label' => 'DeepSeek Chat'],
                            ['value' => 'deepseek-coder', 'label' => 'DeepSeek Coder'],
                        ],
                    ],
                ]),
            ],
        ];

        foreach ($providers as $provider) {
            LlmProvider::updateOrCreate(
                ['slug' => $provider['slug']],
                $provider
            );
        }

        $this->command->info('LLM providers seeded successfully.');
    }
}
