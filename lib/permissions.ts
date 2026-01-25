import { UserRole, ResellerContext, User, Customer } from "./types";
import { dummyCustomers } from "./dummy-data";

export type Permission = 
  | "contracts.view"
  | "contracts.create"
  | "contracts.edit"
  | "contracts.delete"
  | "contracts.renew"
  | "contracts.expire"
  | "inventory.view"
  | "inventory.create"
  | "inventory.edit"
  | "inventory.delete"
  | "tickets.view"
  | "tickets.create"
  | "tickets.manage"
  | "customers.view"
  | "customers.create"
  | "customers.edit"
  | "settings.access";

const permissionsByRole: Record<string, Permission[]> = {
  distributor: [
    "contracts.view", "contracts.create", "contracts.edit", "contracts.delete", "contracts.renew", "contracts.expire",
    "inventory.view", "inventory.create", "inventory.edit", "inventory.delete",
    "tickets.view", "tickets.create", "tickets.manage",
    "customers.view", "customers.create", "customers.edit",
    "settings.access"
  ],
  reseller_as_distributor: [
    "contracts.view", "contracts.create", "contracts.edit", "contracts.renew", "contracts.expire",
    "inventory.view", "inventory.create", "inventory.edit",
    "tickets.view", "tickets.create", "tickets.manage",
    "customers.view", "customers.create", "customers.edit",
    "settings.access"
  ],
  reseller_as_customer: [
    "contracts.view",
    "inventory.view",
    "tickets.view", "tickets.create",
    "customers.view"
  ],
  customer: [
    "contracts.view",
    "inventory.view",
    "tickets.view", "tickets.create",
    "customers.view"
  ]
};

export const hasPermission = (
  userRole: UserRole,
  permission: Permission,
  resellerContext?: ResellerContext
): boolean => {
  let effectiveRole: string = userRole;
  
  if (userRole === "reseller" && resellerContext) {
    effectiveRole = resellerContext.mode === "as_distributor" 
      ? "reseller_as_distributor" 
      : "reseller_as_customer";
  }
  
  return permissionsByRole[effectiveRole]?.includes(permission) ?? false;
};

export const getAccessibleCustomerIds = (
  user: User | null,
  resellerContext?: ResellerContext
): string[] => {
  if (!user) return [];
  
  switch (user.role) {
    case "distributor":
      return dummyCustomers.map(c => c.id);
      
    case "reseller":
      if (resellerContext?.mode === "as_distributor") {
        return user.managedCustomerIds || [];
      } else {
        return user.customerId ? [user.customerId] : [];
      }
      
    case "customer":
      return user.customerId ? [user.customerId] : [];
      
    default:
      return [];
  }
};

export const filterByAccessibleCustomers = <T extends { customerId: string }>(
  data: T[],
  user: User | null,
  resellerContext?: ResellerContext
): T[] => {
  const accessibleIds = getAccessibleCustomerIds(user, resellerContext);
  return data.filter(item => accessibleIds.includes(item.customerId));
};

export const canAccessCustomer = (
  customerId: string,
  user: User | null,
  resellerContext?: ResellerContext
): boolean => {
  const accessibleIds = getAccessibleCustomerIds(user, resellerContext);
  return accessibleIds.includes(customerId);
};

export const getAccessibleCustomers = (
  customers: Customer[],
  user: User | null,
  resellerContext?: ResellerContext
): Customer[] => {
  const accessibleIds = getAccessibleCustomerIds(user, resellerContext);
  return customers.filter(customer => accessibleIds.includes(customer.id));
};
