<?php

namespace App\Services\Llm;

interface LlmProviderInterface
{
    public function connect(array $config): bool;

    public function testConnection(): bool;

    public function generate(string $prompt, array $options = []): string;

    public function getModels(): array;

    public function getStatus(): string;

    public function getError(): ?string;
}
