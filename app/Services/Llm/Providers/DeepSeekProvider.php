<?php

namespace App\Services\Llm\Providers;

use App\Services\Llm\AbstractLlmProvider;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class DeepSeekProvider extends AbstractLlmProvider
{
    private const REQUIRED_CONFIG = ['api_key', 'model'];

    private const BASE_URL = 'https://api.deepseek.com';

    private ?Client $client = null;

    public function connect(array $config = []): bool
    {
        if (! empty($config)) {
            $this->config = $config;
        }

        if (! $this->validateConfig(self::REQUIRED_CONFIG)) {
            return false;
        }

        return $this->testConnection();
    }

    public function testConnection(): bool
    {
        $this->clearError();

        try {
            $response = $this->getClient()->get(self::BASE_URL.'/v1/models', [
                'headers' => [
                    'Authorization' => 'Bearer '.$this->config['api_key'],
                    'Content-Type' => 'application/json',
                ],
            ]);

            if ($response->getStatusCode() === 200) {
                $this->isConnected = true;

                return true;
            }

            $this->setError('Connection failed with status: '.$response->getStatusCode());

            return false;
        } catch (GuzzleException $e) {
            $this->setError('Connection error: '.$e->getMessage());
            Log::error('DeepSeek connection failed', ['error' => $e->getMessage()]);

            return false;
        }
    }

    public function generate(string $prompt, array $options = []): string
    {
        if (! $this->isConnected && ! $this->connect()) {
            throw new \RuntimeException($this->lastError ?? 'Provider not connected');
        }

        $model = $options['model'] ?? $this->config['model'] ?? 'deepseek-chat';

        try {
            $payload = [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 1024,
                'stream' => false,
            ];

            $response = $this->getClient()->post(self::BASE_URL.'/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer '.$this->config['api_key'],
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload,
            ]);

            if ($response->getStatusCode() === 200) {
                $data = json_decode($response->getBody()->getContents(), true);
                $choice = $data['choices'][0] ?? [];

                return $choice['message']['content'] ?? $choice['delta']['content'] ?? '';
            }

            throw new \RuntimeException('Generation failed with status: '.$response->getStatusCode());
        } catch (GuzzleException $e) {
            $message = 'Generation error: '.$e->getMessage();
            $this->setError($message);
            Log::error('DeepSeek generation failed', ['error' => $e->getMessage()]);
            throw new \RuntimeException($message);
        }
    }

    public function getModels(): array
    {
        return [
            ['id' => 'deepseek-chat', 'name' => 'DeepSeek Chat', 'description' => 'General purpose chat model'],
            ['id' => 'deepseek-coder', 'name' => 'DeepSeek Coder', 'description' => 'Specialized for code generation'],
        ];
    }

    public function getDefaultModel(): string
    {
        return $this->config['model'] ?? 'deepseek-chat';
    }

    private function getClient(): Client
    {
        if ($this->client === null) {
            $this->client = new Client([
                'timeout' => 60,
                'connect_timeout' => 10,
            ]);
        }

        return $this->client;
    }
}
