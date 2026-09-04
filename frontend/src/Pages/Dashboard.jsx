import { Moon, Sun, UserRound } from "lucide-react";

function Header({ darkMode, toggleTheme }) {
  const hour = new Date().getHours();
  let Greetings;
  if (hour < 12) {
    Greetings = "Good morning";
  } else if (hour < 16) {
    Greetings = "Good afternoon";                    
  } else {
    Greetings = "Good evening";
  }
  return (<>
    <header className="dashboard-header">
      <div className="header-content">
        <h1>{Greetings}</h1>
        <p>
          Here's your plagiarism analysis overview
        </p>
      </div>
      <div className="header-actions">
        <button
          className="theme-btn"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {darkMode?(<Sun size={21}/>):(<Moon size={21}/>)}
        </button>
        <button
          className="profile-btn"
          title="Profile"
        >
          <UserRound size={21} />
        </button>
      </div>
    </header>
  </>
  );
}
export default Header;