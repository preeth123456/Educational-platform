import React, { useState, useEffect } from 'react';

const CurrentTenantDisplay = () => {
  const [currentTenant, setCurrentTenant] = useState('');

  useEffect(() => {
    // Method 1: From URL subdomain
    const hostname = window.location.hostname;
    if (hostname.includes('.')) {
      const subdomain = hostname.split('.')[0];
      setCurrentTenant(subdomain);
    } else {
      setCurrentTenant('localhost/default');
    }

    // Method 2: From API call (if tenant is stored in session)
    // fetchCurrentTenant();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-blue-100 px-3 py-1 rounded text-sm">
      Current Tenant: <strong>{currentTenant}</strong>
    </div>
  );
};

export default CurrentTenantDisplay;