import driversData from "@/services/mockData/drivers.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let drivers = [...driversData];

const driverService = {
  async getAll() {
    await delay(300);
    return [...drivers];
  },

  async getById(id) {
    await delay(200);
    const driver = drivers.find(d => d.Id === parseInt(id));
    if (!driver) throw new Error("Driver not found");
    return { ...driver };
  },

  async getAvailable() {
    await delay(250);
    return drivers.filter(d => d.isAvailable && d.status === "active").map(d => ({ ...d }));
  },

  async create(driverData) {
    await delay(400);
    const maxId = Math.max(...drivers.map(d => d.Id), 0);
    const newDriver = {
      Id: maxId + 1,
      ...driverData,
      isAvailable: true,
      status: "active",
      rating: 0,
      activeDeliveries: [],
      totalDeliveries: 0,
      onTimePercentage: 0,
      earnings: { today: 0, week: 0, month: 0 },
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(driverData.name)}&background=2563eb&color=fff`
    };
    drivers.push(newDriver);
    return { ...newDriver };
  },

  async update(id, data) {
    await delay(300);
    const index = drivers.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Driver not found");
    drivers[index] = { ...drivers[index], ...data };
    return { ...drivers[index] };
  },

  async updateLocation(id, location) {
    await delay(150);
    const index = drivers.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Driver not found");
    drivers[index] = { ...drivers[index], currentLocation: location };
    return { ...drivers[index] };
  },

  async updateAvailability(id, isAvailable) {
    await delay(200);
    const index = drivers.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Driver not found");
    drivers[index] = { ...drivers[index], isAvailable };
    return { ...drivers[index] };
  },

  async addActiveDelivery(driverId, parcelId) {
    await delay(200);
    const index = drivers.findIndex(d => d.Id === parseInt(driverId));
    if (index === -1) throw new Error("Driver not found");
    const activeDeliveries = [...drivers[index].activeDeliveries, parseInt(parcelId)];
    drivers[index] = { ...drivers[index], activeDeliveries };
    return { ...drivers[index] };
  },

  async removeActiveDelivery(driverId, parcelId) {
    await delay(200);
    const index = drivers.findIndex(d => d.Id === parseInt(driverId));
    if (index === -1) throw new Error("Driver not found");
    const activeDeliveries = drivers[index].activeDeliveries.filter(id => id !== parseInt(parcelId));
    drivers[index] = { ...drivers[index], activeDeliveries };
    return { ...drivers[index] };
  },

async delete(id) {
    await delay(200);
    const index = drivers.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Driver not found");
    drivers.splice(index, 1);
    return { success: true };
  },

  async getCompletedDeliveries(driverId, dateRange = {}) {
    await delay(300);
    const { startDate, endDate } = dateRange;
    
    // Mock completed deliveries data with earnings calculation
    const completedDeliveries = [
      {
        Id: 101,
        trackingNumber: "SR2024-001",
        recipientName: "Sarah Johnson",
        recipientPhone: "+1 (555) 123-4567",
        deliveredAt: new Date().toISOString(),
        distance: 5.2,
        earnings: 12.50
      },
      {
        Id: 102,
        trackingNumber: "SR2024-002",
        recipientName: "Michael Brown",
        recipientPhone: "+1 (555) 234-5678",
        deliveredAt: new Date(Date.now() - 86400000).toISOString(),
        distance: 8.7,
        earnings: 18.75
      },
      {
        Id: 103,
        trackingNumber: "SR2024-003",
        recipientName: "Emma Davis",
        recipientPhone: "+1 (555) 345-6789",
        deliveredAt: new Date(Date.now() - 172800000).toISOString(),
        distance: 3.5,
        earnings: 9.50
      },
      {
        Id: 104,
        trackingNumber: "SR2024-004",
        recipientName: "James Wilson",
        recipientPhone: "+1 (555) 456-7890",
        deliveredAt: new Date(Date.now() - 259200000).toISOString(),
        distance: 12.3,
        earnings: 25.00
      },
      {
        Id: 105,
        trackingNumber: "SR2024-005",
        recipientName: "Olivia Martinez",
        recipientPhone: "+1 (555) 567-8901",
        deliveredAt: new Date(Date.now() - 345600000).toISOString(),
        distance: 6.8,
        earnings: 15.25
      },
      {
        Id: 106,
        trackingNumber: "SR2024-006",
        recipientName: "Daniel Taylor",
        recipientPhone: "+1 (555) 678-9012",
        deliveredAt: new Date(Date.now() - 432000000).toISOString(),
        distance: 4.1,
        earnings: 11.00
      },
      {
        Id: 107,
        trackingNumber: "SR2024-007",
        recipientName: "Sophia Anderson",
        recipientPhone: "+1 (555) 789-0123",
        deliveredAt: new Date(Date.now() - 518400000).toISOString(),
        distance: 9.6,
        earnings: 20.50
      },
      {
        Id: 108,
        trackingNumber: "SR2024-008",
        recipientName: "William Thomas",
        recipientPhone: "+1 (555) 890-1234",
        deliveredAt: new Date(Date.now() - 604800000).toISOString(),
        distance: 7.3,
        earnings: 16.75
      }
    ];

    let filtered = completedDeliveries.filter(d => d);

    if (startDate) {
      filtered = filtered.filter(d => new Date(d.deliveredAt) >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(d => new Date(d.deliveredAt) <= endDate);
    }

    return filtered.map(d => ({ ...d }));
  },

  async getPayoutSummary(driverId) {
    await delay(250);
    const driver = drivers.find(d => d.Id === parseInt(driverId));
    if (!driver) throw new Error("Driver not found");

    // Calculate next payout date (every Friday)
    const today = new Date();
    const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
    const nextPayoutDate = new Date(today);
    nextPayoutDate.setDate(today.getDate() + daysUntilFriday);

    return {
      nextPayoutDate: nextPayoutDate.toISOString(),
      pendingAmount: driver.earnings.week * 0.85, // 85% of weekly earnings pending
      totalPaidOut: driver.earnings.month * 2.5, // Mock historical payout data
      payoutMethod: "Bank Transfer",
      bankAccount: "****1234"
    };
  }
};

export default driverService;