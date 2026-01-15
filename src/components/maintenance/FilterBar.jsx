import { Search } from "lucide-react";
import Button from "../common/Button";

const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  filterConfig,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={filterConfig.searchPlaceholder || "Search..."}
              value={filters.searchTerm}
              onChange={(e) => onFilterChange("searchTerm", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          {filterConfig.filters.map((filter) => (
            <select
              key={filter.name}
              value={filters[filter.name]}
              onChange={(e) => onFilterChange(filter.name, e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
              <option value="all">All {filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}

          <Button variant="secondary" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
