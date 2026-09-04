import { useState } from "react";
import "./App.css";
import Header from "./Pages/Dashboard.jsx";
import AnalysisOverview from "./components/AnalysisOverview.jsx";
import StartNewAnalysis from "./components/StartNewAnalysis.jsx";
import DocumentCompareForm from "./components/DocumentCompareForm.jsx";
import LatestAnalysis from "./components/LatestAnalysis.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? "app dark-theme" : "app light-theme"}>
      <div className="app-layout">
        <Sidebar activePage="Dashboard" />
        <div className="app-main">
          <Header darkMode={darkMode} toggleTheme={toggleTheme} />
          <main className="dashboard-content">
            <AnalysisOverview documentsChecked={4} comparisonsMade={6} needsReview={2} />
            <StartNewAnalysis />
            <DocumentCompareForm />
            <LatestAnalysis />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;