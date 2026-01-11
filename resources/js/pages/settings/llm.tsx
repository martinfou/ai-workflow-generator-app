import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { settings as llmSettings } from '@/routes/llm';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    Edit,
    Plus,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'LLM Connections',
        href: llmSettings.url(),
    },
];

interface Provider {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    config_schema: Record<string, ConfigField>;
}

interface ConfigField {
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: Array<{ value: string; label: string }>;
    validation?: string;
}

interface UserSetting {
    id: number;
    name: string;
    provider: {
        id: number;
        name: string;
        slug: string;
    };
    status: 'online' | 'offline' | 'testing' | 'error';
    status_label: string;
    is_default: boolean;
    last_tested_at?: string;
    config: Record<string, string>;
}

interface LlmSettingsProps {
    providers: Provider[];
    settings: UserSetting[];
}

export default function LlmSettings({ providers, settings }: LlmSettingsProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
        null,
    );
    const [expandedCards, setExpandedCards] = useState<number[]>([]);
    const [editingSetting, setEditingSetting] = useState<UserSetting | null>(
        null,
    );
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        provider_id: '',
        name: '',
        config: {} as Record<string, string>,
        is_default: false,
    });

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        name: '',
        config: {} as Record<string, string>,
        is_default: false,
    });

    const handleProviderSelect = (providerId: string) => {
        const provider = providers.find((p) => p.id === parseInt(providerId));
        setSelectedProvider(provider || null);
        setData('provider_id', providerId);
        setData('config', {});
    };

    const handleConfigChange = (key: string, value: string) => {
        setData('config', { ...data.config, [key]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/llm');
    };

    const handleTestConnection = (settingId: number) => {
        post(`/settings/llm/${settingId}/test`);
    };

    const handleDelete = (settingId: number) => {
        if (confirm('Are you sure you want to disconnect this provider?')) {
            destroy(`/settings/llm/${settingId}`);
        }
    };

    const handleOpenEditDialog = (setting: UserSetting) => {
        setEditingSetting(setting);
        setEditData('name', setting.name);
        setEditData('config', setting.config);
        setEditData('is_default', setting.is_default);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSetting) return;
        putEdit(`/settings/llm/${editingSetting.id}`);
        setIsEditDialogOpen(false);
    };

    const handleEditConfigChange = (key: string, value: string) => {
        setEditData('config', { ...editData.config, [key]: value });
    };

    const toggleCard = (id: number) => {
        setExpandedCards((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'testing':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LLM Connections" />

            <h1 className="sr-only">LLM Connections</h1>

            <SettingsLayout>
                <div className="w-full space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">
                                LLM Connections
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Connect your LLM providers to enable AI-powered
                                features
                            </p>
                        </div>
                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={setIsAddDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Provider
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Connect LLM Provider
                                    </DialogTitle>
                                    <DialogDescription>
                                        Add a new LLM provider to enable
                                        AI-powered workflow features
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="provider">
                                            Provider
                                        </Label>
                                        <Select
                                            onValueChange={handleProviderSelect}
                                            value={data.provider_id}
                                        >
                                            <SelectTrigger id="provider">
                                                <SelectValue placeholder="Select a provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {providers.map((provider) => (
                                                    <SelectItem
                                                        key={provider.id}
                                                        value={provider.id.toString()}
                                                    >
                                                        {provider.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.provider_id && (
                                            <p className="text-sm text-red-500">
                                                {errors.provider_id}
                                            </p>
                                        )}
                                    </div>
                                    {selectedProvider && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Connection Name (optional)
                                                </Label>
                                                <Input
                                                    id="name"
                                                    placeholder={`My ${selectedProvider.name}`}
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {Object.entries(
                                                selectedProvider.config_schema ||
                                                    {},
                                            ).map(([key, field]) => (
                                                <div
                                                    key={key}
                                                    className="space-y-2"
                                                >
                                                    <Label
                                                        htmlFor={`add-${key}`}
                                                    >
                                                        {field.label}
                                                    </Label>
                                                    {field.type === 'select' ? (
                                                        <Select
                                                            value={
                                                                data.config[
                                                                    key
                                                                ] || ''
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                handleConfigChange(
                                                                    key,
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                id={`add-${key}`}
                                                            >
                                                                <SelectValue
                                                                    placeholder={`Select ${field.label.toLowerCase()}`}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {field.options?.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : field.type ===
                                                      'password' ? (
                                                        <Input
                                                            id={`add-${key}`}
                                                            type="password"
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                            value={
                                                                data.config[
                                                                    key
                                                                ] || ''
                                                            }
                                                            onChange={(e) =>
                                                                handleConfigChange(
                                                                    key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={`add-${key}`}
                                                            type="text"
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                            value={
                                                                data.config[
                                                                    key
                                                                ] || ''
                                                            }
                                                            onChange={(e) =>
                                                                handleConfigChange(
                                                                    key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={data.is_default}
                                            onChange={(e) =>
                                                setData(
                                                    'is_default',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        <Label htmlFor="is_default">
                                            Set as default provider
                                        </Label>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsAddDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                processing || !selectedProvider
                                            }
                                        >
                                            Connect
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {editingSetting && (
                        <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                        >
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Edit LLM Connection
                                    </DialogTitle>
                                    <DialogDescription>
                                        Update your{' '}
                                        {editingSetting.provider.name}{' '}
                                        connection settings
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleEditSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">
                                            Connection Name
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            value={editData.name || ''}
                                            onChange={(e) =>
                                                setEditData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="My DeepSeek"
                                        />
                                    </div>
                                    {(() => {
                                        const provider = providers.find(
                                            (p) =>
                                                p.id ===
                                                editingSetting.provider.id,
                                        );
                                        if (!provider) return null;
                                        return Object.entries(
                                            provider.config_schema || {},
                                        ).map(([key, field]) => (
                                            <div
                                                key={key}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor={`edit-${key}`}>
                                                    {field.label}
                                                </Label>
                                                {field.type === 'select' ? (
                                                    <Select
                                                        value={
                                                            editData.config[
                                                                key
                                                            ] || ''
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleEditConfigChange(
                                                                key,
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id={`edit-${key}`}
                                                        >
                                                            <SelectValue
                                                                placeholder={`Select ${field.label.toLowerCase()}`}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {field.options?.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : field.type ===
                                                  'password' ? (
                                                    <Input
                                                        id={`edit-${key}`}
                                                        type="password"
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        value={
                                                            editData.config[
                                                                key
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleEditConfigChange(
                                                                key,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <Input
                                                        id={`edit-${key}`}
                                                        type="text"
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        value={
                                                            editData.config[
                                                                key
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleEditConfigChange(
                                                                key,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ));
                                    })()}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="edit-is_default"
                                            checked={editData.is_default}
                                            onChange={(e) =>
                                                setEditData(
                                                    'is_default',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        <Label htmlFor="edit-is_default">
                                            Set as default provider
                                        </Label>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsEditDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={editProcessing}
                                        >
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}

                    {settings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="text-center text-muted-foreground">
                                    <p className="mb-4">
                                        No LLM providers connected
                                    </p>
                                    <p className="text-sm">
                                        Connect a provider to start using AI
                                        features
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {settings.map((setting) => (
                                <Card key={setting.id} className="w-full">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <CardTitle className="text-base sm:text-lg">
                                                    {setting.name ||
                                                        setting.provider.name}
                                                </CardTitle>
                                                <CardDescription className="text-sm">
                                                    {setting.provider.name}
                                                </CardDescription>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {setting.is_default && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        Default
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1.5 text-xs"
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${getStatusColor(setting.status)}`}
                                                    />
                                                    {setting.status_label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {expandedCards.includes(setting.id) && (
                                            <div className="space-y-2 text-sm">
                                                {Object.entries(
                                                    setting.config,
                                                ).map(
                                                    ([key, value]) =>
                                                        key !== 'api_key' && (
                                                            <div
                                                                key={key}
                                                                className="flex justify-between"
                                                            >
                                                                <span className="text-muted-foreground">
                                                                    {key}:
                                                                </span>
                                                                <span className="font-mono">
                                                                    {value}
                                                                </span>
                                                            </div>
                                                        ),
                                                )}
                                                {setting.last_tested_at && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Last tested:{' '}
                                                        {new Date(
                                                            setting.last_tested_at,
                                                        ).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-between">
                                        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    toggleCard(setting.id)
                                                }
                                                className="flex-1 sm:flex-initial"
                                            >
                                                {expandedCards.includes(
                                                    setting.id,
                                                ) ? (
                                                    <>
                                                        <ChevronUp className="mr-1 h-4 w-4" />
                                                        Collapse
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="mr-1 h-4 w-4" />
                                                        Details
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleTestConnection(
                                                        setting.id,
                                                    )
                                                }
                                                disabled={
                                                    setting.status === 'testing'
                                                }
                                                className="flex-1 sm:flex-initial"
                                            >
                                                <RefreshCw
                                                    className={`mr-1 h-4 w-4 ${setting.status === 'testing' ? 'animate-spin' : ''}`}
                                                />
                                                Test
                                            </Button>
                                        </div>
                                        <div className="flex w-full justify-end gap-2 sm:w-auto">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleOpenEditDialog(
                                                        setting,
                                                    )
                                                }
                                                title="Edit connection"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="ml-1 sm:hidden">
                                                    Edit
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() =>
                                                    handleDelete(setting.id)
                                                }
                                                title="Delete connection"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="ml-1 sm:hidden">
                                                    Delete
                                                </span>
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="rounded-lg border p-4">
                        <h3 className="mb-3 text-sm font-semibold">
                            Supported Providers
                        </h3>
                        <div className="flex flex-col gap-4">
                            {providers.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="flex items-start gap-3"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                                        {provider.icon || '🔌'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {provider.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {provider.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
