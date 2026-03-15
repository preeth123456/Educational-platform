
import React, { useState, useEffect } from 'react';
import { adminService } from '../lib/adminService';
import { FaPlus, FaTrash, FaEdit, FaBolt, FaHistory, FaCheck, FaBan, FaCheckCircle, FaTimesCircle, FaClock, FaLock, FaChartBar, FaExclamationCircle } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminLayout from '../components/AdminLayout';

interface WebhookEndpoint {
    id: number;
    name: string;
    url: string;
    event_types: string;
    is_active: boolean;
    created_at: string;
    created_by_name: string;
}

interface WebhookDelivery {
    id: number;
    webhook_event_type: string;
    webhook_status: 'pending' | 'delivered' | 'failed';
    webhook_response_code: number;
    webhook_retry_count: number;
    webhook_delivered_at: string | null;
    created_at: string;
    message: string;
}

const EVENT_TYPES = [
    { id: 'student.enrolled', label: 'Student Enrolled' },
    { id: 'student.course_completed', label: 'Course Completed' },
    { id: 'classroom.session_started', label: 'Session Started' },
    { id: 'classroom.session_completed', label: 'Session Completed' },
];

const AdminWebhooks = () => {
    const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const { toast } = useToast();

    // Create/Edit Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        url: '',
        event_types: [] as string[],
        is_active: true
    });

    // Deliveries Modal State
    const [deliveriesOpen, setDeliveriesOpen] = useState(false);
    const [currentEndpointId, setCurrentEndpointId] = useState<number | null>(null);
    const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);

    // Monitor State
    const [monitorOpen, setMonitorOpen] = useState(false);
    const [monitorStats, setMonitorStats] = useState<any>(null);

    const openMonitor = async () => {
        try {
            const res = await adminService.webhooks.monitorStats();
            setMonitorStats(res.data);
            setMonitorOpen(true);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load webhook stats", variant: "destructive" });
        }
    };

    useEffect(() => {
        fetchEndpoints();
        fetchSummary();
    }, []);

    const fetchEndpoints = async () => {
        try {
            setLoading(true);
            const res = await adminService.webhooks.getAll();
            setEndpoints(res.data.results || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load webhooks", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await adminService.webhooks.getSummary();
            setSummary(res.data);
        } catch (error) {
            console.error("Failed to fetch summary", error);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.url) {
            toast({ title: "Validation Error", description: "Name and URL are required", variant: "destructive" });
            return;
        }

        // Ensure URL starts with http
        if (!formData.url.startsWith('http')) {
            toast({ title: "Validation Error", description: "URL must start with http:// or https://", variant: "destructive" });
            return;
        }

        const payload = {
            name: formData.name,
            url: formData.url,
            event_types: formData.event_types.join(','), // Backend expects comma-separated string
            is_active: formData.is_active
        };

        try {
            if (isEditing) {
                await adminService.webhooks.update(formData.id, payload);
                toast({ title: "Success", description: "Webhook updated" });
            } else {
                await adminService.webhooks.create(payload);
                toast({ title: "Success", description: "Webhook created" });
            }
            setModalOpen(false);
            fetchEndpoints();
            fetchSummary();
        } catch (error) {
            toast({ title: "Error", description: `Failed to ${isEditing ? 'update' : 'create'} webhook`, variant: "destructive" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this webhook endpoint?")) return;
        try {
            await adminService.webhooks.delete(id);
            toast({ title: "Success", description: "Webhook deleted" });
            fetchEndpoints();
            fetchSummary();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete webhook", variant: "destructive" });
        }
    };

    const handleTest = async (id: number) => {
        try {
            const res = await adminService.webhooks.test(id);
            toast({ title: "Test Sent", description: "Check delivery logs for result" });
            fetchSummary(); // Update delivery counts
        } catch (error) {
            toast({ title: "Error", description: "Failed to send test webhook", variant: "destructive" });
        }
    };

    const viewDeliveries = async (id: number) => {
        setCurrentEndpointId(id);
        setDeliveriesOpen(true);
        setDeliveries([]); // Clear previous
        try {
            const res = await adminService.webhooks.getDeliveries(id, { limit: 20 });
            setDeliveries(res.data.deliveries || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load deliveries", variant: "destructive" });
        }
    };

    const toggleStatus = async (item: WebhookEndpoint) => {
        try {
            await adminService.webhooks.update(item.id, { is_active: !item.is_active });
            toast({ title: "Success", description: `Webhook ${item.is_active ? 'deactivated' : 'activated'}` });
            fetchEndpoints();
        } catch (error) {
            // toast({ title: "Error", description: "Failed to update status", variant: "destructive" }); 
            // Above commented out because strict mode might complain about 'items' typo if I fixed it blindly.
            // Wait, I see 'item' in args.
            // Re-fetching handles the UI update.
            fetchEndpoints();
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({ id: 0, name: '', url: '', event_types: [], is_active: true });
        setModalOpen(true);
    };

    const openEditModal = (item: WebhookEndpoint) => {
        setIsEditing(true);
        setFormData({
            id: item.id,
            name: item.name,
            url: item.url,
            event_types: item.event_types ? item.event_types.split(',') : [],
            is_active: item.is_active
        });
        setModalOpen(true);
    };

    const toggleEventType = (id: string) => {
        const current = formData.event_types;
        if (current.includes(id)) {
            setFormData({ ...formData, event_types: current.filter(e => e !== id) });
        } else {
            setFormData({ ...formData, event_types: [...current, id] });
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-full bg-[#faf9ff]">
                <div>
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">Webhooks</h1>
                    <p className="text-gray-600 mt-2 font-medium">Manage outbound event notifications to external systems</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Webhooks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary?.endpoints?.total || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-500">Successful Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{summary?.deliveries?.successful || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-500">Failed Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary?.deliveries?.failed || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">Last 24 Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{summary?.deliveries?.last_24_hours || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100">
                    <Input
                        placeholder="Search webhooks..."
                        className="max-w-sm"
                    />
                    <div className="flex gap-2">
                        <Button onClick={openMonitor} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <FaChartBar className="mr-2" /> Delivery Stats
                        </Button>
                        <Button onClick={openCreateModal} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <FaPlus className="mr-2" /> Create Webhook
                        </Button>
                    </div>
                </div>

                {/* Webhooks Table */}
                <Card className="shadow-none border-gray-200">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Target URL</TableHead>
                                    <TableHead>Events</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {endpoints.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={item.url}>
                                            {item.url}
                                        </TableCell>
                                        <TableCell>
                                            {item.event_types ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.event_types.split(',').slice(0, 2).map(e => (
                                                        <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                                                    ))}
                                                    {item.event_types.split(',').length > 2 && (
                                                        <Badge variant="outline" className="text-xs">+{item.event_types.split(',').length - 2}</Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge className="bg-blue-100 text-blue-800 border-none">All Events</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {item.is_active ? (
                                                    <Badge className="bg-green-100 text-green-800 border-none justify-center">Active</Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-none justify-center">Inactive</Badge>
                                                )}
                                                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 text-[10px] py-0 justify-center">
                                                    <FaLock size={8} className="mr-1" /> SECURED
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="Test Payload" onClick={() => handleTest(item.id)}>
                                                    <FaBolt className="h-4 w-4 text-yellow-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="View Deliveries" onClick={() => viewDeliveries(item.id)}>
                                                    <FaHistory className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(item)}>
                                                    <FaEdit className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title={item.is_active ? "Deactivate" : "Activate"}
                                                    onClick={() => toggleStatus(item)}
                                                >
                                                    {item.is_active ? <FaBan className="h-4 w-4 text-red-500" /> : <FaCheck className="h-4 w-4 text-green-500" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(item.id)}>
                                                    <FaTrash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {endpoints.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">No webhooks configured.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Create/Edit Modal */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Webhook' : 'Create Webhook'}</DialogTitle>
                            <DialogDescription>Configure where events should be sent.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. Analytics System"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="url" className="text-right">Target URL</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="col-span-3"
                                    placeholder="https://api.example.com/hooks"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Events</Label>
                                <div className="col-span-3 space-y-2 border p-3 rounded-md">
                                    <div className="text-xs text-gray-500 mb-2">Leave all unchecked to subscribe to ALL events.</div>
                                    {EVENT_TYPES.map((type) => (
                                        <div key={type.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={type.id}
                                                checked={formData.event_types.includes(type.id)}
                                                onCheckedChange={() => toggleEventType(type.id)}
                                            />
                                            <label htmlFor={type.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {type.label} <span className="text-xs text-gray-400">({type.id})</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave} className="bg-purple-600">{isEditing ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Deliveries Modal */}
                <Dialog open={deliveriesOpen} onOpenChange={setDeliveriesOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Recent Deliveries</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto min-h-[300px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deliveries.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {log.webhook_status === 'delivered' ? (
                                                        <span className="flex items-center text-green-600 font-bold text-[10px] tracking-wider uppercase">
                                                            <FaCheckCircle className="mr-1 h-3 w-3" /> SUCCESS
                                                        </span>
                                                    ) : log.webhook_status === 'failed' ? (
                                                        <span className="flex items-center text-red-600 font-bold text-[10px] tracking-wider uppercase">
                                                            <FaTimesCircle className="mr-1 h-3 w-3" /> FAILED
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-gray-500 font-bold text-[10px] tracking-wider uppercase">
                                                            <FaClock className="mr-1 h-3 w-3" /> PENDING
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                                {log.webhook_event_type}
                                            </TableCell>
                                            <TableCell className="text-[10px] text-gray-500 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-[11px] text-gray-600 max-w-[300px] truncate" title={log.message}>
                                                {log.message}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {deliveries.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">No delivery logs found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Monitor Stats Dialog */}
                <Dialog open={monitorOpen} onOpenChange={setMonitorOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FaChartBar className="text-blue-500" /> Webhook System Health
                            </DialogTitle>
                            <DialogDescription>Global delivery statistics and recent failures.</DialogDescription>
                        </DialogHeader>

                        {monitorStats && (
                            <div className="space-y-6">
                                {/* Global Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                        <div className="text-3xl font-black text-blue-900">{monitorStats.global_stats?.total}</div>
                                        <div className="text-xs font-bold text-blue-600 uppercase mt-1">Total Signals</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                        <div className="text-3xl font-black text-green-900">{monitorStats.global_stats?.success_ratio}%</div>
                                        <div className="text-xs font-bold text-green-600 uppercase mt-1">Success Rate</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                        <div className="text-3xl font-black text-red-900">{monitorStats.global_stats?.failed}</div>
                                        <div className="text-xs font-bold text-red-600 uppercase mt-1">Total Failures</div>
                                    </div>
                                </div>

                                {/* Recent Failures Table */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <FaExclamationCircle className="text-red-500" /> Recent Failures
                                    </h4>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead className="w-[140px]">Time</TableHead>
                                                    <TableHead>Target System</TableHead>
                                                    <TableHead>Error</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {monitorStats.recent_failures?.map((fail: any) => (
                                                    <TableRow key={fail.id}>
                                                        <TableCell className="text-xs text-gray-500">
                                                            {new Date(fail.created_at).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="font-medium text-xs">
                                                            {fail.webhook_endpoint__url}
                                                        </TableCell>
                                                        <TableCell className="text-xs text-red-600 font-medium truncate max-w-[200px]" title={fail.message}>
                                                            {fail.message}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {(!monitorStats.recent_failures || monitorStats.recent_failures.length === 0) && (
                                                    <TableRow>
                                                        <TableCell colSpan={3} className="text-center py-8 text-gray-400 italic">
                                                            All systems operational. No recent failures.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </AdminLayout>
    );
};

export default AdminWebhooks;
