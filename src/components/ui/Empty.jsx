import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No Data Found", 
  description = "There's nothing here yet.", 
  actionLabel,
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <ApperIcon name={icon} className="w-12 h-12 text-primary/50" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-secondary">{title}</h3>
        <p className="text-secondary/70 max-w-md">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;