import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { LlmSettingOption } from '@/types/prompt';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PromptImproverProps {
    llmSettings: LlmSettingOption[];
}

const FRAMEWORKS = [
    {
        id: 'tcrei',
        name: 'TCREI',
        description: 'Task, Context, References, Evaluate, Iterate',
    },
    {
        id: 'crispe',
        name: 'CRISPE',
        description: 'Capacity and Role, Insight, Statement, Personality, Experiment',
    },
    {
        id: 'risen',
        name: 'RISEN',
        description: 'Role, Instructions, Steps, End Goal, Narrowing',
    },
    {
        id: 'race',
        name: 'RACE',
        description: 'Role, Action, Context, Expectation',
    },
    {
        id: 'care',
        name: 'CARE',
        description: 'Context, Action, Result, Example',
    },
];

export function PromptImprover({ llmSettings }: PromptImproverProps) {
    const [prompt, setPrompt] = useState('');
    const [framework, setFramework] = useState('tcrei');
    const [isImproving, setIsImproving] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        improved_prompt?: string;
        refined_prompt?: string;
        framework_name?: string;
        duration_ms?: number;
        error?: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const handleImprove = async () => {
        if (!prompt.trim() || llmSettings.length === 0) {
            return;
        }

        const defaultSetting = llmSettings.find((s) => s.is_default) || llmSettings[0];

        setIsImproving(true);
        setResult(null);

        try {
            const response = await fetch('/prompts/improve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    framework: framework,
                    user_llm_setting_id: defaultSetting.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
                setResult({
                    success: false,
                    error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
                });
                return;
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to improve prompt',
            });
        } finally {
            setIsImproving(false);
        }
    };

    const handleRefine = async () => {
        if (!feedback.trim() || !result || llmSettings.length === 0) {
            return;
        }

        const defaultSetting = llmSettings.find((s) => s.is_default) || llmSettings[0];
        const currentPrompt = result.refined_prompt || result.improved_prompt;

        if (!currentPrompt) {
            return;
        }

        setIsRefining(true);

        try {
            const response = await fetch('/prompts/refine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    current_prompt: currentPrompt,
                    feedback: feedback,
                    user_llm_setting_id: defaultSetting.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
                setResult({
                    ...result,
                    success: false,
                    error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
                });
                return;
            }

            const data = await response.json();

            if (data.success) {
                setResult({
                    ...result,
                    refined_prompt: data.refined_prompt,
                    duration_ms: data.duration_ms,
                });
                setFeedback('');
            } else {
                setResult({
                    ...result,
                    success: false,
                    error: data.error,
                });
            }
        } catch (error) {
            setResult({
                ...result,
                success: false,
                error: error instanceof Error ? error.message : 'Failed to refine prompt',
            });
        } finally {
            setIsRefining(false);
        }
    };

    const handleCopy = async () => {
        const textToCopy = result?.refined_prompt || result?.improved_prompt;
        if (textToCopy) {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const selectedFramework = FRAMEWORKS.find((f) => f.id === framework);
    const currentPromptText = result?.refined_prompt || result?.improved_prompt;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Prompt Improver</CardTitle>
                <CardDescription>
                    Write a simple prompt and let AI improve it using proven prompting
                    frameworks
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Framework Selection */}
                <div className="space-y-2">
                    <Label htmlFor="framework">Framework</Label>
                    <Select value={framework} onValueChange={setFramework}>
                        <SelectTrigger id="framework">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FRAMEWORKS.map((fw) => (
                                <SelectItem key={fw.id} value={fw.id}>
                                    <div>
                                        <div className="font-medium">{fw.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {fw.description}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedFramework && (
                        <p className="text-xs text-muted-foreground">
                            {selectedFramework.description}
                        </p>
                    )}
                </div>

                {/* Simple Prompt Input */}
                <div className="space-y-2">
                    <Label htmlFor="simple-prompt">Your Simple Prompt</Label>
                    <textarea
                        id="simple-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Write a basic prompt here... e.g., 'Write a blog post about climate change'"
                        className="w-full min-h-32 p-3 rounded-md border bg-background text-sm"
                        disabled={isImproving}
                    />
                </div>

                {/* Improve Button */}
                {llmSettings.length > 0 && (
                    <Button
                        onClick={handleImprove}
                        disabled={isImproving || !prompt.trim()}
                        className="w-full"
                    >
                        {isImproving ? (
                            <>
                                <Spinner className="mr-2 size-4" />
                                Improving...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 size-4" />
                                Improve with {selectedFramework?.name}
                            </>
                        )}
                    </Button>
                )}

                {llmSettings.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                        Connect an LLM provider in Settings to use Prompt Improver
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <>
                        <Separator />
                        <div>
                            {result.success ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium text-sm">
                                            {result.refined_prompt ? 'Refined Prompt' : `Improved with ${result.framework_name}`}
                                            {result.duration_ms && (
                                                <span className="ml-2 text-xs opacity-75">
                                                    ({result.duration_ms}ms)
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopy}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="mr-2 size-3" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="mr-2 size-3" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-md">
                                        <div className="text-sm whitespace-pre-wrap text-green-800 dark:text-green-200">
                                            {currentPromptText}
                                        </div>
                                    </div>

                                    {/* Feedback Section */}
                                    <div className="space-y-2 pt-2">
                                        <Label htmlFor="feedback">
                                            Provide Feedback to Refine
                                        </Label>
                                        <textarea
                                            id="feedback"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="e.g., 'Make the suggested prompt easier for an LLM to understand the scope of the project'"
                                            className="w-full min-h-24 p-3 rounded-md border bg-background text-sm"
                                            disabled={isRefining}
                                        />
                                        <Button
                                            onClick={handleRefine}
                                            disabled={isRefining || !feedback.trim()}
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            {isRefining ? (
                                                <>
                                                    <Spinner className="mr-2 size-4" />
                                                    Refining...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="mr-2 size-4" />
                                                    Refine with Feedback
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-md">
                                    <div className="text-sm text-red-900 dark:text-red-100">
                                        Error: {result.error}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
