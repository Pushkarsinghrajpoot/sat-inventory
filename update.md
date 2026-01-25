# Contract-Centric Inventory & Service Management System - Modification Prompt

> **Instructions**: Use this prompt to modify your existing Customer Inventory & Support Portal to implement the new contract-centric architecture with three user roles.

---

## Overview of Changes

Transform the existing inventory portal into a **Contract-Centric Enterprise Platform** where:
- All inventory, warranties, services, and tickets are linked to a **Contract Number**
- Support **three user roles**: Distributor, Reseller (dual behavior), End Customer
- Implement **Parent Contracts** and **Child Contracts** (AMC, Support, License)
- Access, actions, and visibility are strictly controlled by role and customer mapping

---

## Key Architectural Changes

### 1. Contract-Centric Data Model
- Every inventory item MUST be linked to a Contract Number
- Contracts have parent-child relationships
- Warranties and services are tied to contracts, not just products

### 2. Three-Tier User Roles
1. **Distributor (Admin)** - Full system control
2. **Reseller (Dual Behavior)** - Acts as distributor for downstream OR customer for upstream
3. **End Customer** - Read-only + support ticket access

### 3. New Data Entities
- Parent Contracts
- Child Contracts (AMC, Support, License types)
- Contract-Product mappings
- Role-based customer relationships

---

## Updated Dummy Credentials

```typescript
// src/data/dummyData.ts - Update users array

export const users = [
  // DISTRIBUTOR (Admin)
  {
    id: "USR001",
    email: "admin@satmz.com",
    password: "admin123",
    name: "Rajesh Kumar",
    role: "distributor",
    companyName: "SATMZ Distribution Pvt Ltd",
    phone: "+91-9876500001",
    avatar: null,
    createdAt: "2022-01-01"
  },
  {
    id: "USR002",
    email: "manager@satmz.com",
    password: "manager123",
    name: "Priya Sharma",
    role: "distributor",
    companyName: "SATMZ Distribution Pvt Ltd",
    phone: "+91-9876500002",
    avatar: null,
    createdAt: "2022-03-15"
  },
  
  // RESELLER (Dual Role - can act as distributor for their customers OR as customer for upstream)
  {
    id: "USR003",
    email: "reseller1@satmz.com",
    password: "reseller123",
    name: "John Mathew",
    role: "reseller",
    customerId: "CUST001", // Their own customer ID when acting as customer
    companyName: "Alpha Business Solutions",
    phone: "+91-9876543210",
    avatar: null,
    createdAt: "2023-01-15",
    // Reseller-specific: customers they manage (when acting as distributor)
    managedCustomerIds: ["CUST004", "CUST005"], 
    // Reseller-specific: their upstream distributor
    upstreamDistributorId: "USR001"
  },
  {
    id: "USR004",
    email: "reseller2@satmz.com",
    password: "reseller123",
    name: "Sarah Wilson",
    role: "reseller",
    customerId: "CUST002",
    companyName: "Beta Corporation",
    phone: "+91-9876543211",
    avatar: null,
    createdAt: "2023-03-20",
    managedCustomerIds: ["CUST006"],
    upstreamDistributorId: "USR001"
  },
  
  // END CUSTOMERS (Read-only + support access)
  {
    id: "USR005",
    email: "customer1@satmz.com",
    password: "customer123",
    name: "Mike Johnson",
    role: "customer",
    customerId: "CUST003",
    companyName: "Gamma Industries",
    phone: "+91-9876543212",
    avatar: null,
    createdAt: "2023-06-10"
  },
  {
    id: "USR006",
    email: "customer2@satmz.com",
    password: "customer123",
    name: "Amit Patel",
    role: "customer",
    customerId: "CUST004", // Managed by Reseller1
    companyName: "Delta Systems",
    phone: "+91-9876543213",
    avatar: null,
    createdAt: "2023-09-01"
  },
  {
    id: "USR007",
    email: "customer3@satmz.com",
    password: "customer123",
    name: "Lisa Chen",
    role: "customer",
    customerId: "CUST005", // Managed by Reseller1
    companyName: "Epsilon Tech",
    phone: "+91-9876543214",
    avatar: null,
    createdAt: "2023-10-15"
  },
  {
    id: "USR008",
    email: "customer4@satmz.com",
    password: "customer123",
    name: "David Brown",
    role: "customer",
    customerId: "CUST006", // Managed by Reseller2
    companyName: "Zeta Solutions",
    phone: "+91-9876543215",
    avatar: null,
    createdAt: "2023-11-20"
  }
];
```

---

## New Type Definitions

