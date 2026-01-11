<?php

namespace App\Services\Llm\Providers;

use App\Services\Llm\AbstractLlmProvider;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class OllamaProvider extends AbstractLlmProvider
{
    private const REQUIRED_CONFIG = ['endpoint', 'model'];
    private ?Client $client = null;

    public function connect(array $config = []): bool
    {
        if (!empty($config)) {
            $this->config = $config;
        }

        if (!$this->validateConfig(self::REQUIRED_CONFIG)) {
            return false;
        }

        return $this->testConnection();
    }

    public function testConnection(): bool
    {
        $this->clearError();

        try {
            $endpoint = rtrim($this->config['endpoint'], '/').'/api/tags';
            $response = $this->getClient()->post($endpoint);

            if ($response->getStatusCode() === 200) {
                $this->isConnected = true;
                return true;
            }

            $this->setError('Connection failed with status: '.$response->getStatusCode());
            return false;
        } catch (GuzzleException $e) {
            $this->setError('Connection error: '.$e->getMessage());
            Log::error('Ollama connection failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function generate(string $prompt, array $options = []): string
    {
        if (!$this->isConnected && !$this->connect()) {
            throw new \RuntimeException($this->lastError ?? 'Provider not connected');
        }

        $endpoint = rtrim($this->config['endpoint'], '/');
        $model = $options['model'] ?? $this->config['model'] ?? 'llama3.2';

        try {
            $payload = [
                'model' => $model,
                'prompt' => $prompt,
                'stream' => false,
                'options' => [
                    'temperature' => $options['temperature'] ?? 0.7,
                    'num_predict' => $options['max_tokens'] ?? 1024,
                ],
            ];

            $response = $this->getClient()->post($endpoint.'/api/generate', ['json' => $payload]);

            if ($response->getStatusCode() === 200) {
                $data = json_decode($response->getBody()->getContents(), true);
                return $data['response'] ?? '';
            }

            throw new \RuntimeException('Generation failed with status: '.$response->getStatusCode());
        } catch (GuzzleException $e) {
            $message = 'Generation error: '.$e->getMessage();
            $this->setError($message);
            Log::error('Ollama generation failed', ['error' => $e->getMessage()]);
            throw new \RuntimeException($message);
        }
    }

    public function getModels(): array
    {
        if (!$this->isConnected && !$this->connect()) {
            return [];
        }

        try {
            $endpoint = rtrim($this->config['endpoint'], '/').'/api/tags';
            $response = $this->getClient()->get($endpoint);

            if ($response->getStatusCode() === 200) {
                $data = json_decode($response->getBody()->getContents(), true);
                $models = $data['models'] ?? [];
                return collect($models)->map(fn ($m) => [
                    'id' => $m['name'],
                    'name' => $m['name'],
                    'size' => $m['size'] ?? null,
                ])->toArray();
            }

            return [];
        } catch (GuzzleException $e) {
            Log::error('Failed to fetch Ollama models', ['error' => $e->getMessage()]);
            return [];
        }
    }

    public function getDefaultModel(): string
    {
        return $this->config['model'] ?? 'llama3.2';
    }

    private function getClient(): Client
    {
        if ($this->client === null) {
            $this->client = new Client([
                'timeout' => 30,
                'connect_timeout' => 10,
            ]);
        }

        return $this->client;
    }
}
