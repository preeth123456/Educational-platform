import { useState } from 'react';
import { oauthService } from '../services/connectorService';

export const useOAuthFlow = (provider: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initiateOAuth = async () => {
        try {
            setLoading(true);
            setError(null);
            const { auth_url } = await oauthService.initiateOAuth(provider);
            return auth_url;
        } catch (err: any) {
            setError(err.message || 'Failed to initiate OAuth');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleCallback = async (code: string, state: string) => {
        try {
            setLoading(true);
            return await oauthService.handleCallback(provider, code, state);
        } catch (err: any) {
            setError(err.message || 'OAuth failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        initiateOAuth,
        handleCallback,
        loading,
        error
    };
};
