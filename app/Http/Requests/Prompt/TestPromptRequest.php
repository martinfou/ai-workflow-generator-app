<?php

namespace App\Http\Requests\Prompt;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TestPromptRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'variables' => ['required', 'array'],
            'user_llm_setting_id' => ['required', 'integer', 'exists:user_llm_settings,id'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'variables.required' => 'Variables are required for testing.',
            'variables.array' => 'Variables must be an array.',
            'user_llm_setting_id.required' => 'LLM connection is required for testing.',
            'user_llm_setting_id.exists' => 'Selected LLM connection does not exist.',
        ];
    }
}
