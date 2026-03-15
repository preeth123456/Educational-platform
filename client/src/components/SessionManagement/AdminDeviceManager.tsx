import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Monitor, Smartphone, Tablet, Shield, Trash2, CheckCircle } from 'lucide-react';

interface Device {
  id: number;
  user_id: number;
  user_type: string;
  device_id: string;
  device_name: string;
  device_type: string;
  browser: string;
  os: string;
  is_trusted: boolean;
  last_used: string;
  created_at: string;
}

const AdminDeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDevices();
  }, []);

  const fetchAllDevices = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/session/admin/devices/all/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading devices...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          All Registered Devices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No devices found.</p>
          ) : (
            devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.device_type)}
                    <div>
                      <div className="font-medium">{device.device_name}</div>
                      <div className="text-sm text-gray-500">
                        {device.browser} • {device.os}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className={getUserTypeColor(device.user_type)}>
                      {device.user_type}
                    </Badge>
                    <Badge variant="outline">
                      User ID: {device.user_id}
                    </Badge>
                    {device.is_trusted && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Trusted
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div>Last used: {new Date(device.last_used).toLocaleDateString()}</div>
                  <div>Registered: {new Date(device.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDeviceManager;