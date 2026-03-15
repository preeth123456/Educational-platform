
import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Base URL for admin API
// Assuming backend is on localhost:8000 and proxy is set up, or direct URL
const API_URL = 'http://localhost:8001';

// Create axios instance with auth header
const adminAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to requests
// Interceptor to add token to requests
adminAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // First try to get token directly from local storage (primary method for admin)
        // Check both 'admin_token' and generic 'token' keys to be safe
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token');

        if (adminToken) {
            config.headers.set('Authorization', `Bearer ${adminToken}`);
        } else {
            // Fallback: try to find it in session object (legacy method)
            const sessionStr = localStorage.getItem('user_session');
            if (sessionStr) {
                try {
                    const session = JSON.parse(sessionStr);
                    // If session has a token property?
                    if (session.token) {
                        config.headers.set('Authorization', `Bearer ${session.token}`);
                    }
                } catch (e) {
                    // Ignore JSON errors
                }
            }
        }
        return config;
    },
    (error: AxiosError) => {
        // Handle token expiration or unauthorized access
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn('Admin token expired or invalid. Redirecting to login...');
            // Clear all auth-related items
            localStorage.removeItem('admin_token');
            localStorage.removeItem('token');
            localStorage.removeItem('user_session');

            // Only redirect if not already on the login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const adminService = {
    // ==========================================
    // Feature 1 & 2: API Keys Management
    // ==========================================
    apiKeys: {
        getAll: () => adminAxios.get('/admin/api/api-keys/'),
        getSummary: () => adminAxios.get('/admin/api/api-keys/summary/'),
        getById: (id: number) => adminAxios.get(`/admin/api/api-keys/${id}/`),
        create: (data: any) => adminAxios.post('/admin/api/api-keys/', data),
        update: (id: number, data: any) => adminAxios.patch(`/admin/api/api-keys/${id}/`, data),
        delete: (id: number) => adminAxios.delete(`/admin/api/api-keys/${id}/`),
        regenerate: (id: number) => adminAxios.post(`/admin/api/api-keys/${id}/regenerate/`),
        activate: (id: number) => adminAxios.post(`/admin/api/api-keys/${id}/activate/`),
        deactivate: (id: number) => adminAxios.post(`/admin/api/api-keys/${id}/deactivate/`),
        getStats: (id: number) => adminAxios.get(`/admin/api/api-keys/${id}/usage_stats/`),
        // FEATURE 13: Usage Monitor
        monitorUsage: () => adminAxios.get('/admin/api/monitoring/usage/'),
        // FEATURE 9: Secure Delivery
        sendBundle: (email: string, keyId: number) => adminAxios.post('/api/v1/devtools/delivery/send/', { email, key_id: keyId }),
        downloadBundle: (sdkType: string = 'python') => adminAxios.get(`/api/v1/devtools/delivery/download/?sdk_type=${sdkType}`, { responseType: 'blob' }),
    },

    // ==========================================
    // Feature 3: Webhook Management
    // ==========================================
    webhooks: {
        getAll: () => adminAxios.get('/api/v1/webhooks/endpoints/'),
        getSummary: () => adminAxios.get('/api/v1/webhooks/endpoints/summary/'),
        getById: (id: number) => adminAxios.get(`/api/v1/webhooks/endpoints/${id}/`),
        create: (data: any) => adminAxios.post('/api/v1/webhooks/endpoints/', data),
        update: (id: number, data: any) => adminAxios.patch(`/api/v1/webhooks/endpoints/${id}/`, data),
        delete: (id: number) => adminAxios.delete(`/api/v1/webhooks/endpoints/${id}/`),
        test: (id: number) => adminAxios.post(`/api/v1/webhooks/endpoints/${id}/test/`),
        getDeliveries: (id: number, params?: any) => adminAxios.get(`/api/v1/webhooks/endpoints/${id}/delivery-logs/`, { params }),
        getAllDeliveries: (params?: any) => adminAxios.get('/api/v1/webhooks/deliveries/', { params }),
        getDeliveryById: (id: number) => adminAxios.get(`/api/v1/webhooks/deliveries/${id}/`),
        // FEATURE 13: Webhook Monitor
        monitorStats: () => adminAxios.get('/api/v1/webhooks/monitoring/stats/'),
    },

    // ==========================================
    // Feature 4: Integration Marketplace
    // ==========================================
    integrations: {
        getAvailable: () => adminAxios.get('/api/v1/integrations/available/'),
        getInstalled: () => adminAxios.get('/api/v1/integrations/'),
        getById: (id: number) => adminAxios.get(`/api/v1/integrations/${id}/`),
        install: (data: any) => adminAxios.post('/api/v1/integrations/', data),
        uninstall: (id: number) => adminAxios.delete(`/api/v1/integrations/${id}/`),
        test: (id: number) => adminAxios.post(`/api/v1/integrations/${id}/test/`),
        updateSecrets: (id: number, secrets: any) => adminAxios.put(`/api/v1/integrations/${id}/secrets/`, { secrets }),
        getAuditLogs: (id: number) => id === 0 ? adminAxios.get('/api/v1/integrations/vault/audit/') : adminAxios.get(`/api/v1/integrations/${id}/audit/`),
        getVaultHealth: () => adminAxios.get('/api/v1/integrations/vault/health/'),
        rotateVaultKeys: () => adminAxios.post('/api/v1/integrations/vault/rotate-keys/'),
        // FEATURE 13: Integration Health
        monitorHealth: () => adminAxios.get('/api/v1/integrations/monitoring/health/'),
    },

    // ==========================================
    // Feature 10: Vault (Uses existing Audit Logs)
    // ==========================================
    audit: {
        getLogs: (params?: any) => adminAxios.get('/api/admin/audit/logs/', { params }),
    }
};
