export interface PromptVariable {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select';
    required: boolean;
    options?: string[];
}

export interface PromptTemplate {
    id: number;
    name: string;
    category: string;
    description: string | null;
    content: string;
    variables: PromptVariable[] | null;
    intent: string | null;
    expected_output_format: string | null;
    is_system: boolean;
    is_favorite: boolean;
    usage_count: number;
    created_at: string;
}

export interface PromptTest {
    id: number;
    rendered_prompt: string;
    input_variables: Record<string, string>;
    response: string | null;
    status: 'success' | 'error' | 'timeout';
    error_message: string | null;
    tokens_used: number | null;
    duration_ms: number | null;
    llm_setting: {
        name: string;
        provider: string;
    };
    created_at: string;
}

export interface LlmSettingOption {
    id: number;
    name: string;
    provider: {
        name: string;
        slug: string;
    };
    is_default: boolean;
}

export interface CategoryWithCount {
    name: string;
    count: number;
}

export interface PromptBuilderProps {
    templates: PromptTemplate[];
    llmSettings: LlmSettingOption[];
    categories: CategoryWithCount[];
}

export interface TestResponse {
    success: boolean;
    test?: PromptTest;
    error?: string;
}

export interface PreviewResponse {
    rendered_prompt: string;
    variables: string[];
}
