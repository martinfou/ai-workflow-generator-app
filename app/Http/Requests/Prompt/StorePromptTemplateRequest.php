<?php

namespace App\Http\Requests\Prompt;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePromptTemplateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'string'],
            'variables' => ['nullable', 'array'],
            'variables.*.name' => ['required', 'string', 'max:255'],
            'variables.*.label' => ['required', 'string', 'max:255'],
            'variables.*.type' => ['required', 'string', 'in:text,textarea,number,select'],
            'variables.*.required' => ['required', 'boolean'],
            'intent' => ['nullable', 'string', 'max:500'],
            'expected_output_format' => ['nullable', 'string', 'max:500'],
            'is_favorite' => ['nullable', 'boolean'],
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
            'name.required' => 'Template name is required.',
            'name.max' => 'Template name cannot exceed 255 characters.',
            'category.required' => 'Category is required.',
            'content.required' => 'Template content is required.',
            'variables.*.name.required' => 'Variable name is required.',
            'variables.*.label.required' => 'Variable label is required.',
            'variables.*.type.required' => 'Variable type is required.',
            'variables.*.type.in' => 'Variable type must be text, textarea, number, or select.',
            'variables.*.required.required' => 'Variable required field is required.',
            'variables.*.required.boolean' => 'Variable required field must be true or false.',
        ];
    }
}
