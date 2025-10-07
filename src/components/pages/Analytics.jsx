import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Dashboard from "@/components/pages/Dashboard";
import Card from "@/components/atoms/Card";
import analyticsService from "@/services/api/analyticsService";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [volumes, setVolumes] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [delays, setDelays] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [weeklyStats, dailyVolumes, driverPerformance, delayAnalysis, hourlyDist] = await Promise.all([
        analyticsService.getWeeklyStats(),
        analyticsService.getDailyVolumes(),
        analyticsService.getDriverPerformance(),
        analyticsService.getDelayAnalysis(),
        analyticsService.getHourlyDistribution()
      ]);

      setStats(weeklyStats);
      setVolumes(dailyVolumes);
      setPerformance(driverPerformance);
      setDelays(delayAnalysis);
      setHourly(hourlyDist);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

const volumeChartOptions = {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "Inter" },
    colors: ["#2563eb", "#f59e0b"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
    xaxis: { categories: volumes.map(v => v.date?.slice(5) || 'N/A'), labels: { style: { colors: "#475569" } } },
    yaxis: { labels: { style: { colors: "#475569" } } },
    tooltip: { theme: "light" },
    legend: { position: "top" }
  };

  const volumeChartSeries = [
    { name: "Deliveries", data: volumes.map(v => v.deliveries || 0) },
    { name: "Revenue", data: volumes.map(v => Math.round((v.revenue || 0) / 10)) }
  ];

  const delayChartOptions = {
    chart: { type: "pie", fontFamily: "Inter" },
    colors: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"],
    labels: delays.map(d => d.reason),
    legend: { position: "bottom" },
    dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` }
  };

  const delayChartSeries = delays.map(d => d.count);

  const hourlyChartOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Inter" },
    colors: ["#2563eb"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: hourly.map(h => `${h.hour}:00`), labels: { style: { colors: "#475569" } } },
    yaxis: { labels: { style: { colors: "#475569" } } },
    tooltip: { theme: "light" }
  };

  const hourlyChartSeries = [{ name: "Deliveries", data: hourly.map(h => h.deliveries) }];

const onTimePercentage = (stats?.completedDeliveries && stats?.onTimeDeliveries)
    ? ((stats.onTimeDeliveries / stats.completedDeliveries) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-secondary/70">Performance metrics and insights</p>
      </div>

      {/* Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          key="total-deliveries"
          title="Total Deliveries"
          value={stats?.totalDeliveries ?? 0}
          icon="Package"
          gradient="from-primary to-primary/80"
        />
        <StatCard
          key="completed-deliveries"
          title="Completed"
          value={stats?.completedDeliveries ?? 0}
          icon="CheckCircle2"
          gradient="from-success to-success/80"
        />
        <StatCard
          key="on-time-rate"
          title="On-Time Rate"
          value={`${onTimePercentage}%`}
          icon="Clock"
          trend="up"
          trendValue="+2.5%"
          gradient="from-info to-info/80"
        />
        <StatCard
          key="total-revenue"
          title="Total Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon="DollarSign"
          trend="up"
          trendValue="+8%"
          gradient="from-accent to-accent/80"
        />
      </div>

{/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div key="volume-chart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <h3 className="font-semibold text-secondary mb-4">Delivery Volume & Revenue</h3>
            <ReactApexChart
              options={volumeChartOptions}
              series={volumeChartSeries}
              type="area"
              height={300}
            />
          </Card>
        </motion.div>
<motion.div key="delay-chart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h3 className="font-semibold text-secondary mb-4">Delay Analysis</h3>
            <ReactApexChart
              options={delayChartOptions}
              series={delayChartSeries}
              type="pie"
              height={300}
            />
          </Card>
        </motion.div>
      </div>
{/* Hourly Distribution */}
      <motion.div key="hourly-chart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6">
          <h3 className="font-semibold text-secondary mb-4">Hourly Distribution</h3>
          <ReactApexChart
            options={hourlyChartOptions}
            series={hourlyChartSeries}
            type="bar"
            height={300}
          />
        </Card>
      </motion.div>
{/* Driver Performance */}
      <motion.div key="driver-performance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6">
          <h3 className="font-semibold text-secondary mb-4">Driver Performance Rankings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Driver</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-secondary">Deliveries</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-secondary">On-Time</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-secondary">Rating</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-secondary">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((driver, index) => (
                  <motion.tr
                    key={driver.driverId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-secondary/5 hover:bg-secondary/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? "bg-gradient-to-br from-warning to-warning/80" :
                        index === 1 ? "bg-gradient-to-br from-secondary to-secondary/80" :
                        index === 2 ? "bg-gradient-to-br from-accent to-accent/80" :
                        "bg-gradient-to-br from-primary to-primary/80"
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-secondary">{driver.name}</td>
                    <td className="py-3 px-4 text-right text-secondary">{driver.deliveries}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-success">{driver.onTime}%</span>
                    </td>
<td className="py-3 px-4 text-right">
                      <span className="font-semibold text-secondary">{driver.rating}</span>
                    </td>
<td className="py-3 px-4 text-right text-secondary">
                      ${(driver.revenue ?? 0).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;