import React, { useEffect } from "react";
import { Check, X } from "lucide-react";

const SuccessNotification = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-green-600 dark:border-green-700">
        <Check className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:bg-green-600 dark:hover:bg-green-700 rounded p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;
