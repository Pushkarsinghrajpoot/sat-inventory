import { ContractStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ContractStatusBadgeProps {
  status: ContractStatus;
  className?: string;
}

export function ContractStatusBadge({ status, className }: ContractStatusBadgeProps) {
  const statusConfig = {
    draft: { label: "Draft", variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
    active: { label: "Active", variant: "default" as const, color: "bg-green-100 text-green-800" },
    expiring_soon: { label: "Expiring Soon", variant: "warning" as const, color: "bg-yellow-100 text-yellow-800" },
    expired: { label: "Expired", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    terminated: { label: "Terminated", variant: "destructive" as const, color: "bg-gray-100 text-gray-800" }
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.color} ${className}`}>
      {config.label}
    </Badge>
  );
}
