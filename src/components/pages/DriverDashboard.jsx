import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import parcelService from "@/services/api/parcelService";
import driverService from "@/services/api/driverService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatCard from "@/components/molecules/StatCard";
import DeliveryCard from "@/components/organisms/DeliveryCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [payoutSummary, setPayoutSummary] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const driverId = "1"; // Simulating logged-in driver

const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [driverData, allParcels, completedData, payoutData] = await Promise.all([
        driverService.getById(driverId),
        parcelService.getAll(),
        driverService.getCompletedDeliveries(driverId, getDateRange()),
        driverService.getPayoutSummary(driverId)
      ]);

      setDriver(driverData);
      const assignedParcels = allParcels.filter(p => p.driverId === driverId);
      setParcels(assignedParcels);
      setCompletedDeliveries(completedData);
      setPayoutSummary(payoutData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load driver dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate = null;
    
    if (dateFilter === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (dateFilter === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (dateFilter === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    return { startDate, endDate: new Date() };
  };

  useEffect(() => {
    loadData();
  }, [dateFilter]);
  const toggleAvailability = async () => {
    try {
      await driverService.updateAvailability(driverId, !driver.isAvailable);
      setDriver(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
      toast.success(driver.isAvailable ? "You are now offline" : "You are now online");
    } catch (err) {
      toast.error("Failed to update availability");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!driver) return <Error message="Driver not found" />;

const activeParcels = parcels.filter(p => ["assigned", "in-transit"].includes(p.status));
  const completedToday = completedDeliveries.filter(d => {
    const deliveryDate = new Date(d.deliveredAt);
    const today = new Date();
    return deliveryDate.toDateString() === today.toDateString();
  }).length;
  const totalEarningsFromCompleted = completedDeliveries.reduce((sum, d) => sum + d.earnings, 0);
  return (
    <div className="p-6 space-y-6">
      {/* Driver Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">
                {driver.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary">{driver.name}</h2>
              <p className="text-secondary/70">{driver.vehicleType} - {driver.vehiclePlate}</p>
              <div className="flex items-center gap-2 mt-1">
                <ApperIcon name="Star" size={16} className="text-warning fill-warning" />
                <span className="font-semibold text-secondary">{driver.rating}</span>
                <span className="text-secondary/70">• {driver.totalDeliveries} deliveries</span>
              </div>
            </div>
          </div>
          <Button
            variant={driver.isAvailable ? "primary" : "secondary"}
            onClick={toggleAvailability}
            className="min-w-[140px]"
          >
            <div className={`w-2 h-2 rounded-full ${driver.isAvailable ? "bg-white" : "bg-success"} mr-2`} />
            {driver.isAvailable ? "Online" : "Go Online"}
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Deliveries"
          value={activeParcels.length}
          icon="Package"
          gradient="from-primary to-primary/80"
        />
        <StatCard
          title="Completed Today"
          value={completedToday}
          icon="CheckCircle2"
          gradient="from-success to-success/80"
        />
        <StatCard
          title="Today's Earnings"
          value={`$${driver.earnings.today.toFixed(2)}`}
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

      {/* Assigned Deliveries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-secondary">Assigned Deliveries</h2>
          {activeParcels.length > 0 && (
            <Button variant="primary" size="sm">
              <ApperIcon name="Navigation" size={16} />
              Optimize Route
            </Button>
          )}
        </div>

        {activeParcels.length === 0 ? (
          <Empty
            title="No Active Deliveries"
            description="You don't have any assigned deliveries at the moment."
            icon="Package"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeParcels.map((parcel) => (
              <DeliveryCard
                key={parcel.Id}
                parcel={parcel}
                onTrack={(p) => navigate(`/track/${p.trackingNumber}`)}
                onViewDetails={(p) => {
                  if (p.status === "in-transit") {
                    navigate(`/delivery-confirmation/${p.Id}`);
                  } else {
                    navigate(`/track/${p.trackingNumber}`);
                  }
                }}
              />
            ))}
          </div>
        )}
</div>

      {/* Earnings Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-secondary mb-4">Earnings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
            <p className="text-sm text-secondary/70 mb-2">Today</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${driver.earnings.today.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-success/5 to-info/5 rounded-lg">
            <p className="text-sm text-secondary/70 mb-2">This Week</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-success to-info bg-clip-text text-transparent">
              ${driver.earnings.week.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-accent/5 to-warning/5 rounded-lg">
            <p className="text-sm text-secondary/70 mb-2">This Month</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
              ${driver.earnings.month.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Payout Summary */}
      {payoutSummary && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary">Payout Summary</h3>
            <Button variant="primary" size="sm">
              <ApperIcon name="Download" size={16} />
              Download Statement
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Calendar" size={20} className="text-success" />
                <p className="text-sm text-secondary/70">Next Payout</p>
              </div>
              <p className="text-2xl font-bold text-secondary">
                {new Date(payoutSummary.nextPayoutDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Clock" size={20} className="text-warning" />
                <p className="text-sm text-secondary/70">Pending Amount</p>
              </div>
              <p className="text-2xl font-bold text-secondary">
                ${payoutSummary.pendingAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-info/10 to-info/5 rounded-lg border border-info/20">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="TrendingUp" size={20} className="text-info" />
                <p className="text-sm text-secondary/70">Total Paid Out</p>
              </div>
              <p className="text-2xl font-bold text-secondary">
                ${payoutSummary.totalPaidOut.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Completed Deliveries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-secondary">Completed Deliveries</h2>
          <div className="flex items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-secondary/20 bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {completedDeliveries.length === 0 ? (
          <Empty
            title="No Completed Deliveries"
            description="You haven't completed any deliveries in this time period."
            icon="PackageCheck"
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Tracking #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Delivered At</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Distance</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-secondary">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {completedDeliveries.map((delivery) => (
                    <tr key={delivery.Id} className="hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-primary font-semibold">
                          {delivery.trackingNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-secondary">{delivery.recipientName}</p>
                          <p className="text-sm text-secondary/70">{delivery.recipientPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-secondary">
                            {new Date(delivery.deliveredAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-secondary/70">
                            {new Date(delivery.deliveredAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-secondary">{delivery.distance} km</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-success">
                          ${delivery.earnings.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-secondary/5">
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-right font-semibold text-secondary">
                      Total Earnings:
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xl font-bold text-success">
                        ${totalEarningsFromCompleted.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;