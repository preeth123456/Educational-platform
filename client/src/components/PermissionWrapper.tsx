import React from 'react';
import SessionManager from '../utils/sessionManager';

interface PermissionWrapperProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ 
  permission, 
  fallback = null, 
  children 
}) => {
  const hasPermission = SessionManager.hasPermission(permission);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionWrapper;