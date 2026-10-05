import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard.jsx";
import NewCheck from "./Pages/NewCheck.jsx";
import Results from "./Pages/Results.jsx";
import Help from "./Pages/Help.jsx";
import Sidebar from "./components/sidebar.jsx";
import Loader from "./components/Loader.jsx";
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading,setLoading]=useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? "app dark-theme" : "app light-theme"}>
       {isLoading && <Loader/>}
      <BrowserRouter>
        <div className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
          />

          <div className="app-main">
            <Routes>
              {/* Dashboard */}
              <Route
                path="/"
                element={
                  <Dashboard
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                    analysis={latestAnalysis}
                    onAnalysisComplete={setLatestAnalysis}
                    setLoading={setLoading}
                  />
                }
              />
              {/* New Check */}
              <Route
                path="/new-check"
                
                element={<NewCheck setLoading={setLoading} onAnalysisComplete={setLatestAnalysis}/>}
              />
              {/*Results*/}
              <Route
                path="/results"
                element={<Results analysis={latestAnalysis}/>}
              />
              <Route path="/help" element={<Help />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
