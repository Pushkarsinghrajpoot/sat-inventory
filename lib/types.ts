export type UserRole = "distributor" | "reseller";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  customerId?: string;
  companyName: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  customerId: string;
  productName: string;
  serialNumber: string;
  quantity: number;
  deliveryDate: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  licenseEndDate: string | null;
  serviceType: string | null;
  serviceStartDate: string | null;
  serviceEndDate: string | null;
  category: string;
  invoiceNumber: string;
  challanNumber: string;
  status: "delivered" | "pending" | "returned";
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
  serialNumber: string;
  productName: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  warrantyStatus: "active" | "expiring" | "expired";
  serviceStatus: "covered" | "not_covered";
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
  assignedTo?: string;
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
