import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { motion } from "framer-motion";
import parcelService from "@/services/api/parcelService";
import deliveryService from "@/services/api/deliveryService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const TrackParcel = () => {
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const parcelData = await parcelService.getByTrackingNumber(parcelId);
      setParcel(parcelData);

      try {
        const deliveryData = await deliveryService.getByParcelId(parcelData.Id);
        setDelivery(deliveryData);
      } catch (err) {
        setDelivery(null);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load parcel information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [parcelId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!parcel) return <Error message="Parcel not found" />;

  const timeline = [
    {
      status: "pending",
      label: "Pickup Requested",
      time: parcel.createdAt,
      completed: true
    },
    {
      status: "assigned",
      label: "Driver Assigned",
      time: parcel.status !== "pending" ? parcel.createdAt : null,
      completed: parcel.status !== "pending"
    },
    {
      status: "in-transit",
      label: "In Transit",
      time: delivery?.pickupTime,
      completed: ["in-transit", "delivered"].includes(parcel.status)
    },
    {
      status: "delivered",
      label: "Delivered",
      time: parcel.actualDeliveryTime,
      completed: parcel.status === "delivered"
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Track Parcel
          </h1>
          <p className="text-secondary/70">Real-time delivery tracking</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/active-deliveries")}>
          <ApperIcon name="ArrowLeft" size={20} />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <Card className="p-6">
          <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
            <ApperIcon name="Map" size={20} className="text-primary" />
            Live Location
          </h3>
          <div className="relative w-full aspect-video bg-gradient-to-br from-background to-secondary/5 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-primary/20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ApperIcon name="Navigation" size={32} className="text-primary" />
                </div>
              </div>
            </div>

            {/* Route visualization */}
            {delivery?.routeTaken && delivery.routeTaken.length > 0 && (
              <div className="absolute inset-4 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <ApperIcon name="Home" size={20} className="text-white" />
                  </div>
                  <p className="text-xs text-secondary/70 mt-2">Pickup</p>
                </div>

                <div className="flex-1 h-1 bg-gradient-to-r from-primary via-accent to-success relative">
                  <motion.div
                    animate={{ x: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute w-3 h-3 rounded-full bg-white shadow-lg top-1/2 -translate-y-1/2"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center shadow-lg">
                    <ApperIcon name="MapPin" size={20} className="text-white" />
                  </div>
                  <p className="text-xs text-secondary/70 mt-2">Delivery</p>
                </div>
              </div>
            )}
          </div>

          {parcel.driverName && (
            <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">{parcel.driverName}</p>
                    <p className="text-sm text-secondary/70">Your Driver</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ApperIcon name="Phone" size={16} />
                  Call
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Details Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary">Tracking Information</h3>
                <StatusBadge status={parcel.status} />
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                <p className="text-2xl font-bold text-primary mb-1">{parcel.trackingNumber}</p>
                <p className="text-sm text-secondary/70">
                  Estimated Delivery: {format(new Date(parcel.estimatedDeliveryTime), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-secondary mb-3">Delivery Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.completed
                            ? "bg-gradient-to-br from-primary to-accent"
                            : "bg-secondary/10"
                        }`}
                      >
                        {item.completed ? (
                          <ApperIcon name="Check" size={16} className="text-white" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-secondary/30" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            item.completed ? "bg-gradient-to-b from-primary to-accent" : "bg-secondary/10"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-medium ${item.completed ? "text-secondary" : "text-secondary/50"}`}>
                        {item.label}
                      </p>
                      {item.time && (
                        <p className="text-sm text-secondary/50">
                          {format(new Date(item.time), "MMM dd, HH:mm")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-secondary">Addresses</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-secondary/5 rounded-lg">
                  <ApperIcon name="MapPin" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-secondary/50 mb-1">Pickup Location</p>
                    <p className="text-sm text-secondary">{parcel.pickupAddress.street}</p>
                    <p className="text-sm text-secondary/70">
                      {parcel.pickupAddress.city}, {parcel.pickupAddress.state} {parcel.pickupAddress.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-secondary/5 rounded-lg">
                  <ApperIcon name="MapPin" size={20} className="text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-secondary/50 mb-1">Delivery Location</p>
                    <p className="text-sm text-secondary">{parcel.deliveryAddress.street}</p>
                    <p className="text-sm text-secondary/70">
                      {parcel.deliveryAddress.city}, {parcel.deliveryAddress.state} {parcel.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Package Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-secondary mb-4">Package Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/5 rounded-lg">
            <p className="text-xs text-secondary/50 mb-1">Weight</p>
            <p className="text-lg font-semibold text-secondary">{parcel.packageDetails.weight} lbs</p>
          </div>
          <div className="p-4 bg-secondary/5 rounded-lg">
            <p className="text-xs text-secondary/50 mb-1">Dimensions</p>
            <p className="text-lg font-semibold text-secondary">
              {parcel.packageDetails.dimensions.length}" × {parcel.packageDetails.dimensions.width}" × {parcel.packageDetails.dimensions.height}"
            </p>
          </div>
          <div className="p-4 bg-secondary/5 rounded-lg">
            <p className="text-xs text-secondary/50 mb-1">Price</p>
            <p className="text-lg font-semibold text-secondary">${parcel.price.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-secondary/5 rounded-lg">
            <p className="text-xs text-secondary/50 mb-1">Distance</p>
            <p className="text-lg font-semibold text-secondary">{parcel.distance} miles</p>
          </div>
        </div>
        {parcel.packageDetails.description && (
          <div className="mt-4 p-4 bg-secondary/5 rounded-lg">
            <p className="text-xs text-secondary/50 mb-1">Description</p>
            <p className="text-sm text-secondary">{parcel.packageDetails.description}</p>
          </div>
        )}
        {parcel.packageDetails.fragile && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-2">
            <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
            <p className="text-sm font-medium text-warning">Fragile - Handle with Care</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TrackParcel;