import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
const menuItems = [
    { path: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/book-pickup", icon: "PackagePlus", label: "Book Pickup" },
    { path: "/active-deliveries", icon: "Truck", label: "Active Deliveries" },
    { path: "/delivery-history", icon: "Package", label: "Delivery History" },
    { path: "/track/SWR2024001234", icon: "MapPin", label: "Track Parcel" },
    { path: "/driver-dashboard", icon: "User", label: "Driver Dashboard" },
    { path: "/driver-management", icon: "Users", label: "Driver Management" },
    { path: "/analytics", icon: "BarChart3", label: "Analytics" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-secondary/10 h-full">
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
                    : "text-secondary hover:bg-secondary/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-secondary/10 z-50 lg:hidden"
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
                    : "text-secondary hover:bg-secondary/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;