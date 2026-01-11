import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import type { PromptTest } from '@/types/prompt';
import { History } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TestHistoryProps {
    templateId: number;
}

export function TestHistory({ templateId }: TestHistoryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tests, setTests] = useState<PromptTest[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && templateId) {
            loadTests();
        }
    }, [isOpen, templateId]);

    const loadTests = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/prompts/${templateId}/tests`,
            );
            const data = await response.json();
            setTests(data.tests || []);
        } catch (error) {
            console.error('Failed to load test history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            success: 'default',
            error: 'destructive',
            timeout: 'secondary',
        } as const;

        return (
            <Badge variant={variants[status as keyof typeof variants] || 'default'}>
                {status}
            </Badge>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <History className="mr-2 size-4" />
                    Test History
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Test History</DialogTitle>
                    <DialogDescription>
                        Last 10 test runs for this template
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner className="size-8" />
                    </div>
                ) : tests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No test history available
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tests.map((test, index) => (
                            <div key={test.id}>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(
                                                test.created_at,
                                            ).toLocaleString()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(test.status)}
                                            <Badge variant="outline">
                                                {test.llm_setting.provider}
                                            </Badge>
                                            {test.duration_ms && (
                                                <Badge variant="secondary">
                                                    {test.duration_ms}ms
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        <div className="font-medium mb-1">
                                            Input Variables:
                                        </div>
                                        <div className="bg-muted p-2 rounded text-xs font-mono">
                                            {JSON.stringify(
                                                test.input_variables,
                                                null,
                                                2,
                                            )}
                                        </div>
                                    </div>

                                    {test.status === 'success' && test.response && (
                                        <div className="text-sm">
                                            <div className="font-medium mb-1">
                                                Response:
                                            </div>
                                            <div className="bg-muted p-2 rounded text-xs whitespace-pre-wrap">
                                                {test.response}
                                            </div>
                                        </div>
                                    )}

                                    {test.status === 'error' && test.error_message && (
                                        <div className="text-sm">
                                            <div className="font-medium mb-1 text-destructive">
                                                Error:
                                            </div>
                                            <div className="bg-destructive/10 p-2 rounded text-xs text-destructive">
                                                {test.error_message}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {index < tests.length - 1 && (
                                    <Separator className="mt-4" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
