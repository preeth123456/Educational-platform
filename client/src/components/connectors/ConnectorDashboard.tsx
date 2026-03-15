import React, { useState, useEffect } from 'react';
import { useConnectorAPI } from '@/hooks/useConnectorAPI';
import { ConnectorCard } from '@/components/connectors/ConnectorCard';
import { SyncJobMonitor } from '@/components/connectors/SyncJobMonitor';
import { AddConnectorModal } from '@/components/connectors/AddConnectorModal';
import { configService } from '@/services/connectorService';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming shadcn alert

export const ConnectorDashboard: React.FC = () => {
    const { connectors, loading, error, refetch } = useConnectorAPI();
    const [activeTab, setActiveTab] = useState('connectors');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [configs, setConfigs] = useState<any[]>([]);

    const allProviders = [
        { id: 'google', name: 'Google Classroom & Workspace', icon: 'google', description: 'Sync Classroom, Drive, and Academic data' },
        { id: 'microsoft', name: 'Microsoft Teams', icon: 'microsoft', description: 'Sync Teams, OneDrive, and Outlook' },
        { id: 'canvas', name: 'Canvas LMS', icon: 'canvas', description: 'Sync Courses and Assignments' },
        { id: 'zoom', name: 'Zoom', icon: 'zoom', description: 'Sync Meetings and Recordings' },
        { id: 'slack', name: 'Slack', icon: 'slack', description: 'Sync Channels and Messages' },
        { id: 'salesforce', name: 'Salesforce', icon: 'salesforce', description: 'Sync CRM Contacts and Leads' },
        { id: 'hubspot', name: 'HubSpot', icon: 'hubspot', description: 'Sync Marketing and CRM Data' },
        { id: 'dropbox', name: 'Dropbox', icon: 'dropbox', description: 'Sync Files and Documents' },
        { id: 'github', name: 'GitHub', icon: 'github', description: 'Sync Repositories and Issues' },
        { id: 'notion', name: 'Notion', icon: 'notion', description: 'Sync Pages and Databases' }
    ];

    const fetchConfigs = async () => {
        try {
            const data = await configService.getConfigs();
            // FILTER: Only show "Active" integrations in Connectors Dashboard
            // User Flow: Install (Marketplace) -> Valid Keys -> Active Status -> Appears Here -> Connect (OAuth)
            const activeConfigs = data.filter((config: any) => config.status === 'active');
            setConfigs(activeConfigs);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    // Handle OAuth callback redirect from backend
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const success = params.get('success');
        const provider = params.get('provider');
        const errorParam = params.get('error');
        const message = params.get('message');

        if (success === 'true' && provider) {
            // Auto-refresh to show updated connected status
            refetch();
            fetchConfigs();
            // Clear URL params
            window.history.replaceState({}, '', '/admin/connectors');
            // Show success alert
            alert(`✅ Successfully connected to ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);

            // User Flow: "after successful validation... go into sync job tab page"
            setActiveTab('sync');
        } else if (errorParam) {
            alert(`❌ OAuth Error (${provider}): ${decodeURIComponent(message || errorParam)}`);
            window.history.replaceState({}, '', '/admin/connectors');
        }
    }, []);

    const handleDeleteConfig = async (id: number) => {
        if (window.confirm("Are you sure you want to remove this configuration? This will disable new connections.")) {
            await configService.deleteConfig(id);
            fetchConfigs();
        }
    };

    const handleRefresh = () => {
        refetch();
        fetchConfigs();
    }

    if (loading && connectors.length === 0 && configs.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading connectors...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Third-Party Connectors</h1>
                    <p className="text-gray-500 mt-1">Manage secure OAuth integrations with external platforms.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Error!</span> {error}
                    </div>
                </div>
            )}

            {/* Tabs Layout */}
            <div className="w-full">
                <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-8 w-fit">
                    <button
                        onClick={() => setActiveTab('connectors')}
                        className={`rounded-lg px-6 py-2 text-sm font-medium leading-5 transition-all ${activeTab === 'connectors'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Connectors
                    </button>
                    <button
                        onClick={() => setActiveTab('sync')}
                        className={`rounded-lg px-6 py-2 text-sm font-medium leading-5 transition-all ${activeTab === 'sync'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Sync Jobs
                    </button>
                </div>

                {activeTab === 'connectors' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {connectors.length === 0 ? (
                            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Installed Connectors</h3>
                                <p className="text-gray-500 mb-6 px-4 max-w-md mx-auto">
                                    Browse the Marketplace to discover and install school apps. Once installed, they will appear here for security connection.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <a
                                        href="/admin/integrations"
                                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                                    >
                                        Browse Integration Marketplace
                                    </a>
                                </div>
                            </div>
                        ) : (
                            connectors.map(connector => {
                                const providerId = connector.integration_type;
                                const provider = allProviders.find(p => p.id === providerId) || {
                                    id: providerId,
                                    name: providerId.charAt(0).toUpperCase() + providerId.slice(1),
                                    icon: 'settings',
                                    description: 'Third-Party Integration'
                                };
                                const config = configs.find(c => (c.integration_type || c.provider) === providerId);

                                return (
                                    <ConnectorCard
                                        key={connector.id}
                                        provider={provider}
                                        connector={connector}
                                        config={config}
                                        onRefresh={handleRefresh}
                                        onConfigure={() => setIsAddModalOpen(true)}
                                        onDeleteConfig={handleDeleteConfig}
                                        onViewSync={() => setActiveTab('sync')}
                                        onConnectSuccess={() => setActiveTab('sync')}
                                    />
                                );
                            })
                        )}
                    </div>
                )}

                {activeTab === 'sync' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Recent Sync Activity</h3>
                        </div>
                        <div className="p-6">
                            <SyncJobMonitor />
                        </div>
                    </div>
                )}
            </div>

            <AddConnectorModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchConfigs}
            />
        </div>
    );
};
