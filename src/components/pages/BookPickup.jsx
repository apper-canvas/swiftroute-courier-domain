import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import parcelService from "@/services/api/parcelService";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const BookPickup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pickupStreet: "",
    pickupCity: "",
    pickupState: "",
    pickupZipCode: "",
    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZipCode: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    fragile: false,
    description: "",
    scheduledTime: ""
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePrice = () => {
    const basePrice = 10;
    const weightPrice = parseFloat(formData.weight) * 0.5;
    const volumePrice = (parseFloat(formData.length) * parseFloat(formData.width) * parseFloat(formData.height)) * 0.01;
    const fragilePrice = formData.fragile ? 5 : 0;
    return (basePrice + weightPrice + volumePrice + fragilePrice).toFixed(2);
  };

  const handleSubmit = async () => {
    try {
      const newParcel = {
        customerId: "1",
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        pickupAddress: {
          street: formData.pickupStreet,
          city: formData.pickupCity,
          state: formData.pickupState,
          zipCode: formData.pickupZipCode,
          coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        deliveryAddress: {
          street: formData.deliveryStreet,
          city: formData.deliveryCity,
          state: formData.deliveryState,
          zipCode: formData.deliveryZipCode,
          coordinates: { lat: 37.7849, lng: -122.4094 }
        },
        packageDetails: {
          weight: parseFloat(formData.weight),
          dimensions: {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height)
          },
          fragile: formData.fragile,
          description: formData.description
        },
        scheduledTime: formData.scheduledTime,
        price: parseFloat(calculatePrice()),
        distance: 5.5,
        estimatedDeliveryTime: new Date(new Date(formData.scheduledTime).getTime() + 90 * 60000).toISOString()
      };

      const result = await parcelService.create(newParcel);
      toast.success(`Pickup booked successfully! Tracking: ${result.trackingNumber}`);
      navigate("/active-deliveries");
    } catch (err) {
      toast.error("Failed to book pickup");
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-bold text-secondary mb-4">Customer Information</h3>
      <FormField
        label="Full Name"
        required
        value={formData.customerName}
        onChange={(e) => updateField("customerName", e.target.value)}
        placeholder="Enter customer name"
      />
      <FormField
        label="Phone Number"
        required
        type="tel"
        value={formData.customerPhone}
        onChange={(e) => updateField("customerPhone", e.target.value)}
        placeholder="+1 (555) 123-4567"
      />
      <FormField
        label="Email Address"
        type="email"
        value={formData.customerEmail}
        onChange={(e) => updateField("customerEmail", e.target.value)}
        placeholder="customer@example.com"
      />
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-secondary mb-4">Pickup Address</h3>
        <div className="space-y-4">
          <FormField
            label="Street Address"
            required
            value={formData.pickupStreet}
            onChange={(e) => updateField("pickupStreet", e.target.value)}
            placeholder="123 Main Street"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="City"
              required
              value={formData.pickupCity}
              onChange={(e) => updateField("pickupCity", e.target.value)}
              placeholder="San Francisco"
            />
            <FormField
              label="State"
              required
              value={formData.pickupState}
              onChange={(e) => updateField("pickupState", e.target.value)}
              placeholder="CA"
            />
          </div>
          <FormField
            label="ZIP Code"
            required
            value={formData.pickupZipCode}
            onChange={(e) => updateField("pickupZipCode", e.target.value)}
            placeholder="94102"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-secondary mb-4">Delivery Address</h3>
        <div className="space-y-4">
          <FormField
            label="Street Address"
            required
            value={formData.deliveryStreet}
            onChange={(e) => updateField("deliveryStreet", e.target.value)}
            placeholder="456 Oak Avenue"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="City"
              required
              value={formData.deliveryCity}
              onChange={(e) => updateField("deliveryCity", e.target.value)}
              placeholder="San Francisco"
            />
            <FormField
              label="State"
              required
              value={formData.deliveryState}
              onChange={(e) => updateField("deliveryState", e.target.value)}
              placeholder="CA"
            />
          </div>
          <FormField
            label="ZIP Code"
            required
            value={formData.deliveryZipCode}
            onChange={(e) => updateField("deliveryZipCode", e.target.value)}
            placeholder="94105"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-bold text-secondary mb-4">Package Details</h3>
      <FormField
        label="Weight (lbs)"
        required
        type="number"
        value={formData.weight}
        onChange={(e) => updateField("weight", e.target.value)}
        placeholder="5.5"
      />
      <div className="grid grid-cols-3 gap-4">
        <FormField
          label="Length (in)"
          required
          type="number"
          value={formData.length}
          onChange={(e) => updateField("length", e.target.value)}
          placeholder="12"
        />
        <FormField
          label="Width (in)"
          required
          type="number"
          value={formData.width}
          onChange={(e) => updateField("width", e.target.value)}
          placeholder="8"
        />
        <FormField
          label="Height (in)"
          required
          type="number"
          value={formData.height}
          onChange={(e) => updateField("height", e.target.value)}
          placeholder="6"
        />
      </div>
      <FormField
        label="Description"
        required
        value={formData.description}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="Electronics, Documents, etc."
      />
      <div className="flex items-center gap-2 p-4 bg-secondary/5 rounded-lg">
        <input
          type="checkbox"
          id="fragile"
          checked={formData.fragile}
          onChange={(e) => updateField("fragile", e.target.checked)}
          className="w-4 h-4 text-primary border-secondary/20 rounded focus:ring-primary"
        />
        <label htmlFor="fragile" className="text-sm font-medium text-secondary cursor-pointer">
          Fragile - Handle with Care
        </label>
      </div>
      <FormField
        label="Pickup Time"
        required
        type="datetime-local"
        value={formData.scheduledTime}
        onChange={(e) => updateField("scheduledTime", e.target.value)}
      />
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-bold text-secondary mb-4">Confirm Booking</h3>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-secondary mb-2">Customer</h4>
            <p className="text-sm text-secondary/70">{formData.customerName}</p>
            <p className="text-sm text-secondary/70">{formData.customerPhone}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                <ApperIcon name="MapPin" size={16} className="text-primary" />
                Pickup
              </h4>
              <p className="text-sm text-secondary/70">{formData.pickupStreet}</p>
              <p className="text-sm text-secondary/70">
                {formData.pickupCity}, {formData.pickupState} {formData.pickupZipCode}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                <ApperIcon name="MapPin" size={16} className="text-success" />
                Delivery
              </h4>
              <p className="text-sm text-secondary/70">{formData.deliveryStreet}</p>
              <p className="text-sm text-secondary/70">
                {formData.deliveryCity}, {formData.deliveryState} {formData.deliveryZipCode}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-secondary mb-2">Package Details</h4>
            <div className="text-sm text-secondary/70 space-y-1">
              <p>Weight: {formData.weight} lbs</p>
              <p>Dimensions: {formData.length}" × {formData.width}" × {formData.height}"</p>
              <p>Description: {formData.description}</p>
              {formData.fragile && (
                <p className="text-warning font-medium">⚠️ Fragile - Handle with Care</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-secondary/10">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-secondary">Estimated Price</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ${calculatePrice()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Book a Pickup
        </h1>
        <p className="text-secondary/70">Schedule your delivery in just a few steps</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s === step
                    ? "bg-gradient-to-r from-primary to-accent text-white scale-110"
                    : s < step
                    ? "bg-success text-white"
                    : "bg-secondary/10 text-secondary/50"
                }`}
              >
                {s < step ? <ApperIcon name="Check" size={20} /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 sm:w-24 h-1 transition-all ${
                    s < step ? "bg-success" : "bg-secondary/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs text-secondary/70">
          <span>Customer</span>
          <span>Addresses</span>
          <span>Package</span>
          <span>Confirm</span>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <AnimatePresence mode="wait">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </AnimatePresence>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          <ApperIcon name="ChevronLeft" size={20} />
          Previous
        </Button>

        {step < 4 ? (
          <Button variant="primary" onClick={() => setStep(Math.min(4, step + 1))}>
            Next
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            <ApperIcon name="Check" size={20} />
            Confirm Booking
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookPickup;