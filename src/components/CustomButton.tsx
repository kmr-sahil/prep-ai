import React from "react";

interface ButtonProps {
  title: string;
  loading?: boolean;
  loadingTitle?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  loading = false,
  loadingTitle = "Processing...",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="ml-auto font-normal text-sm sm:text-base flex items-center justify-center gap-2 bg-(--accent) text-(--accent-foreground) px-4 py-2 rounded-xl border border-(--accent-foreground)/10 hover:bg-(--accent)/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
      )}
      <span>{loading ? loadingTitle : title}</span>
    </button>
  );
};

export default CustomButton;
