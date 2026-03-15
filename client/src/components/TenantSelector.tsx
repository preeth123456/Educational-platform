import React, { useState, useEffect } from 'react';

const TenantSelector = () => {
  const [selectedTenant, setSelectedTenant] = useState('');
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    // Get current tenant from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const tenantFromUrl = urlParams.get('tenant');
    const tenantFromStorage = localStorage.getItem('currentTenant');
    
    if (tenantFromUrl) {
      setSelectedTenant(tenantFromUrl);
      localStorage.setItem('currentTenant', tenantFromUrl);
    } else if (tenantFromStorage) {
      setSelectedTenant(tenantFromStorage);
    }

    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/config/tenants/');
      const data = await response.json();
      setTenants(data.data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleTenantChange = (tenantId) => {
    setSelectedTenant(tenantId);
    localStorage.setItem('currentTenant', tenantId);
    
    // Update URL without refresh
    const url = new URL(window.location);
    url.searchParams.set('tenant', tenantId);
    window.history.pushState({}, '', url);
    
    // Reload page to apply new tenant configs
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 bg-white border rounded-lg p-3 shadow-lg z-50">
      <div className="text-sm font-medium mb-2">Current Tenant:</div>
      <select 
        value={selectedTenant} 
        onChange={(e) => handleTenantChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="">Select Tenant</option>
        {tenants.map(tenant => (
          <option key={tenant.tenant_id} value={tenant.tenant_id}>
            {tenant.name}
          </option>
        ))}
      </select>
      {selectedTenant && (
        <div className="text-xs text-gray-600 mt-1">
          Active: {selectedTenant}
        </div>
      )}
    </div>
  );
};

export default TenantSelector;