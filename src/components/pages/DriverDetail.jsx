import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import driverService from "@/services/api/driverService";
import parcelService from "@/services/api/parcelService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DriverDetail = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [driverData, allParcels] = await Promise.all([
        driverService.getById(driverId),
        parcelService.getAll()
      ]);

      setDriver(driverData);
      const driverParcels = allParcels.filter(p => p.driverId === driverId);
      setParcels(driverParcels);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load driver details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [driverId]);

  const toggleAvailability = async () => {
    try {
      await driverService.updateAvailability(driverId, !driver.isAvailable);
      setDriver(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
      toast.success(driver.isAvailable ? "Driver is now offline" : "Driver is now online");
    } catch (err) {
      toast.error("Failed to update availability");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!driver) return <Error message="Driver not found" />;

  const activeParcels = parcels.filter(p => ["assigned", "in-transit"].includes(p.status));
  const completedParcels = parcels.filter(p => p.status === "delivered");

  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate("/driver-management")}
        className="mb-4"
      >
        <ApperIcon name="ArrowLeft" size={16} />
        Back to Drivers
      </Button>

      {/* Driver Profile Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {driver.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary">{driver.name}</h1>
              <p className="text-secondary/70 text-lg">{driver.vehicleType} - {driver.vehiclePlate}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Star" size={18} className="text-warning fill-warning" />
                  <span className="font-semibold text-secondary text-lg">{driver.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Package" size={18} className="text-primary" />
                  <span className="text-secondary/70">{driver.totalDeliveries} total deliveries</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Mail" size={18} className="text-info" />
                  <span className="text-secondary/70">{driver.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Phone" size={18} className="text-success" />
                  <span className="text-secondary/70">{driver.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant={driver.isAvailable ? "primary" : "secondary"}
            onClick={toggleAvailability}
            className="min-w-[160px]"
          >
            <div className={`w-2 h-2 rounded-full ${driver.isAvailable ? "bg-white" : "bg-success"} mr-2`} />
            {driver.isAvailable ? "Online" : "Offline"}
          </Button>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Deliveries"
          value={activeParcels.length}
          icon="Package"
          gradient="from-primary to-primary/80"
        />
        <StatCard
          title="Total Deliveries"
          value={driver.totalDeliveries}
          icon="TrendingUp"
          gradient="from-success to-success/80"
        />
        <StatCard
          title="Monthly Earnings"
          value={`$${driver.earnings.month.toFixed(2)}`}
          icon="DollarSign"
          gradient="from-accent to-accent/80"
        />
        <StatCard
          title="On-Time Rate"
          value={`${driver.onTimePercentage}%`}
          icon="Clock"
          gradient="from-info to-info/80"
        />
      </div>

      {/* Earnings Breakdown */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-secondary mb-6">Earnings Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
              <p className="text-sm text-secondary/70">Today</p>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${driver.earnings.today.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-success/5 to-info/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ApperIcon name="CalendarDays" size={20} className="text-success" />
              <p className="text-sm text-secondary/70">This Week</p>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-success to-info bg-clip-text text-transparent">
              ${driver.earnings.week.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-accent/5 to-warning/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ApperIcon name="CalendarCheck" size={20} className="text-accent" />
              <p className="text-sm text-secondary/70">This Month</p>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
              ${driver.earnings.month.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-secondary mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg border border-warning/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <ApperIcon name="Star" size={24} className="text-warning" />
              </div>
              <div>
                <p className="text-sm text-secondary/70">Average Rating</p>
                <p className="text-3xl font-bold text-secondary">{driver.rating}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-warning to-warning/80"
                  style={{ width: `${(driver.rating / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm text-secondary/70">out of 5.0</span>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <ApperIcon name="CheckCircle2" size={24} className="text-success" />
              </div>
              <div>
                <p className="text-sm text-secondary/70">On-Time Delivery</p>
                <p className="text-3xl font-bold text-secondary">{driver.onTimePercentage}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success to-success/80"
                  style={{ width: `${driver.onTimePercentage}%` }}
                />
              </div>
              <span className="text-sm text-secondary/70">completion rate</span>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-info/10 to-info/5 rounded-lg border border-info/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-info/20 flex items-center justify-center">
                <ApperIcon name="Package" size={24} className="text-info" />
              </div>
              <div>
                <p className="text-sm text-secondary/70">Total Deliveries</p>
                <p className="text-3xl font-bold text-secondary">{driver.totalDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-secondary/70">Completed Deliveries</p>
                <p className="text-3xl font-bold text-secondary">{completedParcels.length}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Vehicle Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-secondary mb-6">Vehicle Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ApperIcon name="Truck" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-secondary/70">Vehicle Type</p>
              <p className="font-semibold text-secondary">{driver.vehicleType}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <ApperIcon name="Hash" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-secondary/70">License Plate</p>
              <p className="font-semibold text-secondary font-mono">{driver.vehiclePlate}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <ApperIcon name="Box" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-secondary/70">Capacity</p>
              <p className="font-semibold text-secondary">{driver.capacity} packages</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Status */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-secondary mb-6">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${driver.isAvailable ? "bg-success" : "bg-error"} animate-pulse`} />
              <p className="font-semibold text-secondary">
                {driver.isAvailable ? "Available" : "Unavailable"}
              </p>
            </div>
            <p className="text-sm text-secondary/70">
              Driver is currently {driver.isAvailable ? "accepting" : "not accepting"} new delivery assignments
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <ApperIcon name="Activity" size={20} className="text-accent" />
              <p className="font-semibold text-secondary capitalize">{driver.status}</p>
            </div>
            <p className="text-sm text-secondary/70">
              Current activity status: {driver.status === "active" ? "Making deliveries" : "Idle"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DriverDetail;