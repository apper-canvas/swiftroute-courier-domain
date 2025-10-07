import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Badge = React.forwardRef(
  ({ className, variant = "default", icon, children, ...props }, ref) => {
    const variants = {
      default: "bg-secondary/10 text-secondary",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      error: "bg-error/10 text-error",
      info: "bg-info/10 text-info",
      primary: "bg-primary/10 text-primary"
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
          variants[variant],
          className
        )}
        {...props}
      >
        {icon && <ApperIcon name={icon} size={12} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;