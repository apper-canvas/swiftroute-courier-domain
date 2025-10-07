import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-error/20 to-error/5 flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-10 h-10 text-error" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-secondary">Oops!</h3>
        <p className="text-secondary/70 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RotateCw" size={16} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;