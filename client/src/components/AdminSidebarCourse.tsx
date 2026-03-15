import React, { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  FaHome, FaUsers, FaChalkboardTeacher, FaBook, FaGraduationCap,
  FaDollarSign, FaBell, FaChartLine, FaCog, FaSignOutAlt,
  FaUserGraduate, FaClipboardList, FaAward, FaEnvelope,
  FaDatabase, FaShieldAlt, FaFileAlt, FaCalendarAlt, FaBuilding, FaCogs, FaBuffer
} from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './AdminSidebarCourse.css';

interface AdminLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  category?: string;
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

export const AdminSidebarBody = (props: React.ComponentProps<'div'>) => {
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

export const AdminSidebarLink = ({
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

export const AdminSidebarCategory = ({ title }: { title: string }) => {
  const { open } = useSidebar();
  
  if (!open) return null;
  
  return (
    <div style={{
      padding: '8px 12px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b21a8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginTop: '16px',
      marginBottom: '4px'
    }}>
      {title}
    </div>
  );
};

const AdminSidebar = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [, navigate] = useLocation();

  const adminLinks: AdminLink[] = [
    // Dashboard
    {
      label: 'Dashboard',
      href: '/normal-admin/courseDashboard',
      icon: <FaHome size={20} />,
      category: 'main'
    },
    
    // Courses
    {
      label: 'Courses',
      href: '/normal-admin/courses',
      icon: <FaBook size={20} />,
      category: 'content'
    },

    // Multi-Tenant Configuration
    {
      label: 'Products',
      href: '/admin/products',
      icon: <FaBuffer size={20} />,
      category: 'configuration'
    },
    {
      label: 'Tenants',
      href: '/admin/tenants',
      icon: <FaBuilding size={20} />,
      category: 'configuration'
    },
    {
      label: 'Configuration',
      href: '/admin/config-management',
      icon: <FaCogs size={20} />,
      category: 'configuration'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    SessionManager.clearSession();
    navigate('/admin-login');
  };

  const logoutLink: AdminLink = {
    label: 'Logout',
    href: '#',
    icon: <FaSignOutAlt size={20} />
  };

  const groupedLinks = adminLinks.reduce((acc, link) => {
    const category = link.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, AdminLink[]>);

  const categoryTitles = {
    main: 'Dashboard',
    users: 'User Management',
    content: 'Courses & Content',
    configuration: 'Multi-Tenant Config'
  };

  return (
    <div style={{ display: 'flex', position: 'relative', zIndex: 9999 }}>
      <SidebarProvider open={open} setOpen={setOpen}>
        <AdminSidebarBody>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {Object.entries(groupedLinks).map(([category, links]) => (
              <div key={category}>
                <AdminSidebarCategory title={categoryTitles[category as keyof typeof categoryTitles] || category} />
                {links.map((link, idx) => (
                  <AdminSidebarLink key={idx} link={link} />
                ))}
              </div>
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
        </AdminSidebarBody>
      </SidebarProvider>
    </div>
  );
};

export default AdminSidebar;