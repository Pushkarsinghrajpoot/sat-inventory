import { addDays, subDays, format } from "date-fns";
import { User, Customer, ParentContract, ChildContract, InventoryItem, Ticket } from "./types";

const today = new Date();
const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

export const dummyUsers: User[] = [
  {
    id: "USR009",
    email: "hha@satmz.com",
    password: "hha123",
    name: "Mohammed Alireza",
    role: "distributor",
    companyName: "Haji Husein Alireza & Co. Ltd. (HHA)",
    phone: "+966-50-1234567",
    avatar: null,
    createdAt: "2023-12-01"
  }
];

export const dummyCustomers: Customer[] = [
  {
    id: "CUST007",
    name: "Haji Husein Alireza & Co. Ltd. (HHA)",
    email: "info@hha.com",
    phone: "+966-50-1234567",
    address: "King Fahd Road, Riyadh 11564, Saudi Arabia",
    gstNumber: "300123456789003",
    contactPerson: "Mohammed Alireza",
    industry: "IT Equipment Distribution",
    createdAt: "2023-12-01",
    status: "active",
    managedBy: "USR009",
    customerType: "direct"
  }
];

export const dummyParentContracts: ParentContract[] = [
  // No contracts for HHA yet - they can create contracts from their inventory
];

export const dummyChildContracts: ChildContract[] = [
  // No child contracts for HHA yet - they can create contracts from their inventory
];