```typescript
// src/types/index.ts - Add/Update these types

export type UserRole = 'distributor' | 'reseller' | 'customer';

export type ContractStatus = 'draft' | 'active' | 'expiring_soon' | 'expired' | 'terminated';

export type ContractType = 'parent' | 'child';

export type ChildContractType = 'AMC' | 'Support' | 'License' | 'Extended Warranty';

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
  // Reseller-specific fields
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
  status: 'active' | 'inactive';
  // New: Who manages this customer
  managedBy: 'distributor' | string; // 'distributor' or reseller userId
  // New: Customer type
  customerType: 'direct' | 'reseller' | 'end_customer';
}

// NEW: Parent Contract
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
  // Products covered under this contract
  productIds: string[];
  // Child contracts linked
  childContractIds: string[];
  // Terms and conditions
  terms: string;
  // Renewal info
  autoRenew: boolean;
  renewalReminderDays: number;
}

// NEW: Child Contract (AMC, Support, License, etc.)
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
  // Coverage details
  coverageType: 'full' | 'limited' | 'parts_only' | 'labor_only';
  responseTime: string; // e.g., "4 hours", "24 hours", "Next Business Day"
  // Linked products/serial numbers
  coveredSerialNumbers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Updated Inventory Item - Now contract-linked
export interface InventoryItem {
  id: string;
  // NEW: Contract linkage (required)
  contractId: string;
  contractNumber: string;
  customerId: string;
  productName: string;
  serialNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  // Warranty info (can be from contract or standalone)
  warrantyStartDate: string | null;
  warrantyEndDate: string | null;
  warrantyContractId: string | null; // Link to child contract if applicable
  // License info
  licenseEndDate: string | null;
  licenseContractId: string | null;
  // Service info
  serviceType: string | null;
  serviceStartDate: string | null;
  serviceEndDate: string | null;
  serviceContractId: string | null; // Link to child contract
  category: string;
  manufacturer: string;
  model: string;
  invoiceNumber: string;
  challanNumber: string;
  poNumber: string;
  status: 'delivered' | 'pending' | 'cancelled';
  notes: string;
}

// Updated Ticket - Contract-aware
export interface Ticket {
  id: string;
  customerId: string;
  // NEW: Contract linkage
  contractId: string;
  contractNumber: string;
  serialNumber: string;
  productName: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  // Coverage from contract
  warrantyStatus: 'active' | 'expiring_soon' | 'expired' | 'not_applicable';
  serviceStatus: 'covered' | 'not_covered' | 'limited_coverage';
  coverageDetails: string; // e.g., "Under AMC - 4 hour response time"
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  timeline: TimelineEvent[];
}

// Role context for reseller dual behavior
export interface ResellerContext {
  mode: 'as_distributor' | 'as_customer';
  // When as_distributor: which customer they're managing
  selectedManagedCustomerId?: string;
}
```

---

## New Dummy Data Structures

### Customers (Updated with management hierarchy)

```typescript
export const customers: Customer[] = [
  // Direct customers of Distributor
  {
    id: "CUST001",
    name: "Alpha Business Solutions",
    email: "contact@alphabiz.com",
    phone: "+91-9876543210",
    address: "123, Tech Park, Andheri East, Mumbai - 400069",
    gstNumber: "27AAAAA0000A1Z5",
    contactPerson: "John Mathew",
    industry: "IT Services",
    createdAt: "2023-01-15",
    status: "active",
    managedBy: "distributor",
    customerType: "reseller" // This customer is also a reseller
  },
  {
    id: "CUST002",
    name: "Beta Corporation",
    email: "info@betacorp.com",
    phone: "+91-9876543211",
    address: "456, Business Hub, Connaught Place, New Delhi - 110001",
    gstNumber: "07BBBBB0000B1Z5",
    contactPerson: "Sarah Wilson",
    industry: "Manufacturing",
    createdAt: "2023-03-20",
    status: "active",
    managedBy: "distributor",
    customerType: "reseller" // This customer is also a reseller
  },
  {
    id: "CUST003",
    name: "Gamma Industries",
    email: "support@gammaindustries.com",
    phone: "+91-9876543212",
    address: "789, Industrial Area, Whitefield, Bangalore - 560066",
    gstNumber: "29CCCCC0000C1Z5",
    contactPerson: "Mike Johnson",
    industry: "Healthcare",
    createdAt: "2023-06-10",
    status: "active",
    managedBy: "distributor",
    customerType: "end_customer" // Direct end customer
  },
  // Customers managed by Reseller1 (Alpha Business Solutions)
  {
    id: "CUST004",
    name: "Delta Systems",
    email: "hello@deltasystems.com",
    phone: "+91-9876543213",
    address: "321, IT Corridor, HITEC City, Hyderabad - 500081",
    gstNumber: "36DDDDD0000D1Z5",
    contactPerson: "Amit Patel",
    industry: "Finance",
    createdAt: "2023-09-01",
    status: "active",
    managedBy: "USR003", // Managed by Reseller1
    customerType: "end_customer"
  },
  {
    id: "CUST005",
    name: "Epsilon Tech",
    email: "info@epsilontech.com",
    phone: "+91-9876543214",
    address: "555, Software Park, Pune - 411057",
    gstNumber: "27EEEEE0000E1Z5",
    contactPerson: "Lisa Chen",
    industry: "Software",
    createdAt: "2023-10-15",
    status: "active",
    managedBy: "USR003", // Managed by Reseller1
    customerType: "end_customer"
  },
  // Customers managed by Reseller2 (Beta Corporation)
  {
    id: "CUST006",
    name: "Zeta Solutions",
    email: "contact@zetasolutions.com",
    phone: "+91-9876543215",
    address: "888, Tech Valley, Gurgaon - 122001",
    gstNumber: "06ZZZZZ0000Z1Z5",
    contactPerson: "David Brown",
    industry: "Consulting",
    createdAt: "2023-11-20",
    status: "active",
    managedBy: "USR004", // Managed by Reseller2
    customerType: "end_customer"
  }
];
```

### Parent Contracts

