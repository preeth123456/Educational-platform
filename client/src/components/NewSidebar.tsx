"use client";

import React, { useState, createContext, useContext } from "react";
import "./NewSidebar.css";
import { LayoutDashboard, BookOpen, FileText, BarChart3, LogOut, User, Settings, MessageCircle, School, Receipt, Headphones, AlertTriangle, CreditCard, ChevronDown, ChevronRight, ChevronUp, Gift } from "lucide-react";
import { Link, useLocation } from "wouter";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  isActive?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
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

export const EduyataSidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const headerHeight = 80; // px
  const sidebarStyles: React.CSSProperties = {
    height: `calc(100vh - ${headerHeight}px)`,
    width: open ? "250px" : "60px",
    backgroundColor: "#d8b4f8",
    transition: "width 0.3s ease",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: headerHeight,
    zIndex: 9999,
    overflow: "hidden",
    boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  };

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 100);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTop = newPosition;
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
      const newPosition = Math.min(maxScroll, scrollPosition + 100);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTop = newPosition;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  return (
    <div
      style={sidebarStyles}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {/* Scroll Up Button */}
      {open && (
        <div
          onClick={scrollUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "32px",
            margin: "8px",
            borderRadius: "6px",
            backgroundColor: "#c084fc",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#a855f7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#c084fc";
          }}
        >
          <ChevronUp size={16} color="#000" />
        </div>
      )}
      
      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0 16px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="scrollable-sidebar"
      >
        {props.children}
      </div>
      
      {/* Scroll Down Button */}
      {open && (
        <div
          onClick={scrollDown}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "32px",
            margin: "8px",
            borderRadius: "6px",
            backgroundColor: "#c084fc",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#a855f7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#c084fc";
          }}
        >
          <ChevronDown size={16} color="#000" />
        </div>
      )}
    </div>
  );
};

export const StudentInfo = () => {
  const { open } = useSidebar();
  
  const studentInfoLink: Links = {
    label: "Student Info",
    href: "/student-info",
    icon: <User size={24} />,
    isActive: false,
  };

  return <SidebarLink link={studentInfoLink} />;
};

export const SidebarLink = ({
  link,
  className = "",
}: {
  link: Links;
  className?: string;
}) => {
  const { open } = useSidebar();
  const [location] = useLocation();
  const isActive = location === link.href;

  const linkStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "12px 8px",
    margin: "4px 0",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#000000",
    transition: "all 0.2s ease",
    cursor: "pointer",
    backgroundColor: isActive ? "#c084fc" : "transparent",
    borderLeft: isActive ? "4px solid #9333ea" : "4px solid transparent",
    minHeight: "44px",
  };

  const iconStyles: React.CSSProperties = {
    minWidth: "24px",
    height: "24px",
    flexShrink: 0,
  };

  const textStyles: React.CSSProperties = {
    marginLeft: "12px",
    fontSize: "14px",
    fontWeight: "500",
    opacity: open ? 1 : 0,
    transition: "opacity 0.2s ease",
    whiteSpace: "nowrap",
    display: open ? "block" : "none",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = "#c084fc";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = "transparent";
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

export function EduyataSidebarDemo({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const links: Links[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={24} />,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: <BookOpen size={24} />,
    },
    {
      label: "Virtual Classrooms",
      href: "/virtual-classrooms",
      icon: <School size={24} />,
    },
    {
      label: "Assignments",
      href: "/assignments",
      icon: <FileText size={24} />,
    },
    {
      label: "Performance",
      href: "/performance",
      icon: <BarChart3 size={24} />,
    },
  ];

  const logoutLink: Links = {
    label: "Logout",
    href: "/",
    icon: <LogOut size={24} />,
    isActive: false,
  };

  const containerStyles: React.CSSProperties = {
    display: "flex",
    position: "relative",
    zIndex: 9999,
  };



  return (
    <div style={containerStyles} className="new-sidebar-container">
      <EduyataSidebar open={open} setOpen={setOpen}>
        <SidebarBody>
          <div>
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            
            {/* Plans & Checkout Menu with Submenu */}
            <div>
              <div 
                onClick={() => toggleMenu('plans')}
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
                  minHeight: "44px"
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
                    <CreditCard size={24} />
                  </div>
                  {open && <span style={{ fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap" }}>Plans & Checkout</span>}
                </div>
                {open && (
                  expandedMenus.includes('plans') ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                )}
              </div>
              
              {expandedMenus.includes('plans') && open && (
                <div style={{ marginLeft: "32px", marginTop: "4px" }}>
                  <SidebarLink link={{
                    label: "Plans",
                    href: "/student/plans",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "Subscription",
                    href: "/student/subscription-management",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "My Invoices",
                    href: "/my-invoices",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "One-Time Store",
                    href: "/student/store",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "My Orders",
                    href: "/student/orders",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "My Wallet",
                    href: "/student/wallet",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                </div>
              )}
            </div>
            {/* Benefits & Entitlements Menu with Submenu */}
            <div>
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
                  minHeight: "44px"
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
                    <Gift size={24} />
                  </div>
                  {open && <span style={{ fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap" }}>Benefits & Entitlements</span>}
                </div>
                {open && (
                  expandedMenus.includes('benefits') ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                )}
              </div>
              
              {expandedMenus.includes('benefits') && open && (
                <div style={{ marginLeft: "32px", marginTop: "4px" }}>
                  <SidebarLink link={{
                    label: "Coupons & Discounts",
                    href: "/student/coupons",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "Scholarships",
                    href: "/student/scholarships",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "Entitlement Engine",
                    href: "/student/my-benefits",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                </div>
              )}
            </div>
            
            <SidebarLink link={{
              label: "Student Info",
              href: "/student-info",
              icon: <User size={24} />
            }} />
            <SidebarLink link={{
              label: "Chat",
              href: "/student-chat",
              icon: <MessageCircle size={24} />
            }} />
            <SidebarLink link={{
              label: "Support & Help",
              href: "/support",
              icon: <Headphones size={24} />
            }} />
            <SidebarLink link={{
              label: "Features",
              href: "/student-features",
              icon: <Zap size={24} />
            }} />
            <SidebarLink link={{
              label: "Settings",
              href: "/settings",
              icon: <Settings size={24} />
            }} />
            <div style={{ marginTop: "20px" }}>
              <SidebarLink link={logoutLink} />
            </div>
          </div>
        </SidebarBody>
      </EduyataSidebar>
    </div>
  );
}

export default EduyataSidebarDemo; 