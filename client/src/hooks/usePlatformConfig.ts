import { useState, useEffect } from 'react';

export const usePlatformConfig = () => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
    
    // Listen for URL changes to refetch config
    const handleUrlChange = () => fetchConfig();
    window.addEventListener('popstate', handleUrlChange);
    
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const fetchConfig = async () => {
    try {
      // Get tenant from URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const tenant = urlParams.get('tenant');
      
      let url = 'http://localhost:8001/api/admin/config/public/';
      if (tenant) {
        url = `http://localhost:8001/api/admin/config/resolve/?tenant=${tenant}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        let configObj = {};
        if (tenant) {
          // For tenant-specific configs - extract values from nested objects
          Object.keys(data.data).forEach(key => {
            configObj[key] = data.data[key].value;
          });
        } else {
          // For public configs
          data.data.forEach(item => {
            configObj[item.key] = item.typed_value;
          });
        }
        
        setConfig(configObj);
        console.log('Config loaded:', configObj);
        applyConfigToCSS(configObj);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyConfigToCSS = (configObj) => {
    const root = document.documentElement;
    console.log('Applying config:', configObj);
    
    // Apply theme colors - values are now direct strings
    if (configObj.theme_primary_color && typeof configObj.theme_primary_color === 'string') {
      root.style.setProperty('--primary-color', configObj.theme_primary_color);
      console.log('Applied primary color:', configObj.theme_primary_color);
    }
    
    if (configObj.theme_secondary_color && typeof configObj.theme_secondary_color === 'string') {
      root.style.setProperty('--secondary-color', configObj.theme_secondary_color);
    }
    
    // Apply site name
    if (configObj.site_name && typeof configObj.site_name === 'string') {
      document.title = configObj.site_name;
    }
  };

  return { config, loading, refetch: fetchConfig };
};