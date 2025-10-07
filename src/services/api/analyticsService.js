import analyticsData from "@/services/mockData/analytics.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const analyticsService = {
  async getDailyVolumes(startDate, endDate) {
    await delay(300);
    return [...analyticsData.dailyVolumes];
  },

  async getWeeklyStats() {
    await delay(250);
    return { ...analyticsData.weeklyStats };
  },

  async getDriverPerformance() {
    await delay(300);
    return [...analyticsData.driverPerformance];
  },

  async getDelayAnalysis() {
    await delay(250);
    return [...analyticsData.delayAnalysis];
  },

  async getHourlyDistribution() {
    await delay(200);
    return [...analyticsData.hourlyDistribution];
  },

  async getDeliveryHeatmap() {
    await delay(300);
    return [...analyticsData.deliveryHeatmap];
  },

  async getSummary() {
    await delay(350);
    return {
      weeklyStats: { ...analyticsData.weeklyStats },
      driverPerformance: [...analyticsData.driverPerformance],
      delayAnalysis: [...analyticsData.delayAnalysis]
    };
  }
};
export default analyticsService;