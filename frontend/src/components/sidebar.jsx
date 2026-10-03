import {
  FileText,
  Home,
  Search,
  BarChart3,
  History,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ collapsed, onToggle }) {
 const workspaceItems = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "New Check", icon: Search, path: "/new-check" },
  { label: "Results", icon: BarChart3, path: "/results" },
  { label: "History", icon: History, path: "/history" },
];
  const supportItems = [
  {
    label: "Help & About",
    icon: HelpCircle,
    path: "/help",
  },
];
  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar-logo">
        <FileText size={22} />
        <span className="sidebar-label">PLAGCOM</span>
        <button
          className="sidebar-toggle"
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <p className="sidebar-section-title">Workspace</p>

        <nav className="sidebar-nav">
          {workspaceItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              aria-label={label}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} />
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <p className="sidebar-section-title">Support</p>
        <nav className="sidebar-nav">
          {supportItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              aria-label={label}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} />
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
export default Sidebar;
