import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PanelLeft } from "lucide-react";

import "./App.css";

import Dashboard from "./Pages/Dashboard.jsx";
import NewCheck from "./Pages/NewCheck.jsx";
import Results from "./Pages/Results.jsx";
import Sidebar from "./components/sidebar.jsx";
import Loader from "./components/Loader.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };
  return (
    <div className={darkMode ? "app dark-theme" : "app light-theme"}>
      {isLoading && <Loader />}
      <BrowserRouter>
        <div
          className={`app-layout ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div className="app-main">
            {!sidebarOpen && (
              <button
                className="sidebar-open-btn"
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
              >
                <PanelLeft size={20} />
              </button>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                    sidebarOpen={sidebarOpen}
                     onOpenSidebar={() => setSidebarOpen(true)}
                  />
                }
              />

              <Route
                path="/new-check"
                element={<NewCheck setLoading={setLoading} />}
              />
              <Route
                path="/results"
                element={<Results />}
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}
export default App;