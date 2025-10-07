import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-primary",
      secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20 focus:ring-secondary",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
      ghost: "text-secondary hover:bg-secondary/10 focus:ring-secondary",
      danger: "bg-gradient-to-r from-error to-error/90 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-error"
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;