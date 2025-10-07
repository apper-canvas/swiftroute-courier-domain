import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import parcelService from "@/services/api/parcelService";
import driverService from "@/services/api/driverService";
import analyticsService from "@/services/api/analyticsService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import DeliveryMap from "@/components/organisms/DeliveryMap";
import DeliveryCard from "@/components/organisms/DeliveryCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [parcelsData, driversData, statsData] = await Promise.all([
        parcelService.getActiveDeliveries(),
        driverService.getAll(),
        analyticsService.getWeeklyStats()
      ]);

      setParcels(parcelsData);
      setDrivers(driversData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const activeDrivers = drivers.filter(d => d.isAvailable && d.status === "active").length;
  const onTimePercentage = stats?.onTimeDeliveries 
    ? ((stats.onTimeDeliveries / stats.completedDeliveries) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Deliveries"
          value={parcels.length}
          icon="Truck"
          trend="up"
          trendValue="+12%"
          gradient="from-primary to-primary/80"
        />
        <StatCard
          title="Available Drivers"
          value={activeDrivers}
          icon="Users"
          gradient="from-success to-success/80"
        />
        <StatCard
          title="On-Time Rate"
          value={`${onTimePercentage}%`}
          icon="Clock"
          trend="up"
          trendValue="+2.5%"
          gradient="from-accent to-accent/80"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon="DollarSign"
          trend="up"
          trendValue="+8%"
          gradient="from-info to-info/80"
        />
      </div>

      {/* Map and Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[500px]">
          <DeliveryMap
            parcels={parcels}
            onSelectParcel={(parcel) => navigate(`/track/${parcel.trackingNumber}`)}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 overflow-auto h-[500px] pr-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary">Recent Deliveries</h2>
            <button
              onClick={() => navigate("/active-deliveries")}
              className="text-sm text-primary hover:underline font-medium"
            >
              View All
            </button>
          </div>

          {parcels.slice(0, 5).map((parcel) => (
            <DeliveryCard
              key={parcel.Id}
              parcel={parcel}
              onTrack={(p) => navigate(`/track/${p.trackingNumber}`)}
              onViewDetails={(p) => navigate(`/track/${p.trackingNumber}`)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;