import React, { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  FaHome, FaChalkboardTeacher, FaSignOutAlt, FaFileAlt, FaBuilding, FaCogs, FaBuffer
} from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './AdminSidebar.css';

interface AdminLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const NormalAdminSidebarBody = (props: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar();
  
  const headerHeight = 80;
  const sidebarStyles: React.CSSProperties = {
    height: `calc(100vh - ${headerHeight}px)`,
    width: open ? '250px' : '60px',
    backgroundColor: '#d8b4f8',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
    position: 'fixed',
    left: 0,
    top: headerHeight,
    zIndex: 9999,
    overflow: 'hidden',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  };

  return (
    <div
      style={sidebarStyles}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {props.children}
    </div>
  );
};

export const NormalAdminSidebarLink = ({
  link,
  className = '',
}: {
  link: AdminLink;
  className?: string;
}) => {
  const { open } = useSidebar();
  const [location] = useLocation();
  const isActive = location === link.href;

  const linkStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 8px',
    margin: '4px 0',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#000000',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    backgroundColor: isActive ? '#c084fc' : 'transparent',
    borderLeft: isActive ? '4px solid #9333ea' : '4px solid transparent',
    minHeight: '44px',
  };

  const iconStyles: React.CSSProperties = {
    minWidth: '24px',
    height: '24px',
    flexShrink: 0,
  };

  const textStyles: React.CSSProperties = {
    marginLeft: '12px',
    fontSize: '14px',
    fontWeight: '500',
    opacity: open ? 1 : 0,
    transition: 'opacity 0.2s ease',
    whiteSpace: 'nowrap',
    display: open ? 'block' : 'none',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = '#c084fc';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  return (
    <Link
      href={link.href}
      style={linkStyles}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={iconStyles}>
        {link.icon}
      </div>
      <span style={textStyles}>
        {link.label}
      </span>
    </Link>
  );
};

const NormalAdminSidebar = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [, navigate] = useLocation();

  const normalAdminLinks: AdminLink[] = [
    {
      label: 'Dashboard',
      href: '/normal-admin/dashboard',
      icon: <FaHome size={20} />
    },
    {
      label: 'Verify Teachers',
      href: '/normal-admin/verify-teachers',
      icon: <FaFileAlt size={20} />
    },
    {
      label: 'Teachers',
      href: '/normal-admin/teachers',
      icon: <FaChalkboardTeacher size={20} />
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: <FaBuffer size={20} />
    },
    {
      label: 'Tenants',
      href: '/admin/tenants',
      icon: <FaBuilding size={20} />
    },
    {
      label: 'Configuration',
      href: '/admin/config-management',
      icon: <FaCogs size={20} />
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    SessionManager.clearSession();
    navigate('/admin-login');
  };

  return (
    <div style={{ display: 'flex', position: 'relative', zIndex: 9999 }}>
      <SidebarProvider open={open} setOpen={setOpen}>
        <NormalAdminSidebarBody>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {normalAdminLinks.map((link, idx) => (
              <NormalAdminSidebarLink key={idx} link={link} />
            ))}
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(107, 33, 168, 0.2)' }}>
            <div 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 8px',
                margin: '4px 0',
                borderRadius: '8px',
                color: '#000000',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c084fc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ minWidth: '24px', height: '24px', flexShrink: 0 }}>
                <FaSignOutAlt size={20} />
              </div>
              <span style={{
                marginLeft: '12px',
                fontSize: '14px',
                fontWeight: '500',
                opacity: open ? 1 : 0,
                transition: 'opacity 0.2s ease',
                whiteSpace: 'nowrap',
                display: open ? 'block' : 'none'
              }}>
                Logout
              </span>
            </div>
          </div>
        </NormalAdminSidebarBody>
      </SidebarProvider>
    </div>
  );
};

export default NormalAdminSidebar;
