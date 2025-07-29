import React, { useState, useEffect } from "react";

interface ButtonProps {
  title: string;
  loading?: boolean;
  loadingTitle?: string | string[];  // allow passing array of titles
  onClick?: () => void;
  disabled?: boolean;
  styleType?: "primary" | "secondary";
  className?: string;
  loadingTitleCycleIntervalMs?: number; // Optional: cycle interval in ms
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  loading = false,
  loadingTitle = "Processing...",
  onClick,
  disabled = false,
  styleType = "primary",
  className = "",
  loadingTitleCycleIntervalMs = 2500, // default to 2 seconds
}) => {
  // If loadingTitle is an array, cycle through it; else show it as is
  const loadingMessages = 
    typeof loadingTitle === "string"
      ? [loadingTitle]
      : loadingTitle.length > 0 
        ? loadingTitle 
        : ["Processing..."];

  const [currentLoadingTitle, setCurrentLoadingTitle] = useState(loadingMessages[0]);

  useEffect(() => {
    if (!loading || loadingMessages.length <= 1) {
      setCurrentLoadingTitle(loadingMessages[0]);
      return;
    }

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setCurrentLoadingTitle(loadingMessages[index]);
    }, loadingTitleCycleIntervalMs);

    return () => {
      clearInterval(interval);
      setCurrentLoadingTitle(loadingMessages[0]);
    };
  }, [loading, loadingMessages, loadingTitleCycleIntervalMs]);

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-normal text-sm sm:text-base flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
        styleType === "primary"
          ? "bg-(--accent) text-(--accent-foreground) border-(--accent-foreground)/10 hover:bg-(--accent)/90 cursor-pointer"
          : "bg-(--secondary) text-(--text) border-(--muted)/10 hover:bg-(--secondary)/90 cursor-pointer"
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
      )}
      <span>{loading ? currentLoadingTitle : title}</span>
    </button>
  );
};

export default CustomButton;
