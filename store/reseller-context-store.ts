import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ResellerContextState {
  mode: "as_distributor" | "as_customer";
  selectedManagedCustomerId: string | null;
  
  setMode: (mode: "as_distributor" | "as_customer") => void;
  setSelectedManagedCustomerId: (customerId: string | null) => void;
  reset: () => void;
}

export const useResellerContextStore = create<ResellerContextState>()(
  persist(
    (set) => ({
      mode: "as_distributor",
      selectedManagedCustomerId: null,
      
      setMode: (mode) => set({ mode }),
      setSelectedManagedCustomerId: (customerId) => set({ selectedManagedCustomerId: customerId }),
      reset: () => set({ mode: "as_distributor", selectedManagedCustomerId: null })
    }),
    {
      name: "reseller-context-storage"
    }
  )
);
