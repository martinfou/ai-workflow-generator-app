import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import type {
    LlmSettingOption,
    PromptTemplate,
    PromptVariable,
} from '@/types/prompt';
import { useForm } from '@inertiajs/react';
import { Plus, Save, Trash2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PromptEditorProps {
    template: PromptTemplate | null;
    llmSettings: LlmSettingOption[];
    onVariablesChange?: (variables: Record<string, string>) => void;
}

export function PromptEditor({
    template,
    llmSettings,
    onVariablesChange,
}: PromptEditorProps) {
    const [variables, setVariables] = useState<PromptVariable[]>(
        template?.variables || [],
    );
    const [inputVariables, setInputVariables] = useState<Record<string, string>>(
        {},
    );
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{
        success: boolean;
        response?: string;
        error?: string;
    } | null>(null);

    const { data, setData, post, put, processing, errors } = useForm({
        name: template?.name || '',
        category: template?.category || 'General',
        description: template?.description || '',
        content: template?.content || '',
        variables: template?.variables || [],
        intent: template?.intent || '',
        expected_output_format: template?.expected_output_format || '',
        is_favorite: template?.is_favorite || false,
    });

    useEffect(() => {
        if (template) {
            setData({
                name: template.name,
                category: template.category,
                description: template.description || '',
                content: template.content,
                variables: template.variables || [],
                intent: template.intent || '',
                expected_output_format: template.expected_output_format || '',
                is_favorite: template.is_favorite,
            });
            setVariables(template.variables || []);
        }
    }, [template]);

    useEffect(() => {
        if (onVariablesChange) {
            onVariablesChange(inputVariables);
        }
    }, [inputVariables, onVariablesChange]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (template) {
            put(`/prompts/${template.id}`);
        } else {
            post('/prompts');
        }
    };

    const handleTest = async () => {
        if (!template || llmSettings.length === 0) {
            return;
        }

        const defaultSetting = llmSettings.find((s) => s.is_default) || llmSettings[0];

        setIsTesting(true);
        setTestResult(null);

        try {
            const response = await fetch(`/prompts/${template.id}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    variables: inputVariables,
                    user_llm_setting_id: defaultSetting.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
                setTestResult({
                    success: false,
                    error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                });
                return;
            }

            const result = await response.json();
            setTestResult(result);
        } catch (error) {
            setTestResult({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to test prompt',
            });
        } finally {
            setIsTesting(false);
        }
    };

    const extractedVariables =
        template?.content.match(/\$\{([a-zA-Z0-9_]+)\}/g)?.map((v) => v.slice(2, -1)) || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    {template ? 'Edit Template' : 'Create Template'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Template name"
                            disabled={template?.is_system}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            placeholder="Category"
                            disabled={template?.is_system}
                        />
                        {errors.category && (
                            <p className="text-sm text-destructive">
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Brief description"
                            disabled={template?.is_system}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Template Content</Label>
                        <textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Enter your prompt template... Use ${variable} for dynamic values"
                            className="w-full min-h-48 p-3 rounded-md border bg-background text-sm"
                            disabled={template?.is_system}
                        />
                        {errors.content && (
                            <p className="text-sm text-destructive">{errors.content}</p>
                        )}
                        {extractedVariables.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                Detected variables: {extractedVariables.join(', ')}
                            </p>
                        )}
                    </div>

                    {!template?.is_system && (
                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 size-4" />
                                {processing ? 'Saving...' : 'Save Template'}
                            </Button>
                        </div>
                    )}
                </form>

                {template && extractedVariables.length > 0 && (
                    <>
                        <Separator className="my-6" />
                        <div className="space-y-4">
                            <h3 className="font-medium">Test Variables</h3>
                            {extractedVariables.map((varName) => (
                                <div key={varName} className="space-y-2">
                                    <Label htmlFor={`var-${varName}`}>{varName}</Label>
                                    <Input
                                        id={`var-${varName}`}
                                        value={inputVariables[varName] || ''}
                                        onChange={(e) =>
                                            setInputVariables((prev) => ({
                                                ...prev,
                                                [varName]: e.target.value,
                                            }))
                                        }
                                        placeholder={`Enter value for ${varName}`}
                                    />
                                </div>
                            ))}

                            {llmSettings.length > 0 && (
                                <Button
                                    type="button"
                                    onClick={handleTest}
                                    disabled={isTesting}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    {isTesting ? (
                                        <>
                                            <Spinner className="mr-2 size-4" />
                                            Testing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 size-4" />
                                            Test with LLM
                                        </>
                                    )}
                                </Button>
                            )}

                            {testResult && (
                                <div
                                    className={`p-4 rounded-md ${testResult.success ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}
                                >
                                    {testResult.success ? (
                                        <div>
                                            <div className="font-medium text-sm text-green-900 dark:text-green-100 mb-2">
                                                Test Successful
                                                {testResult.test?.duration_ms && (
                                                    <span className="ml-2 text-xs opacity-75">
                                                        ({testResult.test.duration_ms}ms)
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm whitespace-pre-wrap text-green-800 dark:text-green-200">
                                                {testResult.test?.response || 'No response received'}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-red-900 dark:text-red-100">
                                            Error: {testResult.error}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
