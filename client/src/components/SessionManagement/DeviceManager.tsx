import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Smartphone, Monitor, Tablet, Shield, ShieldCheck, Clock } from 'lucide-react';
import SessionManager, { DeviceInfo } from '../../utils/sessionManager';

const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const userDevices = await SessionManager.getUserDevices();
      setDevices(userDevices);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrustDevice = async (deviceId: string) => {
    const success = await SessionManager.trustDevice(deviceId);
    if (success) {
      loadDevices(); // Reload devices
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Registered Devices ({devices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No devices found
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="border rounded-lg p-4 border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.device_type)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {device.device_name}
                          {device.is_trusted ? (
                            <Badge variant="outline" className="text-green-600">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Trusted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600">
                              <Shield className="h-3 w-3 mr-1" />
                              Untrusted
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {device.browser} on {device.os}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last used: {formatDate(device.last_used)}
                          </span>
                          <span>
                            Added: {formatDate(device.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!device.is_trusted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrustDevice(device.device_id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ShieldCheck className="h-4 w-4 mr-1" />
                        Trust Device
                      </Button>
                    )}
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

export default DeviceManager;