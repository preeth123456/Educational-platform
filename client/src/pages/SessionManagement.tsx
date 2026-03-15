import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Shield, Users, Settings } from 'lucide-react';
import SessionManager from '../utils/sessionManager';
import SessionDashboard from '../components/SessionManagement/SessionDashboard';
import DeviceManager from '../components/SessionManagement/DeviceManager';
import AdminSessionManager from '../components/SessionManagement/AdminSessionManager';
import AdminDeviceManager from '../components/SessionManagement/AdminDeviceManager';
import AdminPoliciesManager from '../components/SessionManagement/AdminPoliciesManager';

import AdminLayout from '../components/AdminLayout';

const SessionManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  const session = SessionManager.getSession();
  const isAdmin = SessionManager.isAdmin();

  if (!session) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '100px' }}>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-gray-600">Please log in to access session management.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6" style={{ paddingTop: '100px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              Session & Device Management
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin 
                ? 'Monitor and manage all user sessions and devices across the platform'
                : 'Manage your active sessions and trusted devices for enhanced security'
              }
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {isAdmin ? 'All Sessions' : 'My Sessions'}
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {isAdmin ? 'All Devices' : 'My Devices'}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {isAdmin ? 'Policies' : 'Settings'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-6">
              {isAdmin ? (
                <AdminSessionManager />
              ) : (
                <SessionDashboard />
              )}
            </TabsContent>

            <TabsContent value="devices" className="space-y-6">
              {isAdmin ? (
                <AdminDeviceManager />
              ) : (
                <DeviceManager />
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {isAdmin ? (
                <AdminPoliciesManager />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Security settings and preferences coming soon...
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SessionManagementPage;