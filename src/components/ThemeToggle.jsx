import { useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 transition-all duration-200 border border-blue-200 dark:border-blue-800"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      {darkMode ? (
        <>
          <Sun className="w-4 h-4" />
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
