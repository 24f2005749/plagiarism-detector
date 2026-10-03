import { Moon, Sun } from "lucide-react";
import StartNewAnalysis from "../components/StartNewAnalysis";
import DocumentCompareForm from "../components/DocumentCompareForm";
import LatestAnalysis from "../components/LatestAnalysis";
import AnalysisOverview from "../components/AnalysisOverview";

function Dashboard({ darkMode, toggleTheme, analysis, onAnalysisComplete, setLoading }) {
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
        <div className="header-content">
          <h1>{Greetings}</h1>
          <p>Here's your plagiarism analysis overview</p>
        </div>
        <div className="header-actions">
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {darkMode ? <Sun size={21} /> : <Moon size={21} />}
          </button>
         
        </div>
      </header>

      <AnalysisOverview
        documentsChecked={analysis?.documentsChecked ?? 0}
        comparisonsMade={analysis?.comparisonsMade ?? 0}
        needsReview={analysis?.needsReview ?? 0}
      />
      <StartNewAnalysis onAnalysisComplete={onAnalysisComplete} setLoading={setLoading} />
      <DocumentCompareForm onAnalysisComplete={onAnalysisComplete} setLoading={setLoading} />
      <LatestAnalysis data={analysis} />
    </>
  );
}

export default Dashboard;