```typescript
export const parentContracts: ParentContract[] = [
  // Distributor's contract with Reseller1 (Alpha Business Solutions)
  {
    id: "PC001",
    contractNumber: "SATMZ-2024-PC-001",
    customerId: "CUST001",
    customerName: "Alpha Business Solutions",
    title: "Enterprise IT Infrastructure Contract",
    description: "Comprehensive IT infrastructure supply and support agreement",
    startDate: "2024-01-01",
    endDate: formatDate(addDays(today, 365)),
    status: "active",
    totalValue: 5000000,
    createdBy: "USR001",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    productIds: ["INV001", "INV002", "INV003", "INV004"],
    childContractIds: ["CC001", "CC002"],
    terms: "Standard enterprise terms and conditions apply.",
    autoRenew: true,
    renewalReminderDays: 60
  },
  // Distributor's contract with Reseller2 (Beta Corporation)
  {
    id: "PC002",
    contractNumber: "SATMZ-2024-PC-002",
    customerId: "CUST002",
    customerName: "Beta Corporation",
    title: "Data Center Equipment Contract",
    description: "Data center hardware and support services",
    startDate: "2024-02-15",
    endDate: formatDate(addDays(today, 300)),
    status: "active",
    totalValue: 8500000,
    createdBy: "USR001",
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15",
    productIds: ["INV009", "INV010", "INV011"],
    childContractIds: ["CC003", "CC004"],
    terms: "Premium support terms with 24x7 coverage.",
    autoRenew: true,
    renewalReminderDays: 90
  },
  // Distributor's direct contract with End Customer (Gamma Industries)
  {
    id: "PC003",
    contractNumber: "SATMZ-2024-PC-003",
    customerId: "CUST003",
    customerName: "Gamma Industries",
    title: "Healthcare IT Solutions Contract",
    description: "Medical equipment IT infrastructure",
    startDate: "2024-03-01",
    endDate: formatDate(addDays(today, 45)), // Expiring soon
    status: "expiring_soon",
    totalValue: 3200000,
    createdBy: "USR001",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    productIds: ["INV016", "INV017", "INV018"],
    childContractIds: ["CC005"],
    terms: "Healthcare compliance terms included.",
    autoRenew: false,
    renewalReminderDays: 30
  },
  // Reseller1's contract with their customer (Delta Systems)
  {
    id: "PC004",
    contractNumber: "ALPHA-2024-PC-001",
    customerId: "CUST004",
    customerName: "Delta Systems",
    title: "Financial Services IT Contract",
    description: "Banking and financial IT infrastructure",
    startDate: "2024-04-01",
    endDate: formatDate(addDays(today, 200)),
    status: "active",
    totalValue: 2500000,
    createdBy: "USR003", // Created by Reseller1
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
    productIds: ["INV023", "INV024", "INV025"],
    childContractIds: ["CC006", "CC007"],
    terms: "Financial sector compliance included.",
    autoRenew: true,
    renewalReminderDays: 45
  },
  // Reseller1's contract with Epsilon Tech
  {
    id: "PC005",
    contractNumber: "ALPHA-2024-PC-002",
    customerId: "CUST005",
    customerName: "Epsilon Tech",
    title: "Software Development Infrastructure",
    description: "Development and testing environment setup",
    startDate: "2024-05-15",
    endDate: formatDate(addDays(today, 15)), // Expiring very soon
    status: "expiring_soon",
    totalValue: 1800000,
    createdBy: "USR003",
    createdAt: "2024-05-15",
    updatedAt: "2024-05-15",
    productIds: ["INV031", "INV032"],
    childContractIds: ["CC008"],
    terms: "Standard software development terms.",
    autoRenew: false,
    renewalReminderDays: 30
  },
  // Reseller2's contract with Zeta Solutions
  {
    id: "PC006",
    contractNumber: "BETA-2024-PC-001",
    customerId: "CUST006",
    customerName: "Zeta Solutions",
    title: "Consulting IT Infrastructure",
    description: "IT setup for consulting operations",
    startDate: "2024-06-01",
    endDate: formatDate(subDays(today, 10)), // Expired
    status: "expired",
    totalValue: 1200000,
    createdBy: "USR004", // Created by Reseller2
    createdAt: "2024-06-01",
    updatedAt: "2024-06-01",
    productIds: ["INV033", "INV034"],
    childContractIds: ["CC009"],
    terms: "Standard terms.",
    autoRenew: false,
    renewalReminderDays: 30
  }
];
```

### Child Contracts

