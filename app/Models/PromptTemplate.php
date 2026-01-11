<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PromptTemplate extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'category',
        'description',
        'content',
        'variables',
        'intent',
        'expected_output_format',
        'is_system',
        'is_favorite',
        'usage_count',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_system' => 'boolean',
        'is_favorite' => 'boolean',
        'usage_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(PromptTest::class);
    }

    public function scopeUserTemplates($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('user_id', $userId)
                ->orWhere('is_system', true);
        });
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
