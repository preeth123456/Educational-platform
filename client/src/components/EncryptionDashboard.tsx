import React, { useEffect, useState } from 'react';
import { Shield, Lock, Key, TrendingUp, AlertCircle } from 'lucide-react';

interface EncryptionStats {
  students: {
    total: number;
    encrypted: number;
    percentage: number;
  };
  educators: {
    total: number;
    encrypted: number;
    percentage: number;
  };
  active_keys: number;
  encryption_algorithm: string;
}

const EncryptionDashboard: React.FC = () => {
  const [stats, setStats] = useState<EncryptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const fetchSecurityStatus = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/security_status/');
      const data = await response.json();
      if (data.success) {
        setStats(data.encryption_status);
      }
    } catch (error) {
      console.error('Failed to fetch security status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEncryptData = async () => {
    if (!confirm('This will encrypt all unencrypted data. Continue?')) return;
    
    setMigrating(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/encrypt_existing_data/', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        alert(`Successfully encrypted:\n- ${data.encrypted.students} students\n- ${data.encrypted.educators} educators`);
        fetchSecurityStatus();
      }
    } catch (error) {
      alert('Failed to encrypt data: ' + error);
    } finally {
      setMigrating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Data Encryption Status
        </h2>
        <button
          onClick={handleEncryptData}
          disabled={migrating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          {migrating ? 'Encrypting...' : 'Encrypt All Data'}
        </button>
      </div>

      {/* Algorithm Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
        <Key className="w-5 h-5 text-blue-600" />
        <div>
          <p className="font-medium text-blue-900">Encryption Algorithm</p>
          <p className="text-sm text-blue-700">{stats?.encryption_algorithm}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Students Card */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Students</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Students:</span>
              <span className="font-medium">{stats?.students.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Encrypted:</span>
              <span className="font-medium text-green-600">{stats?.students.encrypted}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Encryption Coverage</span>
                <span className="font-bold text-green-600">{stats?.students.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats?.students.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Educators Card */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Educators</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Educators:</span>
              <span className="font-medium">{stats?.educators.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Encrypted:</span>
              <span className="font-medium text-blue-600">{stats?.educators.encrypted}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Encryption Coverage</span>
                <span className="font-bold text-blue-600">{stats?.educators.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats?.educators.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Keys */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-purple-600" />
          <div>
            <p className="font-medium">Active Encryption Keys</p>
            <p className="text-2xl font-bold text-purple-600">{stats?.active_keys}</p>
          </div>
        </div>
      </div>

      {/* Warning if not fully encrypted */}
      {stats && (stats.students.percentage < 100 || stats.educators.percentage < 100) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-900">Action Required</p>
            <p className="text-sm text-yellow-700">
              Some user data is not encrypted. Click "Encrypt All Data" to secure all sensitive information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptionDashboard;
