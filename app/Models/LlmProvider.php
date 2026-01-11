<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LlmProvider extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'icon',
        'config_schema',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config_schema' => 'array',
    ];

    public function userSettings(): HasMany
    {
        return $this->hasMany(UserLlmSetting::class);
    }

    public function userSetting(): HasMany
    {
        return $this->hasMany(UserLlmSetting::class);
    }
}
