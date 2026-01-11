<?php

namespace App\Services\Llm;

use App\Services\Llm\LlmProviderInterface;

abstract class AbstractLlmProvider implements LlmProviderInterface
{
    protected array $config;
    protected ?string $lastError = null;
    protected bool $isConnected = false;

    public function __construct(array $config = [])
    {
        $this->config = $config;
    }

    public function setConfig(array $config): self
    {
        $this->config = $config;

        return $this;
    }

    public function getConfig(): array
    {
        return $this->config;
    }

    public function getError(): ?string
    {
        return $this->lastError;
    }

    public function getStatus(): string
    {
        return $this->isConnected ? 'online' : 'offline';
    }

    protected function setError(?string $error): void
    {
        $this->lastError = $error;
        $this->isConnected = false;
    }

    protected function clearError(): void
    {
        $this->lastError = null;
    }

    protected function validateConfig(array $requiredFields): bool
    {
        foreach ($requiredFields as $field) {
            if (empty($this->config[$field])) {
                $this->setError("Missing required configuration field: {$field}");

                return false;
            }
        }

        return true;
    }
}
