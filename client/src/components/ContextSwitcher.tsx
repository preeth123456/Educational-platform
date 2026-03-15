import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Users, BookOpen, Building, User } from 'lucide-react';
import SessionManager from '../utils/sessionManager';
import './ContextSwitcher.css';

interface Context {
  id: number;
  context_type: string;
  context_id: string;
  context_name: string;
  permissions: Record<string, boolean>;
}

interface ContextSwitcherProps {
  onContextChange?: (context: Context) => void;
}

const ContextSwitcher: React.FC<ContextSwitcherProps> = ({ onContextChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contexts, setContexts] = useState<Context[]>([]);
  const [currentContext, setCurrentContext] = useState<Context | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadContexts();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const loadContexts = async () => {
    const session = SessionManager.getSession();
    if (!session) return;

    try {
      const [contextsRes, currentRes] = await Promise.all([
        fetch(`http://localhost:8001/api/auth/contexts/available/?user_id=${session.id}&user_type=${session.role}`),
        fetch(`http://localhost:8001/api/auth/contexts/current/?user_id=${session.id}&user_type=${session.role}`)
      ]);

      if (contextsRes.ok && currentRes.ok) {
        const contextsData = await contextsRes.json();
        const currentData = await currentRes.json();
        
        setContexts(contextsData.contexts || []);
        setCurrentContext(currentData.current_context);
      }
    } catch (error) {
      console.error('Failed to load contexts:', error);
    }
  };

  const switchContext = async (contextId: number) => {
    const session = SessionManager.getSession();
    if (!session) return;

    setLoading(true);
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
        setIsOpen(false);
        onContextChange?.(data.current_context);
        
        // Trigger page refresh to update permissions
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch context:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContextIcon = (contextType: string) => {
    switch (contextType) {
      case 'organization': return <Building size={16} />;
      case 'role': return <User size={16} />;
      case 'course': return <BookOpen size={16} />;
      default: return <Users size={16} />;
    }
  };

  if (!currentContext || contexts.length <= 1) return null;

  return (
    <div className="context-switcher" ref={dropdownRef}>
      <button 
        className="context-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <div className="context-info">
          {getContextIcon(currentContext.context_type)}
          <span className="context-name">{currentContext.context_name}</span>
        </div>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="context-dropdown">
          <div className="context-dropdown-header">
            <span>Switch Context</span>
          </div>
          <div className="context-list">
            {contexts.map((context) => (
              <button
                key={context.id}
                className={`context-item ${currentContext.id === context.id ? 'active' : ''}`}
                onClick={() => switchContext(context.id)}
                disabled={loading || currentContext.id === context.id}
              >
                <div className="context-item-content">
                  {getContextIcon(context.context_type)}
                  <div className="context-details">
                    <span className="context-item-name">{context.context_name}</span>
                    <span className="context-item-type">{context.context_type}</span>
                  </div>
                </div>
                {currentContext.id === context.id && (
                  <div className="active-indicator">●</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextSwitcher;