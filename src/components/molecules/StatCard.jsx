import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, trendValue, gradient = "from-primary to-primary/80" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-medium text-secondary/70">{title}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={16}
                  className={trend === "up" ? "text-success" : "text-error"}
                />
                <span className={`text-sm font-medium ${trend === "up" ? "text-success" : "text-error"}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center`}>
            <ApperIcon name={icon} className="text-primary" size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;