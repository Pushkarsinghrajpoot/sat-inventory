"use client";

import { useState, useMemo } from "react";
import { ParentContract, ChildContract } from "@/lib/types";
import { ContractCard } from "./contract-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ContractListProps {
  contracts: (ParentContract | ChildContract)[];
  onViewDetails?: (id: string) => void;
  showActions?: boolean;
}

export function ContractList({ contracts, onViewDetails, showActions = true }: ContractListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredContracts = useMemo(() => {
    if (!Array.isArray(contracts)) return [];
    
    return contracts.filter((contract: any) => {
      if (!contract) return false;
      
      const customerName = contract.customerName || `Customer ID: ${contract.customerId}`;
      const matchesSearch = 
        (contract.contractNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contract.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || contract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search contracts by number, title, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No contracts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onViewDetails={onViewDetails}
              showActions={showActions}
            />
          ))}
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {filteredContracts.length} of {Array.isArray(contracts) ? contracts.length : 0} contracts
      </div>
    </div>
  );
}
