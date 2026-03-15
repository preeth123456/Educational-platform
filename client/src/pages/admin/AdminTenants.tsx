import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Settings, Building, CheckCircle, XCircle, Mail, Globe, Calendar, Crown, Star, Shield } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Tenant {
  tenant_id: string;
  name: string;
  domain: string;
  contact_email: string;
  subscription_type: string;
  is_active: boolean;
  created_at: string;
}

const AdminTenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [editingTenant, setEditingTenant] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    domain: '',
    contact_email: '',
    subscription_type: 'basic',
    is_active: true
  });
  const [configuringTenant, setConfiguringTenant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tenant_id: '',
    name: '',
    domain: '',
    contact_email: '',
    subscription_type: 'basic'
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
      console.log('Fetching tenants with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:8001/api/admin/config/tenants/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Tenants API response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Tenants data:', data);
        setTenants(data.data || []);
      } else {
        console.error('Failed to fetch tenants:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8001/api/admin/config/tenants/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ tenant_id: '', name: '', domain: '', contact_email: '', subscription_type: 'basic' });
        fetchTenants();
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
    }
  };

  const [configData, setConfigData] = useState({
    school_logo_url: '',
    theme_primary_color: '#1e40af',
    theme_secondary_color: '#6B7280',
    site_name: '',
    max_students_per_class: '40',
    grading_system: 'percentage'
  });

  const loadTenantConfig = async (tenantId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admin/config/resolve/?tenant=${tenantId}`);
      const data = await response.json();
      if (data.success && data.data) {
        // Extract the latest values from resolved config
        const configs = data.data;
        setConfigData({
          school_logo_url: configs.school_logo_url?.value || '',
          theme_primary_color: configs.theme_primary_color?.value || '#1e40af',
          theme_secondary_color: configs.theme_secondary_color?.value || '#6B7280',
          site_name: configs.site_name?.value || '',
          max_students_per_class: configs.max_students_per_class?.value || '40',
          grading_system: configs.grading_system?.value || 'percentage'
        });
      } else {
        // If no configs found, keep default values
        setConfigData({
          school_logo_url: '',
          theme_primary_color: '#1e40af',
          site_name: ''
        });
      }
    } catch (error) {
      console.error('Error loading tenant config:', error);
    }
  };

  const loadTenantForEdit = async (tenantId: string) => {
    const tenant = tenants.find(t => t.tenant_id === tenantId);
    if (tenant) {
      setEditData({
        name: tenant.name,
        domain: tenant.domain,
        contact_email: tenant.contact_email,
        subscription_type: tenant.subscription_type,
        is_active: tenant.is_active
      });
    }
  };

  const updateTenant = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8001/api/admin/config/tenants/${editingTenant}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      
      if (response.ok) {
        setEditingTenant(null);
        fetchTenants();
        alert('Tenant updated successfully!');
      } else {
        alert('Error updating tenant');
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('Error updating tenant');
    }
  };

  const saveConfiguration = async () => {
    try {
      const configs = [
        { key: 'school_logo_url', value: configData.school_logo_url },
        { key: 'theme_primary_color', value: configData.theme_primary_color },
        { key: 'theme_secondary_color', value: configData.theme_secondary_color },
        { key: 'site_name', value: configData.site_name },
        { key: 'max_students_per_class', value: configData.max_students_per_class },
        { key: 'grading_system', value: configData.grading_system }
      ].filter(config => config.value);
      
      const response = await fetch('http://localhost:8001/api/admin/config/tenants/save-configs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: configuringTenant,
          configs: configs
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setConfiguringTenant(null);
        alert(`Configuration saved successfully! ${result.message}`);
      } else {
        alert(`Error: ${result.message}`);
      }
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration');
    }
  };
  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'premium': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: Crown };
      case 'standard': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Star };
      case 'basic': return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: Shield };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: Shield };
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading tenants...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
                <p className="text-gray-600">Manage schools and organizations</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Tenant</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tenant ID</label>
                  <Input
                    value={formData.tenant_id}
                    onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
                    placeholder="e.g., dps-delhi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Domain</label>
                  <Input
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    placeholder="e.g., dps.eduyata.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">School Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Delhi Public School"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    placeholder="admin@school.edu"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subscription Type</label>
                  <select
                    value={formData.subscription_type}
                    onChange={(e) => setFormData({...formData, subscription_type: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Tenant</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {configuringTenant && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Configure Tenant: {configuringTenant}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setConfiguringTenant(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">School Logo URL</label>
                <Input 
                  placeholder="/logos/school-logo.png" 
                  value={configData.school_logo_url}
                  onChange={(e) => setConfigData({...configData, school_logo_url: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme Primary Color</label>
                  <Input 
                    placeholder="#1e40af" 
                    value={configData.theme_primary_color}
                    onChange={(e) => setConfigData({...configData, theme_primary_color: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Theme Secondary Color</label>
                  <Input 
                    placeholder="#6B7280" 
                    value={configData.theme_secondary_color}
                    onChange={(e) => setConfigData({...configData, theme_secondary_color: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Name</label>
                <Input 
                  placeholder="School Portal" 
                  value={configData.site_name}
                  onChange={(e) => setConfigData({...configData, site_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Students Per Class</label>
                  <Input 
                    type="number"
                    placeholder="40" 
                    value={configData.max_students_per_class}
                    onChange={(e) => setConfigData({...configData, max_students_per_class: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Grading System</label>
                  <select
                    value={configData.grading_system}
                    onChange={(e) => setConfigData({...configData, grading_system: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="cgpa">CGPA</option>
                    <option value="letter">Letter Grade</option>
                  </select>
                </div>
              </div>
              <Button onClick={saveConfiguration}>Save Configuration</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingTenant && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Tenant: {editingTenant}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setEditingTenant(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tenant Name</label>
                <Input 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  placeholder="Organization Name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Domain</label>
                <Input 
                  value={editData.domain}
                  onChange={(e) => setEditData({...editData, domain: e.target.value})}
                  placeholder="org.eduyata.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <Input 
                  type="email"
                  value={editData.contact_email}
                  onChange={(e) => setEditData({...editData, contact_email: e.target.value})}
                  placeholder="admin@org.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subscription Type</label>
                  <select
                    value={editData.subscription_type}
                    onChange={(e) => setEditData({...editData, subscription_type: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={editData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setEditData({...editData, is_active: e.target.value === 'active'})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <Button onClick={updateTenant}>Update Tenant</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {tenants.map((tenant) => {
          const subStyle = getSubscriptionColor(tenant.subscription_type);
          const SubIcon = subStyle.icon;
          return (
            <Card key={tenant.tenant_id} className="shadow-md hover:shadow-lg transition-shadow border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">{tenant.name}</h3>
                        <Badge 
                          variant={tenant.is_active ? "default" : "secondary"}
                          className={tenant.is_active ? "bg-green-100 text-green-800 border-green-200" : ""}
                        >
                          {tenant.is_active ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                          )}
                        </Badge>
                        <Badge className={`${subStyle.bg} ${subStyle.text} ${subStyle.border} border`}>
                          <SubIcon className="w-3 h-3 mr-1" />
                          {tenant.subscription_type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="font-medium">ID:</span> 
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{tenant.tenant_id}</code>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span className="font-medium">Domain:</span> 
                          <span className="text-blue-600">{tenant.domain}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">Contact:</span> 
                          <span>{tenant.contact_email}</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(tenant.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50" onClick={() => {
                      setConfiguringTenant(tenant.tenant_id);
                      loadTenantConfig(tenant.tenant_id);
                    }}>
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-200 hover:bg-gray-50" onClick={() => {
                      setEditingTenant(tenant.tenant_id);
                      loadTenantForEdit(tenant.tenant_id);
                    }}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tenants.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No tenants found. Create your first tenant to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminTenants;