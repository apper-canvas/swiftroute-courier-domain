import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import BookPickup from "@/components/pages/BookPickup";
import ActiveDeliveries from "@/components/pages/ActiveDeliveries";
import TrackParcel from "@/components/pages/TrackParcel";
import DeliveryConfirmation from "@/components/pages/DeliveryConfirmation";
import DriverDashboard from "@/components/pages/DriverDashboard";
import Analytics from "@/components/pages/Analytics";
import DriverManagement from "@/components/pages/DriverManagement";
import DeliveryHistory from "@/components/pages/DeliveryHistory";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
<Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="book-pickup" element={<BookPickup />} />
          <Route path="active-deliveries" element={<ActiveDeliveries />} />
          <Route path="delivery-history" element={<DeliveryHistory />} />
          <Route path="track/:parcelId" element={<TrackParcel />} />
          <Route path="delivery-confirmation/:deliveryId" element={<DeliveryConfirmation />} />
          <Route path="driver-dashboard" element={<DriverDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="driver-management" element={<DriverManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;