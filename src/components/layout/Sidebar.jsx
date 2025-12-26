import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  Wrench,
  LineChart,
} from "lucide-react";

function Sidebar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Activity, label: "Equipment", path: "/equipment" },
    { icon: Calendar, label: "Reservations", path: "/reservations" },
    { icon: Wrench, label: "Maintenance", path: "/maintenance" },
    { icon: LineChart, label: "Analytics", path: "/analytics" },
  ];

  return (
    <div className="relative flex">
      {/* Sidebar */}
      <div
        className={`w-60 min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 relative transition-all duration-300 ease-in-out ${
          toggleMenu ? "hidden" : "block"
        }`}>
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setToggleMenu(!toggleMenu)}
          className="absolute z-[100] items-center p-2 border border-blue-200/30 dark:border-blue-700/50 rounded-full shadow-lg text-white bg-blue-700 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all duration-300 transform hover:scale-105"
          style={{ top: "1rem", left: "13.5rem" }}>
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-col h-full pt-5 pb-4">
          {/* Sidebar Header */}
          <div className="px-4 mb-8">
            <h2 className="text-white dark:text-blue-100 text-xl font-bold">
              Renal System
            </h2>
            <p className="text-blue-200 dark:text-blue-300 text-sm mt-1">
              Medical Equipment
            </p>
          </div>

          {/* Navigation Items - Takes available space */}
          <div className="flex-1 overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1" aria-label="Sidebar">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
                        isActive
                          ? "bg-blue-700 dark:bg-blue-800 text-white dark:text-blue-50 shadow-inner"
                          : "text-blue-100 dark:text-blue-200 hover:bg-blue-700/50 dark:hover:bg-blue-800/70 hover:text-white dark:hover:text-blue-50 hover:shadow-md"
                      }`
                    }
                    end={item.path === "/dashboard"}>
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${({ isActive }) =>
                        isActive
                          ? "text-white dark:text-blue-50"
                          : "text-blue-200 dark:text-blue-300"}`}
                    />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* User Profile - Always at the bottom */}
          <div className="mt-auto pt-6 border-t border-blue-700/50 dark:border-blue-800/50">
            <div className="px-3">
              <div className="flex items-center px-3 py-3 text-blue-200 dark:text-blue-300 hover:bg-blue-700/30 dark:hover:bg-blue-800/50 rounded-lg transition-colors duration-200 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center mr-3">
                  <span className="text-sm font-semibold text-white dark:text-blue-100">
                    SY
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate text-white dark:text-blue-100">
                    Sherif Yani
                  </p>
                  <p className="text-xs text-blue-300 dark:text-blue-400 truncate">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed State */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          toggleMenu ? "w-16" : "w-0"
        }`}>
        {toggleMenu && (
          <div className="w-16 min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 flex flex-col items-center py-5">
            <button
              type="button"
              onClick={() => setToggleMenu(!toggleMenu)}
              className="mb-8 p-2 rounded-full text-white bg-blue-700 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all duration-300 transform hover:scale-105">
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Navigation Items */}
            <nav className="flex-1 flex flex-col items-center space-y-4">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `p-2.5 rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? "bg-blue-700 dark:bg-blue-800 text-white dark:text-blue-50"
                          : "text-blue-200 dark:text-blue-300 hover:bg-blue-700/50 dark:hover:bg-blue-800/70 hover:text-white dark:hover:text-blue-50"
                      }`
                    }
                    title={item.label}
                    end={item.path === "/dashboard"}>
                    <Icon className="h-5 w-5" />
                    {/* Active indicator */}
                    {({ isActive }) =>
                      isActive && (
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
                      )
                    }
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-blue-900 dark:bg-blue-950 text-white dark:text-blue-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg border border-blue-800 dark:border-blue-900">
                      {item.label}
                    </div>
                  </NavLink>
                );
              })}
            </nav>

            {/* User Profile at the bottom of collapsed sidebar */}
            <div className="mt-auto pt-6 border-t border-blue-700/50 dark:border-blue-800/50 w-full px-3">
              <div className="p-2 rounded-lg bg-blue-700/30 dark:bg-blue-800/50 group relative flex justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white dark:text-blue-100">
                    SY
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-blue-900 dark:bg-blue-950 text-white dark:text-blue-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg border border-blue-800 dark:border-blue-900">
                  Sherif Yani
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
