import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Shield, X, Search, Filter } from 'lucide-react';

interface AdminSessionInfo {
  id: string;
  user_id: number;
  user_type: string;
  device_name: string;
  ip_address: string;
  last_activity: string;
  created_at: string;
}

interface SessionPolicies {
  max_concurrent_sessions: number;
  session_timeout_minutes: number;
  max_devices_per_user: number;
  require_device_approval: boolean;
  auto_logout_inactive: boolean;
}

const AdminSessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<AdminSessionInfo[]>([]);
  const [policies, setPolicies] = useState<SessionPolicies | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([loadSessions(), loadPolicies()]);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/session/admin/sessions/all/');
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadPolicies = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/session/policies/');
      const data = await response.json();
      setPolicies(data.policy);
    } catch (error) {
      console.error('Failed to load policies:', error);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      try {
        const response = await fetch('http://localhost:8001/api/session/admin/sessions/revoke/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId })
        });
        
        if (response.ok) {
          loadSessions(); // Reload sessions
        }
      } catch (error) {
        console.error('Failed to revoke session:', error);
      }
    }
  };

  const handleUpdatePolicies = async (updatedPolicies: Partial<SessionPolicies>) => {
    try {
      const response = await fetch('http://localhost:8001/api/session/policies/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPolicies)
      });
      
      if (response.ok) {
        loadPolicies(); // Reload policies
      }
    } catch (error) {
      console.error('Failed to update policies:', error);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.user_id.toString().includes(searchTerm) ||
                         session.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.ip_address.includes(searchTerm);
    
    const matchesFilter = filterType === 'all' || session.user_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading admin data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Policies */}
      {policies && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Session Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Max Concurrent Sessions</label>
                <Input
                  type="number"
                  value={policies.max_concurrent_sessions}
                  onChange={(e) => handleUpdatePolicies({ max_concurrent_sessions: parseInt(e.target.value) })}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={policies.session_timeout_minutes}
                  onChange={(e) => handleUpdatePolicies({ session_timeout_minutes: parseInt(e.target.value) })}
                  min="30"
                  max="10080"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Devices per User</label>
                <Input
                  type="number"
                  value={policies.max_devices_per_user}
                  onChange={(e) => handleUpdatePolicies({ max_devices_per_user: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Sessions ({filteredSessions.length})
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by user ID, device, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No active sessions found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          User ID: {session.user_id}
                          <Badge className={getUserTypeColor(session.user_type)}>
                            {session.user_type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {session.device_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                          <span>IP: {session.ip_address}</span>
                          <span>Last active: {formatDate(session.last_activity)}</span>
                          <span>Started: {formatDate(session.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSessionManager;