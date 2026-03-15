import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Smartphone, Monitor, Tablet, Shield, X, Clock, MapPin } from 'lucide-react';
import SessionManager, { SessionInfo } from '../../utils/sessionManager';

const SessionDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const activeSessions = await SessionManager.getActiveSessions();
      setSessions(activeSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      const success = await SessionManager.revokeSession(sessionId);
      if (success) {
        loadSessions(); // Reload sessions
      }
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
          <div className="text-center">Loading sessions...</div>
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
            Active Sessions ({sessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No active sessions found
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`border rounded-lg p-4 ${
                    session.is_current ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(session.device_type)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {session.device_name}
                          {session.is_current && (
                            <Badge variant="secondary">Current Session</Badge>
                          )}
                          {session.is_trusted && (
                            <Badge variant="outline" className="text-green-600">
                              <Shield className="h-3 w-3 mr-1" />
                              Trusted
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {session.browser} on {session.os}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.ip_address}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last active: {formatDate(session.last_activity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Revoke
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

export default SessionDashboard;