import { useEffect, useState } from 'react';
import SessionManager from '../utils/sessionManager';

interface Context {
  id: number;
  context_type: string;
  context_id: string;
  context_name: string;
  permissions: Record<string, boolean>;
}

export const useContextManager = () => {
  const [currentContext, setCurrentContext] = useState<Context | null>(null);
  const [availableContexts, setAvailableContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeContexts();
  }, []);

  const initializeContexts = async () => {
    const session = SessionManager.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      // Initialize contexts for user
      const initResponse = await fetch('http://localhost:8001/api/auth/contexts/initialize/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.id,
          user_type: session.role
        })
      });

      if (initResponse.ok) {
        const data = await initResponse.json();
        setAvailableContexts(data.contexts || []);
        setCurrentContext(data.current_context);
        
        // Update session with current context
        if (data.current_context) {
          SessionManager.updateSessionContext(data.current_context);
        }
      }
    } catch (error) {
      console.error('Failed to initialize contexts:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchContext = async (contextId: number) => {
    const session = SessionManager.getSession();
    if (!session) return false;

    try {
      const response = await fetch('http://localhost:8001/api/auth/contexts/switch/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.id,
          user_type: session.role,
          context_id: contextId,
          session_token: SessionManager.getSessionToken()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentContext(data.current_context);
        SessionManager.updateSessionContext(data.current_context);
        return true;
      }
    } catch (error) {
      console.error('Failed to switch context:', error);
    }
    return false;
  };

  return {
    currentContext,
    availableContexts,
    loading,
    switchContext,
    hasPermission: (permission: string) => currentContext?.permissions?.[permission] || false
  };
};