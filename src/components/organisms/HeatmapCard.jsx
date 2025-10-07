import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const HeatmapCard = ({ data = [] }) => {
  const [hoveredArea, setHoveredArea] = useState(null);

  // Sort data by delivery count to get min/max
  const sortedData = [...data].sort((a, b) => a.deliveries - b.deliveries);
  const minDeliveries = sortedData[0]?.deliveries || 0;
  const maxDeliveries = sortedData[sortedData.length - 1]?.deliveries || 100;

  // Calculate intensity color based on delivery count
  const getIntensityColor = (deliveries) => {
    if (deliveries === 0) return "bg-gray-100";
    
    const normalized = (deliveries - minDeliveries) / (maxDeliveries - minDeliveries);
    
    if (normalized < 0.2) return "bg-yellow-100";
    if (normalized < 0.4) return "bg-orange-200";
    if (normalized < 0.6) return "bg-orange-300";
    if (normalized < 0.8) return "bg-red-400";
    return "bg-red-600";
  };

  // Get text color based on background intensity
  const getTextColor = (deliveries) => {
    const normalized = (deliveries - minDeliveries) / (maxDeliveries - minDeliveries);
    return normalized >= 0.6 ? "text-white" : "text-secondary";
  };

  // Group areas into rows for grid layout (4 per row)
  const rows = [];
  for (let i = 0; i < data.length; i += 4) {
    rows.push(data.slice(i, i + 4));
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ApperIcon name="Map" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary">Delivery Heatmap</h2>
              <p className="text-sm text-secondary/60">High-demand delivery areas</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-secondary/70">Demand:</span>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-yellow-100 border border-secondary/10"></div>
              <span className="text-secondary/60">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-orange-300 border border-secondary/10"></div>
              <span className="text-secondary/60">Med</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-red-600 border border-secondary/10"></div>
              <span className="text-secondary/60">High</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
{row.map((area, cellIndex) => (
                <motion.div
                  key={`${rowIndex}-${area.area}-${cellIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: rowIndex * 0.1 }}
                  className="relative"
                  onMouseEnter={() => setHoveredArea(area)}
                  onMouseLeave={() => setHoveredArea(null)}
                >
                  <div
                    className={`
                      ${getIntensityColor(area.deliveries)}
                      ${getTextColor(area.deliveries)}
                      p-4 rounded-lg border border-secondary/10
                      transition-all duration-200 cursor-pointer
                      hover:shadow-lg hover:scale-105
                    `}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">
                          {area.area}
                        </span>
                        <ApperIcon 
                          name="MapPin" 
                          size={14}
                          className={getTextColor(area.deliveries)}
                        />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{area.deliveries}</span>
                        <span className="text-xs opacity-70">deliveries</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Tooltip */}
                  {hoveredArea?.area === area.area && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl p-3 border border-secondary/10 z-10"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-secondary">{area.area}</span>
                          <span className="text-xs text-secondary/60">
                            {Math.round((area.deliveries / maxDeliveries) * 100)}% of max
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-secondary/70">
                          <ApperIcon name="Package" size={12} />
                          <span>{area.deliveries} total deliveries</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-secondary/70">
                          <ApperIcon name="MapPin" size={12} />
                          <span>
                            {area.lat.toFixed(4)}, {area.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={16} className="text-primary" />
              <div>
                <p className="text-xs text-secondary/60">Highest Demand</p>
                <p className="text-sm font-bold text-secondary">
                  {sortedData[sortedData.length - 1]?.area || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Package" size={16} className="text-accent" />
              <div>
                <p className="text-xs text-secondary/60">Total Areas</p>
                <p className="text-sm font-bold text-secondary">{data.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="BarChart3" size={16} className="text-success" />
              <div>
                <p className="text-xs text-secondary/60">Avg Deliveries</p>
                <p className="text-sm font-bold text-secondary">
                  {Math.round(data.reduce((sum, area) => sum + area.deliveries, 0) / data.length)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeatmapCard;