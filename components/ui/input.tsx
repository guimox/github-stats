import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  buttonText?: string;
  onButtonClick?: (e: any) => void;
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      buttonText,
      onButtonClick,
      isLoading,
      ...props
    },
    ref
  ) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="w-full relative flex items-center border border-input rounded-md">
        {StartIcon && (
          <div className="pl-3">
            <StartIcon size={18} className="text-muted-foreground" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex-1 h-8 px-4 text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {buttonText && (
          <button
            type="button"
            onClick={onButtonClick}
            disabled={isLoading}
            className={cn(
              "h-10 px-4 bg-gray-300 text-white rounded-r-sm text-sm font-medium hover:bg-primary/90 focus:outline-1 disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading ? "cursor-wait" : ""
            )}
          >
            {isLoading ? "Loading..." : buttonText}
          </button>
        )}
        {EndIcon && !buttonText && (
          <div className="pr-3">
            <EndIcon size={18} className="text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
