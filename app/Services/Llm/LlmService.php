<?php

namespace App\Services\Llm;

use App\Models\UserLlmSetting;
use App\Services\Llm\Providers\DeepSeekProvider;
use App\Services\Llm\Providers\OllamaProvider;
use InvalidArgumentException;

class LlmService
{
    private array $providers = [];

    public function __construct()
    {
        $this->registerDefaultProviders();
    }

    private function registerDefaultProviders(): void
    {
        $this->registerProvider('ollama', new OllamaProvider);
        $this->registerProvider('deepseek', new DeepSeekProvider);
    }

    public function registerProvider(string $slug, object $provider): void
    {
        $this->providers[$slug] = $provider;
    }

    public function getProvider(string $slug): ?object
    {
        return $this->providers[$slug] ?? null;
    }

    public function getAvailableProviders(): array
    {
        return array_keys($this->providers);
    }

    public function createUserSetting(UserLlmSetting $setting): UserLlmSetting
    {
        if ($setting->is_default) {
            UserLlmSetting::where('user_id', $setting->user_id)
                ->where('provider_id', $setting->provider_id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $setting->save();

        return $setting;
    }

    public function testConnection(UserLlmSetting $setting): bool
    {
        $provider = $this->getProviderBySetting($setting);

        if ($provider === null) {
            return false;
        }

        $setting->status = 'testing';
        $setting->save();

        $config = $setting->config;
        $providerSlug = $setting->provider->slug;

        if ($providerSlug === 'ollama') {
            $config['endpoint'] = $config['endpoint'] ?? 'http://localhost:11434';
        }

        $result = $provider->connect($config);

        $setting->status = $result ? 'online' : 'error';
        $setting->last_tested_at = now();
        $setting->last_error = $result ? null : $provider->getError();
        $setting->save();

        return $result;
    }

    public function generate(UserLlmSetting $setting, string $prompt, array $options = []): string
    {
        $provider = $this->getProviderBySetting($setting);

        if ($provider === null) {
            throw new InvalidArgumentException('Provider not found');
        }

        $config = $setting->config;
        $providerSlug = $setting->provider->slug;

        if ($providerSlug === 'ollama') {
            $config['endpoint'] = $config['endpoint'] ?? 'http://localhost:11434';
        }

        $provider->connect($config);

        return $provider->generate($prompt, $options);
    }

    public function getModels(UserLlmSetting $setting): array
    {
        $provider = $this->getProviderBySetting($setting);

        if ($provider === null) {
            return [];
        }

        $config = $setting->config;
        $providerSlug = $setting->provider->slug;

        if ($providerSlug === 'ollama') {
            $config['endpoint'] = $config['endpoint'] ?? 'http://localhost:11434';
        }

        $provider->connect($config);

        return $provider->getModels();
    }

    public function deleteUserSetting(UserLlmSetting $setting): bool
    {
        return $setting->delete();
    }

    public function getUserSettings(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return UserLlmSetting::with('provider')
            ->where('user_id', $userId)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getDefaultSetting(int $userId): ?UserLlmSetting
    {
        return UserLlmSetting::where('user_id', $userId)
            ->where('is_default', true)
            ->with('provider')
            ->first();
    }

    private function getProviderBySetting(UserLlmSetting $setting): ?object
    {
        $providerSlug = $setting->provider->slug ?? null;

        if ($providerSlug === null) {
            return null;
        }

        return $this->getProvider($providerSlug);
    }

    public static function getOllamaConfigSchema(): array
    {
        return [
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
                ],
            ],
        ];
    }

    public static function getDeepSeekConfigSchema(): array
    {
        return [
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
        ];
    }

    public static function getDefaultDeepSeekConfigSchema(): array
    {
        return [
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
        ];
    }
}
