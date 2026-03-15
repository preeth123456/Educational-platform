import React, { useState } from 'react';
import { configService } from '../../services/connectorService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Lock, Server } from 'lucide-react';

interface AddConnectorModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddConnectorModal: React.FC<AddConnectorModalProps> = ({ open, onClose, onSuccess }) => {
    const [provider, setProvider] = useState('google');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!clientId || !clientSecret) {
            setError('All fields are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await configService.addConfig({
                provider,
                client_id: clientId,
                client_secret: clientSecret
            });
            onSuccess();
            onClose();
            // Reset form
            setClientId('');
            setClientSecret('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add connector configuration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl p-6 bg-white border border-gray-100 shadow-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Server className="w-5 h-5 text-purple-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900">Add New Connector</DialogTitle>
                    </div>
                    <p className="text-sm text-gray-500">
                        Enter the OAuth credentials from your provider (Google Cloud Console / Azure Portal).
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Provider</Label>
                        <Select value={provider} onValueChange={setProvider}>
                            <SelectTrigger className="w-full rounded-xl border-gray-200">
                                <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                <SelectItem value="google">Google Classroom & Workspace</SelectItem>
                                <SelectItem value="microsoft">Microsoft Teams</SelectItem>
                                <SelectItem value="canvas">Canvas LMS</SelectItem>
                                <SelectItem value="zoom">Zoom</SelectItem>
                                <SelectItem value="slack">Slack</SelectItem>
                                <SelectItem value="salesforce">Salesforce</SelectItem>
                                <SelectItem value="hubspot">HubSpot</SelectItem>
                                <SelectItem value="dropbox">Dropbox</SelectItem>
                                <SelectItem value="github">GitHub</SelectItem>
                                <SelectItem value="notion">Notion</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Client ID</Label>
                        <Input
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            placeholder="e.g. 123456789-abc..."
                            className="rounded-xl border-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Client Secret</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <Input
                                type="password"
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                placeholder="••••••••••••••••"
                                className="pl-9 rounded-xl border-gray-200"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400">
                            Secrets are encrypted securely in the Vault before storage.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:justify-between">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-medium text-gray-500">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-purple-200">
                        {loading ? 'Saving...' : 'Add Configuration'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
