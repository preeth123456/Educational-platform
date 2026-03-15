import { useState, useEffect, useCallback } from 'react';
import { connectorService } from '../services/connectorService';

export const useConnectorAPI = () => {
    const [connectors, setConnectors] = useState<any[]>([]);
    const [syncJobs, setSyncJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConnectors = useCallback(async () => {
        try {
            setLoading(true);
            const data = await connectorService.getConnectors();
            setConnectors(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch connectors');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSyncJobs = useCallback(async (connectorId?: number | null) => {
        try {
            const data = await connectorService.getSyncJobs(connectorId);
            setSyncJobs(data);
        } catch (err: any) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchConnectors();
        fetchSyncJobs();
    }, [fetchConnectors, fetchSyncJobs]);

    return {
        connectors,
        syncJobs,
        loading,
        error,
        refetch: fetchConnectors,
        fetchSyncJobs
    };
};
