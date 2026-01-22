import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InventoryItem, FilterState } from "@/lib/types";
import { dummyInventory } from "@/lib/dummy-data";

interface InventoryState {
  items: InventoryItem[];
  filters: FilterState;
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  getFilteredItems: (customerId?: string) => InventoryItem[];
}

const defaultFilters: FilterState = {
  search: "",
  category: "all",
  status: "all",
  customerId: "all",
  dateFrom: "",
  dateTo: ""
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: dummyInventory,
      filters: defaultFilters,
      
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item]
        }));
      },
      
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          )
        }));
      },
      
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));
      },
      
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
      },
      
      resetFilters: () => {
        set({ filters: defaultFilters });
      },
      
      getFilteredItems: (customerId) => {
        const { items, filters } = get();
        
        return items.filter((item) => {
          if (customerId && customerId !== "all" && item.customerId !== customerId) {
            return false;
          }
          
          if (filters.customerId !== "all" && item.customerId !== filters.customerId) {
            return false;
          }
          
          if (filters.search) {
            const search = filters.search.toLowerCase();
            if (
              !item.productName.toLowerCase().includes(search) &&
              !item.serialNumber.toLowerCase().includes(search)
            ) {
              return false;
            }
          }
          
          if (filters.category !== "all" && item.category !== filters.category) {
            return false;
          }
          
          return true;
        });
      }
    }),
    {
      name: "inventory-storage"
    }
  )
);
