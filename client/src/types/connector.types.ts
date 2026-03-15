export interface Connector {
    id: number;
    name: string;
    integration_type: 'google' | 'microsoft' | 'canvas' | 'zoom' | 'slack' | 'salesforce' | 'hubspot' | 'dropbox' | 'github' | 'notion';
    status: 'active' | 'inactive';
    config: any;
    installed_at: string;
    is_connected?: boolean; // New field from backend serializer
}

export interface SyncJob {
    id: number;
    job_type: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    processed: number;
    total: number;
    message: string;
    created_at: string;
}

export interface ProviderConfig {
    id: string;
    name: string;
    icon: string;
    description: string;
}
