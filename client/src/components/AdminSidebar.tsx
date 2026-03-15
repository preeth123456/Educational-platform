import React, { useState, createContext, useContext, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  FaHome, FaUsers, FaChalkboardTeacher, FaBook, FaGraduationCap,
  FaDollarSign, FaBell, FaChartLine, FaCog, FaSignOutAlt,
  FaUserGraduate, FaClipboardList, FaAward, FaEnvelope,
  FaDatabase, FaShieldAlt, FaFileAlt, FaCalendarAlt, FaCreditCard, FaFileInvoice, FaUndo, FaExclamationTriangle, FaHeadphones,
  FaPuzzlePiece, FaBuffer, FaCheckCircle, FaEye, FaLock, FaHistory, FaBuilding, FaCogs, FaFlag
  FaPuzzlePiece, FaBuffer, FaCheckCircle, FaEye, FaLock, FaHistory, FaBuilding, FaCogs, FaGift, FaPercent, FaTags, FaChevronDown, FaChevronRight
} from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './AdminSidebar.css';

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
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [themeColor, setThemeColor] = useState('#d8b4f8');

  // Load tenant theme color
  useEffect(() => {
    const loadTenantTheme = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tenantId = urlParams.get('tenant');
        
        if (tenantId) {
          const response = await fetch(`http://localhost:8001/api/admin/config/resolve/?tenant=${tenantId}`);
          if (response.ok) {
            const data = await response.json();
            const primaryColor = data.data?.theme_primary_color?.value;
            if (primaryColor) {
              setThemeColor(primaryColor);
            }
          }
        }
      } catch (error) {
        console.error('Error loading tenant theme:', error);
      }
    };
    
    loadTenantTheme();
  }, []);

  // Store and restore scroll position
  React.useEffect(() => {
    const savedScrollTop = sessionStorage.getItem('adminSidebarScrollTop');
    if (savedScrollTop && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScrollTop, 10);
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      sessionStorage.setItem('adminSidebarScrollTop', scrollRef.current.scrollTop.toString());
    }
  };

  const headerHeight = 80;
  const sidebarStyles: React.CSSProperties = {
    height: `calc(100vh - ${headerHeight}px)`,
    width: open ? '250px' : '60px',
    backgroundColor: themeColor,
    transition: 'width 0.3s ease, background-color 0.3s ease',
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
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        data-sidebar-scroll
        style={{ 
          flex: 1, 
          overflowY: 'auto',
          scrollBehavior: 'smooth'
        }}
      >
        {props.children}
      </div>
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

  // Preserve tenant parameter when navigating
  const getTenantAwareHref = (href: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantId = urlParams.get('tenant');
    if (tenantId) {
      const separator = href.includes('?') ? '&' : '?';
      return `${href}${separator}tenant=${tenantId}`;
    }
    return href;
  };

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Store current scroll position before navigation
    const sidebar = document.querySelector('[data-sidebar-scroll]') as HTMLElement;
    if (sidebar) {
      sessionStorage.setItem('adminSidebarScrollTop', sidebar.scrollTop.toString());
    }
  };

  return (
    <Link
      href={getTenantAwareHref(link.href)}
      style={linkStyles}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const adminLinks: AdminLink[] = [
    // Dashboard
    {
      label: 'Dashboard',
      href: '/admin-dashboard',
      icon: <FaHome size={20} />,
      category: 'main'
    },

    // User Management
    {
      label: 'Students',
      href: '/admin/students',
      icon: <FaUserGraduate size={20} />,
      category: 'users'
    },
    {
      label: 'Teachers',
      href: '/admin/teachers',
      icon: <FaChalkboardTeacher size={20} />,
      category: 'users'
    },
    {
      label: 'Admins',
      href: '/admin/admins',
      icon: <FaShieldAlt size={20} />,
      category: 'users'
    },

    // Courses & Content
    {
      label: 'Courses',
      href: '/admin/courses',
      icon: <FaBook size={20} />,
      category: 'content'
    },
    {
      label: 'Assignments',
      href: '/admin/assignments',
      icon: <FaClipboardList size={20} />,
      category: 'content'
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: <FaAward size={20} />,
      category: 'content'
    },

    // Enrollments & Access
    {
      label: 'Enrollments',
      href: '/admin/enrollments',
      icon: <FaGraduationCap size={20} />,
      category: 'access'
    },

    // Financial
    {
      label: 'Usage Tracking',
      href: '/admin/usage',
      icon: <FaChartLine size={20} />,
      category: 'financial'
    },
    {
      label: 'Checkout & Transactions',
      href: '/admin/checkout-transactions',
      icon: <FaCreditCard size={20} />,
      category: 'financial'
    },
    {
      label: 'Billing & Payments',
      href: '/admin/billing',
      icon: <FaCreditCard size={20} />,
      category: 'financial'
    },
    {
      label: 'Payment Failures',
      href: '/admin/payment-failures',
      icon: <FaExclamationTriangle size={20} />,
      category: 'financial'
    },
    {
      label: 'Product Catalog & Pricing',
      href: '/admin/product-catalog-pricing',
      icon: <FaDollarSign size={20} />,
      category: 'financial'
    },
    {
      label: 'Revenue Ledger',
      href: '/admin/revenue',
      icon: <FaDollarSign size={20} />,
      category: 'financial'
    },
    {
      label: 'Reports',
      href: '/admin/financial-reports',
      icon: <FaFileAlt size={20} />,
      category: 'financial'
    },

    // Communication
    {
      label: 'Announcements',
      href: '/admin/announcements',
      icon: <FaBell size={20} />,
      category: 'communication'
    },
    {
      label: 'View Breaches',
      href: '/admin/view-breaches',
      icon: <FaExclamationTriangle size={20} />,
      category: 'communication'
    },
    {
      label: 'Support Tickets',
      href: '/admin-support',
      icon: <FaHeadphones size={20} />,
      category: 'communication'
    },
    {
      label: 'Grievances',
      href: '/admin/grievances',
      icon: <FaExclamationTriangle size={20} />,
      category: 'communication'
    },
    {
      label: 'Notifications',
      href: '/admin/notifications',
      icon: <FaEnvelope size={20} />,
      category: 'communication'
    },
    {
      label: 'Scheduling & Tasks',
      href: '/admin/scheduling-tasks',
      icon: <FaCalendarAlt size={20} />,
      category: 'communication'
    },
    {
      label: 'Collaboration Tools',
      href: '/admin/collaboration-tools',
      icon: <FaUsers size={20} />,
      category: 'communication'
    },

    // Analytics
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: <FaChartLine size={20} />,
      category: 'analytics'
    },
    {
      label: 'Performance',
      href: '/admin/performance',
      icon: <FaChartLine size={20} />,
      category: 'analytics'
    },

    // System
    {
      label: 'Data Management',
      href: '/admin/data-management',
      icon: <FaDatabase size={20} />,
      category: 'system'
    },
    {
      label: 'System Health',
      href: '/admin/system-health',
      icon: <FaShieldAlt size={20} />,
      category: 'system'
    },
    {
      label: 'Session Management',
      href: '/session-management',
      icon: <FaShieldAlt size={20} />,
      category: 'system'
    },
    {
      label: 'Audit & Security',
      href: '/admin/audit',
      icon: <FaShieldAlt size={20} />,
      category: 'system'
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: <FaCog size={20} />,
      category: 'system'
    },
    {
      label: 'Backup',
      href: '/admin/backup',
      icon: <FaDatabase size={20} />,
      category: 'system'
    },

    {
      label: 'Context Test',
      href: '/context-test',
      icon: <FaShieldAlt size={20} />,
      category: 'system'
    },

    // Developers - NEW SECTION (Features 1, 2, 3)
    {
      label: 'API Keys',
      href: '/admin/developers/api-keys',
      icon: <FaShieldAlt size={20} />,
      category: 'developers'
    },
    {
      label: 'Webhooks',
      href: '/admin/developers/webhooks',
      icon: <FaBuffer size={20} />,
      category: 'developers'
    },
    {
      label: 'Feature Flags',
      href: '/admin/feature-flags',
      icon: <FaFlag size={20} />,
      category: 'developers'
    },

    // Integrations - NEW SECTION (Feature 4)
    {
      label: 'Connectors',
      href: '/admin/connectors',
      icon: <FaPuzzlePiece size={20} />,
      category: 'integrations'
    },
    {
      label: 'Integrations',
      href: '/admin/integrations',
      icon: <FaPuzzlePiece size={20} />,
      category: 'integrations'
    },
    {
      label: 'Compliance',
      href: '/admin/compliance',
      icon: <FaCheckCircle size={20} />,
      category: 'system'
    },
    // Security & Secrets - NEW SECTION (Feature 10)
    {
      label: 'Secrets Vault',
      href: '/admin/vault',
      icon: <FaLock size={20} />,
      category: 'security'
    },
    {
      label: 'Account Lockouts',
      href: '/admin/security/account-lockouts',
      icon: <FaShieldAlt size={20} />,
      category: 'security'
    },

    // Promotions & Entitlements - Removed from main links (will be dropdown)

    // Multi-Tenant Configuration - NEW SECTION (Feature 2)
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
    access: 'Enrollments',
    financial: 'Financial',
    communication: 'Communication',
    analytics: 'Reports & Analytics',
    promotions: 'Promotions & Entitlements',
    system: 'System Settings',
    developers: 'Developers',
    integrations: 'Integrations',
    security: 'Security & Secrets',
    configuration: 'Multi-Tenant Config'
  };

  return (
    <div style={{ display: 'flex', position: 'relative', zIndex: 9999 }}>
      <SidebarProvider open={open} setOpen={setOpen}>
        <AdminSidebarBody>
          {Object.entries(groupedLinks).map(([category, links]) => (
            <div key={category}>
              <AdminSidebarCategory title={categoryTitles[category as keyof typeof categoryTitles] || category} />
              {links.map((link, idx) => (
                <AdminSidebarLink key={idx} link={link} />
              ))}
            </div>
          ))}

          {/* Benefits & Entitlements Dropdown Menu */}
          <div>
            <AdminSidebarCategory title="Benefits & Entitlements" />
            <div 
              onClick={() => toggleMenu('benefits')}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 8px",
                margin: "4px 0",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: "transparent",
                minHeight: "44px",
                color: "#000000"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c084fc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ minWidth: "24px", height: "24px", flexShrink: 0 }}>
                  <FaGift size={20} />
                </div>
                {open && <span style={{ fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap" }}>Benefits & Entitlements</span>}
              </div>
              {open && (
                expandedMenus.includes('benefits') ? 
                  <FaChevronDown size={12} /> : 
                  <FaChevronRight size={12} />
              )}
            </div>
            
            {expandedMenus.includes('benefits') && open && (
              <div style={{ marginLeft: "32px", marginTop: "4px" }}>
                <AdminSidebarLink link={{
                  label: "Coupons & Discounts",
                  href: "/admin/coupons",
                  icon: <FaGift size={20} />
                }} />
                <AdminSidebarLink link={{
                  label: "Scholarships",
                  href: "/admin/discount-rules",
                  icon: <FaPercent size={20} />
                }} />
                <AdminSidebarLink link={{
                  label: "Entitlement Engine",
                  href: "/admin/entitlements",
                  icon: <FaTags size={20} />
                }} />
              </div>
            )}
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
