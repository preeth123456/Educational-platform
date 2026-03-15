import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LuLayoutDashboard,
  LuUser,
  LuBookOpen,
  LuClipboardList,
  LuLogOut,
  LuReceipt
} from 'react-icons/lu';
import { MdBarChart } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import '../Dashboard.css';

// Type for studentData prop
type StudentData = {
  name: string;
  avatar: string;
  role: string;
  college: string;
  location: string;
};

// Props for Sidebar component
type SidebarProps = {
  studentData?: StudentData;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({ studentData, collapsed, setCollapsed }) => {
  const [location] = useLocation(); // ✅ correctly using wouter

  // Sidebar should be collapsed by default, expand on hover
  return (
    <div
      className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="sidebar-toggle-wrapper">
        {/* Remove sidebar toggle button and Eduyata text */}
      </div>
      {/* Remove profile section */}
      <div className="sidebar-menu" style={{ marginTop: 0 }}>
        <Link href="/dashboard" className={location === '/dashboard' ? 'active' : ''}>
            <LuLayoutDashboard 
              size={collapsed ? 34 : 22} 
              style={{ marginRight: collapsed ? 0 : 12 }} 
            /> {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link href="/student-info" className={location === '/student-info' ? 'active' : ''}>
            <LuUser 
              size={collapsed ? 34 : 22} 
              style={{ marginRight: collapsed ? 0 : 12 }} 
            /> {!collapsed && <span>Student Info</span>}
          </Link>
          <Link href="/courses" className={location.startsWith('/courses') ? 'active' : ''}>
            <LuBookOpen 
              size={collapsed ? 34 : 22} 
              style={{ marginRight: collapsed ? 0 : 12 }} 
            /> {!collapsed && <span>Courses</span>}
          </Link>
          <Link href="/assignments" className={location === '/assignments' ? 'active' : ''}>
            <LuClipboardList 
              size={collapsed ? 34 : 22} 
              style={{ marginRight: collapsed ? 0 : 12 }} 
            /> {!collapsed && <span>Assignments</span>}
          </Link>
          <Link href="/performance" className={location === '/performance' ? 'active' : ''}>
            <MdBarChart 
              size={collapsed ? 34 : 22} 
              style={{ marginRight: collapsed ? 0 : 12 }} 
            /> {!collapsed && <span>Performance</span>}
          </Link>
          <Link href="/badges" className={location === '/badges' ? 'active' : ''}>
            <FaTrophy 
              size={collapsed ? 34 : 22} 
              style={{ marginRight: collapsed ? 0 : 12 }} 
            /> {!collapsed && <span>Badges</span>}
          </Link>
          <Link href="/my-invoices" className={location === '/my-invoices' ? 'active' : ''}>
            <LuReceipt 
              size={collapsed ? 34 : 22} 
              style={{ marginRight: collapsed ? 0 : 12 }} 
            /> {!collapsed && <span>My Invoices</span>}
          </Link>
      </div>
      <div className="sidebar-footer">
        <Link href="/" className="logout-btn">
          <LuLogOut 
            size={collapsed ? 34 : 22} 
            style={{ marginRight: collapsed ? 0 : 12 }} 
          /> {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
