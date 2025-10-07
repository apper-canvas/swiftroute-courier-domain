import parcelsData from "@/services/mockData/parcels.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let parcels = [...parcelsData];

const parcelService = {
  async getAll() {
    await delay(300);
    return [...parcels];
  },

  async getById(id) {
    await delay(200);
    const parcel = parcels.find(p => p.Id === parseInt(id));
    if (!parcel) throw new Error("Parcel not found");
    return { ...parcel };
  },

  async getByTrackingNumber(trackingNumber) {
    await delay(200);
    const parcel = parcels.find(p => p.trackingNumber === trackingNumber);
    if (!parcel) throw new Error("Parcel not found");
    return { ...parcel };
  },

  async getByStatus(status) {
    await delay(250);
    return parcels.filter(p => p.status === status).map(p => ({ ...p }));
  },

  async getActiveDeliveries() {
    await delay(300);
    return parcels.filter(p => ["pending", "assigned", "in-transit"].includes(p.status)).map(p => ({ ...p }));
  },

  async create(parcelData) {
    await delay(400);
    const maxId = Math.max(...parcels.map(p => p.Id), 0);
    const trackingNumber = `SWR2024${String(maxId + 1).padStart(6, "0")}`;
    const newParcel = {
      Id: maxId + 1,
      trackingNumber,
      ...parcelData,
      status: "pending",
      driverId: null,
      driverName: null,
      createdAt: new Date().toISOString(),
      actualDeliveryTime: null,
      paymentStatus: "pending"
    };
    parcels.push(newParcel);
    return { ...newParcel };
  },

  async update(id, data) {
    await delay(300);
    const index = parcels.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Parcel not found");
    parcels[index] = { ...parcels[index], ...data };
    return { ...parcels[index] };
  },

  async assignDriver(parcelId, driverId, driverName) {
    await delay(350);
    const index = parcels.findIndex(p => p.Id === parseInt(parcelId));
    if (index === -1) throw new Error("Parcel not found");
    parcels[index] = {
      ...parcels[index],
      driverId: String(driverId),
      driverName,
      status: "assigned"
    };
    return { ...parcels[index] };
  },

  async updateStatus(id, status) {
    await delay(250);
    const index = parcels.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Parcel not found");
    parcels[index] = { ...parcels[index], status };
    if (status === "delivered") {
      parcels[index].actualDeliveryTime = new Date().toISOString();
    }
    return { ...parcels[index] };
  },

  async delete(id) {
    await delay(200);
    const index = parcels.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Parcel not found");
    parcels.splice(index, 1);
    return { success: true };
  }
};

export default parcelService;