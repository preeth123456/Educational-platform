
import React, { useState, useEffect } from 'react';
import { adminService } from '../lib/adminService';
import { FaTrash, FaCog, FaCheckCircle, FaPuzzlePiece, FaSlack, FaVideo, FaInfoCircle, FaExternalLinkAlt, FaLock, FaExclamationTriangle, FaShieldAlt, FaMicrosoft, FaSalesforce, FaHubspot, FaDropbox, FaGithub, FaHeartbeat } from 'react-icons/fa';
import { SiCanvas, SiZoom, SiNotion, SiGoogleclassroom } from 'react-icons/si';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import AdminLayout from '../components/AdminLayout';

interface Integration {
    id: number;
    name: string;
    integration_type: string;
    status: 'active' | 'inactive';
    config: any;
    installed_at: string;
    installed_by_name: string;
}

interface ConfigField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
}

interface AvailableIntegration {
    type: string;
    name: string;
    description: string;
    credential_url?: string;
    credential_help?: string;
    config_fields: ConfigField[];
}

const AdminIntegrations = () => {
    const [activeTab, setActiveTab] = useState("marketplace");
    const [availableApps, setAvailableApps] = useState<AvailableIntegration[]>([]);
    const [installedApps, setInstalledApps] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInstalling, setIsInstalling] = useState(false);
    const { toast } = useToast();

    // Install/Manage Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<AvailableIntegration | null>(null);
    const [configData, setConfigData] = useState<Record<string, string>>({});

    // Details Modal State
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedInstalled, setSelectedInstalled] = useState<Integration | null>(null);
    const [isUpdatingSecrets, setIsUpdatingSecrets] = useState(false);
    const [secretsToUpdate, setSecretsToUpdate] = useState<Record<string, string>>({});

    // Centralized Error Modal State
    const [errorModal, setErrorModal] = useState({ open: false, title: '', message: '' });

    // Health Monitor State
    const [monitorOpen, setMonitorOpen] = useState(false);
    const [healthData, setHealthData] = useState<any[]>([]);

    const openMonitor = async () => {
        try {
            const res = await adminService.integrations.monitorHealth();
            setHealthData(res.data);
            setMonitorOpen(true);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load health status", variant: "destructive" });
        }
    };

    const showError = (title: string, message: string) => {
        setErrorModal({ open: true, title, message });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [availableRes, installedRes] = await Promise.all([
                adminService.integrations.getAvailable(),
                adminService.integrations.getInstalled()
            ]);

            // Backend returns list directly for available, and { results: [] } for installed (ModelViewSet default)
            setAvailableApps(Array.isArray(availableRes.data) ? availableRes.data : availableRes.data.integrations || []);
            setInstalledApps(installedRes.data.results || []);
        } catch (error) {
            console.error("Fetch Data Error:", error);
            toast({ title: "Error", description: "Failed to load integrations", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const openInstallModal = (app: AvailableIntegration) => {
        setSelectedApp(app);
        const initialConfig: Record<string, string> = {};
        app.config_fields.forEach(field => initialConfig[field.name] = '');
        setConfigData(initialConfig);
        setModalOpen(true);
    };

    const handleInstall = async () => {
        if (!selectedApp) return;

        // Validation
        for (const field of selectedApp.config_fields) {
            if (field.required && !configData[field.name]) {
                showError("Validation Error", `${field.label} is required`);
                return;
            }
        }

        try {
            setIsInstalling(true);
            await adminService.integrations.install({
                integration_type: selectedApp.type,
                configuration: configData // Backend expects 'configuration'
            });
            toast({ title: "Success", description: `${selectedApp.name} installed successfully` });
            setModalOpen(false);
            fetchData();
            setActiveTab("installed");
        } catch (error: any) {
            const msg = error.response?.data?.error || "Failed to install integration";
            showError("Installation Failed", msg);
        } finally {
            setIsInstalling(false);
        }
    };

    const handleUninstall = async (id: number) => {
        if (!confirm("Are you sure? This will remove the integration and its automatically created API keys and webhooks.")) return;
        try {
            await adminService.integrations.uninstall(id);
            toast({ title: "Success", description: "Integration uninstalled" });
            setDetailsOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to uninstall", variant: "destructive" });
        }
    };

    const handleTest = async (id: number) => {
        try {
            toast({ title: "Testing...", description: "Verifying connection..." });
            const res = await adminService.integrations.test(id);
            if (res.data.success) {
                toast({ title: "Connection Successful", description: res.data.message });
                fetchData(); // Refresh to update status if it changed
            } else {
                showError("Connection Failed", res.data.message);
            }
        } catch (error) {
        }
    };

    const handleUpdateSecrets = async () => {
        if (!selectedInstalled) return;
        try {
            setIsUpdatingSecrets(true);
            await adminService.integrations.updateSecrets(selectedInstalled.id, secretsToUpdate);
            toast({ title: "Success", description: "Secrets updated securely in the vault" });
            setDetailsOpen(false);
            fetchData();
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.response?.data?.error || "Failed to update secrets",
                variant: "destructive"
            });
        } finally {
            setIsUpdatingSecrets(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'google': return <SiGoogleclassroom className="h-10 w-10 text-[#00AC47]" />;
            case 'microsoft': return <FaMicrosoft className="h-10 w-10 text-[#00A4EF]" />;
            case 'canvas': return <SiCanvas className="h-10 w-10 text-[#E13F2F]" />;
            case 'slack': return <FaSlack className="h-10 w-10 text-[#4A154B]" />;
            case 'zoom': return <SiZoom className="h-10 w-10 text-[#2D8CFF]" />;
            case 'salesforce': return <FaSalesforce className="h-10 w-10 text-[#00A1E0]" />;
            case 'hubspot': return <FaHubspot className="h-10 w-10 text-[#FF7A59]" />;
            case 'dropbox': return <FaDropbox className="h-10 w-10 text-[#0061FF]" />;
            case 'github': return <FaGithub className="h-10 w-10 text-[#181717]" />;
            case 'notion': return <SiNotion className="h-10 w-10 text-[#000000]" />;
            default: return <FaPuzzlePiece className="h-10 w-10 text-gray-400" />;
        }
    };

    const getResourceType = (type: string) => {
        const oauthApps = ['google', 'microsoft', 'canvas', 'zoom', 'slack', 'salesforce', 'hubspot', 'dropbox', 'github', 'notion'];
        if (oauthApps.includes(type.toLowerCase())) return 'OAuth SSO & Data Sync';
        return 'API Credentials';
    };

    // Helper to unify status display (Hide "Error" text, show "Inactive" instead)
    const getStatusLabel = (status: string) => {
        if (status === 'active') return 'Active';
        if (status === 'inactive') return 'Inactive';
        if (status === 'error') return 'Check Config'; // Friendly label for errors
        return status;
    };

    const getBadgeStyles = (status: string) => {
        if (status === 'active') {
            return {
                variant: 'default' as const,
                className: 'bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 font-bold shadow-none'
            };
        }
        // Gray for inactive, error, configuring
        return {
            variant: 'secondary' as const,
            className: 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-none px-3 font-bold shadow-none'
        };
    };

    return (
        <AdminLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#faf9ff]">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-extrabold text-black tracking-tight">Integration Marketplace</h1>
                        <p className="text-gray-600 mt-2 font-medium">Connect your favorite tools to automate Education workflows</p>
                    </div>
                    <div>
                        <Button onClick={openMonitor} variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 shadow-sm font-bold">
                            <FaHeartbeat className="mr-2 h-5 w-5" /> System Health
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-white p-1 rounded-lg border border-gray-200 mb-6 inline-flex shadow-none">
                        <TabsTrigger value="marketplace" className="px-6 py-2 rounded-md transition-all data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 shadow-none">Marketplace</TabsTrigger>
                        <TabsTrigger value="installed" className="px-6 py-2 rounded-md transition-all data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 shadow-none">
                            Installed Apps {installedApps.length > 0 && <span className="ml-2 bg-purple-200 px-2 rounded-full text-xs">{installedApps.length}</span>}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="marketplace" className="mt-0 focus-visible:outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableApps.map((app) => (
                                <Card key={app.type} className="hover:border-purple-300 transition-all shadow-none border-gray-200 bg-white group">
                                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
                                        <div className="bg-[#f3f0ff] p-3 rounded-xl transition-colors group-hover:bg-purple-100">
                                            {getIcon(app.type)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">{app.name}</CardTitle>
                                            <CardDescription className="text-purple-600 font-semibold">{getResourceType(app.type)}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm h-12 overflow-hidden">{app.description}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {app.config_fields.map(f => (
                                                <Badge key={f.name} variant="secondary" className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider">
                                                    {f.label}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        {installedApps.find(i => i.integration_type === app.type) ? (
                                            <Button variant="ghost" className="w-full text-green-600 bg-green-50 font-bold hover:bg-green-100 hover:text-green-700" disabled>
                                                <FaCheckCircle className="mr-2" /> Installed
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full bg-black text-white hover:bg-gray-800 font-bold py-6 rounded-xl transition-all"
                                                onClick={() => openInstallModal(app)}
                                            >
                                                Configure & Install
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="installed" className="mt-0 focus-visible:outline-none">
                        <div className="space-y-4">
                            {installedApps.map((app) => (
                                <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-gray-300">
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-none">
                                            {getIcon(app.integration_type)}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold text-gray-900">{app.name}</h3>
                                                <Badge
                                                    variant={getBadgeStyles(app.status).variant}
                                                    className={getBadgeStyles(app.status).className}
                                                >
                                                    {getStatusLabel(app.status)}
                                                </Badge>
                                                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 px-2 font-bold shadow-none flex items-center gap-1">
                                                    <FaLock size={10} /> Vault Protected
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium tracking-tight">
                                                Installed on {new Date(app.installed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                        <Button variant="outline"
                                            className="font-bold border-gray-200 text-gray-700 rounded-xl px-6 hover:bg-gray-50 shadow-none"
                                            onClick={() => handleTest(app.id)}>
                                            Test Connection
                                        </Button>
                                        <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl px-4 py-2 flex items-center shadow-none"
                                            onClick={() => {
                                                setSelectedInstalled(app);
                                                setDetailsOpen(true);
                                            }}>
                                            <FaCog className="h-4 w-4 mr-2" /> Manage
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {installedApps.length === 0 && !loading && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaPuzzlePiece className="text-gray-300 text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">No Integrations Yet</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto mt-2">Browse the marketplace to find tools that can supercharge your classroom management.</p>
                                    <Button variant="outline" className="mt-6 font-bold rounded-xl" onClick={() => setActiveTab("marketplace")}>
                                        Open Marketplace
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Install Modal */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col rounded-3xl p-0 shadow-none border-gray-200 overflow-hidden">
                        <DialogHeader className="space-y-3 px-8 pt-8 pb-4 shrink-0">
                            <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                                {selectedApp && getIcon(selectedApp.type)}
                            </div>
                            <DialogTitle className="text-2xl font-extrabold">Install {selectedApp?.name}</DialogTitle>
                            <DialogDescription className="font-medium text-gray-500 text-base">
                                Let's link your {selectedApp?.name} account to Eduyata.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1 px-8">
                            <div className="space-y-5 pb-6">
                                <div className="bg-blue-50 p-4 rounded-xl flex gap-4 items-start border border-blue-100">
                                    <FaInfoCircle className="text-blue-500 mt-1 shrink-0" />
                                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                        Installing this app will automatically provision a new <span className="font-bold">API Key</span> and <span className="font-bold">Webhook Endpoint</span> dedicated to this integration.
                                    </p>
                                </div>



                                <div className="space-y-4">
                                    {selectedApp?.config_fields.map((field) => (
                                        <div key={field.name} className="grid w-full items-center gap-2">
                                            <Label htmlFor={field.name} className="text-xs font-bold text-gray-400 uppercase tracking-widest">{field.label}</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name} // Explicit name
                                                autoComplete="off" // Disable autofill
                                                data-lpignore="true" // Ignore LastPass
                                                type={field.type === 'password' ? 'password' : 'text'}
                                                value={configData[field.name] || ''}
                                                onChange={(e) => setConfigData({ ...configData, [field.name]: e.target.value })}
                                                placeholder={field.placeholder || `Paste your ${field.label} here`}
                                                required={field.required}
                                                className="rounded-xl border-gray-200 py-6 focus:ring-purple-200 font-mono text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic "Get Credentials" Link for ALL Apps */}
                                {selectedApp?.credential_url && (
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                                        <div className="flex items-start gap-3">
                                            <FaInfoCircle className="text-purple-500 mt-0.5 shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                                                    {selectedApp?.credential_help || 'Get your OAuth credentials from the developer portal'}
                                                </p>
                                                <a
                                                    href={selectedApp?.credential_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                                                >
                                                    <FaExternalLinkAlt className="text-[10px]" />
                                                    Get {selectedApp?.name} Credentials
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <DialogFooter className="sm:justify-between gap-4 px-8 py-6 border-t border-gray-100 shrink-0 bg-white">
                            <Button variant="ghost" onClick={() => setModalOpen(false)} className="font-bold rounded-xl text-gray-400">Cancel</Button>
                            <Button onClick={handleInstall} disabled={isInstalling} className="bg-black text-white hover:bg-gray-800 font-bold rounded-xl px-10 py-6">
                                {isInstalling ? "Linking..." : "Confirm & Install"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Details/Manage Modal */}
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                    <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 shadow-none border-gray-200 h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Manage {selectedInstalled?.name}</DialogTitle>
                        </DialogHeader>
                        {selectedInstalled && (
                            <div className="mt-4">
                                <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 mb-6">
                                        <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">General</TabsTrigger>
                                        <TabsTrigger value="secrets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                                            <FaLock size={12} /> Secrets Manager
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#faf9ff] p-4 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                <Badge
                                                    variant={getBadgeStyles(selectedInstalled.status).variant}
                                                    className={getBadgeStyles(selectedInstalled.status).className}
                                                >
                                                    {getStatusLabel(selectedInstalled.status)}
                                                </Badge>
                                            </div>
                                            <div className="bg-[#faf9ff] p-4 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Integration ID</p>
                                                <p className="font-mono text-sm font-bold text-purple-700">#{selectedInstalled.id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-3">Standard Configuration</h4>
                                            <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-2">
                                                {selectedInstalled.config && Object.entries(selectedInstalled.config).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                                                        <span className="text-gray-400">{key}:</span>
                                                        <span className="text-gray-700 font-bold">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-gray-400 italic flex items-center gap-1">
                                                <FaShieldAlt /> Sensitive values are automatically masked by the vault.
                                            </p>
                                        </div>

                                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                            <h4 className="font-bold text-red-700 mb-1">Uninstall Integration</h4>
                                            <p className="text-xs text-red-600 font-medium mb-4 leading-relaxed">
                                                Deleting this will permanently remove associated keys and webhooks.
                                            </p>
                                            <Button variant="destructive" className="w-full rounded-xl py-6 font-bold shadow-none" onClick={() => handleUninstall(selectedInstalled.id)}>
                                                <FaTrash className="mr-2" /> Uninstall Integration
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="secrets" className="space-y-6">
                                        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex gap-3">
                                            <FaLock className="text-purple-500 mt-1 shrink-0" />
                                            <div>
                                                <h5 className="text-xs font-bold text-purple-900">Secure Vault Storage</h5>
                                                <p className="text-[10px] text-purple-700 font-medium leading-relaxed">
                                                    Updating secrets here will immediately re-encrypt them in the backend vault.
                                                    You only need to provide the fields you want to change.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 py-2">
                                            {selectedInstalled.config && Object.keys(selectedInstalled.config).map((key) => (
                                                <div key={key} className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key.replace('_', ' ')}</Label>
                                                    <Input
                                                        type="password"
                                                        placeholder="•••••••••••• (Leave blank to keep current)"
                                                        className="rounded-xl border-gray-200 py-6 focus:ring-purple-200"
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                setSecretsToUpdate({ ...secretsToUpdate, [key]: e.target.value });
                                                            } else {
                                                                const newSecrets = { ...secretsToUpdate };
                                                                delete newSecrets[key];
                                                                setSecretsToUpdate(newSecrets);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            className="w-full bg-purple-600 text-white hover:bg-purple-700 py-6 rounded-xl font-bold transition-all shadow-md"
                                            onClick={handleUpdateSecrets}
                                            disabled={isUpdatingSecrets || Object.keys(secretsToUpdate).length === 0}
                                        >
                                            {isUpdatingSecrets ? 'Updating Safe...' : 'Update Secrets'}
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* System Health Monitor Dialog */}
                <Dialog open={monitorOpen} onOpenChange={setMonitorOpen}>
                    <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col rounded-3xl p-0 shadow-none border-gray-200 overflow-hidden">
                        <DialogHeader className="px-8 pt-8 pb-4 bg-white shrink-0">
                            <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-gray-900">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <FaHeartbeat className="text-green-600 h-6 w-6" />
                                </div>
                                System Health & Sync Status
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                Real-time connection status and background synchronization logs for all installed integrations.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-auto px-8 pb-8">
                            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Integration</th>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Connection</th>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Last Sync Status</th>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px] text-right">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {healthData.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-[#faf9ff] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{item.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.status === 'active' ? (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-2 font-bold shadow-none">Active</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none px-2 font-bold shadow-none">Inactive</Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {item.last_sync?.status === 'completed' && <FaCheckCircle className="text-green-500" />}
                                                        {item.last_sync?.status === 'failed' && <FaExclamationTriangle className="text-red-500" />}
                                                        {(item.last_sync?.status === 'pending' || item.last_sync?.status === 'running') && <FaHeartbeat className="text-blue-500 animate-pulse" />}
                                                        {item.last_sync?.status === 'never_run' && <span className="w-2 h-2 rounded-full bg-gray-300"></span>}

                                                        <span className="font-medium text-gray-700 capitalize">
                                                            {item.last_sync?.status?.replace('_', ' ') || 'Never Run'}
                                                        </span>
                                                        {item.last_sync?.status === 'failed' && (
                                                            <span className="text-xs text-red-500 font-normal truncate max-w-[200px]" title={item.last_sync?.message}>
                                                                - {item.last_sync?.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-xs text-gray-500">
                                                    {item.last_sync?.time ? (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span>{new Date(item.last_sync.time).toLocaleString()}</span>
                                                            <div className="flex gap-2">
                                                                <span className="bg-gray-100 px-1.5 rounded text-[10px]">{item.last_sync.records} records</span>
                                                                <span className="bg-gray-100 px-1.5 rounded text-[10px]">{item.last_sync.duration}s</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">--</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {healthData.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                                                    No integrations installed to monitor.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Footer removed as per user request */}
                    </DialogContent>
                </Dialog>
                <Dialog open={errorModal.open} onOpenChange={(open) => setErrorModal(prev => ({ ...prev, open }))}>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-white p-0 overflow-hidden">
                        <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <DialogHeader className="space-y-2">
                                <DialogTitle className="text-xl font-bold text-red-900 text-center">{errorModal.title}</DialogTitle>
                                <DialogDescription className="text-red-700 font-medium text-center text-sm leading-relaxed">
                                    {errorModal.message}
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-4 bg-white flex justify-center">
                            <Button
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-6"
                                onClick={() => setErrorModal(prev => ({ ...prev, open: false }))}
                            >
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div >
        </AdminLayout >
    );
};

export default AdminIntegrations;
