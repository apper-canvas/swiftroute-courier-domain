const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const parcelService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "pickup_address_street_c"}},
          {"field": {"Name": "pickup_address_city_c"}},
          {"field": {"Name": "pickup_address_state_c"}},
          {"field": {"Name": "pickup_address_zip_code_c"}},
          {"field": {"Name": "pickup_address_coordinates_lat_c"}},
          {"field": {"Name": "pickup_address_coordinates_lng_c"}},
          {"field": {"Name": "delivery_address_street_c"}},
          {"field": {"Name": "delivery_address_city_c"}},
          {"field": {"Name": "delivery_address_state_c"}},
          {"field": {"Name": "delivery_address_zip_code_c"}},
          {"field": {"Name": "delivery_address_coordinates_lat_c"}},
          {"field": {"Name": "delivery_address_coordinates_lng_c"}},
          {"field": {"Name": "package_details_weight_c"}},
          {"field": {"Name": "package_details_dimensions_length_c"}},
          {"field": {"Name": "package_details_dimensions_width_c"}},
          {"field": {"Name": "package_details_dimensions_height_c"}},
          {"field": {"Name": "package_details_fragile_c"}},
          {"field": {"Name": "package_details_description_c"}},
          {"field": {"Name": "scheduled_time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "driver_id_c"}},
          {"field": {"Name": "driver_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "estimated_delivery_time_c"}},
          {"field": {"Name": "actual_delivery_time_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "payment_status_c"}},
          {"field": {"Name": "distance_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(p => ({
        Id: p.Id,
        trackingNumber: p.tracking_number_c,
        customerId: p.customer_id_c,
        customerName: p.customer_name_c,
        customerPhone: p.customer_phone_c,
        pickupAddress: {
          street: p.pickup_address_street_c,
          city: p.pickup_address_city_c,
          state: p.pickup_address_state_c,
          zipCode: p.pickup_address_zip_code_c,
          coordinates: {
            lat: p.pickup_address_coordinates_lat_c,
            lng: p.pickup_address_coordinates_lng_c
          }
        },
        deliveryAddress: {
          street: p.delivery_address_street_c,
          city: p.delivery_address_city_c,
          state: p.delivery_address_state_c,
          zipCode: p.delivery_address_zip_code_c,
          coordinates: {
            lat: p.delivery_address_coordinates_lat_c,
            lng: p.delivery_address_coordinates_lng_c
          }
        },
        packageDetails: {
          weight: p.package_details_weight_c,
          dimensions: {
            length: p.package_details_dimensions_length_c,
            width: p.package_details_dimensions_width_c,
            height: p.package_details_dimensions_height_c
          },
          fragile: p.package_details_fragile_c,
          description: p.package_details_description_c
        },
        scheduledTime: p.scheduled_time_c,
        status: p.status_c,
        driverId: p.driver_id_c?.Id,
        driverName: p.driver_name_c,
        createdAt: p.created_at_c,
        estimatedDeliveryTime: p.estimated_delivery_time_c,
        actualDeliveryTime: p.actual_delivery_time_c,
        price: p.price_c,
        paymentStatus: p.payment_status_c,
        distance: p.distance_c
      }));
    } catch (error) {
      console.error("Error fetching parcels:", error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "pickup_address_street_c"}},
          {"field": {"Name": "pickup_address_city_c"}},
          {"field": {"Name": "pickup_address_state_c"}},
          {"field": {"Name": "pickup_address_zip_code_c"}},
          {"field": {"Name": "pickup_address_coordinates_lat_c"}},
          {"field": {"Name": "pickup_address_coordinates_lng_c"}},
          {"field": {"Name": "delivery_address_street_c"}},
          {"field": {"Name": "delivery_address_city_c"}},
          {"field": {"Name": "delivery_address_state_c"}},
          {"field": {"Name": "delivery_address_zip_code_c"}},
          {"field": {"Name": "delivery_address_coordinates_lat_c"}},
          {"field": {"Name": "delivery_address_coordinates_lng_c"}},
          {"field": {"Name": "package_details_weight_c"}},
          {"field": {"Name": "package_details_dimensions_length_c"}},
          {"field": {"Name": "package_details_dimensions_width_c"}},
          {"field": {"Name": "package_details_dimensions_height_c"}},
          {"field": {"Name": "package_details_fragile_c"}},
          {"field": {"Name": "package_details_description_c"}},
          {"field": {"Name": "scheduled_time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "driver_id_c"}},
          {"field": {"Name": "driver_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "estimated_delivery_time_c"}},
          {"field": {"Name": "actual_delivery_time_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "payment_status_c"}},
          {"field": {"Name": "distance_c"}}
        ]
      };

      const response = await apperClient.getRecordById('parcel_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const p = response.data;
      return {
        Id: p.Id,
        trackingNumber: p.tracking_number_c,
        customerId: p.customer_id_c,
        customerName: p.customer_name_c,
        customerPhone: p.customer_phone_c,
        pickupAddress: {
          street: p.pickup_address_street_c,
          city: p.pickup_address_city_c,
          state: p.pickup_address_state_c,
          zipCode: p.pickup_address_zip_code_c,
          coordinates: {
            lat: p.pickup_address_coordinates_lat_c,
            lng: p.pickup_address_coordinates_lng_c
          }
        },
        deliveryAddress: {
          street: p.delivery_address_street_c,
          city: p.delivery_address_city_c,
          state: p.delivery_address_state_c,
          zipCode: p.delivery_address_zip_code_c,
          coordinates: {
            lat: p.delivery_address_coordinates_lat_c,
            lng: p.delivery_address_coordinates_lng_c
          }
        },
        packageDetails: {
          weight: p.package_details_weight_c,
          dimensions: {
            length: p.package_details_dimensions_length_c,
            width: p.package_details_dimensions_width_c,
            height: p.package_details_dimensions_height_c
          },
          fragile: p.package_details_fragile_c,
          description: p.package_details_description_c
        },
        scheduledTime: p.scheduled_time_c,
        status: p.status_c,
        driverId: p.driver_id_c?.Id,
        driverName: p.driver_name_c,
        createdAt: p.created_at_c,
        estimatedDeliveryTime: p.estimated_delivery_time_c,
        actualDeliveryTime: p.actual_delivery_time_c,
        price: p.price_c,
        paymentStatus: p.payment_status_c,
        distance: p.distance_c
      };
    } catch (error) {
      console.error(`Error fetching parcel ${id}:`, error.message);
      throw error;
    }
  },

  async getByTrackingNumber(trackingNumber) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "pickup_address_street_c"}},
          {"field": {"Name": "pickup_address_city_c"}},
          {"field": {"Name": "pickup_address_state_c"}},
          {"field": {"Name": "pickup_address_zip_code_c"}},
          {"field": {"Name": "delivery_address_street_c"}},
          {"field": {"Name": "delivery_address_city_c"}},
          {"field": {"Name": "delivery_address_state_c"}},
          {"field": {"Name": "delivery_address_zip_code_c"}},
          {"field": {"Name": "package_details_weight_c"}},
          {"field": {"Name": "package_details_dimensions_length_c"}},
          {"field": {"Name": "package_details_dimensions_width_c"}},
          {"field": {"Name": "package_details_dimensions_height_c"}},
          {"field": {"Name": "package_details_fragile_c"}},
          {"field": {"Name": "package_details_description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "driver_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "estimated_delivery_time_c"}},
          {"field": {"Name": "actual_delivery_time_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "distance_c"}}
        ],
        where: [
          {"FieldName": "tracking_number_c", "Operator": "EqualTo", "Values": [trackingNumber]}
        ]
      };

      const response = await apperClient.fetchRecords('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("Parcel not found");
      }

      const p = response.data[0];
      return {
        Id: p.Id,
        trackingNumber: p.tracking_number_c,
        customerName: p.customer_name_c,
        customerPhone: p.customer_phone_c,
        pickupAddress: {
          street: p.pickup_address_street_c,
          city: p.pickup_address_city_c,
          state: p.pickup_address_state_c,
          zipCode: p.pickup_address_zip_code_c
        },
        deliveryAddress: {
          street: p.delivery_address_street_c,
          city: p.delivery_address_city_c,
          state: p.delivery_address_state_c,
          zipCode: p.delivery_address_zip_code_c
        },
        packageDetails: {
          weight: p.package_details_weight_c,
          dimensions: {
            length: p.package_details_dimensions_length_c,
            width: p.package_details_dimensions_width_c,
            height: p.package_details_dimensions_height_c
          },
          fragile: p.package_details_fragile_c,
          description: p.package_details_description_c
        },
        status: p.status_c,
        driverName: p.driver_name_c,
        createdAt: p.created_at_c,
        estimatedDeliveryTime: p.estimated_delivery_time_c,
        actualDeliveryTime: p.actual_delivery_time_c,
        price: p.price_c,
        distance: p.distance_c
      };
    } catch (error) {
      console.error(`Error fetching parcel by tracking number ${trackingNumber}:`, error.message);
      throw error;
    }
  },

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}
        ]
      };

      const response = await apperClient.fetchRecords('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching parcels by status ${status}:`, error.message);
      throw error;
    }
  },

  async getActiveDeliveries() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "tracking_number_c"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "pickup_address_street_c"}},
          {"field": {"Name": "pickup_address_city_c"}},
          {"field": {"Name": "pickup_address_state_c"}},
          {"field": {"Name": "pickup_address_zip_code_c"}},
          {"field": {"Name": "delivery_address_street_c"}},
          {"field": {"Name": "delivery_address_city_c"}},
          {"field": {"Name": "delivery_address_state_c"}},
          {"field": {"Name": "delivery_address_zip_code_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "driver_name_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {conditions: [{fieldName: "status_c", operator: "EqualTo", values: ["pending"]}]},
            {conditions: [{fieldName: "status_c", operator: "EqualTo", values: ["assigned"]}]},
            {conditions: [{fieldName: "status_c", operator: "EqualTo", values: ["in-transit"]}]}
          ]
        }]
      };

      const response = await apperClient.fetchRecords('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(p => ({
        Id: p.Id,
        trackingNumber: p.tracking_number_c,
        customerName: p.customer_name_c,
        customerPhone: p.customer_phone_c,
        pickupAddress: {
          street: p.pickup_address_street_c,
          city: p.pickup_address_city_c,
          state: p.pickup_address_state_c,
          zipCode: p.pickup_address_zip_code_c
        },
        deliveryAddress: {
          street: p.delivery_address_street_c,
          city: p.delivery_address_city_c,
          state: p.delivery_address_state_c,
          zipCode: p.delivery_address_zip_code_c
        },
        status: p.status_c,
        driverName: p.driver_name_c,
        createdAt: p.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching active deliveries:", error.message);
      throw error;
    }
  },

  async create(parcelData) {
    try {
      const allParcels = await this.getAll();
      const maxId = Math.max(...allParcels.map(p => p.Id), 0);
      const trackingNumber = `SWR2024${String(maxId + 1).padStart(6, "0")}`;

      const params = {
        records: [{
          tracking_number_c: trackingNumber,
          customer_id_c: parcelData.customerId,
          customer_name_c: parcelData.customerName,
          customer_phone_c: parcelData.customerPhone,
          pickup_address_street_c: parcelData.pickupAddress.street,
          pickup_address_city_c: parcelData.pickupAddress.city,
          pickup_address_state_c: parcelData.pickupAddress.state,
          pickup_address_zip_code_c: parcelData.pickupAddress.zipCode,
          pickup_address_coordinates_lat_c: parcelData.pickupAddress.coordinates.lat,
          pickup_address_coordinates_lng_c: parcelData.pickupAddress.coordinates.lng,
          delivery_address_street_c: parcelData.deliveryAddress.street,
          delivery_address_city_c: parcelData.deliveryAddress.city,
          delivery_address_state_c: parcelData.deliveryAddress.state,
          delivery_address_zip_code_c: parcelData.deliveryAddress.zipCode,
          delivery_address_coordinates_lat_c: parcelData.deliveryAddress.coordinates.lat,
          delivery_address_coordinates_lng_c: parcelData.deliveryAddress.coordinates.lng,
          package_details_weight_c: parcelData.packageDetails.weight,
          package_details_dimensions_length_c: parcelData.packageDetails.dimensions.length,
          package_details_dimensions_width_c: parcelData.packageDetails.dimensions.width,
          package_details_dimensions_height_c: parcelData.packageDetails.dimensions.height,
          package_details_fragile_c: parcelData.packageDetails.fragile,
          package_details_description_c: parcelData.packageDetails.description,
          scheduled_time_c: parcelData.scheduledTime,
          status_c: "pending",
          created_at_c: new Date().toISOString(),
          estimated_delivery_time_c: parcelData.estimatedDeliveryTime,
          price_c: parcelData.price,
          payment_status_c: "pending",
          distance_c: parcelData.distance
        }]
      };

      const response = await apperClient.createRecord('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0].success) {
        return { ...response.results[0].data, trackingNumber };
      }

      throw new Error("Failed to create parcel");
    } catch (error) {
      console.error("Error creating parcel:", error.message);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const updateData = { Id: parseInt(id) };

      if (data.status) updateData.status_c = data.status;
      if (data.driverId) updateData.driver_id_c = parseInt(data.driverId);
      if (data.driverName) updateData.driver_name_c = data.driverName;

      const params = { records: [updateData] };

      const response = await apperClient.updateRecord('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating parcel ${id}:`, error.message);
      throw error;
    }
  },

  async assignDriver(parcelId, driverId, driverName) {
    try {
      const params = {
        records: [{
          Id: parseInt(parcelId),
          driver_id_c: parseInt(driverId),
          driver_name_c: driverName,
          status_c: "assigned"
        }]
      };

      const response = await apperClient.updateRecord('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error assigning driver to parcel ${parcelId}:`, error.message);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const updateData = {
        Id: parseInt(id),
        status_c: status
      };

      if (status === "delivered") {
        updateData.actual_delivery_time_c = new Date().toISOString();
      }

      const params = { records: [updateData] };

      const response = await apperClient.updateRecord('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating parcel status ${id}:`, error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord('parcel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting parcel ${id}:`, error.message);
      throw error;
    }
  }
};

export default parcelService;