import { useState, useEffect } from 'react';

// Enhanced feature flag hook with server-side check
export const useFeatureFlag = (flagName: string) => {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        // Get current user from session
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        if (!userData.id || !userData.role) {
          setEnabled(false);
          return;
        }
        
        // Check with server
        const response = await fetch('http://localhost:8001/api/feature-flags/check/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flag_name: flagName,
            user_id: userData.id,
            user_type: userData.role
          })
        });
        
        const data = await response.json();
        setEnabled(data.enabled || false);
      } catch (error) {
        console.error('Feature flag check failed:', error);
        setEnabled(false);
      }
    };
    
    checkFeatureFlag();
  }, [flagName]);
  
  return enabled;
};