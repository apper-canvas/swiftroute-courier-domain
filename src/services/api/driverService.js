const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const driverService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "vehicle_type_c"}},
          {"field": {"Name": "vehicle_plate_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "current_location_lat_c"}},
          {"field": {"Name": "current_location_lng_c"}},
          {"field": {"Name": "is_available_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "total_deliveries_c"}},
          {"field": {"Name": "on_time_percentage_c"}},
          {"field": {"Name": "earnings_today_c"}},
          {"field": {"Name": "earnings_week_c"}},
          {"field": {"Name": "earnings_month_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('driver_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(d => ({
        Id: d.Id,
        name: d.name_c,
        phone: d.phone_c,
        email: d.email_c,
        vehicleType: d.vehicle_type_c,
        vehiclePlate: d.vehicle_plate_c,
        capacity: d.capacity_c,
        currentLocation: {
          lat: d.current_location_lat_c,
          lng: d.current_location_lng_c
        },
        isAvailable: d.is_available_c,
        status: d.status_c,
        rating: d.rating_c,
        totalDeliveries: d.total_deliveries_c,
        onTimePercentage: d.on_time_percentage_c,
        earnings: {
          today: d.earnings_today_c,
          week: d.earnings_week_c,
          month: d.earnings_month_c
        },
        avatar: d.avatar_c,
        activeDeliveries: []
      }));
    } catch (error) {
      console.error("Error fetching drivers:", error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "vehicle_type_c"}},
          {"field": {"Name": "vehicle_plate_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "current_location_lat_c"}},
          {"field": {"Name": "current_location_lng_c"}},
          {"field": {"Name": "is_available_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "total_deliveries_c"}},
          {"field": {"Name": "on_time_percentage_c"}},
          {"field": {"Name": "earnings_today_c"}},
          {"field": {"Name": "earnings_week_c"}},
          {"field": {"Name": "earnings_month_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };

      const response = await apperClient.getRecordById('driver_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const d = response.data;
      return {
        Id: d.Id,
        name: d.name_c,
        phone: d.phone_c,
        email: d.email_c,
        vehicleType: d.vehicle_type_c,
        vehiclePlate: d.vehicle_plate_c,
        capacity: d.capacity_c,
        currentLocation: {
          lat: d.current_location_lat_c,
          lng: d.current_location_lng_c
        },
        isAvailable: d.is_available_c,
        status: d.status_c,
        rating: d.rating_c,
        totalDeliveries: d.total_deliveries_c,
        onTimePercentage: d.on_time_percentage_c,
        earnings: {
          today: d.earnings_today_c,
          week: d.earnings_week_c,
          month: d.earnings_month_c
        },
        avatar: d.avatar_c,
        activeDeliveries: []
      };
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error.message);
      throw error;
    }
  },

  async getAvailable() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "is_available_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "is_available_c", "Operator": "EqualTo", "Values": [true]},
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["active"]}
        ]
      };

      const response = await apperClient.fetchRecords('driver_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching available drivers:", error.message);
      throw error;
    }
  },

  async create(driverData) {
    try {
      const params = {
        records: [{
          name_c: driverData.name,
          phone_c: driverData.phone,
          email_c: driverData.email,
          vehicle_type_c: driverData.vehicleType,
          vehicle_plate_c: driverData.vehiclePlate,
          capacity_c: driverData.capacity,
          is_available_c: true,
          status_c: "active",
          rating_c: 0,
          total_deliveries_c: 0,
          on_time_percentage_c: 0,
          earnings_today_c: 0,
          earnings_week_c: 0,
          earnings_month_c: 0,
          avatar_c: `https://ui-avatars.com/api/?name=${encodeURIComponent(driverData.name)}&background=2563eb&color=fff`
        }]
      };

      const response = await apperClient.createRecord('driver_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0].success) {
        return response.results[0].data;
      }

      throw new Error("Failed to create driver");
    } catch (error) {
      console.error("Error creating driver:", error.message);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (data.name) updateData.name_c = data.name;
      if (data.phone) updateData.phone_c = data.phone;
      if (data.email) updateData.email_c = data.email;
      if (data.vehicleType) updateData.vehicle_type_c = data.vehicleType;
      if (data.vehiclePlate) updateData.vehicle_plate_c = data.vehiclePlate;
      if (data.capacity) updateData.capacity_c = data.capacity;
      if (data.isAvailable !== undefined) updateData.is_available_c = data.isAvailable;
      if (data.status) updateData.status_c = data.status;
      if (data.rating) updateData.rating_c = data.rating;

      const params = { records: [updateData] };

      const response = await apperClient.updateRecord('driver_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0].success) {
        return response.results[0].data;
      }

      throw new Error("Failed to update driver");
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error.message);
      throw error;
    }
  },

  async updateLocation(id, location) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          current_location_lat_c: location.lat,
          current_location_lng_c: location.lng
        }]
      };

      const response = await apperClient.updateRecord('driver_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating driver location ${id}:`, error.message);
      throw error;
    }
  },

  async updateAvailability(id, isAvailable) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          is_available_c: isAvailable
        }]
      };

      const response = await apperClient.updateRecord('driver_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results[0].data;
    } catch (error) {
      console.error(`Error updating driver availability ${id}:`, error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord('driver_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error.message);
      throw error;
    }
  },

  async getCompletedDeliveries(driverId, dateRange = {}) {
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
      }
    ];

    let filtered = completedDeliveries;
    if (dateRange.startDate) {
      filtered = filtered.filter(d => new Date(d.deliveredAt) >= dateRange.startDate);
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(d => new Date(d.deliveredAt) <= dateRange.endDate);
    }

    return filtered;
  },

  async getPayoutSummary(driverId) {
    try {
      const driver = await this.getById(driverId);
      
      const today = new Date();
      const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
      const nextPayoutDate = new Date(today);
      nextPayoutDate.setDate(today.getDate() + daysUntilFriday);

      return {
        nextPayoutDate: nextPayoutDate.toISOString(),
        pendingAmount: driver.earnings.week * 0.85,
        totalPaidOut: driver.earnings.month * 2.5,
        payoutMethod: "Bank Transfer",
        bankAccount: "****1234"
      };
    } catch (error) {
      console.error(`Error getting payout summary for driver ${driverId}:`, error.message);
      throw error;
    }
  },

  async addActiveDelivery(driverId, parcelId) {
    return { success: true };
  },

  async removeActiveDelivery(driverId, parcelId) {
    return { success: true };
  }
};

export default driverService;