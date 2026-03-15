import React, { useState, useEffect } from 'react';
import { FaLock, FaUnlock, FaSearch, FaFilter, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';

interface AccountLockout {
  id: number;
  user_id: number;
  user_type: 'student' | 'teacher' | 'admin';
  username: string;
  failed_attempts: number;
  is_locked: boolean;
  lockout_until: string | null;
  last_failed_ip: string | null;
  last_failed_at: string | null;
  created_at: string;
  updated_at: string;
}

const AccountLockouts: React.FC = () => {
  const [lockouts, setLockouts] = useState<AccountLockout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [filterUserType, setFilterUserType] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');

  useEffect(() => {
    fetchAccountLockouts();
  }, []);

  const fetchAccountLockouts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8001/api/auth/lockouts/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLockouts(data.lockouts || []);
      } else {
        console.error('Failed to fetch account lockouts');
      }
    } catch (error) {
      console.error('Error fetching account lockouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAccount = async (userId: number, userType: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8001/api/auth/lockouts/unlock/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_type: userType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh the list
          fetchAccountLockouts();
          alert('Account unlocked successfully');
        } else {
          alert(data.message || 'Failed to unlock account');
        }
      } else {
        alert('Failed to unlock account');
      }
    } catch (error) {
      console.error('Error unlocking account:', error);
      alert('Error unlocking account');
    }
  };

  const filteredLockouts = lockouts.filter(lockout => {
    const matchesSearch = lockout.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'locked' && lockout.is_locked) ||
      (filterStatus === 'unlocked' && !lockout.is_locked);
    const matchesUserType = filterUserType === 'all' || lockout.user_type === filterUserType;
    
    return matchesSearch && matchesStatus && matchesUserType;
  });

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getRemainingTime = (lockoutUntil: string | null) => {
    if (!lockoutUntil) return 'N/A';
    
    const now = new Date();
    const until = new Date(lockoutUntil);
    const diff = until.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <FaShieldAlt className="text-red-500" />;
      case 'teacher':
        return <FaShieldAlt className="text-blue-500" />;
      case 'student':
        return <FaShieldAlt className="text-green-500" />;
      default:
        return <FaShieldAlt className="text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Lockouts</h1>
          <p className="text-gray-600">Monitor and manage account lockouts for brute force protection</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="locked">Locked</option>
                <option value="unlocked">Unlocked</option>
              </select>
            </div>
            
            <div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filterUserType}
                onChange={(e) => setFilterUserType(e.target.value as any)}
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <FaLock className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Currently Locked</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lockouts.filter(l => l.is_locked).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaExclamationTriangle className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lockouts.filter(l => l.failed_attempts >= 3).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaShieldAlt className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{lockouts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaUnlock className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lockouts.filter(l => !l.is_locked).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Lockouts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Account Lockout Records</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading account lockouts...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Failed Attempts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lockout Until
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Failed IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Failed Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLockouts.map((lockout) => (
                    <tr key={lockout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getUserTypeIcon(lockout.user_type)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {lockout.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lockout.user_type} (ID: {lockout.user_id})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lockout.failed_attempts >= 5 ? 'bg-red-100 text-red-800' :
                          lockout.failed_attempts >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {lockout.failed_attempts}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lockout.is_locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {lockout.is_locked ? (
                            <>
                              <FaLock className="mr-1" />
                              Locked
                            </>
                          ) : (
                            <>
                              <FaUnlock className="mr-1" />
                              Active
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lockout.is_locked ? (
                          <div>
                            <div>{formatDateTime(lockout.lockout_until)}</div>
                            <div className="text-xs text-gray-500">
                              ({getRemainingTime(lockout.lockout_until)})
                            </div>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lockout.last_failed_ip || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(lockout.last_failed_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {lockout.is_locked && (
                          <button
                            onClick={() => unlockAccount(lockout.user_id, lockout.user_type)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaUnlock className="mr-1" />
                            Unlock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredLockouts.length === 0 && (
                <div className="p-8 text-center">
                  <FaShieldAlt className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No account lockouts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterUserType !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'All accounts are currently active with no lockouts.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AccountLockouts;