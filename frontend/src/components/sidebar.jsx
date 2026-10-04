import {
  FileText,
  Home,
  Search,
  BarChart3,
  History,
  HelpCircle,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ onClose }) {
  const workspaceItems = [
    { label: "Dashboard", icon: Home,path: "/",},
    {label: "New Check",icon: Search,path: "/new-check",},
      {label: "Results", icon: BarChart3,path: "/results",},
      {label: "History", icon: History,path: "/history", },
  ];

  const supportItems = [{label: "Help & About",icon: HelpCircle,path: "/help",},
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">

        <div className="sidebar-brand">
          <FileText size={22} />
          <span>PLAGCOM</span>
        </div>

        <button
          className="sidebar-close-btn"
          onClick={onClose}
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <p className="sidebar-section-title">
          Workspace
        </p>
        <nav className="sidebar-nav">
          {workspaceItems.map(
            ({ label, icon: Icon, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <p className="sidebar-section-title">
          Support
        </p>
        <nav className="sidebar-nav">
          {supportItems.map(
            ({ label, icon: Icon, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>
      </div>
    </aside>
  );
}
export default Sidebar;