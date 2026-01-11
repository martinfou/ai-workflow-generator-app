import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface PromptPreviewProps {
    content: string;
    variables: Record<string, string>;
}

export function PromptPreview({ content, variables }: PromptPreviewProps) {
    const [highlightedContent, setHighlightedContent] = useState<string>('');

    useEffect(() => {
        const highlighted = highlightVariables(content, variables);
        setHighlightedContent(highlighted);
    }, [content, variables]);

    const highlightVariables = (
        text: string,
        vars: Record<string, string>,
    ): string => {
        if (!text) {
            return '';
        }

        // Replace ${variable} with highlighted spans
        return text.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (match, varName) => {
            const isFilled = vars[varName] && vars[varName].trim() !== '';
            const className = isFilled
                ? 'bg-green-200 dark:bg-green-800 px-1 rounded'
                : 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded';

            const displayValue = isFilled ? vars[varName] : match;

            return `<span class="${className}">${escapeHtml(displayValue)}</span>`;
        });
    };

    const escapeHtml = (text: string): string => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
                {content ? (
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words p-4 bg-muted rounded-md min-h-32"
                        dangerouslySetInnerHTML={{ __html: highlightedContent }}
                    />
                ) : (
                    <div className="text-sm text-muted-foreground text-center py-8">
                        Enter template content to see preview
                    </div>
                )}
                <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span className="inline-block size-3 bg-green-200 dark:bg-green-800 rounded" />
                        Filled variable
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="inline-block size-3 bg-yellow-200 dark:bg-yellow-800 rounded" />
                        Unfilled variable
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
