import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type {
    CategoryWithCount,
    PromptTemplate,
} from '@/types/prompt';
import { FileText, Plus, Search, Star } from 'lucide-react';
import { useState } from 'react';

interface TemplateLibraryProps {
    templates: PromptTemplate[];
    categories: CategoryWithCount[];
    onSelectTemplate: (template: PromptTemplate) => void;
    onCreateNew: () => void;
    selectedTemplateId?: number;
}

export function TemplateLibrary({
    templates,
    categories,
    onSelectTemplate,
    onCreateNew,
    selectedTemplateId,
}: TemplateLibraryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            !searchQuery ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            !activeCategory || template.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Template Library</CardTitle>
                    <Button size="sm" onClick={onCreateNew}>
                        <Plus className="size-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div>
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                            Categories
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={activeCategory === null ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveCategory(null)}
                            >
                                All
                                <Badge variant="secondary" className="ml-2">
                                    {templates.length}
                                </Badge>
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.name}
                                    variant={
                                        activeCategory === category.name
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => setActiveCategory(category.name)}
                                >
                                    {category.name}
                                    <Badge variant="secondary" className="ml-2">
                                        {category.count}
                                    </Badge>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Templates List */}
                <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            {searchQuery || activeCategory
                                ? 'No templates found'
                                : 'No templates yet'}
                        </div>
                    ) : (
                        filteredTemplates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => onSelectTemplate(template)}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                    selectedTemplateId === template.id
                                        ? 'bg-accent border-primary'
                                        : 'hover:bg-accent/50'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="size-4 shrink-0 text-muted-foreground" />
                                            <span className="font-medium text-sm truncate">
                                                {template.name}
                                            </span>
                                            {template.is_favorite && (
                                                <Star className="size-3 fill-yellow-400 text-yellow-400 shrink-0" />
                                            )}
                                        </div>
                                        {template.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {template.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {template.category}
                                            </Badge>
                                            {template.is_system && (
                                                <Badge variant="outline" className="text-xs">
                                                    System
                                                </Badge>
                                            )}
                                            {template.usage_count > 0 && (
                                                <span className="text-xs text-muted-foreground">
                                                    Used {template.usage_count}x
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
