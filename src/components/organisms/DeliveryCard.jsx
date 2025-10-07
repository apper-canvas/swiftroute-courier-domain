import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DeliveryCard = ({ parcel, onViewDetails, onTrack }) => {
  const getBorderColor = (status) => {
    switch (status) {
      case "delivered": return "border-l-success";
      case "in-transit": return "border-l-primary";
      case "assigned": return "border-l-info";
      case "pending": return "border-l-warning";
      default: return "border-l-secondary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 border-l-4 ${getBorderColor(parcel.status)} hover:shadow-lg transition-shadow`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-secondary">{parcel.trackingNumber}</h3>
              <StatusBadge status={parcel.status} />
            </div>
            <p className="text-sm text-secondary/70">{parcel.customerName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary/50">
              {format(new Date(parcel.createdAt), "MMM dd, HH:mm")}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <ApperIcon name="MapPin" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-secondary/50">Pickup</p>
              <p className="text-sm text-secondary truncate">{parcel.pickupAddress.street}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ApperIcon name="MapPin" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-secondary/50">Delivery</p>
              <p className="text-sm text-secondary truncate">{parcel.deliveryAddress.street}</p>
            </div>
          </div>
        </div>

        {parcel.driverName && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-secondary/5 rounded">
            <ApperIcon name="User" size={16} className="text-secondary/70" />
            <span className="text-sm text-secondary/70">Driver: {parcel.driverName}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onTrack && onTrack(parcel)}
          >
            <ApperIcon name="Navigation" size={16} />
            Track
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            onClick={() => onViewDetails && onViewDetails(parcel)}
          >
            <ApperIcon name="Eye" size={16} />
            Details
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default DeliveryCard;