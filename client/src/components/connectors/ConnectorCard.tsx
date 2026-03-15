import React, { useState } from 'react';
import { Connector, ProviderConfig } from '../../types/connector.types';
import { useOAuthFlow } from '../../hooks/useOAuthFlow';
import { CheckCircle, XCircle, ExternalLink, Settings, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { FaGoogle, FaMicrosoft, FaSlack, FaSalesforce, FaHubspot, FaDropbox, FaGithub } from 'react-icons/fa';
import { SiCanvas, SiZoom, SiNotion, SiGoogleclassroom } from 'react-icons/si';

interface ConnectorCardProps {
    provider: ProviderConfig;
    connector?: Connector;
    config?: { client_id: string; id: number; is_active?: boolean }; // Config from API
    onRefresh: () => void;
    onConfigure: () => void; // Open modal
    onDeleteConfig: (id: number) => void;
    onViewSync: () => void;
    onConnectSuccess: () => void;
}

export const ConnectorCard: React.FC<ConnectorCardProps> = ({
    provider,
    connector,
    config,
    onRefresh,
    onConfigure,
    onDeleteConfig,
    onViewSync,
    onConnectSuccess
}) => {
    const { initiateOAuth, loading: authLoading } = useOAuthFlow(provider.id);

    // Use IS_CONNECTED from backend (checks for access_token presence)
    // Status is 'active' if keys are valid (Installed), but is_connected determines OAuth state
    const isConnected = !!connector && (connector.is_connected === true);

    // Configured ONLY if config exists AND is active (passed verification)
    const isConfigured = !!config && (config.is_active !== false); // Default to true if undefined for backward compat, but backend sends it now

    const handleConnect = async () => {
        if (!isConfigured) {
            onConfigure();
            return;
        }

        const url = await initiateOAuth();
        if (url) {
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            window.open(
                url,
                'oauth_popup',
                `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
            );

            const handleMessage = (event: MessageEvent) => {
                if (event.data.type === 'OAUTH_SUCCESS' && event.data.provider === provider.id) {
                    window.removeEventListener('message', handleMessage);
                    onRefresh();
                    onConnectSuccess(); // Switch tab
                }
            };
            window.addEventListener('message', handleMessage);
        }
    };

    // Branding helper
    const getBrandStyles = (id: string) => {
        switch (id) {
            case 'google': return {
                bg: 'bg-gradient-to-br from-green-50 to-white',
                iconBg: 'bg-white',
                iconColor: 'text-[#00AC47]', // Google Classroom Green
                Icon: SiGoogleclassroom,
                border: 'hover:border-green-200'
            };
            case 'microsoft': return {
                bg: 'bg-gradient-to-br from-indigo-50 to-white',
                iconBg: 'bg-indigo-600',
                iconColor: 'text-white',
                Icon: FaMicrosoft,
                border: 'hover:border-indigo-200'
            };
            case 'canvas': return {
                bg: 'bg-gradient-to-br from-red-50 to-white',
                iconBg: 'bg-red-600',
                iconColor: 'text-white',
                Icon: SiCanvas,
                border: 'hover:border-red-200'
            };
            case 'zoom': return {
                bg: 'bg-gradient-to-br from-blue-50 to-white',
                iconBg: 'bg-blue-500',
                iconColor: 'text-white',
                Icon: SiZoom,
                border: 'hover:border-blue-200'
            };
            case 'slack': return {
                bg: 'bg-gradient-to-br from-fuchsia-50 to-white',
                iconBg: 'bg-white',
                iconColor: 'text-fuchsia-600',
                Icon: FaSlack,
                border: 'hover:border-fuchsia-200'
            };
            case 'salesforce': return {
                bg: 'bg-gradient-to-br from-sky-50 to-white',
                iconBg: 'bg-sky-500',
                iconColor: 'text-white',
                Icon: FaSalesforce,
                border: 'hover:border-sky-200'
            };
            case 'hubspot': return {
                bg: 'bg-gradient-to-br from-orange-50 to-white',
                iconBg: 'bg-orange-500',
                iconColor: 'text-white',
                Icon: FaHubspot,
                border: 'hover:border-orange-200'
            };
            case 'dropbox': return {
                bg: 'bg-gradient-to-br from-blue-50 to-white',
                iconBg: 'bg-blue-600',
                iconColor: 'text-white',
                Icon: FaDropbox,
                border: 'hover:border-blue-200'
            };
            case 'github': return {
                bg: 'bg-gradient-to-br from-gray-50 to-white',
                iconBg: 'bg-black',
                iconColor: 'text-white',
                Icon: FaGithub,
                border: 'hover:border-gray-300'
            };
            case 'notion': return {
                bg: 'bg-gradient-to-br from-gray-50 to-white',
                iconBg: 'bg-white',
                iconColor: 'text-black',
                Icon: SiNotion,
                border: 'hover:border-gray-200'
            };
            default: return {
                bg: 'bg-white',
                iconBg: 'bg-gray-100',
                iconColor: 'text-gray-600',
                Icon: Settings,
                border: 'hover:border-gray-200'
            };
        }
    };

    const styles = getBrandStyles(provider.id);
    const Icon = styles.Icon;

    return (
        <div className={`relative rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 ${styles.bg} ${styles.border} group hover:shadow-lg`}>
            {/* Status Indicator Dot */}
            <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />

            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${styles.iconBg} ${styles.iconColor} text-2xl`}>
                        <Icon />
                    </div>
                    {isConfigured && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => onDeleteConfig(config!.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Configuration"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.name}</h3>
                <p className="text-sm text-gray-500 mb-6 min-h-[40px] leading-relaxed">{provider.description}</p>

                <div className="space-y-3">
                    {isConnected ? (
                        <div className="flex gap-2">
                            <button
                                className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                                onClick={onViewSync}
                            >
                                <ExternalLink className="w-4 h-4 text-gray-400" /> View Logs
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            disabled={authLoading || (!isConfigured && !!config)} // Disabled if config exists but invalid (inactive)
                            className={`w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm
                                ${isConfigured
                                    ? 'bg-gray-900 hover:bg-black text-white hover:scale-[1.02]'
                                    : !!config
                                        ? 'bg-red-50 border-2 border-dashed border-red-200 text-red-600 opacity-60 cursor-not-allowed' // Invalid/Inactive
                                        : 'bg-white border-2 border-dashed border-gray-300 text-gray-400 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50' // Not configured
                                }
                                ${authLoading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isConfigured ? (
                                <>
                                    {authLoading ? 'Connecting...' : 'Connect App'}
                                    {!authLoading && <ExternalLink className="w-4 h-4 opacity-50" />}
                                </>
                            ) : !!config ? (
                                <>
                                    <XCircle className="w-4 h-4" /> Invalid Config (Check Marketplace)
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" /> Configure First
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Footer */}
            {isConnected && (
                <div className="bg-white/50 px-6 py-3 border-t border-gray-100 text-[11px] font-medium text-gray-400 flex justify-between items-center rounded-b-2xl backdrop-blur-sm">
                    <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-green-500" /> Connected
                    </span>
                    <span className="font-mono opacity-50">ID: {connector?.id}</span>
                </div>
            )}
        </div>
    );
};
