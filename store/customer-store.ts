import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Customer } from "@/lib/types";
import { dummyCustomers } from "@/lib/dummy-data";

interface CustomerState {
  customers: Customer[];
  getCustomerById: (id: string) => Customer | undefined;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: dummyCustomers,
      
      getCustomerById: (id) => {
        return get().customers.find((customer) => customer.id === id);
      },
      
      addCustomer: (customer) => {
        set((state) => ({
          customers: [...state.customers, customer]
        }));
      },
      
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id ? { ...customer, ...updates } : customer
          )
        }));
      }
    }),
    {
      name: "customer-storage"
    }
  )
);
