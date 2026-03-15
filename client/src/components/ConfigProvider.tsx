import React from 'react';
import { usePlatformConfig } from '../hooks/usePlatformConfig';

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config, loading } = usePlatformConfig();

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return <>{children}</>;
};

export default ConfigProvider;