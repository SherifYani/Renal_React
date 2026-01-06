import React from "react";

const ErrorState = ({ message, onRetry }) => (
  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
    <p className="text-red-600 dark:text-red-400">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-sm rounded-lg">
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
