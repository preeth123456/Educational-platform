"use client";

import React, { useState, createContext, useContext } from "react";
import { LayoutDashboard, BookOpen, FileText, BarChart3, LogOut, User } from "lucide-react";

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

export const SidebarBody = ({ children, ...props }: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  
  const sidebarStyles: React.CSSProperties = {
    height: "100vh",
    width: open ? "250px" : "60px",
    backgroundColor: "#d8b4f8",
    transition: "width 0.3s ease",
    display: "flex",
    flexDirection: "column",
    padding: "16px 8px",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1000,
    overflow: "hidden",
  };

  return (
    <div
      style={sidebarStyles}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export const StudentInfo = () => {
  const { open } = useSidebar();
  
  const studentInfoLink: Links = {
    label: "Student Info",
    href: "#",
    icon: <User size={open ? 22 : 34} />,
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
    backgroundColor: link.isActive ? "#c084fc" : "transparent",
    borderLeft: link.isActive ? "4px solid #9333ea" : "4px solid transparent",
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
    if (!link.isActive) {
      e.currentTarget.style.backgroundColor = "#c084fc";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!link.isActive) {
      e.currentTarget.style.backgroundColor = "transparent";
    }
  };

  return (
    <a
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
    </a>
  );
};

export function EduyataSidebarDemo() {
  const [open, setOpen] = useState(false);

  const links: Links[] = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard size={open ? 22 : 34} />,
      isActive: false,
    },
    {
      label: "Courses",
      href: "#",
      icon: <BookOpen size={open ? 22 : 34} />,
      isActive: true,
    },
    {
      label: "Assignments",
      href: "#",
      icon: <FileText size={open ? 22 : 34} />,
      isActive: false,
    },
    {
      label: "Performance",
      href: "#",
      icon: <BarChart3 size={open ? 22 : 34} />,
      isActive: false,
    },
  ];

  const logoutLink: Links = {
    label: "Logout",
    href: "#",
    icon: <LogOut size={open ? 22 : 34} />,
    isActive: false,
  };

  const containerStyles: React.CSSProperties = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  };

  const contentStyles: React.CSSProperties = {
    marginLeft: open ? "250px" : "60px",
    transition: "margin-left 0.3s ease",
    flex: 1,
    padding: "20px",
  };

  const spacerStyles: React.CSSProperties = {
    flex: 1,
  };

  return (
    <div style={containerStyles}>
      <EduyataSidebar open={open} setOpen={setOpen}>
                <SidebarBody>
          <div>
            <SidebarLink link={links[0]} />
            <StudentInfo />
            {links.slice(1).map((link, idx) => (
              <SidebarLink key={idx + 1} link={link} />
            ))}
          </div>
          <div style={spacerStyles}></div>
          <div>
            <SidebarLink link={logoutLink} />
          </div>
        </SidebarBody>
      </EduyataSidebar>
      <div style={contentStyles}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Eduyata Dashboard
        </h1>
        <p style={{ color: "#666" }}>
          Hover over the sidebar to see it expand. The sidebar is collapsed by default and shows only icons.
        </p>
      </div>
    </div>
  );
}

export default EduyataSidebarDemo; 
