import React, { useEffect, useState } from 'react';
import { useOAuthFlow } from '../hooks/useOAuthFlow';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
    provider: string;
}

const AdminOAuthCallback: React.FC<Props> = ({ provider }) => {
    const { handleCallback } = useOAuthFlow(provider);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const processCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const state = params.get('state');

            if (!code) {
                setStatus('error');
                setErrorMsg('Authorization code not found');
                return;
            }

            try {
                await handleCallback(code, state || '');
                setStatus('success');

                // Notify the opener window
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'OAUTH_SUCCESS',
                        provider: provider
                    }, window.location.origin);
                }

                // Close the popup after a short delay
                setTimeout(() => {
                    window.close();
                }, 2000);

            } catch (err: any) {
                console.error('OAuth Callback Error:', err);
                setStatus('error');
                setErrorMsg(err.message || 'Failed to complete authentication');
            }
        };

        processCallback();
    }, [provider, handleCallback]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
            {status === 'loading' && (
                <>
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                    <h2 className="text-xl font-bold text-gray-900">Finalizing Connection...</h2>
                    <p className="text-gray-500">Please wait while we sync with {title(provider)} Classroom.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Connected!</h2>
                    <p className="text-gray-500">Your school data is now syncing. This window will close shortly.</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Authentication Failed</h2>
                    <p className="text-red-500 mb-6">{errorMsg}</p>
                    <button
                        onClick={() => window.close()}
                        className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold"
                    >
                        Close Window
                    </button>
                </>
            )}
        </div>
    );
};

// Helper to capitalize
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default AdminOAuthCallback;
