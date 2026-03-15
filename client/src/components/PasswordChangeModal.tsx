import React, { useState } from 'react';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    userType: 'student' | 'teacher';
    onSuccess: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ 
    isOpen, onClose, userId, userType, onSuccess 
}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8001/api/auth/change_password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    user_type: userType,
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Password changed successfully!');
                onSuccess();
                onClose();
            } else {
                setError(result.message || 'Failed to change password');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '8px',
                width: '400px', maxWidth: '90vw'
            }}>
                <h2>Change Password</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Your password has expired. Please change it to continue.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Current Password:</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '8px', marginTop: '5px',
                                border: '1px solid #ddd', borderRadius: '4px'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '8px', marginTop: '5px',
                                border: '1px solid #ddd', borderRadius: '4px'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label>Confirm New Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '8px', marginTop: '5px',
                                border: '1px solid #ddd', borderRadius: '4px'
                            }}
                        />
                    </div>
                    
                    {error && (
                        <div style={{ color: 'red', marginBottom: '15px' }}>
                            {error}
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                padding: '10px 20px', border: '1px solid #ddd',
                                backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '10px 20px', border: 'none',
                                backgroundColor: '#007bff', color: 'white',
                                borderRadius: '4px', cursor: 'pointer'
                            }}
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeModal;