import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(
  ({ className, hover = false, children, ...props }, ref) => {
    const Component = hover ? motion.div : "div";
    const motionProps = hover ? {
      whileHover: { y: -4, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
      transition: { duration: 0.2 }
    } : {};

    return (
      <Component
        ref={ref}
        className={cn(
          "bg-white rounded-lg border border-secondary/10 shadow-sm",
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

export default Card;