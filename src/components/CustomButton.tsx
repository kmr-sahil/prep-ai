import React from "react";

interface ButtonProps {
  title: string;
  loading?: boolean;
  loadingTitle?: string;
  onClick?: () => void;
  disabled?: boolean;
  styleType?: "primary" | "secondary";
  className?: string;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  loading = false,
  loadingTitle = "Processing...",
  onClick,
  disabled = false,
  styleType = "primary",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={` font-normal text-sm sm:text-base flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
        styleType === "primary"
          ? "bg-(--accent) text-(--accent-foreground) border-(--accent-foreground)/10 hover:bg-(--accent)/90 cursor-pointer"
          : "bg-(--secondary) text-(--text) border-(--muted)/10 hover:bg-(--secondary)/90 cursor-pointer"
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
      )}
      <span>{loading ? loadingTitle : title}</span>
    </button>
  );
};

export default CustomButton;
