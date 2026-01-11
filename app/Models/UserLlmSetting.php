<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class UserLlmSetting extends Model
{
    protected $fillable = [
        'user_id',
        'provider_id',
        'name',
        'config',
        'is_default',
        'status',
        'last_tested_at',
        'last_error',
    ];

    protected $casts = [
        'config' => 'encrypted:array',
        'is_default' => 'boolean',
        'last_tested_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(LlmProvider::class);
    }

    public function status(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => $value,
            set: fn (string $value) => $value,
        );
    }

    public function getConnectionStatusAttribute(): string
    {
        return match ($this->status) {
            'online' => 'Connected',
            'testing' => 'Testing connection...',
            'error' => 'Connection failed',
            default => 'Not connected',
        };
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->name ?? $this->provider->name;
    }

    protected function decryptConfig(string $key): ?string
    {
        $config = $this->config;

        return $config[$key] ?? null;
    }
}
