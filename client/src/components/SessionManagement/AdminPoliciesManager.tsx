import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Settings, Save, RefreshCw } from 'lucide-react';

interface SessionPolicy {
  max_concurrent_sessions: number;
  session_timeout_minutes: number;
  max_devices_per_user: number;
  require_device_approval: boolean;
  auto_logout_inactive: boolean;
}

const AdminPoliciesManager: React.FC = () => {
  const [policies, setPolicies] = useState<SessionPolicy>({
    max_concurrent_sessions: 3,
    session_timeout_minutes: 1440,
    max_devices_per_user: 5,
    require_device_approval: false,
    auto_logout_inactive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/session/policies/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policy);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePolicies = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8001/api/session/policies/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        },
        body: JSON.stringify(policies)
      });
      
      if (response.ok) {
        alert('Policies updated successfully!');
      } else {
        alert('Failed to update policies');
      }
    } catch (error) {
      console.error('Error updating policies:', error);
      alert('Error updating policies');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SessionPolicy, value: number | boolean) => {
    setPolicies(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading policies...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Session Policies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="max_sessions">Maximum Concurrent Sessions</Label>
              <Input
                id="max_sessions"
                type="number"
                min="1"
                max="10"
                value={policies.max_concurrent_sessions}
                onChange={(e) => handleInputChange('max_concurrent_sessions', parseInt(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum number of active sessions per user
              </p>
            </div>

            <div>
              <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
              <Input
                id="session_timeout"
                type="number"
                min="30"
                max="10080"
                value={policies.session_timeout_minutes}
                onChange={(e) => handleInputChange('session_timeout_minutes', parseInt(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Session expires after this many minutes of inactivity
              </p>
            </div>

            <div>
              <Label htmlFor="max_devices">Maximum Devices per User</Label>
              <Input
                id="max_devices"
                type="number"
                min="1"
                max="20"
                value={policies.max_devices_per_user}
                onChange={(e) => handleInputChange('max_devices_per_user', parseInt(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum number of devices a user can register
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require_approval">Require Device Approval</Label>
                <p className="text-sm text-gray-500">
                  New devices must be approved before access
                </p>
              </div>
              <Switch
                id="require_approval"
                checked={policies.require_device_approval}
                onCheckedChange={(checked) => handleInputChange('require_device_approval', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_logout">Auto Logout Inactive Sessions</Label>
                <p className="text-sm text-gray-500">
                  Automatically logout inactive sessions
                </p>
              </div>
              <Switch
                id="auto_logout"
                checked={policies.auto_logout_inactive}
                onCheckedChange={(checked) => handleInputChange('auto_logout_inactive', checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={updatePolicies} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Policies
              </>
            )}
          </Button>
          <Button variant="outline" onClick={fetchPolicies}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPoliciesManager;