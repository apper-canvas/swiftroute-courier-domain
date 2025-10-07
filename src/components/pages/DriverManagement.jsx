import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import driverService from "@/services/api/driverService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DriverManagement = () => {
const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredDrivers = filter === "all"
    ? drivers
    : filter === "available"
    ? drivers.filter(d => d.isAvailable && d.status === "active")
    : drivers.filter(d => !d.isAvailable || d.status !== "active");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Driver Management
          </h1>
          <p className="text-secondary/70">Monitor and manage driver fleet</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-secondary/5 rounded-lg w-fit">
        {[
          { value: "all", label: "All Drivers" },
          { value: "available", label: "Available" },
          { value: "unavailable", label: "Offline" }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === tab.value
                ? "bg-white text-primary shadow-sm"
                : "text-secondary/70 hover:text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <motion.div
            key={driver.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-secondary">{driver.name}</h3>
                    <Badge
                      variant={driver.isAvailable && driver.status === "active" ? "success" : "default"}
                      icon={driver.isAvailable ? "Circle" : "CircleSlash"}
                    >
                      {driver.isAvailable ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <p className="text-sm text-secondary/70 mb-1">{driver.vehicleType}</p>
                  <p className="text-xs text-secondary/50">{driver.vehiclePlate}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-secondary/10 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary/70">Rating</span>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Star" size={14} className="text-warning fill-warning" />
                    <span className="font-semibold text-secondary">{driver.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary/70">Total Deliveries</span>
                  <span className="font-semibold text-secondary">{driver.totalDeliveries}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary/70">On-Time Rate</span>
                  <span className="font-semibold text-success">{driver.onTimePercentage}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary/70">Active Deliveries</span>
                  <Badge variant="primary">{driver.activeDeliveries.length}</Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-4 border-t border-secondary/10">
                <div>
                  <p className="text-xs text-secondary/50">Today</p>
                  <p className="text-sm font-semibold text-secondary">${driver.earnings.today.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary/50">Week</p>
                  <p className="text-sm font-semibold text-secondary">${driver.earnings.week.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary/50">Month</p>
                  <p className="text-sm font-semibold text-secondary">${driver.earnings.month.toFixed(0)}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ApperIcon name="Phone" size={14} />
                  Call
                </Button>
<Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/driver-management/${driver.Id}`)}
                >
                  <ApperIcon name="Eye" size={14} />
                  Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DriverManagement;