import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full px-4 py-2.5 bg-white border rounded-lg text-secondary transition-all duration-200",
          "placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          error ? "border-error focus:ring-error/50 focus:border-error" : "border-secondary/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;