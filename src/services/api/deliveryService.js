import deliveriesData from "@/services/mockData/deliveries.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deliveries = [...deliveriesData];

const deliveryService = {
  async getAll() {
    await delay(300);
    return [...deliveries];
  },

  async getById(id) {
    await delay(200);
    const delivery = deliveries.find(d => d.Id === parseInt(id));
    if (!delivery) throw new Error("Delivery not found");
    return { ...delivery };
  },

  async getByParcelId(parcelId) {
    await delay(200);
    const delivery = deliveries.find(d => d.parcelId === String(parcelId));
    if (!delivery) throw new Error("Delivery not found");
    return { ...delivery };
  },

  async getByDriverId(driverId) {
    await delay(250);
    return deliveries.filter(d => d.driverId === String(driverId)).map(d => ({ ...d }));
  },

  async create(deliveryData) {
    await delay(400);
    const maxId = Math.max(...deliveries.map(d => d.Id), 0);
    const newDelivery = {
      Id: maxId + 1,
      ...deliveryData,
      pickupTime: null,
      deliveryTime: null,
      routeTaken: [],
      proofOfDelivery: null,
      signature: null,
      photos: [],
      customerRating: null,
      status: "assigned"
    };
    deliveries.push(newDelivery);
    return { ...newDelivery };
  },

  async update(id, data) {
    await delay(300);
    const index = deliveries.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Delivery not found");
    deliveries[index] = { ...deliveries[index], ...data };
    return { ...deliveries[index] };
  },

  async updateStatus(id, status) {
    await delay(250);
    const index = deliveries.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Delivery not found");
    deliveries[index] = { ...deliveries[index], status };
    return { ...deliveries[index] };
  },

  async completeDelivery(id, completionData) {
    await delay(400);
    const index = deliveries.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Delivery not found");
    deliveries[index] = {
      ...deliveries[index],
      deliveryTime: new Date().toISOString(),
      proofOfDelivery: completionData,
      signature: completionData.signature,
      photos: completionData.photos,
      status: "delivered"
    };
    return { ...deliveries[index] };
  },

  async addRoutePoint(id, point) {
    await delay(150);
    const index = deliveries.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Delivery not found");
    const routeTaken = [...deliveries[index].routeTaken, { ...point, timestamp: new Date().toISOString() }];
    deliveries[index] = { ...deliveries[index], routeTaken };
    return { ...deliveries[index] };
  },

  async delete(id) {
    await delay(200);
    const index = deliveries.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Delivery not found");
    deliveries.splice(index, 1);
    return { success: true };
  }
};

export default deliveryService;