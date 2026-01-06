import { RefreshCw } from 'lucide-react';

const LoadingState = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center">
      <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
      <div className="text-lg text-gray-700 dark:text-blue-200">
        {message}
      </div>
    </div>
  </div>
);

export default LoadingState;