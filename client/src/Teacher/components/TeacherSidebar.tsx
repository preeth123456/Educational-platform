"use client";

import React, { useState, createContext, useContext } from "react";
import "./TeacherSidebar.css";
import { LayoutDashboard, BookOpen, FileText, BarChart3, LogOut, User, TrendingUp, ClipboardList, Users, Headphones, AlertTriangle, Gift, GraduationCap, Shield, ChevronDown, ChevronRight } from "lucide-react";
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

export const TeacherSidebar = ({
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

  const headerHeight = 80;
  const sidebarStyles: React.CSSProperties = {
    height: `calc(100vh - ${headerHeight}px)`,
    width: open ? "250px" : "60px",
    backgroundColor: "#d8b4f8",
    transition: "width 0.3s ease",
    display: "flex",
    flexDirection: "column",
    padding: "16px 0",
    position: "fixed",
    left: 0,
    top: headerHeight,
    zIndex: 9999,
    overflowY: "auto",
    overflowX: "hidden",
    boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
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
    position: "relative",
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
    visibility: open ? "visible" : "hidden",
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
      <div style={iconStyles}>{link.icon}</div>
      <span style={textStyles}>{link.label}</span>
    </Link>
  );
};

export function TeacherSidebarDemo({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
      href: "/teacher-dashboard",
      icon: <LayoutDashboard size={24} />,
    },
    {
      label: "My LMS",
      href: "/teacher-lms",
      icon: <BookOpen size={24} />,
    },
    {
      label: "Create Course",
      href: "/create-course",
      icon: <FileText size={24} />,
    },
    {
      label: "My Courses",
      href: "/my-courses",
      icon: <BarChart3 size={24} />,
    },
    {
      label: "Performance",
      href: "/teacher-performance",
      icon: <TrendingUp size={24} />,
    },
    {
      label: "Assignments",
      href: "/teacher-assignments",
      icon: <ClipboardList size={24} />,
    },
    {
      label: "Student Management",
      href: "/teacher-students",
      icon: <Users size={24} />,
    },
    {
      label: "Teacher Profile",
      href: "/teacher-info",
      icon: <User size={24} />,
    },
    {
      label: "Report Breach",
      href: "/teacher-report-breach",
      icon: <AlertTriangle size={24} />,
    },
    {
      label: "Support",
      href: "/teacher-support",
      icon: <Headphones size={24} />,
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

  const spacerStyles: React.CSSProperties = {
    flex: 1,
  };

  return (
    <div style={containerStyles} className="teacher-sidebar-container">
      <TeacherSidebar open={open} setOpen={setOpen}>
        <SidebarBody>
          <div>
            {links.map((link, idx) => (
              <SidebarLink key={`main-link-${idx}`} link={link} />
            ))}
            
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
                    href: "/teacher/coupons",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "Scholarships",
                    href: "/teacher/scholarships",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                  <SidebarLink link={{
                    label: "Entitlement Engine",
                    href: "/teacher/entitlements",
                    icon: <div style={{ width: "24px", height: "24px" }} />
                  }} />
                </div>
              )}
            </div>
          </div>
          <div style={spacerStyles}></div>
          <div>
            <SidebarLink key="logout-link" link={logoutLink} />
          </div>
        </SidebarBody>
      </TeacherSidebar>
    </div>
  );
}

export default TeacherSidebarDemo;
