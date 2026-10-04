import { useState } from "react";
import { Moon, Sun, PanelLeft} from "lucide-react";
import StartNewAnalysis from "../components/StartNewAnalysis";
import DocumentCompareForm from "../components/DocumentCompareForm";
import LatestAnalysis from "../components/LatestAnalysis";
import AnalysisOverview from "../components/AnalysisOverview";

function Dashboard({ darkMode, toggleTheme,onOpenSidebar,sidebarOpen }) {
  const hour = new Date().getHours();
  let Greetings;
  if (hour < 12) {
    Greetings = "Good morning";
  } else if (hour < 16) {
    Greetings = "Good afternoon";
  } else {
    Greetings = "Good evening";
  }

  const [latestAnalysis, setLatestAnalysis] = useState(null);

  return (
    <>
   <header className="dashboard-header">

  {!sidebarOpen && (
    <button
      className="sidebar-open-btn"
      onClick={onOpenSidebar}
      title="Open sidebar"
      aria-label="Open sidebar"
    >
      <PanelLeft size={20} />
    </button>
  )}

  <div className="header-content">
    <h1>{Greetings}</h1>
    <p>Here's your plagiarism analysis overview</p>
  </div>

  <div className="header-actions">
    <button
      className="theme-btn"
      onClick={toggleTheme}
      title="Toggle theme"
    >
      {darkMode ? <Sun size={21} /> : <Moon size={21} />}
    </button>
  </div>

</header>
      <AnalysisOverview />
      <StartNewAnalysis />
      <DocumentCompareForm onAnalysisComplete={setLatestAnalysis} />
      <LatestAnalysis data={latestAnalysis} />
    </>
  );
}

export default Dashboard;