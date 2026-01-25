"use client";

import { useAuthStore } from "@/store/auth-store";
import { useResellerContextStore } from "@/store/reseller-context-store";
import { useCustomerStore } from "@/store/customer-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User } from "lucide-react";

export function ResellerContextSwitcher() {
  const { user } = useAuthStore();
  const { mode, selectedManagedCustomerId, setMode, setSelectedManagedCustomerId } = useResellerContextStore();
  const { customers } = useCustomerStore();

  if (user?.role !== "reseller") return null;

  const managedCustomers = customers.filter(c => 
    user.managedCustomerIds?.includes(c.id)
  );

  return (
    <div className="p-4 border-b border-gray-200 bg-blue-50">
      <p className="text-xs text-gray-600 mb-2 font-medium">You are acting as:</p>
      <Select value={mode} onValueChange={(value: "as_distributor" | "as_customer") => setMode(value)}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="as_distributor">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Distributor (Managing Customers)</span>
            </div>
          </SelectItem>
          <SelectItem value="as_customer">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Customer (Viewing My Contracts)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {mode === "as_distributor" && managedCustomers.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 mb-1 font-medium">Select customer to manage:</p>
          <Select 
            value={selectedManagedCustomerId || "all"} 
            onValueChange={(value) => setSelectedManagedCustomerId(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All my customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All My Customers</SelectItem>
              {managedCustomers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
