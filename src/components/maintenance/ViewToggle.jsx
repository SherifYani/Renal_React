import { List, CalendarDays } from "lucide-react";

const ViewToggle = ({ currentView, setCurrentView }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setCurrentView("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            currentView === "list"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}>
          <List className="w-4 h-4" />
          List View
        </button>
        <button
          onClick={() => setCurrentView("calendar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            currentView === "calendar"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}>
          <CalendarDays className="w-4 h-4" />
          Calendar View
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
