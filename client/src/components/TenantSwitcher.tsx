import React, { useState, useEffect } from 'react';

const TenantSwitcher = () => {
  const [currentTenant, setCurrentTenant] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tenant = urlParams.get('tenant') || 'default';
    setCurrentTenant(tenant);
  }, []);

  const switchTenant = (tenantId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tenant', tenantId);
    window.location.href = url.toString();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded p-3 shadow-lg">
      <div className="text-sm font-medium mb-2">Current: {currentTenant}</div>
      <div className="space-y-1">
        <button onClick={() => switchTenant('x-org')} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
          X Organization
        </button>
        <button onClick={() => switchTenant('dps-delhi')} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
          DPS Delhi
        </button>
        <button onClick={() => switchTenant('default')} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
          Default
        </button>
      </div>
    </div>
  );
};

export default TenantSwitcher;