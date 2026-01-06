import React from "react";
import Button from "./Button";

const ErrorState = ({ message, onRetry, compact = false }) => {
  if (compact) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm">{message}</p>
        {onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry} className="mt-2">
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
        <span className="text-2xl text-red-600 dark:text-red-400">!</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
