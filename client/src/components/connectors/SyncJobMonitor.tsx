import React from 'react';
import { useConnectorAPI } from '../../hooks/useConnectorAPI';
import { RefreshCw, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export const SyncJobMonitor: React.FC = () => {
    const { syncJobs, connectors, loading, fetchSyncJobs } = useConnectorAPI();

    // User Requirement: "status will be shown as connected ok" on Sync Tab
    const connectedApps = connectors.filter(c => c.is_connected === true);

    if (loading && syncJobs.length === 0) {
        return <div className="p-4 text-center text-gray-500">Loading sync history...</div>;
    }

    if (syncJobs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No sync jobs have been run yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Connected Apps Header */}
            {connectedApps.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-green-800">Connected Integrations (Ready to Sync):</span>
                        <div className="text-xs text-green-700 font-medium animate-pulse">● Auto-Sync Active</div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {connectedApps.map(app => (
                            <div key={app.id} className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-green-200 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-gray-700">{app.name}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-200"></div>
                                <button
                                    onClick={async () => {
                                        if (confirm(`Start full sync for ${app.name}?`)) {
                                            try {
                                                await import('../../services/connectorService').then(m => m.connectorService.triggerSync(app.id));
                                                fetchSyncJobs();
                                                // Ideally show a toast here
                                            } catch (e) {
                                                alert('Failed to start sync');
                                            }
                                        }
                                    }}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" /> Sync Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {syncJobs.filter(job => job.job_type !== 'Test Sync').map((job) => (
                        <li key={job.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {job.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                                    {job.status === 'failed' && <XCircle className="w-6 h-6 text-red-500" />}
                                    {job.status === 'running' && <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />}
                                    {job.status === 'pending' && <Clock className="w-6 h-6 text-gray-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {job.job_type} ({job.source_type} → {job.target_type})
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {new Date(job.created_at).toLocaleString()}
                                    </p>
                                    {/* Progress Bar for running jobs */}
                                    {job.status === 'running' && (
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${job.progress_percentage}%` }}
                                            ></div>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1 font-mono">
                                        {job.status === 'failed' ? (
                                            <span className="text-red-600 font-bold">Error: {job.message}</span>
                                        ) : (
                                            <span>
                                                {job.processed_records !== undefined ? job.processed_records : '-'} / {job.total_records !== undefined ? job.total_records : '-'} records
                                                {job.duration ? ` • ${job.duration}s` : ''}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${job.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            job.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                job.status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {job.status}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
