const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const analyticsService = {
  async getDailyVolumes(startDate, endDate) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "daily_volumes_date_c"}},
          {"field": {"Name": "daily_volumes_deliveries_c"}},
          {"field": {"Name": "daily_volumes_revenue_c"}}
        ],
        orderBy: [{"fieldName": "daily_volumes_date_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('analytics_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(d => ({
        date: d.daily_volumes_date_c,
        deliveries: d.daily_volumes_deliveries_c,
        revenue: d.daily_volumes_revenue_c
      }));
    } catch (error) {
      console.error("Error fetching daily volumes:", error.message);
      return [];
    }
  },

  async getWeeklyStats() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "weekly_stats_total_deliveries_c"}},
          {"field": {"Name": "weekly_stats_completed_deliveries_c"}},
          {"field": {"Name": "weekly_stats_on_time_deliveries_c"}},
          {"field": {"Name": "weekly_stats_delayed_deliveries_c"}},
          {"field": {"Name": "weekly_stats_failed_deliveries_c"}},
          {"field": {"Name": "weekly_stats_total_revenue_c"}},
          {"field": {"Name": "weekly_stats_average_delivery_time_c"}},
          {"field": {"Name": "weekly_stats_average_revenue_c"}}
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords('analytics_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          totalDeliveries: 0,
          completedDeliveries: 0,
          onTimeDeliveries: 0,
          delayedDeliveries: 0,
          failedDeliveries: 0,
          totalRevenue: 0,
          averageDeliveryTime: 0,
          averageRevenue: 0
        };
      }

      if (!response.data || response.data.length === 0) {
        return {
          totalDeliveries: 0,
          completedDeliveries: 0,
          onTimeDeliveries: 0,
          delayedDeliveries: 0,
          failedDeliveries: 0,
          totalRevenue: 0,
          averageDeliveryTime: 0,
          averageRevenue: 0
        };
      }

      const d = response.data[0];
      return {
        totalDeliveries: d.weekly_stats_total_deliveries_c || 0,
        completedDeliveries: d.weekly_stats_completed_deliveries_c || 0,
        onTimeDeliveries: d.weekly_stats_on_time_deliveries_c || 0,
        delayedDeliveries: d.weekly_stats_delayed_deliveries_c || 0,
        failedDeliveries: d.weekly_stats_failed_deliveries_c || 0,
        totalRevenue: d.weekly_stats_total_revenue_c || 0,
        averageDeliveryTime: d.weekly_stats_average_delivery_time_c || 0,
        averageRevenue: d.weekly_stats_average_revenue_c || 0
      };
    } catch (error) {
      console.error("Error fetching weekly stats:", error.message);
      return {
        totalDeliveries: 0,
        completedDeliveries: 0,
        onTimeDeliveries: 0,
        delayedDeliveries: 0,
        failedDeliveries: 0,
        totalRevenue: 0,
        averageDeliveryTime: 0,
        averageRevenue: 0
      };
    }
  },

  async getDriverPerformance() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "driver_performance_driver_id_c"}},
          {"field": {"Name": "driver_performance_name_c"}},
          {"field": {"Name": "driver_performance_deliveries_c"}},
          {"field": {"Name": "driver_performance_on_time_c"}},
          {"field": {"Name": "driver_performance_rating_c"}},
          {"field": {"Name": "driver_performance_revenue_c"}}
        ],
        orderBy: [{"fieldName": "driver_performance_deliveries_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('analytics_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(d => ({
        driverId: d.driver_performance_driver_id_c?.Id,
        name: d.driver_performance_name_c,
        deliveries: d.driver_performance_deliveries_c,
        onTime: d.driver_performance_on_time_c,
        rating: d.driver_performance_rating_c,
        revenue: d.driver_performance_revenue_c
      }));
    } catch (error) {
      console.error("Error fetching driver performance:", error.message);
      return [];
    }
  },

  async getDelayAnalysis() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "delay_analysis_reason_c"}},
          {"field": {"Name": "delay_analysis_count_c"}},
          {"field": {"Name": "delay_analysis_percentage_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('analytics_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(d => ({
        reason: d.delay_analysis_reason_c,
        count: d.delay_analysis_count_c,
        percentage: d.delay_analysis_percentage_c
      }));
    } catch (error) {
      console.error("Error fetching delay analysis:", error.message);
      return [];
    }
  },

  async getHourlyDistribution() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "hourly_distribution_hour_c"}},
          {"field": {"Name": "hourly_distribution_deliveries_c"}}
        ],
        orderBy: [{"fieldName": "hourly_distribution_hour_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('analytics_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(d => ({
        hour: d.hourly_distribution_hour_c,
        deliveries: d.hourly_distribution_deliveries_c
      }));
    } catch (error) {
      console.error("Error fetching hourly distribution:", error.message);
      return [];
    }
  },

  async getDeliveryHeatmap() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "delivery_heatmap_area_c"}},
          {"field": {"Name": "delivery_heatmap_deliveries_c"}},
          {"field": {"Name": "delivery_heatmap_lat_c"}},
          {"field": {"Name": "delivery_heatmap_lng_c"}}
        ],
        orderBy: [{"fieldName": "delivery_heatmap_deliveries_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('analytics_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(d => ({
        area: d.delivery_heatmap_area_c,
        deliveries: d.delivery_heatmap_deliveries_c,
        lat: d.delivery_heatmap_lat_c,
        lng: d.delivery_heatmap_lng_c
      }));
    } catch (error) {
      console.error("Error fetching delivery heatmap:", error.message);
      return [];
    }
  },

  async getSummary() {
    try {
      const [weeklyStats, driverPerformance, delayAnalysis] = await Promise.all([
        this.getWeeklyStats(),
        this.getDriverPerformance(),
        this.getDelayAnalysis()
      ]);

      return {
        weeklyStats,
        driverPerformance,
        delayAnalysis
      };
    } catch (error) {
      console.error("Error fetching analytics summary:", error.message);
      return {
        weeklyStats: {},
        driverPerformance: [],
        delayAnalysis: []
      };
    }
  }
};

export default analyticsService;