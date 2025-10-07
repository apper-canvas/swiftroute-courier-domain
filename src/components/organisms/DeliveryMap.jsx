import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DeliveryMap = ({ parcels = [], selectedParcel, onSelectParcel }) => {
  const [mapCenter] = useState({ lat: 37.7749, lng: -122.4194 });

  const getMarkerColor = (status) => {
    switch (status) {
      case "delivered": return "bg-success";
      case "in-transit": return "bg-primary";
      case "assigned": return "bg-info";
      case "pending": return "bg-warning";
      default: return "bg-secondary";
    }
  };

  return (
    <Card className="h-full p-0 overflow-hidden">
      <div className="relative w-full h-full bg-gradient-to-br from-background to-secondary/5">
        {/* Map Header */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-4 border border-secondary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ApperIcon name="Map" size={20} className="text-primary" />
                <span className="font-semibold text-secondary">Live Tracking Map</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-secondary/70">In Transit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-secondary/70">Delivered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-secondary/70">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-full max-w-4xl aspect-video">
            {/* Map markers */}
            {parcels.map((parcel, index) => (
              <motion.div
                key={parcel.Id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${30 + (index * 20) % 40}%`
                }}
                onClick={() => onSelectParcel && onSelectParcel(parcel)}
              >
                <div className={`w-8 h-8 rounded-full ${getMarkerColor(parcel.status)} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                  <ApperIcon name="MapPin" size={16} className="text-white" />
                </div>
                
                {/* Marker popup */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-xl p-3 border border-secondary/10"
                >
                  <p className="text-xs font-semibold text-secondary mb-1">
                    {parcel.trackingNumber}
                  </p>
                  <p className="text-xs text-secondary/70">
                    {parcel.deliveryAddress.street}
                  </p>
                </motion.div>
              </motion.div>
            ))}

            {/* Central map illustration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <ApperIcon name="Navigation" size={200} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Active Deliveries Counter */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-4 border border-secondary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <ApperIcon name="Truck" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{parcels.length}</p>
                <p className="text-xs text-secondary/70">Active Deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DeliveryMap;