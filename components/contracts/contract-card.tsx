"use client";

import { ParentContract, ChildContract } from "@/lib/types";
import { ContractStatusBadge } from "./contract-status-badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, DollarSign, Package, FileSignature } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useContractStore } from "@/store/contract-store";

interface ContractCardProps {
  contract: ParentContract;
  onViewDetails?: (id: string) => void;
  showActions?: boolean;
}

export function ContractCard({ contract, onViewDetails, showActions = true }: ContractCardProps) {
  const router = useRouter();
  const { getChildContractsByParentId } = useContractStore();
  const childContracts = getChildContractsByParentId(contract.id);

  const daysRemaining = differenceInDays(new Date(contract.endDate), new Date());

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(contract.id);
    } else {
      router.push(`/contracts/${contract.id}`);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-mono text-gray-600">{contract.contractNumber}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{contract.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{contract.customerName}</p>
          </div>
          <ContractStatusBadge status={contract.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Value</p>
              <p className="font-semibold">₹{(contract.totalValue / 100000).toFixed(2)}L</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Products</p>
              <p className="font-semibold">{contract.productIds.length}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Valid Period</p>
            <p className="font-medium text-gray-700">
              {format(new Date(contract.startDate), "MMM d, yyyy")} - {format(new Date(contract.endDate), "MMM d, yyyy")}
            </p>
            {contract.status === "active" && (
              <p className="text-xs text-gray-500 mt-0.5">
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
              </p>
            )}
          </div>
        </div>

        {childContracts.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <FileSignature className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">Child Contracts ({childContracts.length})</span>
            </div>
            <div className="space-y-1">
              {childContracts.slice(0, 2).map((child) => (
                <div key={child.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{child.contractNumber}: {child.type}</span>
                  <ContractStatusBadge status={child.status} className="text-xs px-2 py-0.5" />
                </div>
              ))}
              {childContracts.length > 2 && (
                <p className="text-xs text-gray-500 italic">+{childContracts.length - 2} more</p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="pt-3 border-t">
          <Button onClick={handleViewDetails} variant="outline" className="w-full">
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
