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
  }
};

export default driverService;