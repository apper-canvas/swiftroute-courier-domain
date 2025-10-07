import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import parcelService from "@/services/api/parcelService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import DeliveryCard from "@/components/organisms/DeliveryCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ActiveDeliveries = () => {
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parcelService.getActiveDeliveries();
      setParcels(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load active deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredParcels = filter === "all"
    ? parcels
    : parcels.filter(p => p.status === filter);

  const statusCounts = {
    all: parcels.length,
    pending: parcels.filter(p => p.status === "pending").length,
    assigned: parcels.filter(p => p.status === "assigned").length,
    "in-transit": parcels.filter(p => p.status === "in-transit").length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Active Deliveries
          </h1>
          <p className="text-secondary/70">Monitor all ongoing delivery operations</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/book-pickup")}>
          <ApperIcon name="Plus" size={20} />
          Book Pickup
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-secondary/5 rounded-lg w-fit">
        {[
          { value: "all", label: "All", icon: "List" },
          { value: "pending", label: "Pending", icon: "Clock" },
          { value: "assigned", label: "Assigned", icon: "UserCheck" },
          { value: "in-transit", label: "In Transit", icon: "Truck" }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              filter === tab.value
                ? "bg-white text-primary shadow-sm"
                : "text-secondary/70 hover:text-secondary"
            }`}
          >
            <ApperIcon name={tab.icon} size={16} />
            {tab.label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              filter === tab.value
                ? "bg-primary/10 text-primary"
                : "bg-secondary/10 text-secondary/70"
            }`}>
              {statusCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {filteredParcels.length === 0 ? (
        <Empty
          title="No Deliveries Found"
          description={`There are no ${filter === "all" ? "" : filter} deliveries at the moment.`}
          icon="Package"
          actionLabel="Book New Pickup"
          onAction={() => navigate("/book-pickup")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParcels.map((parcel) => (
            <DeliveryCard
              key={parcel.Id}
              parcel={parcel}
              onTrack={(p) => navigate(`/track/${p.trackingNumber}`)}
              onViewDetails={(p) => navigate(`/track/${p.trackingNumber}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveDeliveries;