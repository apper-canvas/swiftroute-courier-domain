const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const deliveryService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "parcel_id_c"}},
          {"field": {"Name": "driver_id_c"}},
          {"field": {"Name": "pickup_time_c"}},
          {"field": {"Name": "delivery_time_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "signature_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "customer_rating_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(d => ({
        Id: d.Id,
        trackingNumber: d.tracking_number_c,
        parcelId: d.parcel_id_c?.Id,
        driverId: d.driver_id_c?.Id,
        pickupTime: d.pickup_time_c,
        deliveryTime: d.delivery_time_c,
        distance: d.distance_c,
        signature: d.signature_c,
        photos: d.photos_c ? JSON.parse(d.photos_c) : [],
        customerRating: d.customer_rating_c,
        notes: d.notes_c,
        status: d.status_c,
        proofOfDelivery: d.signature_c ? {
          signature: d.signature_c,
          photos: d.photos_c ? JSON.parse(d.photos_c) : [],
          completedBy: d.driver_id_c?.Name,
          completedAt: d.delivery_time_c
        } : null,
        routeTaken: []
      }));
    } catch (error) {
      console.error("Error fetching deliveries:", error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "parcel_id_c"}},
          {"field": {"Name": "driver_id_c"}},
          {"field": {"Name": "pickup_time_c"}},
          {"field": {"Name": "delivery_time_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "signature_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "customer_rating_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.getRecordById('delivery_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const d = response.data;
      return {
        Id: d.Id,
        trackingNumber: d.tracking_number_c,
        parcelId: d.parcel_id_c?.Id,
        driverId: d.driver_id_c?.Id,
        pickupTime: d.pickup_time_c,
        deliveryTime: d.delivery_time_c,
        distance: d.distance_c,
        signature: d.signature_c,
        photos: d.photos_c ? JSON.parse(d.photos_c) : [],
        customerRating: d.customer_rating_c,
        notes: d.notes_c,
        status: d.status_c,
        proofOfDelivery: d.signature_c ? {
          signature: d.signature_c,
          photos: d.photos_c ? JSON.parse(d.photos_c) : [],
          completedBy: d.driver_id_c?.Name,
          completedAt: d.delivery_time_c
        } : null,
        routeTaken: []
      };
    } catch (error) {
      console.error(`Error fetching delivery ${id}:`, error.message);
      throw error;
    }
  },

  async getByParcelId(parcelId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "parcel_id_c"}},
          {"field": {"Name": "driver_id_c"}},
          {"field": {"Name": "pickup_time_c"}},
          {"field": {"Name": "delivery_time_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "parcel_id_c", "Operator": "EqualTo", "Values": [parseInt(parcelId)]}
        ]
      };

      const response = await apperClient.fetchRecords('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("Delivery not found");
      }

      const d = response.data[0];
      return {
        Id: d.Id,
        trackingNumber: d.tracking_number_c,
        parcelId: d.parcel_id_c?.Id,
        driverId: d.driver_id_c?.Id,
        pickupTime: d.pickup_time_c,
        deliveryTime: d.delivery_time_c,
        distance: d.distance_c,
        status: d.status_c,
        routeTaken: []
      };
    } catch (error) {
      console.error(`Error fetching delivery for parcel ${parcelId}:`, error.message);
      throw error;
    }
  },

  async getByDriverId(driverId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "driver_id_c", "Operator": "EqualTo", "Values": [parseInt(driverId)]}
        ]
      };

      const response = await apperClient.fetchRecords('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching deliveries for driver ${driverId}:`, error.message);
      throw error;
    }
  },

  async create(deliveryData) {
    try {
      const params = {
        records: [{
          tracking_number_c: deliveryData.trackingNumber,
          parcel_id_c: parseInt(deliveryData.parcelId),
          driver_id_c: parseInt(deliveryData.driverId),
          distance_c: deliveryData.distance,
          status_c: "assigned"
        }]
      };

      const response = await apperClient.createRecord('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0].success) {
        return response.results[0].data;
      }

      throw new Error("Failed to create delivery");
    } catch (error) {
      console.error("Error creating delivery:", error.message);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const updateData = { Id: parseInt(id) };

      if (data.status) updateData.status_c = data.status;
      if (data.pickupTime) updateData.pickup_time_c = data.pickupTime;
      if (data.deliveryTime) updateData.delivery_time_c = data.deliveryTime;
      if (data.customerRating) updateData.customer_rating_c = data.customerRating;
      if (data.notes) updateData.notes_c = data.notes;

      const params = { records: [updateData] };

      const response = await apperClient.updateRecord('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating delivery ${id}:`, error.message);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating delivery status ${id}:`, error.message);
      throw error;
    }
  },

  async completeDelivery(id, completionData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          delivery_time_c: new Date().toISOString(),
          signature_c: completionData.signature,
          photos_c: JSON.stringify(completionData.photos),
          notes_c: completionData.notes,
          status_c: "delivered"
        }]
      };

      const response = await apperClient.updateRecord('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error completing delivery ${id}:`, error.message);
      throw error;
    }
  },

  async addRoutePoint(id, point) {
    return { success: true };
  },

  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting delivery ${id}:`, error.message);
      throw error;
    }
  },

  async getCompletedDeliveries() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "delivery_time_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "customer_rating_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "parcel_id_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {conditions: [{fieldName: "status_c", operator: "EqualTo", values: ["delivered"]}]},
            {conditions: [{fieldName: "status_c", operator: "EqualTo", values: ["cancelled"]}]}
          ]
        }]
      };

      const response = await apperClient.fetchRecords('delivery_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(d => ({
        Id: d.Id,
        trackingNumber: d.tracking_number_c,
        deliveryTime: d.delivery_time_c,
        distance: d.distance_c,
        customerRating: d.customer_rating_c,
        notes: d.notes_c,
        status: d.status_c,
        parcelId: d.parcel_id_c?.Id,
        proofOfDelivery: d.signature_c ? { completedBy: "Driver" } : null
      }));
    } catch (error) {
      console.error("Error fetching completed deliveries:", error.message);
      throw error;
    }
  }
};

export default deliveryService;