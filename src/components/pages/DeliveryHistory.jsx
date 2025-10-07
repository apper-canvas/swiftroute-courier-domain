import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import deliveryService from "@/services/api/deliveryService";
import parcelService from "@/services/api/parcelService";

const DeliveryHistory = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadDeliveries();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, searchTerm, filterStatus]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deliveryService.getCompletedDeliveries();
      setDeliveries(data);
    } catch (err) {
      setError("Failed to load delivery history. Please try again.");
      toast.error("Failed to load delivery history");
    } finally {
      setLoading(false);
    }
  };

  const filterDeliveries = () => {
    let filtered = [...deliveries];

    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(delivery => delivery.status === filterStatus);
    }

    filtered.sort((a, b) => new Date(b.deliveryTime) - new Date(a.deliveryTime));
    setFilteredDeliveries(filtered);
  };

  const handleDownloadReceipt = async (delivery) => {
    if (!delivery.proofOfDelivery) {
      toast.warning("No receipt available for this delivery");
      return;
    }

    try {
      const receiptContent = `
DELIVERY RECEIPT
================
Tracking Number: ${delivery.trackingNumber}
Delivered: ${format(new Date(delivery.deliveryTime), "PPpp")}
Distance: ${delivery.distance} km
Delivered By: ${delivery.proofOfDelivery.completedBy}
Customer Rating: ${delivery.customerRating || "N/A"}/5
Notes: ${delivery.notes || "N/A"}
================
      `.trim();

      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${delivery.trackingNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Receipt downloaded successfully");
    } catch (err) {
      toast.error("Failed to download receipt");
    }
  };

  const handleReorder = async (delivery) => {
    try {
      const parcel = await parcelService.getById(delivery.parcelId);
      navigate("/book-pickup", { 
        state: { 
          reorderData: {
            weight: parcel.weight,
            dimensions: parcel.dimensions,
            recipientName: parcel.recipientName,
            recipientPhone: parcel.recipientPhone,
            deliveryAddress: parcel.deliveryAddress
          }
        }
      });
      toast.info("Redirected to booking with previous delivery details");
    } catch (err) {
      toast.error("Failed to reorder. Please try again.");
    }
  };

  if (loading) return <Loading message="Loading delivery history..." />;
  if (error) return <Error message={error} onRetry={loadDeliveries} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Delivery History</h1>
          <p className="text-secondary/70 mt-1">View past deliveries, download receipts, and reorder</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<ApperIcon name="Search" size={18} />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "delivered" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("delivered")}
            >
              Delivered
            </Button>
            <Button
              variant={filterStatus === "cancelled" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("cancelled")}
            >
              Cancelled
            </Button>
          </div>
        </div>
      </Card>

      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <Empty 
          message={searchTerm || filterStatus !== "all" 
            ? "No deliveries match your search criteria" 
            : "No delivery history available"
          }
          icon="Package"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDeliveries.map((delivery, index) => (
            <motion.div
              key={delivery.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Package" size={20} className="text-primary" />
                        <span className="font-mono text-sm font-semibold text-secondary">
                          {delivery.trackingNumber}
                        </span>
                      </div>
                      <StatusBadge status={delivery.status} />
                    </div>
                    {delivery.customerRating && (
                      <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                        <ApperIcon name="Star" size={16} className="text-accent fill-accent" />
                        <span className="text-sm font-semibold text-accent">
                          {delivery.customerRating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-secondary/70">
                      <ApperIcon name="Calendar" size={16} />
                      <span>
                        {delivery.deliveryTime 
                          ? format(new Date(delivery.deliveryTime), "PPp")
                          : "Not delivered yet"
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary/70">
                      <ApperIcon name="Navigation" size={16} />
                      <span>{delivery.distance} km</span>
                    </div>
                    {delivery.proofOfDelivery && (
                      <div className="flex items-center gap-2 text-secondary/70">
                        <ApperIcon name="User" size={16} />
                        <span>Delivered by {delivery.proofOfDelivery.completedBy}</span>
                      </div>
                    )}
                    {delivery.notes && (
                      <div className="flex items-start gap-2 text-secondary/70">
                        <ApperIcon name="FileText" size={16} className="mt-0.5" />
                        <span className="flex-1">{delivery.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {delivery.status === "delivered" && delivery.proofOfDelivery && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDownloadReceipt(delivery)}
                      >
                        <ApperIcon name="Download" size={16} />
                        Receipt
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleReorder(delivery)}
                    >
                      <ApperIcon name="RotateCw" size={16} />
                      Reorder
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;