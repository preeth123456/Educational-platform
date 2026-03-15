// INCIDENT DETECTION FILE - Security status indicator component
import React, { useEffect, useState } from 'react';
import { Shield, ShieldCheck, Lock } from 'lucide-react';

interface SecurityIndicatorProps {
  userId?: number;
  userType?: 'student' | 'teacher';
  showDetails?: boolean;
}

const SecurityIndicator: React.FC<SecurityIndicatorProps> = ({ 
  userId, 
  userType = 'student',
  showDetails = false 
}) => {
  const [encrypted, setEncrypted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchSecurityStatus();
    }
  }, [userId]);

  const fetchSecurityStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/auth/user_security_status/?user_id=${userId}&user_type=${userType}`
      );
      const data = await response.json();
      if (data.success) {
        setEncrypted(data.encrypted);
      }
    } catch (error) {
      console.error('Failed to fetch security status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Shield className="w-4 h-4 animate-pulse" />
        <span>Checking security...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {encrypted ? (
        <>
          <ShieldCheck className="w-4 h-4 text-green-500" />
          {showDetails && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-green-600">Protected</span>
              <span className="text-xs text-gray-500">AES-256 Encrypted</span>
            </div>
          )}
        </>
      ) : (
        <>
          <Shield className="w-4 h-4 text-yellow-500" />
          {showDetails && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-yellow-600">Standard</span>
              <span className="text-xs text-gray-500">Not encrypted</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const SecurityBadge: React.FC<{ encrypted: boolean }> = ({ encrypted }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      encrypted 
        ? 'bg-green-100 text-green-700' 
        : 'bg-gray-100 text-gray-600'
    }`}>
      <Lock className="w-3 h-3" />
      {encrypted ? 'Encrypted' : 'Standard'}
    </div>
  );
};

export default SecurityIndicator;