```typescript
export const childContracts: ChildContract[] = [
  // Under PC001 (Alpha Business Solutions)
  {
    id: "CC001",
    contractNumber: "SATMZ-2024-CC-001",
    parentContractId: "PC001",
    parentContractNumber: "SATMZ-2024-PC-001",
    customerId: "CUST001",
    type: "AMC",
    title: "Annual Maintenance Contract - Servers",
    description: "Comprehensive AMC for all server equipment",
    startDate: "2024-01-01",
    endDate: formatDate(addDays(today, 365)),
    status: "active",
    value: 500000,
    coverageType: "full",
    responseTime: "4 hours",
    coveredSerialNumbers: ["SRV-2024-001234", "SRV-2024-001235"],
    createdBy: "USR001",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "CC002",
    contractNumber: "SATMZ-2024-CC-002",
    parentContractId: "PC001",
    parentContractNumber: "SATMZ-2024-PC-001",
    customerId: "CUST001",
    type: "License",
    title: "Microsoft 365 License Agreement",
    description: "Enterprise M365 licenses",
    startDate: "2024-02-01",
    endDate: formatDate(addDays(today, 25)), // Expiring soon
    status: "expiring_soon",
    value: 150000,
    coverageType: "full",
    responseTime: "24 hours",
    coveredSerialNumbers: ["LIC-M365-ALPHA-001"],
    createdBy: "USR001",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01"
  },
  // Under PC002 (Beta Corporation)
  {
    id: "CC003",
    contractNumber: "SATMZ-2024-CC-003",
    parentContractId: "PC002",
    parentContractNumber: "SATMZ-2024-PC-002",
    customerId: "CUST002",
    type: "Support",
    title: "Premium Support - Data Center",
    description: "24x7 premium support for data center equipment",
    startDate: "2024-02-15",
    endDate: formatDate(addDays(today, 300)),
    status: "active",
    value: 800000,
    coverageType: "full",
    responseTime: "2 hours",
    coveredSerialNumbers: ["SRV-2024-002001", "NET-2023-008765"],
    createdBy: "USR001",
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15"
  },
  {
    id: "CC004",
    contractNumber: "SATMZ-2024-CC-004",
    parentContractId: "PC002",
    parentContractNumber: "SATMZ-2024-PC-002",
    customerId: "CUST002",
    type: "Extended Warranty",
    title: "Extended Warranty - Laptops",
    description: "Extended warranty coverage for all laptops",
    startDate: "2024-01-10",
    endDate: formatDate(addDays(today, 28)), // Expiring soon
    status: "expiring_soon",
    value: 200000,
    coverageType: "full",
    responseTime: "Next Business Day",
    coveredSerialNumbers: ["LAP-2024-201"],
    createdBy: "USR001",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  // Under PC003 (Gamma Industries - Direct Customer)
  {
    id: "CC005",
    contractNumber: "SATMZ-2024-CC-005",
    parentContractId: "PC003",
    parentContractNumber: "SATMZ-2024-PC-003",
    customerId: "CUST003",
    type: "AMC",
    title: "Healthcare Equipment AMC",
    description: "AMC for medical IT infrastructure",
    startDate: "2024-03-01",
    endDate: formatDate(addDays(today, 45)),
    status: "expiring_soon",
    value: 350000,
    coverageType: "full",
    responseTime: "4 hours",
    coveredSerialNumbers: ["SRV-2023-003001", "LAP-2024-301"],
    createdBy: "USR001",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01"
  },
  // Under PC004 (Delta Systems - Reseller1's customer)
  {
    id: "CC006",
    contractNumber: "ALPHA-2024-CC-001",
    parentContractId: "PC004",
    parentContractNumber: "ALPHA-2024-PC-001",
    customerId: "CUST004",
    type: "AMC",
    title: "Financial Systems AMC",
    description: "AMC for banking infrastructure",
    startDate: "2024-04-01",
    endDate: formatDate(addDays(today, 200)),
    status: "active",
    value: 250000,
    coverageType: "full",
    responseTime: "2 hours",
    coveredSerialNumbers: ["SRV-2024-004001"],
    createdBy: "USR003",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01"
  },
  {
    id: "CC007",
    contractNumber: "ALPHA-2024-CC-002",
    parentContractId: "PC004",
    parentContractNumber: "ALPHA-2024-PC-001",
    customerId: "CUST004",
    type: "License",
    title: "Salesforce License Agreement",
    description: "CRM software licenses",
    startDate: "2024-01-01",
    endDate: formatDate(addDays(today, 55)),
    status: "expiring_soon",
    value: 180000,
    coverageType: "full",
    responseTime: "24 hours",
    coveredSerialNumbers: ["LIC-SF-DELTA-001"],
    createdBy: "USR003",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  // Under PC005 (Epsilon Tech - Reseller1's customer)
  {
    id: "CC008",
    contractNumber: "ALPHA-2024-CC-003",
    parentContractId: "PC005",
    parentContractNumber: "ALPHA-2024-PC-002",
    customerId: "CUST005",
    type: "Support",
    title: "Development Support",
    description: "Technical support for dev infrastructure",
    startDate: "2024-05-15",
    endDate: formatDate(addDays(today, 15)),
    status: "expiring_soon",
    value: 120000,
    coverageType: "limited",
    responseTime: "8 hours",
    coveredSerialNumbers: ["LAP-2024-501", "LAP-2024-502"],
    createdBy: "USR003",
    createdAt: "2024-05-15",
    updatedAt: "2024-05-15"
  },
  // Under PC006 (Zeta Solutions - Reseller2's customer) - EXPIRED
  {
    id: "CC009",
    contractNumber: "BETA-2024-CC-001",
    parentContractId: "PC006",
    parentContractNumber: "BETA-2024-PC-001",
    customerId: "CUST006",
    type: "AMC",
    title: "Consulting IT AMC",
    description: "AMC for consulting equipment",
    startDate: "2024-06-01",
    endDate: formatDate(subDays(today, 10)),
    status: "expired",
    value: 100000,
    coverageType: "limited",
    responseTime: "Next Business Day",
    coveredSerialNumbers: ["LAP-2024-601"],
    createdBy: "USR004",
    createdAt: "2024-06-01",
    updatedAt: "2024-06-01"
  }
];
```

---

## Updated Project Structure

Add/modify these files:

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── contracts/
│   │   │   ├── page.tsx                    # Contract list
│   │   │   ├── new/page.tsx                # Create new contract
│   │   │   ├── [id]/page.tsx               # Contract detail
│   │   │   └── [id]/child-contracts/
│   │   │       ├── page.tsx                # Child contracts list
│   │   │       └── new/page.tsx            # Create child contract
│   │   └── ... (existing pages)
├── components/
│   ├── contracts/
│   │   ├── ContractList.tsx
│   │   ├── ContractCard.tsx
│   │   ├── ContractDetailModal.tsx
│   │   ├── CreateContractForm.tsx
│   │   ├── CreateChildContractForm.tsx
│   │   ├── ContractStatusBadge.tsx
│   │   ├── ContractTimeline.tsx
│   │   └── ContractProductsTable.tsx
│   ├── shared/
│   │   ├── RoleContextSwitcher.tsx         # For reseller dual mode
│   │   └── ... (existing)
├── store/
│   ├── contractStore.ts                    # New store
│   ├── resellerContextStore.ts             # New store for reseller mode
│   └── ... (existing stores - modified)
├── data/
│   └── dummyData.ts                        # Updated with contracts
└── types/
    └── index.ts                            # Updated types
