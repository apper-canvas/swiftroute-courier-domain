import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { variant: "warning", icon: "Clock", label: "Pending" },
    assigned: { variant: "info", icon: "UserCheck", label: "Assigned" },
    "in-transit": { variant: "primary", icon: "Truck", label: "In Transit" },
    delivered: { variant: "success", icon: "CheckCircle2", label: "Delivered" },
    failed: { variant: "error", icon: "XCircle", label: "Failed" },
    cancelled: { variant: "error", icon: "XCircle", label: "Cancelled" }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;