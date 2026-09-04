
import { FileText,Home, Search,BarChart3,History,HelpCircle,} from "lucide-react";

function Sidebar({ activePage = "Dashboard" }) {
  const workspaceItems = [
    { label: "Dashboard", icon: Home },
    { label: "New Check", icon: Search },
    { label: "Results", icon: BarChart3 },
    { label: "History", icon: History },
  ];
  const supportItems = [
    { label: "Help & About",
     icon: HelpCircle }];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <FileText size={22} />
        <span>PLAGCOM</span>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <p className="sidebar-section-title">Workspace</p>
        <nav className="sidebar-nav">
          {workspaceItems.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              className={`sidebar-link ${
                activePage === label ? "active" : ""
              }`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <p className="sidebar-section-title">Support</p>
        <nav className="sidebar-nav">
          {supportItems.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              className={`sidebar-link ${
                activePage === label ? "active" : ""
              }`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;