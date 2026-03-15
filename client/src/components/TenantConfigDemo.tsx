import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import usePlatformConfig from '@/hooks/usePlatformConfig';

const TenantConfigDemo: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const { config, loading } = usePlatformConfig(selectedTenant);

  const tenants = [
    { id: '', name: 'Default (No Tenant)', color: '#007bff' },
    { id: 'dps-delhi', name: 'DPS Delhi', color: '#dc3545' },
    { id: 'st-marys', name: "St. Mary's Convent", color: '#17a2b8' },
    { id: 'kendriya-001', name: 'Kendriya Vidyalaya', color: '#28a745' }
  ];

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenant(tenantId);
    // Force page reload to apply new configuration
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (loading) {
    return <div className="p-6">Loading tenant configuration...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Tenant Configuration Demo</CardTitle>
          <p className="text-sm text-gray-600">
            Switch between different tenants to see how the platform adapts to each organization's branding and settings.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Tenant:</label>
            <div className="grid grid-cols-2 gap-2">
              {tenants.map((tenant) => (
                <Button
                  key={tenant.id}
                  variant={selectedTenant === tenant.id ? "default" : "outline"}
                  onClick={() => handleTenantChange(tenant.id)}
                  className="justify-start"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: tenant.color }}
                  ></div>
                  {tenant.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Current Configuration:</h4>
            <div className="space-y-2">
              {Object.entries(config).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{key}:</span>
                  <Badge variant="outline">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Live Preview:</h4>
            <div 
              className="p-4 rounded-lg text-white text-center"
              style={{ 
                backgroundColor: config.theme_primary_color || '#007bff',
                transition: 'background-color 0.3s ease'
              }}
            >
              <h3 className="text-lg font-bold">
                {config.site_name || 'Eduyata'} - {selectedTenant ? tenants.find(t => t.id === selectedTenant)?.name : 'Default'}
              </h3>
              <p className="text-sm opacity-90">
                Theme Color: {config.theme_primary_color || '#007bff'}
              </p>
              {config.grading_system && (
                <p className="text-sm opacity-90 mt-2">
                  Grading: {Array.isArray(config.grading_system) ? config.grading_system.join(', ') : config.grading_system}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantConfigDemo;