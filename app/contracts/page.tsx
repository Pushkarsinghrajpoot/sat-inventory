"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/store/auth-store";
import { useContractStore } from "@/store/contract-store";
import { useResellerContextStore } from "@/store/reseller-context-store";
import { filterByAccessibleCustomers, hasPermission } from "@/lib/permissions";
import { ContractList } from "@/components/contracts/contract-list";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContractsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { parentContracts } = useContractStore();
  const { mode } = useResellerContextStore();

  const resellerContext = user?.role === "reseller" ? { mode } : undefined;

  const accessibleContracts = filterByAccessibleCustomers(
    parentContracts,
    user,
    resellerContext
  );

  const canCreate = hasPermission(
    user?.role || "customer",
    "contracts.create",
    resellerContext
  );

  const stats = {
    total: accessibleContracts.length,
    active: accessibleContracts.filter(c => c.status === "active").length,
    expiringSoon: accessibleContracts.filter(c => c.status === "expiring_soon").length,
    expired: accessibleContracts.filter(c => c.status === "expired").length
  };

  return (
    <DashboardLayout title="Contracts">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Contracts
          </h1>
          <p className="text-gray-600 mt-1">Manage parent and child contracts</p>
        </div>
        {canCreate && (
          <Button onClick={() => router.push("/contracts/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Contract
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Contracts</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Expiring Soon</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.expiringSoon}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.expired}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <ContractList contracts={accessibleContracts} />
      </div>
    </div>
    </DashboardLayout>
  );
}
