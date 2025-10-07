import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { Id: 1, message: "New delivery assigned to Driver #1", time: "5 min ago", type: "info" },
    { Id: 2, message: "Delivery SWR2024001234 completed", time: "15 min ago", type: "success" },
    { Id: 3, message: "Delay reported on Route #5", time: "1 hour ago", type: "warning" }
  ];

  return (
    <header className="h-16 bg-white border-b border-secondary/10 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-secondary/5 rounded-lg transition-colors"
        >
          <ApperIcon name="Menu" size={24} className="text-secondary" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          SwiftRoute
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-secondary/5 rounded-lg transition-colors relative"
          >
            <ApperIcon name="Bell" size={20} className="text-secondary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-secondary/10 overflow-hidden"
              >
                <div className="p-4 border-b border-secondary/10">
                  <h3 className="font-semibold text-secondary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.Id} className="p-4 border-b border-secondary/5 hover:bg-secondary/5 transition-colors">
                      <p className="text-sm text-secondary">{notif.message}</p>
                      <p className="text-xs text-secondary/50 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-secondary/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-bold text-white">AD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-secondary">Admin User</p>
            <p className="text-xs text-secondary/50">admin@swiftroute.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;