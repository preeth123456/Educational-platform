import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import SessionManager from '../utils/sessionManager';
import './SSOCallback.css';

interface SSOData {
    sso_success?: string;
    sso_new?: string;
    user_type?: string;
    user_id?: string;

    name?: string;
    email?: string;
    provider?: string;
    error?: string;
    profile_completed?: string;
}

const SSOCallback: React.FC = () => {
    const [, navigate] = useLocation();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState('');
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [ssoData, setSsoData] = useState<SSOData>({});
    const [selectedRole, setSelectedRole] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        handleSSOCallback();
    }, []);

    const handleSSOCallback = () => {
        const params = new URLSearchParams(window.location.search);
        const data: SSOData = {
            sso_success: params.get('sso_success') || undefined,
            sso_new: params.get('sso_new') || undefined,
            user_type: params.get('user_type') || undefined,
            user_id: params.get('user_id') || undefined,
            name: params.get('name') || undefined,
            email: params.get('email') || undefined,
            provider: params.get('provider') || undefined,
            error: params.get('error') || undefined,
            profile_completed: params.get('profile_completed') || undefined,
        };

        setSsoData(data);

        if (data.error) {
            setError(getErrorMessage(data.error));
            setIsProcessing(false);
            return;
        }

        if (data.sso_success === 'true') {
            // Existing user - save session and redirect
            SessionManager.saveSession({
                id: data.user_id,
                name: data.name,
                email: data.email,
                role: data.user_type === 'educator' ? 'teacher' : 'student',
                profile_completed: data.profile_completed === 'true',
            });

            // Redirect to appropriate dashboard
            const redirectUrl = data.user_type === 'educator' ? '/teacher-dashboard' : '/dashboard';

            setTimeout(() => navigate(redirectUrl), 1000);
        } else if (data.sso_new === 'true') {
            // New user - show role selection
            setShowRoleSelection(true);
            setIsProcessing(false);
        } else {
            setError('Invalid SSO response');
            setIsProcessing(false);
        }
    };

    const getErrorMessage = (error: string): string => {
        const errorMessages: Record<string, string> = {
            'no_code': 'Authorization was cancelled or failed.',
            'token_exchange_failed': 'Failed to complete authentication.',
            'userinfo_failed': 'Failed to retrieve user information.',
            'server_error': 'A server error occurred. Please try again.',
            'access_denied': 'Access was denied.',
        };
        return errorMessages[error] || 'An unexpected error occurred.';
    };

    const handleRoleSelection = async () => {
        if (!selectedRole) return;

        setIsRegistering(true);
        try {
            const response = await fetch('http://localhost:8001/api/auth/social/complete-registration/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: ssoData.provider,
                    email: ssoData.email,
                    name: ssoData.name,
                    user_type: selectedRole,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                SessionManager.saveSession(result.data);
                navigate(result.redirect_url);
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="sso-callback-container">
            <div className="sso-callback-card">
                {isProcessing && !showRoleSelection && (
                    <div className="sso-processing">
                        <div className="sso-spinner"></div>
                        <h2>Completing Sign In...</h2>
                        <p>Please wait while we authenticate you.</p>
                    </div>
                )}

                {error && (
                    <div className="sso-error">
                        <div className="error-icon">❌</div>
                        <h2>Authentication Failed</h2>
                        <p>{error}</p>
                        <button
                            className="sso-back-btn"
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                {showRoleSelection && (
                    <div className="sso-role-selection">
                        <h2>Welcome, {ssoData.name}!</h2>
                        <p>This is your first time signing in with {ssoData.provider}.</p>
                        <p className="email-display">{ssoData.email}</p>

                        <div className="role-question">
                            <h3>Are you a Student or Teacher?</h3>
                            <div className="role-options">
                                <label className={`role-option ${selectedRole === 'student' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={selectedRole === 'student'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <div className="role-content">
                                        <span className="role-icon">🎓</span>
                                        <span className="role-name">Student</span>
                                        <span className="role-desc">I want to learn</span>
                                    </div>
                                </label>
                                <label className={`role-option ${selectedRole === 'educator' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="educator"
                                        checked={selectedRole === 'educator'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <div className="role-content">
                                        <span className="role-icon">👨‍🏫</span>
                                        <span className="role-name">Teacher</span>
                                        <span className="role-desc">I want to teach</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            className="sso-continue-btn"
                            onClick={handleRoleSelection}
                            disabled={!selectedRole || isRegistering}
                        >
                            {isRegistering ? 'Creating Account...' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SSOCallback;