```

---

## Feature Modifications by Page

### 1. Login Page - No Changes
Keep existing login, role detection happens on successful login.

### 2. Sidebar - Add Contracts Menu & Role Context

```tsx
// Sidebar modifications:
// 1. Add "Contracts" menu item (new)
// 2. Add role context switcher for resellers

// Navigation items based on role:
const getNavigationItems = (role: UserRole, resellerContext?: ResellerContext) => {
  const baseItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Contracts', href: '/contracts', icon: FileText }, // NEW
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Warranty & Services', href: '/warranty', icon: Shield },
    { name: 'Support Tickets', href: '/tickets', icon: Ticket },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'History', href: '/history', icon: History },
  ];
  
  // Distributor gets Settings
  if (role === 'distributor') {
    baseItems.push({ name: 'Settings', href: '/settings', icon: Settings });
  }
  
  // Reseller in distributor mode gets Settings for their scope
  if (role === 'reseller' && resellerContext?.mode === 'as_distributor') {
    baseItems.push({ name: 'Settings', href: '/settings', icon: Settings });
  }
  
  return baseItems;
};

// For Resellers: Add context switcher in sidebar
// Shows: "Acting as: [Distributor ▾]" or "Acting as: [Customer ▾]"
```

### 3. Dashboard - Contract Awareness

**New Stats Cards:**
- Total Contracts (Active)
- Contracts Expiring Soon
- Open Tickets
- Revenue This Month (Distributor/Reseller-as-Distributor only)

**New Widgets:**
- Contract Expiry Alerts (replaces/augments current expiry alerts)
- Recent Contract Activity

**Role-based visibility:**
- **Distributor**: All contracts, all customers
- **Reseller (as Distributor)**: Only their managed customers' contracts
- **Reseller (as Customer)**: Only their own contracts from upstream
- **Customer**: Only their own contracts

### 4. NEW: Contracts Page

```
/contracts - Contract List Page

┌─────────────────────────────────────────────────────────────────────────────┐
│  Contracts                                    [+ Create Contract]          │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search contracts...  │ Status ▾ │ Customer ▾ │ Type ▾ │ [Clear] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PARENT CONTRACTS                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ SATMZ-2024-PC-001                                                    │   │
│  │ Enterprise IT Infrastructure Contract                               │   │
│  │ Customer: Alpha Business Solutions                                   │   │
│  │ Value: ₹50,00,000  •  Products: 4  •  Child Contracts: 2           │   │
│  │ Valid: Jan 1, 2024 - Jan 1, 2025  •  ● Active                       │   │
│  │                                                                      │   │
│  │ Child Contracts:                                                     │   │
│  │ ├─ CC-001: AMC - Servers (● Active)                                 │   │
│  │ └─ CC-002: License - M365 (○ Expiring in 25 days)                   │   │
│  │                                                                      │   │
│  │                    [View Details] [Add Child Contract] [Manage]     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ... more contracts                                                        │
└─────────────────────────────────────────────────────────────────────────────┘

ROLE-BASED ACTIONS:
- Distributor: Create, Edit, Renew, Expire, Delete contracts
- Reseller (as Distributor): Same as above, but only for their customers
- Reseller (as Customer): View only
- Customer: View only
```

### 5. Create Contract Flow (Distributor/Reseller-as-Distributor)

**Step 1: Select Customer**
```
┌─────────────────────────────────────────────────────────────────┐
│  Create New Contract                                            │
│                                                                 │
│  Step 1 of 4: Select Customer                                   │
│                                                                 │
│  Select Customer *                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Search customers...                                   ▾ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Or create a new customer                                       │
│                                                                 │
│                                          [Cancel] [Next →]      │
└─────────────────────────────────────────────────────────────────┘
```

**Step 2: Contract Details**
```
┌─────────────────────────────────────────────────────────────────┐
│  Step 2 of 4: Contract Details                                  │
│                                                                 │
│  Contract Number * (auto-generated, editable)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SATMZ-2024-PC-007                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Contract Title *                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Description                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Start Date *              End Date *                           │
│  ┌────────────────┐       ┌────────────────┐                   │
│  │ 📅 Select...   │       │ 📅 Select...   │                   │
│  └────────────────┘       └────────────────┘                   │
│                                                                 │
│  Total Contract Value *                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ₹                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ☐ Auto-renew contract                                         │
│  Renewal reminder: [60 ▾] days before expiry                   │
│                                                                 │
│                                    [← Back] [Next: Add Products]│
└─────────────────────────────────────────────────────────────────┘
```

**Step 3: Add Products**
```
┌─────────────────────────────────────────────────────────────────┐
│  Step 3 of 4: Add Products                                      │
│                                                                 │
│  Add products covered under this contract                       │
│                                                                 │
│  [+ Add Product]                                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Product Name        │ Serial Number  │ Qty │ Warranty   │ X │
│  ├─────────────────────┼────────────────┼─────┼────────────┼───┤
│  │ Dell PowerEdge R750 │ SRV-2024-007   │ 2   │ 3 years    │ ✕ │
│  │ Cisco Switch 9300   │ NET-2024-015   │ 4   │ 2 years    │ ✕ │
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Or select from existing inventory                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Select products...                                    ▾ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                                      [← Back] [Next: Review]    │
└─────────────────────────────────────────────────────────────────┘
```

**Step 4: Review & Create**
```
┌─────────────────────────────────────────────────────────────────┐
│  Step 4 of 4: Review & Create                                   │
│                                                                 │
│  CONTRACT SUMMARY                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Contract: SATMZ-2024-PC-007                             │   │
│  │ Customer: Delta Systems                                  │   │
│  │ Title: Enterprise IT Infrastructure                      │   │
│  │ Period: Jan 15, 2025 - Jan 14, 2026                     │   │
│  │ Value: ₹25,00,000                                       │   │
│  │ Products: 2 items (6 units total)                       │   │
│  │ Auto-renew: Yes (60 days reminder)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ☐ Create as Draft (edit before activating)                    │
│  ☑ Activate immediately                                        │
│                                                                 │
│                                   [← Back] [Create Contract]    │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Contract Detail Page

