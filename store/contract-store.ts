import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ParentContract, ChildContract } from "@/lib/types";
import { dummyParentContracts, dummyChildContracts } from "@/lib/dummy-data";
import { differenceInDays } from "date-fns";

interface ContractState {
  parentContracts: ParentContract[];
  childContracts: ChildContract[];
  isLoading: boolean;
  
  addParentContract: (contract: ParentContract) => void;
  updateParentContract: (id: string, updates: Partial<ParentContract>) => void;
  deleteParentContract: (id: string) => void;
  
  addChildContract: (contract: ChildContract) => void;
  updateChildContract: (id: string, updates: Partial<ChildContract>) => void;
  deleteChildContract: (id: string) => void;
  
  getContractsByCustomerId: (customerId: string) => ParentContract[];
  getChildContractsByParentId: (parentId: string) => ChildContract[];
  getContractCoverage: (serialNumber: string) => {
    parentContract: ParentContract | null;
    childContracts: ChildContract[];
    isCovered: boolean;
    coverageDetails: string;
  };
  getExpiringContracts: (days: number) => ParentContract[];
  getContractById: (id: string) => ParentContract | null;
  getChildContractById: (id: string) => ChildContract | null;
}

export const useContractStore = create<ContractState>()(
  persist(
    (set, get) => ({
      parentContracts: dummyParentContracts,
      childContracts: dummyChildContracts,
      isLoading: false,
      
      addParentContract: (contract) => set((state) => ({
        parentContracts: [...state.parentContracts, contract]
      })),
      
      updateParentContract: (id, updates) => set((state) => ({
        parentContracts: state.parentContracts.map(c => 
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
      })),
      
      deleteParentContract: (id) => set((state) => ({
        parentContracts: state.parentContracts.filter(c => c.id !== id),
        childContracts: state.childContracts.filter(c => c.parentContractId !== id)
      })),
      
      addChildContract: (contract) => set((state) => ({
        childContracts: [...state.childContracts, contract]
      })),
      
      updateChildContract: (id, updates) => set((state) => ({
        childContracts: state.childContracts.map(c => 
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
      })),
      
      deleteChildContract: (id) => set((state) => ({
        childContracts: state.childContracts.filter(c => c.id !== id)
      })),
      
      getContractsByCustomerId: (customerId) => {
        return get().parentContracts.filter(c => c.customerId === customerId);
      },
      
      getChildContractsByParentId: (parentId) => {
        return get().childContracts.filter(c => c.parentContractId === parentId);
      },
      
      getContractCoverage: (serialNumber) => {
        const { parentContracts, childContracts } = get();
        
        const coveringChildContracts = childContracts.filter(cc => 
          cc.coveredSerialNumbers.includes(serialNumber) && cc.status === "active"
        );
        
        if (coveringChildContracts.length === 0) {
          return {
            parentContract: null,
            childContracts: [],
            isCovered: false,
            coverageDetails: "Not covered under any active contract"
          };
        }
        
        const parentContract = parentContracts.find(pc => 
          pc.id === coveringChildContracts[0].parentContractId
        );
        
        const primaryCoverage = coveringChildContracts[0];
        const coverageDetails = `Covered under ${primaryCoverage.type} - ${primaryCoverage.responseTime} response time (${primaryCoverage.coverageType} coverage)`;
        
        return {
          parentContract: parentContract || null,
          childContracts: coveringChildContracts,
          isCovered: true,
          coverageDetails
        };
      },
      
      getExpiringContracts: (days) => {
        const today = new Date();
        return get().parentContracts.filter(c => {
          const endDate = new Date(c.endDate);
          const daysUntilExpiry = differenceInDays(endDate, today);
          return daysUntilExpiry > 0 && daysUntilExpiry <= days;
        });
      },
      
      getContractById: (id) => {
        return get().parentContracts.find(c => c.id === id) || null;
      },
      
      getChildContractById: (id) => {
        return get().childContracts.find(c => c.id === id) || null;
      }
    }),
    {
      name: "contract-storage"
    }
  )
);
