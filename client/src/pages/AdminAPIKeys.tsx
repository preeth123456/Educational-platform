
import React, { useState, useEffect } from 'react';
import { adminService } from '../lib/adminService';
import { FaPlus, FaTrash, FaEdit, FaSync, FaChartBar, FaCopy, FaCheck, FaBan, FaCheckCircle, FaExclamationCircle, FaLock, FaShieldAlt, FaEnvelope, FaCode, FaDownload } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminLayout from '../components/AdminLayout';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface APIKey {
    id: number;
    key_value: string;
    name: string;
    user: number;
    user_name: string;
    is_active: boolean;
    created_at: string;
    rate_limit_per_hour: number;
    allowed_ips: string;
    allowed_endpoints: string;  // comma-separated: students,courses,teachers,classrooms
    last_used_at: string | null;
    request_count: number;
}

interface APIKeyStats {
    key_id: number;
    key_name: string;
    is_active: boolean;
    rate_limit: number;
    allowed_ips: string;
    total_lifetime_requests: number;
    last_used_at: string | null;
    created_at: string;
    last_30_days_requests: number;
    current_hour_requests: number;
    remaining_requests_this_hour: number;
    graph_data?: any[];
}

const AdminAPIKeys = () => {
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const { toast } = useToast();

    // Create Modal State
    const [createOpen, setCreateOpen] = useState(false);
    const [newKeyData, setNewKeyData] = useState({
        name: '',
        user: 1,
        rate_limit_per_hour: 1000,
        allowed_ips: '',
        allowed_endpoints: 'students,courses,teachers,classrooms'  // Default all
    });
    const [createdKey, setCreatedKey] = useState<string | null>(null);

    // Edit Modal State
    const [editOpen, setEditOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<APIKey | null>(null);

    // Stats Modal State
    const [statsOpen, setStatsOpen] = useState(false);
    const [currentStats, setCurrentStats] = useState<APIKeyStats | null>(null);

    // Stats Chart Data
    const [statsData, setStatsData] = useState<any[]>([]);
    const [regeneratedKey, setRegeneratedKey] = useState<string | null>(null);
    const [showRegenerated, setShowRegenerated] = useState(false);

    // Feature 9: Secure Bundle State
    const [bundleModalOpen, setBundleModalOpen] = useState(false);
    const [bundleEmail, setBundleEmail] = useState('');
    const [selectedKeyForBundle, setSelectedKeyForBundle] = useState<string>(''); // Key ID as string for Select
    const [sendingBundle, setSendingBundle] = useState(false);
    const [bundleSent, setBundleSent] = useState(false);

    useEffect(() => {
        fetchKeys();
        fetchSummary();
    }, []);

    const fetchKeys = async () => {
        try {
            setLoading(true);
            const res = await adminService.apiKeys.getAll();
            setApiKeys(res.data.results || []);
        } catch (error) {
            console.error("Failed to fetch API keys", error);
            toast({
                title: "Error",
                description: "Failed to load API keys",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await adminService.apiKeys.getSummary();
            setSummary(res.data);
        } catch (error) {
            console.error("Failed to fetch summary", error);
        }
    };

    const handleCreate = async () => {
        if (!newKeyData.name) {
            toast({ title: "Validation Error", description: "Name is required", variant: "destructive" });
            return;
        }

        try {
            const res = await adminService.apiKeys.create(newKeyData);
            setCreatedKey(res.data.key_value);
            toast({ title: "Success", description: "API Key created successfully" });
            fetchKeys();
            fetchSummary();
            // Don't close immediately, let user copy key
        } catch (error) {
            toast({ title: "Error", description: "Failed to create API Key", variant: "destructive" });
        }
    };

    const handleUpdate = async () => {
        if (!editingKey) return;
        try {
            const payload = {
                name: editingKey.name,
                rate_limit_per_hour: editingKey.rate_limit_per_hour,
                allowed_ips: editingKey.allowed_ips
            };
            await adminService.apiKeys.update(editingKey.id, payload);
            toast({ title: "Success", description: "API Key updated" });
            setEditOpen(false);
            fetchKeys();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update API Key", variant: "destructive" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this API Key? This actions cannot be undone.")) return;
        try {
            await adminService.apiKeys.delete(id);
            toast({ title: "Success", description: "API Key deleted" });
            fetchKeys();
            fetchSummary();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete API Key", variant: "destructive" });
        }
    };

    const handleRegenerate = async (id: number) => {
        if (!confirm("Regenerate Key? The old key will stop working immediately.")) return;
        try {
            const res = await adminService.apiKeys.regenerate(id);
            setRegeneratedKey(res.data.data.key_value);
            setShowRegenerated(true);
            fetchKeys();
        } catch (error) {
            toast({ title: "Error", description: "Failed to regenerate key", variant: "destructive" });
        }
    };

    const toggleStatus = async (key: APIKey) => {
        try {
            if (key.is_active) {
                await adminService.apiKeys.deactivate(key.id);
                toast({ title: "Deactivated", description: `${key.name} is now inactive` });
            } else {
                await adminService.apiKeys.activate(key.id);
                toast({ title: "Activated", description: `${key.name} is now active` });
            }
            fetchKeys();
            fetchSummary();
        } catch (error) {
            toast({ title: "Error", description: "Failed to change status", variant: "destructive" });
        }
    };

    const viewStats = async (id: number) => {
        try {
            const res = await adminService.apiKeys.getStats(id);
            setCurrentStats(res.data);


            // Use real graph data from backend
            setStatsData(res.data.graph_data || []);

            setStatsOpen(true);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load stats", variant: "destructive" });
        }
    };

    const handleSendBundle = async () => {
        if (!bundleEmail || !selectedKeyForBundle) {
            toast({ title: "Validation Error", description: "Email and API Key are required", variant: "destructive" });
            return;
        }

        try {
            setSendingBundle(true);
            const res = await adminService.apiKeys.sendBundle(bundleEmail, parseInt(selectedKeyForBundle));
            setBundleSent(true);
            toast({
                title: "Bundle Sent!",
                description: "The Developer Kit has been emailed successfully.",
                className: "bg-green-50 border-green-200"
            });
        } catch (error: any) {
            toast({
                title: "Delivery Failed",
                description: error.response?.data?.message || "Could not send the bundle.",
                variant: "destructive"
            });
        } finally {
            setSendingBundle(false);
        }
    };

    const handleDownloadBundle = async (sdkType: string = 'python') => {
        try {
            const res = await adminService.apiKeys.downloadBundle(sdkType);
            // Create download link from blob
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            // Filename based on SDK type
            const filename = sdkType === 'nodejs' ? 'NodeJS_Eduyata_SDK.zip' : 'Eduyata_Developer_Kit.zip';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setBundleModalOpen(false);
            toast({
                title: "Download Started!",
                description: `${filename} has been downloaded. Add your API Key to config.js.`,
                className: "bg-green-50 border-green-200"
            });
        } catch (error: any) {
            toast({
                title: "Download Failed",
                description: error.response?.data?.message || "Could not download the bundle.",
                variant: "destructive"
            });
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-full bg-[#faf9ff]">
                <div>
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">API Keys Management</h1>
                    <p className="text-gray-600 mt-2 font-medium">Manage access keys for the Public API Framework</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Keys</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary?.total_keys || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-500">Active Keys</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{summary?.active_keys || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-500">Inactive Keys</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary?.inactive_keys || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{summary?.total_requests_all_time || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature 9: Developer Tooling */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCode className="text-orange-500" /> Developer Resources
                    </h2>
                    <div className="flex justify-center">
                        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600">
                                        <FaCode className="text-white" />
                                    </div>
                                    Developer Kit
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Complete web dashboard to access and export API data.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">v1.0.2</Badge>
                                    <Badge className="bg-green-100 text-green-800 border-none">Stable</Badge>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full border-gray-200"
                                        onClick={() => handleDownloadBundle('python')}
                                    >
                                        <FaDownload className="mr-2" /> Download
                                    </Button>
                                    <Button
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none font-bold shadow-lg shadow-orange-200"
                                        onClick={() => {
                                            setBundleEmail('');
                                            setBundleSent(false);
                                            setBundleModalOpen(true);
                                        }}
                                    >
                                        <FaEnvelope className="mr-2" /> Email Bundle
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100">
                    <Input
                        placeholder="Search API keys..."
                        className="max-w-sm"
                    />
                    <Dialog open={createOpen} onOpenChange={(open) => {
                        setCreateOpen(open);
                        if (!open) setCreatedKey(null); // Reset created key on close
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                <FaPlus className="mr-2" /> Create New Key
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            {/* ... existing create modal content ... */}
                            <DialogHeader>
                                <DialogTitle>Create New API Key</DialogTitle>
                                <DialogDescription>
                                    Generate a new key for an external application.
                                </DialogDescription>
                            </DialogHeader>

                            {!createdKey ? (
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input
                                            id="name"
                                            value={newKeyData.name}
                                            onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. My App Integration"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="rate" className="text-right">Rate Limit</Label>
                                        <Input
                                            id="rate"
                                            type="number"
                                            value={newKeyData.rate_limit_per_hour}
                                            onChange={(e) => setNewKeyData({ ...newKeyData, rate_limit_per_hour: parseInt(e.target.value) })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <div className="text-right pt-2">
                                            <Label htmlFor="ips">Allowed IPs</Label>
                                            <div className="text-[11px] text-gray-500 font-normal mt-0.5">(Optional)</div>
                                        </div>
                                        <Textarea
                                            id="ips"
                                            value={newKeyData.allowed_ips}
                                            onChange={(e) => setNewKeyData({ ...newKeyData, allowed_ips: e.target.value })}
                                            className="col-span-3"
                                            placeholder="Comma separated IPs (e.g. 192.168.1.1). Leave empty for any IP."
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <div className="text-right pt-2">
                                            <Label>Allowed Endpoints</Label>
                                            <div className="text-[11px] text-gray-500 font-normal mt-0.5">(Select access)</div>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-2 gap-2">
                                            {['students', 'courses', 'teachers', 'classrooms'].map((endpoint) => (
                                                <label key={endpoint} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={newKeyData.allowed_endpoints.includes(endpoint)}
                                                        onChange={(e) => {
                                                            const current = newKeyData.allowed_endpoints.split(',').filter(e => e);
                                                            if (e.target.checked) {
                                                                current.push(endpoint);
                                                            } else {
                                                                const idx = current.indexOf(endpoint);
                                                                if (idx > -1) current.splice(idx, 1);
                                                            }
                                                            setNewKeyData({ ...newKeyData, allowed_endpoints: current.join(',') });
                                                        }}
                                                        className="w-4 h-4 text-purple-600"
                                                    />
                                                    <span className="capitalize font-medium">{endpoint}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 space-y-4">
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
                                        <FaCheckCircle className="mx-auto text-green-500 w-12 h-12 mb-2" />
                                        <h3 className="text-lg font-medium text-green-900">API Key Created!</h3>
                                        <p className="text-sm text-green-700 mb-4">Copy this key now. It won't be shown again.</p>

                                        <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-300">
                                            <code className="flex-1 font-mono text-sm break-all">{createdKey}</code>
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                navigator.clipboard.writeText(createdKey);
                                                toast({ title: "Copied", description: "Key copied to clipboard" });
                                            }}>
                                                <FaCopy />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <DialogFooter>
                                {!createdKey ? (
                                    <Button onClick={handleCreate} className="bg-purple-600">Generate Key</Button>
                                ) : (
                                    <Button onClick={() => setCreateOpen(false)}>Close</Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Developer Guide Link */}
                    <Button
                        variant="outline"
                        className="ml-2 text-gray-600 border-gray-300"
                        onClick={() => {
                            const baseUrl = window.location.origin.includes('localhost')
                                ? 'http://localhost:8001' // Development backend port
                                : window.location.origin;  // Production
                            window.open(`${baseUrl}/api/v1/developer-guide/`, '_blank');
                        }}
                    >
                        <FaExclamationCircle className="mr-2" /> Developer Guide
                    </Button>
                </div>

                {/* Keys Table */}
                <Card className="shadow-none border-gray-200">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Namespace / Name</TableHead>
                                    <TableHead>Key Prefix</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Rate Limit</TableHead>
                                    <TableHead>Last Used</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiKeys.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">
                                            <div>{key.name}</div>
                                            <div className="text-xs text-gray-500">ID: {key.id}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                                    {key.key_value.substring(0, 8)}...
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 hover:bg-gray-200"
                                                    title="Copy full key"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(key.key_value);
                                                        toast({ title: "Copied", description: "Full API Key copied to clipboard" });
                                                    }}
                                                >
                                                    <FaCopy className="h-3 w-3 text-gray-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {key.is_active ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none justify-center">Active</Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-none justify-center">Inactive</Badge>
                                                )}
                                                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 text-[10px] py-0 justify-center">
                                                    <FaLock size={8} className="mr-1" /> SECURED
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>{key.rate_limit_per_hour}/hr</TableCell>
                                        <TableCell>
                                            {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="View Stats" onClick={() => viewStats(key.id)}>
                                                    <FaChartBar className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Edit" onClick={() => {
                                                    setEditingKey(key);
                                                    setEditOpen(true);
                                                }}>
                                                    <FaEdit className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Regenerate" onClick={() => handleRegenerate(key.id)}>
                                                    <FaSync className="h-4 w-4 text-orange-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title={key.is_active ? "Deactivate" : "Activate"}
                                                    onClick={() => toggleStatus(key)}
                                                >
                                                    {key.is_active ? (
                                                        <FaBan className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <FaCheck className="h-4 w-4 text-green-500" />
                                                    )}
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(key.id)}>
                                                    <FaTrash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {apiKeys.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No API keys found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit Modal */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit API Key</DialogTitle>
                        </DialogHeader>
                        {editingKey && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editingKey.name}
                                        onChange={(e) => setEditingKey({ ...editingKey, name: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-rate" className="text-right">Rate Limit</Label>
                                    <Input
                                        id="edit-rate"
                                        type="number"
                                        value={editingKey.rate_limit_per_hour}
                                        onChange={(e) => setEditingKey({ ...editingKey, rate_limit_per_hour: parseInt(e.target.value) })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <div className="text-right pt-2">
                                        <Label htmlFor="edit-ips">Allowed IPs</Label>
                                        <div className="text-[11px] text-gray-500 font-normal mt-0.5">(Optional)</div>
                                    </div>
                                    <Textarea
                                        id="edit-ips"
                                        value={editingKey.allowed_ips}
                                        onChange={(e) => setEditingKey({ ...editingKey, allowed_ips: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={handleUpdate} className="bg-purple-600">Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Stats Modal */}
                <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Usage Statistics</DialogTitle>
                            <DialogDescription>Usage data for {currentStats?.key_name}</DialogDescription>
                        </DialogHeader>

                        {currentStats && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500">Requests this Hour</div>
                                        <div className="text-2xl font-bold flex items-baseline gap-2">
                                            {currentStats.current_hour_requests}
                                            <span className="text-xs font-normal text-gray-400">/ {currentStats.rate_limit}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500">Last 30 Days</div>
                                        <div className="text-2xl font-bold">{currentStats.last_30_days_requests}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500">Lifetime Total</div>
                                        <div className="text-2xl font-bold">{currentStats.total_lifetime_requests}</div>
                                    </div>
                                </div>

                                <div className="h-[300px] w-full bg-white p-4 border rounded-lg">
                                    <h4 className="text-sm font-medium mb-4 text-gray-500">Daily Requests (Mock Data)</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={statsData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="day" hide />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="requests" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="text-xs text-center text-gray-400">
                                    Created on: {new Date(currentStats.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Regenerated Key Modal */}
                <Dialog open={showRegenerated} onOpenChange={setShowRegenerated}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FaShieldAlt className="text-green-500" /> Key Regenerated
                            </DialogTitle>
                            <DialogDescription>
                                Copy your new key now. You won't be able to see it again!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border">
                            <code className="text-xs font-mono break-all pr-4">
                                {regeneratedKey}
                            </code>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    if (regeneratedKey) {
                                        navigator.clipboard.writeText(regeneratedKey);
                                        toast({ title: "Copied", description: "API Key copied to clipboard" });
                                    }
                                }}
                            >
                                <FaCopy />
                            </Button>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setShowRegenerated(false)} className="w-full">
                                I've saved it
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Feature 9: Secure Bundle Modal */}
                <Dialog open={bundleModalOpen} onOpenChange={setBundleModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FaShieldAlt className="text-orange-500" /> Email Developer Kit
                            </DialogTitle>
                            <DialogDescription>
                                Send the Developer Kit bundle with the API key pre-configured.
                            </DialogDescription>
                        </DialogHeader>

                        {!bundleSent ? (
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Developer Email</Label>
                                    <Input
                                        placeholder="dev@partner.com"
                                        value={bundleEmail}
                                        onChange={(e) => setBundleEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Select API Key to Include</Label>
                                    <div className="border rounded-md">
                                        <div className="bg-gray-50 px-3 py-2 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Available Keys ({apiKeys.filter(k => k.is_active).length})
                                        </div>
                                        <ScrollArea className="h-[200px]">
                                            <div className="p-1 space-y-1">
                                                {apiKeys.filter(k => k.is_active).length === 0 ? (
                                                    <div className="text-center py-8 text-gray-500 text-sm">
                                                        No active API keys found.
                                                    </div>
                                                ) : (
                                                    apiKeys.filter(k => k.is_active).map((key) => (
                                                        <div
                                                            key={key.id}
                                                            onClick={() => setSelectedKeyForBundle(key.id.toString())}
                                                            className={`
                                                                flex items-center justify-between p-3 rounded cursor-pointer transition-colors text-sm
                                                                ${selectedKeyForBundle === key.id.toString()
                                                                    ? 'bg-purple-50 border border-purple-200 text-purple-900'
                                                                    : 'hover:bg-gray-100 border border-transparent'}
                                                            `}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{key.name}</span>
                                                                <code className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                                    {key.key_value.substring(0, 12)}...
                                                                </code>
                                                            </div>
                                                            {selectedKeyForBundle === key.id.toString() && (
                                                                <FaCheckCircle className="text-purple-600" />
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                    <p className="text-[11px] text-gray-500">
                                        The bundle will include a pre-configured dashboard with this API key.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 space-y-4">
                                <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaCheck className="text-green-600 text-xl" />
                                    </div>
                                    <h3 className="text-lg font-bold text-green-900">Developer Kit Sent!</h3>
                                    <p className="text-sm text-gray-600 mb-4">The Developer Kit has been emailed to the developer.</p>
                                    <p className="text-xs text-gray-500 italic">
                                        The kit includes the API key pre-configured in config.js
                                    </p>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {!bundleSent ? (
                                <Button
                                    onClick={handleSendBundle}
                                    className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                                    disabled={sendingBundle}
                                >
                                    {sendingBundle ? "Sending..." : "Send Developer Kit"}
                                </Button>
                            ) : (
                                <Button onClick={() => setBundleModalOpen(false)} className="w-full">
                                    Done
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </AdminLayout>
    );
};

export default AdminAPIKeys;
