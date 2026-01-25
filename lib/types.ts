export type UserRole = "distributor" | "reseller" | "customer";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  customerId?: string;
  companyName: string;
  phone: string;
  avatar: string | null;
  createdAt: string;
  managedCustomerIds?: string[];
  upstreamDistributorId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  contactPerson: string;
  industry: string;
  createdAt: string;
  status: "active" | "inactive";
  managedBy: "distributor" | string;
  customerType: "direct" | "reseller" | "end_customer";
}

export interface InventoryItem {
  id: string;
  contractId: string;
  contractNumber: string;
  customerId: string;
  productName: string;
  serialNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  warrantyStartDate: string | null;
  warrantyEndDate: string | null;
  warrantyContractId: string | null;
  licenseEndDate: string | null;
  licenseContractId: string | null;
  serviceType: string | null;
  serviceStartDate: string | null;
  serviceEndDate: string | null;
  serviceContractId: string | null;
  category: string;
  manufacturer: string;
  model: string;
  invoiceNumber: string;
  challanNumber: string;
  poNumber: string;
  status: "delivered" | "pending" | "cancelled";
  notes: string;
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory = "Hardware Issue" | "Software Issue" | "Network Issue" | "License Issue" | "General Inquiry";

export interface TimelineEntry {
  action: string;
  by: string;
  at: string;
  note: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  contractId: string;
  contractNumber: string;
  serialNumber: string;
  productName: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  warrantyStatus: "active" | "expiring_soon" | "expired" | "not_applicable";
  serviceStatus: "covered" | "not_covered" | "limited_coverage";
  coverageDetails: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  timeline: TimelineEntry[];
  assignedTo: string | null;
}

export type NotificationType = "warranty_expiry" | "license_expiry" | "ticket_update" | "system";

export interface Notification {
  id: string;
  customerId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  serialNumber?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FilterState {
  search: string;
  category: string;
  status: string;
  customerId: string;
  dateFrom: string;
  dateTo: string;
}

export interface WarrantyStatus {
  status: "active" | "expiring_soon" | "expired";
  daysRemaining: number;
  color: string;
}

export type ContractStatus = "draft" | "active" | "expiring_soon" | "expired" | "terminated";
export type ContractType = "parent" | "child";
export type ChildContractType = "AMC" | "Support" | "License" | "Extended Warranty";

export interface ParentContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  totalValue: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  productIds: string[];
  childContractIds: string[];
  terms: string;
  autoRenew: boolean;
  renewalReminderDays: number;
}

export interface ChildContract {
  id: string;
  contractNumber: string;
  parentContractId: string;
  parentContractNumber: string;
  customerId: string;
  type: ChildContractType;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  value: number;
  coverageType: "full" | "limited" | "parts_only" | "labor_only";
  responseTime: string;
  coveredSerialNumbers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResellerContext {
  mode: "as_distributor" | "as_customer";
  selectedManagedCustomerId?: string;
}
