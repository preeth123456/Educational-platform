import React from "react";

interface DashboardHeaderProps {
  collapsed: boolean;
  avatar: string;
  name: string;
  role: string;
  searchPlaceholder?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  collapsed,
  avatar,
  name,
  role,
  searchPlaceholder = "Search for courses, assignments..."
}) => (
  <div className={`dashboard-header${collapsed ? " collapsed" : ""}`}>
    <div className="header-search">
      <input type="text" placeholder={searchPlaceholder} />
    </div>
    <div className="header-profile">
      <div className="notifications">
        <span className="notification-indicator"></span>
      </div>
      <div className="user-profile">
        <img src={avatar} alt={name} className="profile-avatar" />
        <div className="profile-info">
          <p className="profile-name">{name}</p>
          <p className="profile-role">{role}</p>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardHeader; 