```
/contracts/[id] - Contract Detail

┌─────────────────────────────────────────────────────────────────────────────┐
│  [← Back to Contracts]                                                     │
│                                                                             │
│  SATMZ-2024-PC-001                               ● Active                  │
│  Enterprise IT Infrastructure Contract                                      │
│                                                                             │
│  Customer: Alpha Business Solutions                                         │
│  Created: Jan 1, 2024  •  Valid until: Jan 1, 2025 (340 days remaining)   │
│  Total Value: ₹50,00,000                                                   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ [Overview] [Products (4)] [Child Contracts (2)] [History] [Documents]│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  OVERVIEW TAB:                                                              │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │ CONTRACT DETAILS                │  │ QUICK ACTIONS                   │ │
│  │                                 │  │                                 │ │
│  │ Start Date: Jan 1, 2024        │  │ [+ Add Product]                 │ │
│  │ End Date: Jan 1, 2025          │  │ [+ Add Child Contract]          │ │
│  │ Auto-renew: Yes                │  │ [✏️ Edit Contract]              │ │
│  │ Reminder: 60 days              │  │ [🔄 Renew Contract]             │ │
│  │                                 │  │ [⏹️ Expire Contract]            │ │
│  │ Terms:                         │  │                                 │ │
│  │ Standard enterprise terms...   │  └─────────────────────────────────┘ │
│  └─────────────────────────────────┘                                       │
│                                                                             │
│  CHILD CONTRACTS TAB:                                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ CC-001: AMC - Servers                                                │  │
│  │ Coverage: Full  •  Response: 4 hours  •  ● Active                   │  │
│  │ Products: SRV-2024-001234, SRV-2024-001235                          │  │
│  │ Valid: Jan 1, 2024 - Jan 1, 2025                                    │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ CC-002: License - Microsoft 365                                      │  │
│  │ Coverage: Full  •  Response: 24 hours  •  ○ Expiring (25 days)      │  │
│  │ Products: LIC-M365-ALPHA-001                                        │  │
│  │ Valid: Feb 1, 2024 - Mar 1, 2025                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  PRODUCTS TAB:                                                              │
│  (Table showing all products under this contract)                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7. Inventory Page - Contract-Linked

**Modifications:**
- Add "Contract" column showing contract number
- Add "Contract" filter dropdown
- Every item must show linked contract
- When adding new inventory, must select/create contract first

```
Filter bar additions:
│ Contract ▾ │ - Filter by contract number

Table columns (updated):
│ Product │ Serial │ Contract │ Category │ Warranty │ Service │ Status │ Actions │
```

### 8. Warranty & Services Page - Contract-Linked

**Modifications:**
- Show warranty/service status from child contracts
- Link to parent and child contracts
- Group by contract

### 9. Tickets Page - Contract-Linked

**Ticket Creation:**
When creating a ticket, the coverage info comes from the contract:

```
┌─────────────────────────────────────────────────────────────────┐
│  COVERAGE INFO (from Contract)                                  │
│                                                                 │
│  Contract: SATMZ-2024-PC-001                                   │
│  Child Contract: CC-001 (AMC - Servers)                        │
│                                                                 │
│  ✓ This product is COVERED under active AMC                    │
│  ✓ Response Time: 4 hours                                      │
│  ✓ Coverage Type: Full (parts + labor)                         │
│                                                                 │
│  Support will be provided at no additional cost.               │
└─────────────────────────────────────────────────────────────────┘
```

**Ticket List:**
- Show contract number column
- Filter by contract

### 10. Reseller Context Switcher Component

For resellers, add a context switcher in the header or sidebar:

```tsx
// components/shared/RoleContextSwitcher.tsx

