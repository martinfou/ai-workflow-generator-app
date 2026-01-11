import { PromptEditor } from '@/components/prompts/prompt-editor';
import { PromptImprover } from '@/components/prompts/prompt-improver';
import { PromptPreview } from '@/components/prompts/prompt-preview';
import { TemplateLibrary } from '@/components/prompts/template-library';
import { TestHistory } from '@/components/prompts/test-history';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PromptBuilderProps, PromptTemplate } from '@/types/prompt';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Prompt Builder',
        href: '/prompts/builder',
    },
];

export default function PromptBuilder({
    templates,
    llmSettings,
    categories,
}: PromptBuilderProps) {
    const [selectedTemplate, setSelectedTemplate] =
        useState<PromptTemplate | null>(templates[0] || null);
    const [inputVariables, setInputVariables] = useState<Record<string, string>>(
        {},
    );

    const handleSelectTemplate = (template: PromptTemplate) => {
        setSelectedTemplate(template);
        setInputVariables({});
    };

    const handleCreateNew = () => {
        setSelectedTemplate(null);
        setInputVariables({});
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prompt Builder" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Prompt Builder
                    </h1>
                    <p className="text-muted-foreground">
                        Create, test, and manage your AI prompt templates
                    </p>
                </div>

                {/* Prompt Improver Section */}
                <PromptImprover llmSettings={llmSettings} />

                <Separator />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-16rem)]">
                    {/* Template Library Sidebar - 25% */}
                    <div className="lg:col-span-1">
                        <TemplateLibrary
                            templates={templates}
                            categories={categories}
                            onSelectTemplate={handleSelectTemplate}
                            onCreateNew={handleCreateNew}
                            selectedTemplateId={selectedTemplate?.id}
                        />
                    </div>

                    {/* Main Content Area - 75% */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Test History Button */}
                        {selectedTemplate && (
                            <div className="flex justify-end">
                                <TestHistory templateId={selectedTemplate.id} />
                            </div>
                        )}

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Editor */}
                            <div>
                                <PromptEditor
                                    template={selectedTemplate}
                                    llmSettings={llmSettings}
                                    onVariablesChange={setInputVariables}
                                />
                            </div>

                            {/* Preview */}
                            <div>
                                <PromptPreview
                                    content={selectedTemplate?.content || ''}
                                    variables={inputVariables}
                                />
                            </div>
                        </div>

                        {/* Empty State */}
                        {!selectedTemplate && templates.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-muted-foreground mb-4">
                                    Get started by creating your first prompt template
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Use templates to create reusable prompts with dynamic
                                    variables
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
