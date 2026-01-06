import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  type = "button",
  disabled = false,
  fullWidth = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 font-medium";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white",
    secondary:
      "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
    danger:
      "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white",
    success:
      "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white",
    warning:
      "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