const RoleContextSwitcher = () => {
  const { user } = useAuthStore();
  const { mode, setMode, selectedManagedCustomerId } = useResellerContextStore();
  
  if (user?.role !== 'reseller') return null;
  
  return (
    <div className="p-4 border-b border-gray-200 bg-blue-50">
      <p className="text-xs text-gray-500 mb-2">You are acting as:</p>
      <Select value={mode} onValueChange={setMode}>
        <SelectTrigger className="w-full">
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
      
      {mode === 'as_distributor' && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Select customer to manage:</p>
          <Select value={selectedManagedCustomerId} onValueChange={setSelectedManagedCustomerId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All my customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All My Customers</SelectItem>
              {user.managedCustomerIds?.map(customerId => (
                <SelectItem key={customerId} value={customerId}>
                  {getCustomerName(customerId)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
```

---

## New Zustand Stores

### Contract Store

```typescript
// src/store/contractStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ParentContract, ChildContract } from '@/types';
import { parentContracts as initialParentContracts, childContracts as initialChildContracts } from '@/data/dummyData';

interface ContractState {
  parentContracts: ParentContract[];
  childContracts: ChildContract[];
  isLoading: boolean;
  
  // Parent contract actions
  addParentContract: (contract: ParentContract) => void;
  updateParentContract: (id: string, updates: Partial<ParentContract>) => void;
  deleteParentContract: (id: string) => void;
  
  // Child contract actions
  addChildContract: (contract: ChildContract) => void;
  updateChildContract: (id: string, updates: Partial<ChildContract>) => void;
  deleteChildContract: (id: string) => void;
  
  // Query helpers
  getContractsByCustomerId: (customerId: string) => ParentContract[];
  getChildContractsByParentId: (parentId: string) => ChildContract[];
  getContractCoverage: (serialNumber: string) => {
    parentContract: ParentContract | null;
    childContracts: ChildContract[];
    isCovered: boolean;
    coverageDetails: string;
  };
  getExpiringContracts: (days: number) => ParentContract[];
}

export const useContractStore = create<ContractState>()(
  persist(
    (set, get) => ({
      parentContracts: initialParentContracts,
      childContracts: initialChildContracts,
      isLoading: false,
      
      addParentContract: (contract) => set((state) => ({
        parentContracts: [...state.parentContracts, contract]
      })),
      
      updateParentContract: (id, updates) => set((state) => ({
        parentContracts: state.parentContracts.map(c => 
          c.id === id ? { ...c, ...updates } : c
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
          c.id === id ? { ...c, ...updates } : c
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
        
        // Find child contracts covering this serial number
        const coveringChildContracts = childContracts.filter(cc => 
          cc.coveredSerialNumbers.includes(serialNumber) && cc.status === 'active'
        );
        
        if (coveringChildContracts.length === 0) {
          return {
            parentContract: null,
            childContracts: [],
            isCovered: false,
            coverageDetails: 'Not covered under any active contract'
          };
        }
        
        const parentContract = parentContracts.find(pc => 
          pc.id === coveringChildContracts[0].parentContractId
        );
        
        const primaryCoverage = coveringChildContracts[0];
        const coverageDetails = `Covered under ${primaryCoverage.type} - ${primaryCoverage.responseTime} response time`;
        
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
          const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry > 0 && daysUntilExpiry <= days;
        });
      }
    }),
    {
      name: 'contract-storage'
    }
  )
);
```

### Reseller Context Store

```typescript
// src/store/resellerContextStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ResellerContextState {
  mode: 'as_distributor' | 'as_customer';
  selectedManagedCustomerId: string | null;
  
  setMode: (mode: 'as_distributor' | 'as_customer') => void;
  setSelectedManagedCustomerId: (customerId: string | null) => void;
  reset: () => void;
}

export const useResellerContextStore = create<ResellerContextState>()(
  persist(
    (set) => ({
      mode: 'as_distributor', // Default mode for resellers
      selectedManagedCustomerId: null,
      
      setMode: (mode) => set({ mode }),
      setSelectedManagedCustomerId: (customerId) => set({ selectedManagedCustomerId: customerId }),
      reset: () => set({ mode: 'as_distributor', selectedManagedCustomerId: null })
    }),
    {
      name: 'reseller-context-storage'
    }
  )
);
```

---

## Permission Matrix

```typescript
// src/lib/permissions.ts

type Permission = 
  | 'contracts.view'
  | 'contracts.create'
  | 'contracts.edit'
  | 'contracts.delete'
  | 'contracts.renew'
  | 'contracts.expire'
  | 'inventory.view'
  | 'inventory.create'
  | 'inventory.edit'
  | 'inventory.delete'
  | 'tickets.view'
  | 'tickets.create'
  | 'tickets.manage'
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'settings.access';

const permissionsByRole: Record<string, Permission[]> = {
  distributor: [
    'contracts.view', 'contracts.create', 'contracts.edit', 'contracts.delete', 'contracts.renew', 'contracts.expire',
    'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
    'tickets.view', 'tickets.create', 'tickets.manage',
    'customers.view', 'customers.create', 'customers.edit',
    'settings.access'
  ],
  'reseller_as_distributor': [
    'contracts.view', 'contracts.create', 'contracts.edit', 'contracts.renew', 'contracts.expire',
    'inventory.view', 'inventory.create', 'inventory.edit',
    'tickets.view', 'tickets.create', 'tickets.manage',
    'customers.view', 'customers.create', 'customers.edit',
    'settings.access'
  ],
  'reseller_as_customer': [
    'contracts.view',
    'inventory.view',
    'tickets.view', 'tickets.create',
    'customers.view'
  ],
  customer: [
    'contracts.view',
    'inventory.view',
    'tickets.view', 'tickets.create',
    'customers.view'
  ]
};

export const hasPermission = (
  userRole: UserRole,
  permission: Permission,
  resellerContext?: ResellerContext
): boolean => {
  let effectiveRole = userRole;
  
  if (userRole === 'reseller' && resellerContext) {
    effectiveRole = resellerContext.mode === 'as_distributor' 
      ? 'reseller_as_distributor' 
      : 'reseller_as_customer';
  }
  
  return permissionsByRole[effectiveRole]?.includes(permission) ?? false;
};

// Hook for use in components
export const usePermissions = () => {
  const { user } = useAuthStore();
  const { mode } = useResellerContextStore();
  
  const resellerContext: ResellerContext | undefined = user?.role === 'reseller' 
    ? { mode } 
    : undefined;
  
  return {
    can: (permission: Permission) => hasPermission(user?.role || 'customer', permission, resellerContext),
    isDistributor: user?.role === 'distributor',
    isReseller: user?.role === 'reseller',
    isCustomer: user?.role === 'customer',
    resellerMode: user?.role === 'reseller' ? mode : null
  };
};
```

---

## Data Access Helper

```typescript
// src/lib/dataAccess.ts

// Get accessible customer IDs based on role and context
export const getAccessibleCustomerIds = (
  user: User,
  resellerContext?: ResellerContext
): string[] => {
  switch (user.role) {
    case 'distributor':
      // Distributor sees all customers
      return customers.map(c => c.id);
      
    case 'reseller':
      if (resellerContext?.mode === 'as_distributor') {
        // Reseller as distributor sees their managed customers
        return user.managedCustomerIds || [];
      } else {
        // Reseller as customer sees only their own
        return user.customerId ? [user.customerId] : [];
      }
      
    case 'customer':
      // Customer sees only their own
      return user.customerId ? [user.customerId] : [];
      
    default:
      return [];
  }
};

// Filter any data array by accessible customer IDs
export const filterByAccessibleCustomers = <T extends { customerId: string }>(
  data: T[],
  user: User,
  resellerContext?: ResellerContext
): T[] => {
  const accessibleIds = getAccessibleCustomerIds(user, resellerContext);
  return data.filter(item => accessibleIds.includes(item.customerId));
};
```

---

## Testing Scenarios

### Test Credentials Summary

| Role | Email | Password | Company | Behavior |
|------|-------|----------|---------|----------|
| Distributor | admin@satmz.com | admin123 | SATMZ Distribution | Full access |
| Distributor | manager@satmz.com | manager123 | SATMZ Distribution | Full access |
| Reseller | reseller1@satmz.com | reseller123 | Alpha Business | Dual: Manages CUST004, CUST005 OR is customer of SATMZ |
| Reseller | reseller2@satmz.com | reseller123 | Beta Corporation | Dual: Manages CUST006 OR is customer of SATMZ |
| Customer | customer1@satmz.com | customer123 | Gamma Industries | Read-only, direct customer |
| Customer | customer2@satmz.com | customer123 | Delta Systems | Read-only, managed by Reseller1 |
| Customer | customer3@satmz.com | customer123 | Epsilon Tech | Read-only, managed by Reseller1 |
| Customer | customer4@satmz.com | customer123 | Zeta Solutions | Read-only, managed by Reseller2 |

### Test Flows

1. **Distributor Flow:**
   - Login as admin@satmz.com
   - Create parent contract for any customer
   - Add products to contract
   - Create child contracts (AMC, Support, License)
   - View all contracts across all customers
   - Manage tickets for all customers

2. **Reseller as Distributor Flow:**
   - Login as reseller1@satmz.com
   - Switch to "Acting as: Distributor"
   - Select customer "Delta Systems" (CUST004)
   - Create contract for Delta Systems
   - Add products and child contracts
   - Manage tickets for Delta Systems and Epsilon Tech

3. **Reseller as Customer Flow:**
   - Login as reseller1@satmz.com
   - Switch to "Acting as: Customer"
   - View only contracts assigned from SATMZ Distribution
   - View inventory (read-only)
   - Raise support tickets
   - Cannot create/edit contracts

4. **End Customer Flow:**
   - Login as customer1@satmz.com
   - View assigned contracts
   - View inventory (read-only)
   - Check warranty/service coverage
   - Raise support ticket
   - Cannot create/edit anything

---

## Implementation Priority

1. **Phase 1: Data Model & Types**
   - Update type definitions
   - Add contract-related types
   - Update dummy data with contracts

2. **Phase 2: Stores**
   - Create contractStore
   - Create resellerContextStore
   - Update existing stores for contract linkage

3. **Phase 3: Permissions & Access**
   - Implement permission system
   - Implement data access helpers
   - Add role context switching

4. **Phase 4: UI Components**
   - Create contract components
   - Add context switcher for resellers
   - Update existing components for contract awareness

5. **Phase 5: Pages**
   - Create contracts pages
   - Update inventory page
   - Update tickets page
   - Update dashboard

6. **Phase 6: Testing & Polish**
   - Test all role scenarios
   - Test data isolation
   - Add loading states and error handling

---

## Summary of Changes

| Area | Change Type | Description |
|------|-------------|-------------|
| Data Model | New | Parent Contracts, Child Contracts |
| Data Model | Modified | Inventory items link to contracts |
| Data Model | Modified | Tickets show contract coverage |
| User Roles | New | Customer role added |
| User Roles | Modified | Reseller has dual behavior |
| Navigation | New | Contracts menu item |
| Navigation | New | Reseller context switcher |
| Pages | New | /contracts, /contracts/new, /contracts/[id] |
| Pages | Modified | Dashboard, Inventory, Tickets, Warranty |
| Stores | New | contractStore, resellerContextStore |
| Stores | Modified | All stores filter by accessible customers |
| Permissions | New | Role-based permission system |

---

**Apply these changes incrementally, testing each phase before moving to the next. The contract-centric architecture is the foundation - ensure it's solid before building the UI on top.**