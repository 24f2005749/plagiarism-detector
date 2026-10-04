import { Moon, Sun, PanelLeft} from "lucide-react";
import StartNewAnalysis from "../components/StartNewAnalysis";
import DocumentCompareForm from "../components/DocumentCompareForm";
import LatestAnalysis from "../components/LatestAnalysis";
import AnalysisOverview from "../components/AnalysisOverview";

function Dashboard({ darkMode, toggleTheme, onOpenSidebar, sidebarOpen, latestAnalysis, onAnalysisComplete }) {
  const hour = new Date().getHours();
  let Greetings;
  if (hour < 12) {
    Greetings = "Good morning";
  } else if (hour < 16) {
    Greetings = "Good afternoon";
  } else {
    Greetings = "Good evening";
  }

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
      <AnalysisOverview
        documentsChecked={latestAnalysis?.stats.documents ?? 0}
        comparisonsMade={latestAnalysis?.stats.comparisons ?? 0}
        needsReview={latestAnalysis?.stats.needsReview ?? 0}
      />
      <StartNewAnalysis onAnalysisComplete={onAnalysisComplete} />
      <DocumentCompareForm onAnalysisComplete={onAnalysisComplete} />
      {latestAnalysis && <LatestAnalysis data={latestAnalysis} />}
    </>
  );
}

export default Dashboard;