export const dummyInventory: InventoryItem[] = [
  // HHA Lenovo Products Only - All other inventory removed
  {
    id: "INV035",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "Lenovo Neo 50A 27 G5",
    serialNumber: "12SA000RAX-001",
    quantity: 249,
    unitPrice: 85000,
    totalPrice: 21165000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 1095)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Carry-in Warranty",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 1095)),
    serviceContractId: null,
    category: "All-in-One PC",
    manufacturer: "Lenovo",
    model: "Neo 50A 27 G5",
    invoiceNumber: "HHA-INV-001",
    challanNumber: "HHA-DC-001",
    poNumber: "HHA-PO-001",
    status: "delivered",
    notes: "Intel Core i7-13620H, DDR5 16GB RAM, 512GB SSD, Windows 11 Pro, 3-Year Carry-in Warranty"
  },
  {
    id: "INV036",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "Lenovo ThinkCentre Neo 50a 27 All-in-One",
    serialNumber: "12SA000RAX-002",
    quantity: 17,
    unitPrice: 95000,
    totalPrice: 1615000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 1095)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Carry-in Warranty + Premier Support",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 1095)),
    serviceContractId: null,
    category: "All-in-One PC",
    manufacturer: "Lenovo",
    model: "ThinkCentre Neo 50a 27",
    invoiceNumber: "HHA-INV-002",
    challanNumber: "HHA-DC-002",
    poNumber: "HHA-PO-002",
    status: "delivered",
    notes: "Intel Core i7-13620H, 16GB RAM, 512GB SSD, Intel UHD Graphics, 27-inch FHD Display, 3-Year Carry-in Warranty + Premier Support"
  },
  {
    id: "INV037",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "Lenovo ThinkPad T14",
    serialNumber: "T14-32GB-001",
    quantity: 1,
    unitPrice: 180000,
    totalPrice: 180000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 365)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Standard Warranty",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 365)),
    serviceContractId: null,
    category: "Laptop",
    manufacturer: "Lenovo",
    model: "ThinkPad T14",
    invoiceNumber: "HHA-INV-003",
    challanNumber: "HHA-DC-003",
    poNumber: "HHA-PO-003",
    status: "delivered",
    notes: "Intel Core i7-255U, 32GB DDR5 RAM, 1TB SSD (M.2 2280 NVMe)"
  },
  {
    id: "INV038",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "Lenovo ThinkPad T14",
    serialNumber: "T14-16GB-001",
    quantity: 12,
    unitPrice: 120000,
    totalPrice: 1440000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 365)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Standard Warranty",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 365)),
    serviceContractId: null,
    category: "Laptop",
    manufacturer: "Lenovo",
    model: "ThinkPad T14",
    invoiceNumber: "HHA-INV-004",
    challanNumber: "HHA-DC-004",
    poNumber: "HHA-PO-004",
    status: "delivered",
    notes: "Intel Core i7-255U, 16GB DDR5 RAM, 512GB SSD (M.2 2280 TLC)"
  },
  {
    id: "INV039",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "Lenovo Essential Wireless Keyboard and Mouse Combo",
    serialNumber: "KB-MOUSE-001",
    quantity: 10,
    unitPrice: 3500,
    totalPrice: 35000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 365)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Standard Warranty",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 365)),
    serviceContractId: null,
    category: "Accessories",
    manufacturer: "Lenovo",
    model: "Essential Wireless Combo",
    invoiceNumber: "HHA-INV-005",
    challanNumber: "HHA-DC-005",
    poNumber: "HHA-PO-005",
    status: "delivered",
    notes: "Wireless keyboard and mouse combo"
  },
  {
    id: "INV040",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "ThinkPad Professional 16-inch Topload Gen",
    serialNumber: "BAG-16IN-001",
    quantity: 12,
    unitPrice: 4500,
    totalPrice: 54000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 365)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Standard Warranty",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 365)),
    serviceContractId: null,
    category: "Accessories",
    manufacturer: "Lenovo",
    model: "ThinkPad Professional Topload",
    invoiceNumber: "HHA-INV-006",
    challanNumber: "HHA-DC-006",
    poNumber: "HHA-PO-006",
    status: "delivered",
    notes: "16-inch professional laptop bag"
  },
  {
    id: "INV041",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "ThinkVision T27QD-40 Monitor",
    serialNumber: "MON-T27QD-001",
    quantity: 10,
    unitPrice: 35000,
    totalPrice: 350000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 1095)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Standard Warranty",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 1095)),
    serviceContractId: null,
    category: "Monitor",
    manufacturer: "Lenovo",
    model: "ThinkVision T27QD-40",
    invoiceNumber: "HHA-INV-007",
    challanNumber: "HHA-DC-007",
    poNumber: "HHA-PO-007",
    status: "delivered",
    notes: "27-inch 2K QHD IPS Panel, 120Hz Refresh Rate, 4ms Response Time, HDMI/DP/USB-C (96W PD)/Ethernet, Eyesafe, Phone Holder, Tilt/Swivel/Lift/Pivot"
  },
  {
    id: "INV042",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "Service Tier – Basic Package",
    serialNumber: "SERVICE-BASIC-001",
    quantity: 1,
    unitPrice: 50000,
    totalPrice: 50000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 365)),
    warrantyContractId: null,
    licenseEndDate: null,
    licenseContractId: null,
    serviceType: "Service Package",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 365)),
    serviceContractId: null,
    category: "Service",
    manufacturer: "Lenovo",
    model: "Basic Service Package",
    invoiceNumber: "HHA-INV-008",
    challanNumber: "HHA-DC-008",
    poNumber: "HHA-PO-008",
    status: "delivered",
    notes: "Basic service package for equipment"
  },
  {
    id: "INV043",
    contractId: "",
    contractNumber: "",
    customerId: "CUST007",
    productName: "Windows 11 Pro 64-bit",
    serialNumber: "WIN11-PRO-001",
    quantity: 17,
    unitPrice: 15000,
    totalPrice: 255000,
    deliveryDate: "2024-12-01",
    warrantyStartDate: "2024-12-01",
    warrantyEndDate: formatDate(addDays(today, 365)),
    warrantyContractId: null,
    licenseEndDate: formatDate(addDays(today, 365)),
    licenseContractId: "WIN11-LICENSE-001",
    serviceType: "License",
    serviceStartDate: "2024-12-01",
    serviceEndDate: formatDate(addDays(today, 365)),
    serviceContractId: null,
    category: "Software License",
    manufacturer: "Microsoft",
    model: "Windows 11 Pro 64-bit",
    invoiceNumber: "HHA-INV-009",
    challanNumber: "HHA-DC-009",
    poNumber: "HHA-PO-009",
    status: "delivered",
    notes: "Windows 11 Pro 64-bit operating system license"
  }
];

export const dummyTickets: Ticket[] = [
  // No tickets for HHA yet - they can create tickets from their inventory
];

export const dummyNotifications = [
  // No notifications for HHA yet - empty array
];

export const loginCredentials = {
  "hha@satmz.com": { password: "hha123", userId: "USR009" }
};

export function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  
  if (!localStorage.getItem("inventory_customers")) {
    localStorage.setItem("inventory_customers", JSON.stringify(dummyCustomers));
  }
  
  if (!localStorage.getItem("inventory_items")) {
    localStorage.setItem("inventory_items", JSON.stringify(dummyInventory));
  }
  
  if (!localStorage.getItem("inventory_contracts")) {
    localStorage.setItem("inventory_contracts", JSON.stringify([...dummyParentContracts, ...dummyChildContracts]));
  }
  
  if (!localStorage.getItem("inventory_tickets")) {
    localStorage.setItem("inventory_tickets", JSON.stringify(dummyTickets));
  }
}
