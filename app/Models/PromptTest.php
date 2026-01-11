<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromptTest extends Model
{
    protected $fillable = [
        'user_id',
        'prompt_template_id',
        'user_llm_setting_id',
        'rendered_prompt',
        'input_variables',
        'response',
        'status',
        'error_message',
        'tokens_used',
        'duration_ms',
    ];

    protected $casts = [
        'input_variables' => 'array',
        'tokens_used' => 'integer',
        'duration_ms' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function promptTemplate(): BelongsTo
    {
        return $this->belongsTo(PromptTemplate::class);
    }

    public function llmSetting(): BelongsTo
    {
        return $this->belongsTo(UserLlmSetting::class, 'user_llm_setting_id');
    }
}
