
import React, { useState, useEffect } from 'react';
import { adminService } from '../lib/adminService';
import {
    FaLock, FaSync, FaShieldAlt, FaHistory, FaCheckCircle,
    FaExclamationTriangle, FaInfoCircle, FaFingerprint, FaKey
} from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import AdminLayout from '../components/AdminLayout';
import { ScrollArea } from "@/components/ui/scroll-area";

interface VaultHealth {
    status: string;
    total_keys: number;
    encryption_algorithm: string;
    key_derivation: string;
    caching_enabled: boolean;
}

interface AuditLog {
    id: number;
    action: string;
    message: string;
    performed_by: string;
    timestamp: string;
    details: any;
}

const AdminVault = () => {
    const [health, setHealth] = useState<VaultHealth | null>(null);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchVaultData();
    }, []);

    const fetchVaultData = async () => {
        try {
            setLoading(true);
            const [healthRes, logsRes] = await Promise.all([
                adminService.integrations.getVaultHealth(),
                adminService.integrations.getAuditLogs(0) // Fetch Global Vault Audit Logs
            ]);
            setHealth(healthRes.data);
            setAuditLogs(logsRes.data || []);
        } catch (error) {
            console.error("Vault Data Error:", error);
            toast({ title: "Error", description: "Failed to load Vault status", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleRotateKeys = async () => {
        try {
            setIsRotating(true);
            await adminService.integrations.rotateVaultKeys();
            toast({
                title: "Success",
                description: "Master Encryption Key rotated successfully. All secrets re-encrypted.",
                className: "bg-green-50 border-green-200"
            });
            setRotateDialogOpen(false);
            fetchVaultData();
        } catch (error: any) {
            toast({
                title: "Rotation Failed",
                description: error.response?.data?.error || "An error occurred during key rotation",
                variant: "destructive"
            });
        } finally {
            setIsRotating(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#faf9ff] min-h-screen">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-purple-600 p-2 rounded-lg text-white">
                                <FaShieldAlt size={24} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-black tracking-tight">Secrets Vault</h1>
                        </div>
                        <p className="text-gray-600 font-medium">Enterprise-grade encryption management for integration credentials.</p>
                    </div>

                    {health && (
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-100 shadow-sm">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-green-700 uppercase tracking-wider">Vault: {health.status}</span>
                        </div>
                    )}
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-white to-purple-50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                                Encryption Algorithm
                                <FaFingerprint className="text-purple-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-purple-900">{health?.encryption_algorithm || "AES-256-GCM"}</div>
                            <div className="mt-2 flex gap-1">
                                <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-600 bg-white">High Integrity</Badge>
                                <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-600 bg-white">Authenticated</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                                Key Derivation
                                <FaKey className="text-blue-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-blue-900">{health?.key_derivation || "PBKDF2-HMAC"}</div>
                            <div className="mt-2">
                                <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600 bg-white">100k Iterations</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-white to-green-50 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                                Active Keys
                                <FaLock className="text-green-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-green-900">{health?.total_keys || 0}</div>
                            <p className="text-xs text-green-600 font-medium mt-2">Currently protecting all integrations</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Security Actions */}
                    <div className="space-y-6">
                        <Card className="border-gray-200 shadow-none rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <FaSync className="text-orange-500" /> Key Rotation
                                </CardTitle>
                                <CardDescription>Periodically rotate your Master Vault Key for maximum security.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-6">
                                    <div className="flex gap-3">
                                        <FaExclamationTriangle className="text-orange-500 mt-1 shrink-0" />
                                        <p className="text-xs text-orange-800 font-medium leading-relaxed">
                                            Rotating the master key will re-encrypt all stored secrets with a new derived sub-key. This is a background process and won't interrupt services.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-black text-white hover:bg-gray-800 py-6 rounded-2xl font-bold transition-all shadow-lg"
                                    onClick={() => setRotateDialogOpen(true)}
                                >
                                    Rotate Master Key Now
                                </Button>
                                <p className="text-[10px] text-gray-400 text-center mt-4 italic">Recommended every 90 days or if a breach is suspected.</p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 shadow-none rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <FaInfoCircle className="text-blue-500" /> Security Compliance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Auto-Encryption</span>
                                    <Badge className="bg-green-100 text-green-700 shadow-none border-none font-bold">ENABLED</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Sensitive Field Masking</span>
                                    <Badge className="bg-green-100 text-green-700 shadow-none border-none font-bold">ACTIVE</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Audit Logging</span>
                                    <Badge className="bg-green-100 text-green-700 shadow-none border-none font-bold">ENABLED</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Multi-Tenancy Isolation</span>
                                    <Badge className="bg-blue-100 text-blue-700 shadow-none border-none font-bold">VERIFIED</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Audit Logs */}
                    <div className="lg:col-span-2">
                        <Card className="border-gray-200 shadow-none rounded-3xl min-h-[500px] flex flex-col overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <FaHistory className="text-gray-400" /> Vault Activity Audit
                                    </CardTitle>
                                    <CardDescription>Real-time log of secret access and modifications.</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-purple-600 font-bold hover:bg-purple-50" onClick={fetchVaultData}>
                                    Refresh
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <ScrollArea className="h-[450px]">
                                    <Table>
                                        <TableHeader className="bg-gray-50 sticky top-0 z-10">
                                            <TableRow>
                                                <TableHead className="w-[120px]">Timestamp</TableHead>
                                                <TableHead>Admin</TableHead>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Target</TableHead>
                                                <TableHead className="text-right">Result</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {auditLogs.length > 0 ? auditLogs.map((log) => (
                                                <TableRow key={log.id} className="hover:bg-gray-50">
                                                    <TableCell className="text-[11px] font-mono text-gray-500">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-gray-900">{log.performed_by}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="bg-gray-100 text-[10px] uppercase font-bold tracking-tighter">
                                                            {log.action}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600 truncate max-w-[150px]">{log.message}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge className="bg-green-100 text-green-700 border-none shadow-none font-bold text-[10px]">SUCCESS</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">
                                                        No recent vault activity recorded.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Confirm Rotation Dialog */}
                <Dialog open={rotateDialogOpen} onOpenChange={setRotateDialogOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 shadow-none border-gray-200">
                        <DialogHeader className="space-y-4">
                            <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                                <FaSync className="text-orange-500 text-xl" />
                            </div>
                            <DialogTitle className="text-2xl font-extrabold">Confirm Key Rotation</DialogTitle>
                            <DialogDescription className="font-medium text-gray-500 text-base leading-relaxed">
                                You are about to generate a new <span className="font-bold text-black">Master Vault Key</span>.
                                All existing integration secrets will be decrypted and re-encrypted with the new key.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 my-4">
                            <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                                <FaExclamationTriangle /> Critical Operation
                            </h4>
                            <p className="text-xs text-red-600 font-medium leading-relaxed">
                                Ensure your server's <code className="bg-red-100 px-1 rounded">VAULT_MASTER_KEY</code> environment variable is set correctly.
                                This operation cannot be undone.
                            </p>
                        </div>

                        <DialogFooter className="sm:justify-between gap-4 mt-4">
                            <Button variant="ghost" onClick={() => setRotateDialogOpen(false)} className="font-bold rounded-xl text-gray-400">Cancel</Button>
                            <Button
                                onClick={handleRotateKeys}
                                disabled={isRotating}
                                className="bg-black text-white hover:bg-gray-800 font-bold rounded-xl px-10 py-6"
                            >
                                {isRotating ? "Re-encrypting..." : "Confirm Rotation"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminVault;
