import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import deliveryService from "@/services/api/deliveryService";
import parcelService from "@/services/api/parcelService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SignatureCanvas from "@/components/organisms/SignatureCanvas";
import ApperIcon from "@/components/ApperIcon";

const DeliveryConfirmation = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signature, setSignature] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const deliveryData = await deliveryService.getById(deliveryId);
      setDelivery(deliveryData);

      const parcelData = await parcelService.getById(deliveryData.parcelId);
      setParcel(parcelData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load delivery information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [deliveryId]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...photoUrls]);
  };

  const handleSubmit = async () => {
    if (!signature) {
      toast.error("Please provide a signature");
      return;
    }

    if (photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    try {
      setSubmitting(true);

      const completionData = {
        signature,
        photos,
        completedBy: parcel.driverName,
        completedAt: new Date().toISOString(),
        notes
      };

      await deliveryService.completeDelivery(delivery.Id, completionData);
      await parcelService.updateStatus(parcel.Id, "delivered");

      toast.success("Delivery completed successfully!");
      navigate("/driver-dashboard");
    } catch (err) {
      toast.error("Failed to complete delivery");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!delivery || !parcel) return <Error message="Delivery not found" />;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Delivery Confirmation
          </h1>
          <p className="text-secondary/70">Complete the delivery process</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/driver-dashboard")}>
          <ApperIcon name="ArrowLeft" size={20} />
          Back
        </Button>
      </div>

      {/* Delivery Info */}
      <Card className="p-6">
        <h3 className="font-semibold text-secondary mb-4">Delivery Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-secondary/50 mb-1">Tracking Number</p>
            <p className="font-semibold text-secondary">{parcel.trackingNumber}</p>
          </div>
          <div>
            <p className="text-sm text-secondary/50 mb-1">Customer</p>
            <p className="font-semibold text-secondary">{parcel.customerName}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-secondary/50 mb-1">Delivery Address</p>
            <p className="font-semibold text-secondary">
              {parcel.deliveryAddress.street}, {parcel.deliveryAddress.city}, {parcel.deliveryAddress.state} {parcel.deliveryAddress.zipCode}
            </p>
          </div>
        </div>
      </Card>

      {/* Signature */}
      <SignatureCanvas
        onSave={setSignature}
        onClear={() => setSignature(null)}
      />

      {/* Photo Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
            <ApperIcon name="Camera" size={20} className="text-primary" />
            Proof of Delivery Photos
          </h3>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-secondary/20 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <ApperIcon name="Upload" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-secondary">Upload Photos</p>
                  <p className="text-sm text-secondary/70">Click to select images</p>
                </div>
              </label>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={photo} alt={`Proof ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ApperIcon name="X" size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-secondary mb-4">Additional Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the delivery..."
            className="w-full p-4 border border-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            rows={4}
          />
        </Card>
      </motion.div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/driver-dashboard")}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!signature || photos.length === 0 || submitting}
          className="flex-1"
        >
          {submitting ? (
            <>
              <ApperIcon name="Loader2" size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ApperIcon name="CheckCircle2" size={20} />
              Complete Delivery
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryConfirmation;