import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Eye, Search, Filter, Layers, Building, Package, Globe, Code, Palette } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface ConfigItem {
  key: string;
  value: string;
  typed_value: any;
  display_value: string;
  value_type: string;
  category: string;
  description: string;
}

interface ConfigResolution {
  [key: string]: {
    value: any;
    source: string;
    category: string;
  };
}

const AdminConfigManagement: React.FC = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [globalConfigs, setGlobalConfigs] = useState<ConfigItem[]>([]);
  const [selectedTenant, setSelectedTenant] = useState('dps-delhi');
  const [tenantConfigs, setTenantConfigs] = useState<ConfigResolution>({});
  const [hierarchyData, setHierarchyData] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState('theme_primary_color');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [debugConfig, setDebugConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
    fetchGlobalConfigs();
    fetchTenantConfigs();
    fetchHierarchy();
  }, [selectedTenant, selectedKey]);

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchTenants(),
      fetchGlobalConfigs(), 
      fetchTenantConfigs(),
      fetchHierarchy()
    ]);
    setLoading(false);
  };

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8001/api/admin/config/tenants/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTenants(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchGlobalConfigs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8001/api/admin/config/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGlobalConfigs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching global configs:', error);
    }
  };

  const fetchTenantConfigs = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/admin/config/resolve/?tenant=${selectedTenant}`);
      
      if (response.ok) {
        const data = await response.json();
        setTenantConfigs(data.data || {});
      }
    } catch (error) {
      console.error('Error fetching tenant configs:', error);
    }
  };

  const fetchHierarchy = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `http://localhost:8001/api/admin/config/hierarchy/?key=${selectedKey}&tenant=${selectedTenant}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setHierarchyData(data.hierarchy || []);
      }
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceColor = (source: string) => {
    if (source.includes('tenant')) return 'bg-red-100 text-red-800';
    if (source.includes('product')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleEditConfig = async (key: string, newValue: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Find the config to check its type
      const config = globalConfigs.find(c => c.key === key);
      let processedValue = newValue;
      
      // Convert value based on type
      if (config?.value_type === 'integer') {
        processedValue = parseInt(newValue).toString();
      } else if (config?.value_type === 'boolean') {
        processedValue = newValue.toLowerCase() === 'true' ? 'true' : 'false';
      }
      
      const response = await fetch(`http://localhost:8001/api/admin/config/${key}/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: processedValue })
      });
      
      if (response.ok) {
        setEditingConfig(null);
        await refreshData();
      } else {
        const errorData = await response.text();
        console.error('Config update failed:', response.status, errorData);
        alert(`Failed to update configuration: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Error updating configuration');
    }
  };

  const handleDebugConfig = async (key: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `http://localhost:8001/api/admin/config/hierarchy/?key=${key}&tenant=${selectedTenant}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setDebugConfig(data);
      }
    } catch (error) {
      console.error('Error fetching debug info:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'tenant': return 'bg-red-500';
      case 'product': return 'bg-blue-500';
      case 'global': return 'bg-gray-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="p-6">Loading configuration management...</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuration Management</h1>
                <p className="text-gray-600">Manage multi-tenant configuration hierarchy</p>
              </div>
            </div>
            <Button onClick={refreshData} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

      <Tabs defaultValue="hierarchy" className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-1">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50">
            <TabsTrigger value="hierarchy" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Configuration Hierarchy
            </TabsTrigger>
            <TabsTrigger value="tenant-view" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Tenant View
            </TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Global Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Hierarchy Debug</CardTitle>
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tenant</label>
                  <select
                    value={selectedTenant}
                    onChange={(e) => setSelectedTenant(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    {tenants.map(tenant => (
                      <option key={tenant.tenant_id} value={tenant.tenant_id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Configuration Key</label>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="theme_primary_color">Theme Primary Color</option>
                    <option value="grading_system">Grading System</option>
                    <option value="school_logo_url">School Logo URL</option>
                    <option value="site_name">Site Name</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hierarchyData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getLevelColor(item.level)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{item.level}</span>
                        <Badge variant="outline">{item.source}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Value: <code className="bg-gray-100 px-2 py-1 rounded">{JSON.stringify(item.value)}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenant-view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Configuration View</CardTitle>
              <div>
                <label className="block text-sm font-medium mb-1">Select Tenant</label>
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  {tenants.map(tenant => (
                    <option key={tenant.tenant_id} value={tenant.tenant_id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(tenantConfigs).map(([key, config]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium">{key}</h4>
                        <p className="text-sm text-gray-600">
                          Value: <code className="bg-gray-100 px-2 py-1 rounded">{JSON.stringify(config.value)}</code>
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={getSourceColor(config.source)}>
                            {config.source}
                          </Badge>
                          <Badge variant="outline">{config.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {globalConfigs.map((config) => (
                  <div key={config.key} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium">{config.key}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                        {editingConfig === config.key ? (
                          <div className="flex gap-2 mt-2">
                            <Input 
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="text-sm"
                            />
                            <Button size="sm" onClick={() => handleEditConfig(config.key, editValue)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingConfig(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm">
                            Value: <code className="bg-gray-100 px-2 py-1 rounded">{config.display_value}</code>
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{config.value_type}</Badge>
                          <Badge variant="outline">{config.category}</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingConfig(config.key);
                        setEditValue(config.display_value);
                      }}>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {debugConfig && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Debug Information for {debugConfig.key}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setDebugConfig(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugConfig, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminConfigManagement;