import { Customer, InventoryItem, Ticket, Notification, User } from "./types";
import { addDays, subDays, format } from "date-fns";

const today = new Date();

export const dummyUsers: User[] = [
  {
    id: "USR001",
    email: "admin@satmz.com",
    role: "distributor",
    companyName: "SATMZ"
  },
  {
    id: "USR002",
    email: "reseller1@satmz.com",
    role: "reseller",
    customerId: "CUST001",
    companyName: "Alpha Business Solutions"
  },
  {
    id: "USR003",
    email: "reseller2@satmz.com",
    role: "reseller",
    customerId: "CUST002",
    companyName: "Beta Corporation"
  }
];

export const dummyCustomers: Customer[] = [
  {
    id: "CUST001",
    name: "Alpha Business Solutions",
    email: "contact@satmz.com",
    phone: "+91-9876543210",
    address: "Mumbai, India",
    createdAt: "2023-01-15"
  },
  {
    id: "CUST002",
    name: "Beta Corporation",
    email: "info@satmz.com",
    phone: "+91-9876543211",
    address: "Delhi, India",
    createdAt: "2023-03-20"
  },
  {
    id: "CUST003",
    name: "Gamma Industries",
    email: "support@satmz.com",
    phone: "+91-9876543212",
    address: "Bangalore, India",
    createdAt: "2023-06-10"
  }
];

export const dummyInventory: InventoryItem[] = [
  {
    id: "INV001",
    customerId: "CUST001",
    productName: "Dell PowerEdge R750 Server",
    serialNumber: "SRV-2024-001234",
    quantity: 2,
    deliveryDate: "2024-01-15",
    warrantyStartDate: "2024-01-15",
    warrantyEndDate: format(addDays(today, 400), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "AMC",
    serviceStartDate: "2024-01-15",
    serviceEndDate: format(addDays(today, 100), "yyyy-MM-dd"),
    category: "Server",
    invoiceNumber: "INV-2024-0001",
    challanNumber: "DC-2024-0001",
    status: "delivered"
  },
  {
    id: "INV002",
    customerId: "CUST001",
    productName: "HP EliteBook 840 G9",
    serialNumber: "LAP-2024-002345",
    quantity: 10,
    deliveryDate: "2024-02-10",
    warrantyStartDate: "2024-02-10",
    warrantyEndDate: format(addDays(today, 25), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 25), "yyyy-MM-dd"),
    serviceType: "Extended Support",
    serviceStartDate: "2024-02-10",
    serviceEndDate: format(addDays(today, 180), "yyyy-MM-dd"),
    category: "Laptop",
    invoiceNumber: "INV-2024-0002",
    challanNumber: "DC-2024-0002",
    status: "delivered"
  },
  {
    id: "INV003",
    customerId: "CUST002",
    productName: "Cisco Catalyst 9300 Switch",
    serialNumber: "NET-2024-003456",
    quantity: 5,
    deliveryDate: "2024-01-20",
    warrantyStartDate: "2024-01-20",
    warrantyEndDate: format(addDays(today, 55), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "AMC",
    serviceStartDate: "2024-01-20",
    serviceEndDate: format(addDays(today, 200), "yyyy-MM-dd"),
    category: "Networking Equipment",
    invoiceNumber: "INV-2024-0003",
    challanNumber: "DC-2024-0003",
    status: "delivered"
  },
  {
    id: "INV004",
    customerId: "CUST002",
    productName: "Microsoft Office 365 E3",
    serialNumber: "LIC-2024-004567",
    quantity: 50,
    deliveryDate: "2024-03-01",
    warrantyStartDate: "2024-03-01",
    warrantyEndDate: format(addDays(today, 300), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 85), "yyyy-MM-dd"),
    serviceType: "Premium Support",
    serviceStartDate: "2024-03-01",
    serviceEndDate: format(addDays(today, 300), "yyyy-MM-dd"),
    category: "Software License",
    invoiceNumber: "INV-2024-0004",
    challanNumber: "DC-2024-0004",
    status: "delivered"
  },
  {
    id: "INV005",
    customerId: "CUST003",
    productName: "Lenovo ThinkPad X1 Carbon",
    serialNumber: "LAP-2024-005678",
    quantity: 15,
    deliveryDate: "2023-12-15",
    warrantyStartDate: "2023-12-15",
    warrantyEndDate: format(subDays(today, 10), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Laptop",
    invoiceNumber: "INV-2023-0045",
    challanNumber: "DC-2023-0045",
    status: "delivered"
  },
  {
    id: "INV006",
    customerId: "CUST001",
    productName: "HPE ProLiant DL380 Gen10",
    serialNumber: "SRV-2024-006789",
    quantity: 1,
    deliveryDate: "2024-01-05",
    warrantyStartDate: "2024-01-05",
    warrantyEndDate: format(addDays(today, 500), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "AMC",
    serviceStartDate: "2024-01-05",
    serviceEndDate: format(addDays(today, 365), "yyyy-MM-dd"),
    category: "Server",
    invoiceNumber: "INV-2024-0005",
    challanNumber: "DC-2024-0005",
    status: "delivered"
  },
  {
    id: "INV007",
    customerId: "CUST003",
    productName: "Dell UltraSharp U2720Q Monitor",
    serialNumber: "MON-2024-007890",
    quantity: 20,
    deliveryDate: "2024-02-01",
    warrantyStartDate: "2024-02-01",
    warrantyEndDate: format(addDays(today, 700), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Monitor",
    invoiceNumber: "INV-2024-0006",
    challanNumber: "DC-2024-0006",
    status: "delivered"
  },
  {
    id: "INV008",
    customerId: "CUST002",
    productName: "HP LaserJet Enterprise M507",
    serialNumber: "PRT-2024-008901",
    quantity: 3,
    deliveryDate: "2023-11-10",
    warrantyStartDate: "2023-11-10",
    warrantyEndDate: format(subDays(today, 30), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Extended Support",
    serviceStartDate: "2023-11-10",
    serviceEndDate: format(addDays(today, 60), "yyyy-MM-dd"),
    category: "Printer",
    invoiceNumber: "INV-2023-0040",
    challanNumber: "DC-2023-0040",
    status: "delivered"
  },
  {
    id: "INV009",
    customerId: "CUST001",
    productName: "NetApp FAS2750 Storage",
    serialNumber: "STO-2024-009012",
    quantity: 1,
    deliveryDate: "2024-03-15",
    warrantyStartDate: "2024-03-15",
    warrantyEndDate: format(addDays(today, 900), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Premium Support",
    serviceStartDate: "2024-03-15",
    serviceEndDate: format(addDays(today, 900), "yyyy-MM-dd"),
    category: "Storage Device",
    invoiceNumber: "INV-2024-0007",
    challanNumber: "DC-2024-0007",
    status: "delivered"
  },
  {
    id: "INV010",
    customerId: "CUST003",
    productName: "Adobe Creative Cloud Team",
    serialNumber: "LIC-2024-010123",
    quantity: 25,
    deliveryDate: "2024-01-25",
    warrantyStartDate: "2024-01-25",
    warrantyEndDate: format(addDays(today, 250), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 40), "yyyy-MM-dd"),
    serviceType: "Standard Support",
    serviceStartDate: "2024-01-25",
    serviceEndDate: format(addDays(today, 250), "yyyy-MM-dd"),
    category: "Software License",
    invoiceNumber: "INV-2024-0008",
    challanNumber: "DC-2024-0008",
    status: "delivered"
  },
  {
    id: "INV011",
    customerId: "CUST002",
    productName: "Fortinet FortiGate 100F",
    serialNumber: "NET-2024-011234",
    quantity: 2,
    deliveryDate: "2024-02-15",
    warrantyStartDate: "2024-02-15",
    warrantyEndDate: format(addDays(today, 600), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 45), "yyyy-MM-dd"),
    serviceType: "AMC",
    serviceStartDate: "2024-02-15",
    serviceEndDate: format(addDays(today, 365), "yyyy-MM-dd"),
    category: "Networking Equipment",
    invoiceNumber: "INV-2024-0009",
    challanNumber: "DC-2024-0009",
    status: "delivered"
  },
  {
    id: "INV012",
    customerId: "CUST001",
    productName: "Dell Latitude 7430",
    serialNumber: "LAP-2024-012345",
    quantity: 8,
    deliveryDate: "2023-10-20",
    warrantyStartDate: "2023-10-20",
    warrantyEndDate: format(subDays(today, 5), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Laptop",
    invoiceNumber: "INV-2023-0035",
    challanNumber: "DC-2023-0035",
    status: "delivered"
  },
  {
    id: "INV013",
    customerId: "CUST003",
    productName: "VMware vSphere Enterprise Plus",
    serialNumber: "LIC-2024-013456",
    quantity: 10,
    deliveryDate: "2024-03-10",
    warrantyStartDate: "2024-03-10",
    warrantyEndDate: format(addDays(today, 320), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 75), "yyyy-MM-dd"),
    serviceType: "Premium Support",
    serviceStartDate: "2024-03-10",
    serviceEndDate: format(addDays(today, 320), "yyyy-MM-dd"),
    category: "Software License",
    invoiceNumber: "INV-2024-0010",
    challanNumber: "DC-2024-0010",
    status: "delivered"
  },
  {
    id: "INV014",
    customerId: "CUST002",
    productName: "Apple MacBook Pro 16-inch",
    serialNumber: "LAP-2024-014567",
    quantity: 5,
    deliveryDate: "2024-01-30",
    warrantyStartDate: "2024-01-30",
    warrantyEndDate: format(addDays(today, 280), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "AppleCare+",
    serviceStartDate: "2024-01-30",
    serviceEndDate: format(addDays(today, 1095), "yyyy-MM-dd"),
    category: "Laptop",
    invoiceNumber: "INV-2024-0011",
    challanNumber: "DC-2024-0011",
    status: "delivered"
  },
  {
    id: "INV015",
    customerId: "CUST001",
    productName: "Aruba AP-535 Access Point",
    serialNumber: "NET-2024-015678",
    quantity: 12,
    deliveryDate: "2024-02-20",
    warrantyStartDate: "2024-02-20",
    warrantyEndDate: format(addDays(today, 450), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Extended Support",
    serviceStartDate: "2024-02-20",
    serviceEndDate: format(addDays(today, 450), "yyyy-MM-dd"),
    category: "Networking Equipment",
    invoiceNumber: "INV-2024-0012",
    challanNumber: "DC-2024-0012",
    status: "delivered"
  },
  {
    id: "INV016",
    customerId: "CUST003",
    productName: "Synology DS1621+ NAS",
    serialNumber: "STO-2024-016789",
    quantity: 2,
    deliveryDate: "2023-12-01",
    warrantyStartDate: "2023-12-01",
    warrantyEndDate: format(subDays(today, 20), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Storage Device",
    invoiceNumber: "INV-2023-0042",
    challanNumber: "DC-2023-0042",
    status: "delivered"
  },
  {
    id: "INV017",
    customerId: "CUST002",
    productName: "Zoom Rooms License",
    serialNumber: "LIC-2024-017890",
    quantity: 8,
    deliveryDate: "2024-01-10",
    warrantyStartDate: "2024-01-10",
    warrantyEndDate: format(addDays(today, 220), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 35), "yyyy-MM-dd"),
    serviceType: "Standard Support",
    serviceStartDate: "2024-01-10",
    serviceEndDate: format(addDays(today, 220), "yyyy-MM-dd"),
    category: "Software License",
    invoiceNumber: "INV-2024-0013",
    challanNumber: "DC-2024-0013",
    status: "delivered"
  },
  {
    id: "INV018",
    customerId: "CUST001",
    productName: "HP Z2 Tower G9 Workstation",
    serialNumber: "WKS-2024-018901",
    quantity: 6,
    deliveryDate: "2024-03-05",
    warrantyStartDate: "2024-03-05",
    warrantyEndDate: format(addDays(today, 850), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Premium Support",
    serviceStartDate: "2024-03-05",
    serviceEndDate: format(addDays(today, 850), "yyyy-MM-dd"),
    category: "Workstation",
    invoiceNumber: "INV-2024-0014",
    challanNumber: "DC-2024-0014",
    status: "delivered"
  },
  {
    id: "INV019",
    customerId: "CUST003",
    productName: "Epson EcoTank L15150",
    serialNumber: "PRT-2024-019012",
    quantity: 4,
    deliveryDate: "2023-11-25",
    warrantyStartDate: "2023-11-25",
    warrantyEndDate: format(subDays(today, 15), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Extended Support",
    serviceStartDate: "2023-11-25",
    serviceEndDate: format(addDays(today, 90), "yyyy-MM-dd"),
    category: "Printer",
    invoiceNumber: "INV-2023-0041",
    challanNumber: "DC-2023-0041",
    status: "delivered"
  },
  {
    id: "INV020",
    customerId: "CUST002",
    productName: "Sophos XG 230 Firewall",
    serialNumber: "NET-2024-020123",
    quantity: 1,
    deliveryDate: "2024-02-28",
    warrantyStartDate: "2024-02-28",
    warrantyEndDate: format(addDays(today, 520), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 88), "yyyy-MM-dd"),
    serviceType: "AMC",
    serviceStartDate: "2024-02-28",
    serviceEndDate: format(addDays(today, 365), "yyyy-MM-dd"),
    category: "Networking Equipment",
    invoiceNumber: "INV-2024-0015",
    challanNumber: "DC-2024-0015",
    status: "delivered"
  },
  {
    id: "INV021",
    customerId: "CUST001",
    productName: "Logitech MeetUp Camera",
    serialNumber: "CAM-2024-021234",
    quantity: 10,
    deliveryDate: "2024-01-12",
    warrantyStartDate: "2024-01-12",
    warrantyEndDate: format(addDays(today, 650), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Conference Equipment",
    invoiceNumber: "INV-2024-0016",
    challanNumber: "DC-2024-0016",
    status: "delivered"
  },
  {
    id: "INV022",
    customerId: "CUST003",
    productName: "AutoCAD 2024 License",
    serialNumber: "LIC-2024-022345",
    quantity: 15,
    deliveryDate: "2024-03-20",
    warrantyStartDate: "2024-03-20",
    warrantyEndDate: format(addDays(today, 340), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 62), "yyyy-MM-dd"),
    serviceType: "Standard Support",
    serviceStartDate: "2024-03-20",
    serviceEndDate: format(addDays(today, 340), "yyyy-MM-dd"),
    category: "Software License",
    invoiceNumber: "INV-2024-0017",
    challanNumber: "DC-2024-0017",
    status: "delivered"
  },
  {
    id: "INV023",
    customerId: "CUST002",
    productName: "ASUS ROG Strix Laptop",
    serialNumber: "LAP-2024-023456",
    quantity: 3,
    deliveryDate: "2023-10-15",
    warrantyStartDate: "2023-10-15",
    warrantyEndDate: format(subDays(today, 2), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Laptop",
    invoiceNumber: "INV-2023-0034",
    challanNumber: "DC-2023-0034",
    status: "delivered"
  },
  {
    id: "INV024",
    customerId: "CUST001",
    productName: "Dell EMC PowerStore 500T",
    serialNumber: "STO-2024-024567",
    quantity: 1,
    deliveryDate: "2024-02-05",
    warrantyStartDate: "2024-02-05",
    warrantyEndDate: format(addDays(today, 1000), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Premium Support",
    serviceStartDate: "2024-02-05",
    serviceEndDate: format(addDays(today, 1095), "yyyy-MM-dd"),
    category: "Storage Device",
    invoiceNumber: "INV-2024-0018",
    challanNumber: "DC-2024-0018",
    status: "delivered"
  },
  {
    id: "INV025",
    customerId: "CUST003",
    productName: "Ubiquiti UniFi Dream Machine Pro",
    serialNumber: "NET-2024-025678",
    quantity: 3,
    deliveryDate: "2024-01-08",
    warrantyStartDate: "2024-01-08",
    warrantyEndDate: format(addDays(today, 380), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Extended Support",
    serviceStartDate: "2024-01-08",
    serviceEndDate: format(addDays(today, 730), "yyyy-MM-dd"),
    category: "Networking Equipment",
    invoiceNumber: "INV-2024-0019",
    challanNumber: "DC-2024-0019",
    status: "delivered"
  },
  {
    id: "INV026",
    customerId: "CUST002",
    productName: "Microsoft SQL Server 2022",
    serialNumber: "LIC-2024-026789",
    quantity: 5,
    deliveryDate: "2024-03-12",
    warrantyStartDate: "2024-03-12",
    warrantyEndDate: format(addDays(today, 310), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 50), "yyyy-MM-dd"),
    serviceType: "Premium Support",
    serviceStartDate: "2024-03-12",
    serviceEndDate: format(addDays(today, 310), "yyyy-MM-dd"),
    category: "Software License",
    invoiceNumber: "INV-2024-0020",
    challanNumber: "DC-2024-0020",
    status: "delivered"
  },
  {
    id: "INV027",
    customerId: "CUST001",
    productName: "Samsung 32-inch 4K Monitor",
    serialNumber: "MON-2024-027890",
    quantity: 25,
    deliveryDate: "2024-02-22",
    warrantyStartDate: "2024-02-22",
    warrantyEndDate: format(addDays(today, 800), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Monitor",
    invoiceNumber: "INV-2024-0021",
    challanNumber: "DC-2024-0021",
    status: "delivered"
  },
  {
    id: "INV028",
    customerId: "CUST003",
    productName: "Brother MFC-L8900CDW Printer",
    serialNumber: "PRT-2024-028901",
    quantity: 2,
    deliveryDate: "2023-11-30",
    warrantyStartDate: "2023-11-30",
    warrantyEndDate: format(subDays(today, 8), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: null,
    serviceStartDate: null,
    serviceEndDate: null,
    category: "Printer",
    invoiceNumber: "INV-2023-0043",
    challanNumber: "DC-2023-0043",
    status: "delivered"
  },
  {
    id: "INV029",
    customerId: "CUST002",
    productName: "Lenovo ThinkCentre M90q Tiny",
    serialNumber: "DES-2024-029012",
    quantity: 20,
    deliveryDate: "2024-03-01",
    warrantyStartDate: "2024-03-01",
    warrantyEndDate: format(addDays(today, 780), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Extended Support",
    serviceStartDate: "2024-03-01",
    serviceEndDate: format(addDays(today, 1095), "yyyy-MM-dd"),
    category: "Desktop",
    invoiceNumber: "INV-2024-0022",
    challanNumber: "DC-2024-0022",
    status: "delivered"
  },
  {
    id: "INV030",
    customerId: "CUST001",
    productName: "Tableau Desktop License",
    serialNumber: "LIC-2024-030123",
    quantity: 12,
    deliveryDate: "2024-01-18",
    warrantyStartDate: "2024-01-18",
    warrantyEndDate: format(addDays(today, 240), "yyyy-MM-dd"),
    licenseEndDate: format(addDays(today, 28), "yyyy-MM-dd"),
    serviceType: "Standard Support",
    serviceStartDate: "2024-01-18",
    serviceEndDate: format(addDays(today, 240), "yyyy-MM-dd"),
    category: "Software License",
    invoiceNumber: "INV-2024-0023",
    challanNumber: "DC-2024-0023",
    status: "delivered"
  },
  {
    id: "INV031",
    customerId: "CUST003",
    productName: "Juniper EX2300 Switch",
    serialNumber: "NET-2024-031234",
    quantity: 4,
    deliveryDate: "2024-02-12",
    warrantyStartDate: "2024-02-12",
    warrantyEndDate: format(addDays(today, 470), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "AMC",
    serviceStartDate: "2024-02-12",
    serviceEndDate: format(addDays(today, 365), "yyyy-MM-dd"),
    category: "Networking Equipment",
    invoiceNumber: "INV-2024-0024",
    challanNumber: "DC-2024-0024",
    status: "delivered"
  },
  {
    id: "INV032",
    customerId: "CUST002",
    productName: "APC Smart-UPS 3000VA",
    serialNumber: "UPS-2024-032345",
    quantity: 8,
    deliveryDate: "2024-01-22",
    warrantyStartDate: "2024-01-22",
    warrantyEndDate: format(addDays(today, 680), "yyyy-MM-dd"),
    licenseEndDate: null,
    serviceType: "Extended Support",
    serviceStartDate: "2024-01-22",
    serviceEndDate: format(addDays(today, 730), "yyyy-MM-dd"),
    category: "Power Equipment",
    invoiceNumber: "INV-2024-0025",
    challanNumber: "DC-2024-0025",
    status: "delivered"
  }
];

export const dummyTickets: Ticket[] = [
  {
    id: "TKT001",
    customerId: "CUST001",
    serialNumber: "SRV-2024-001234",
    productName: "Dell PowerEdge R750 Server",
    category: "Hardware Issue",
    priority: "high",
    subject: "Server overheating warning",
    description: "Getting temperature warning alerts on server dashboard. Fan speeds appear normal but temperature keeps rising.",
    status: "open",
    warrantyStatus: "active",
    serviceStatus: "covered",
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 30).toISOString(),
    updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 30).toISOString(),
    timeline: [
      {
        action: "Ticket Created",
        by: "Alpha Business Solutions",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 30).toISOString(),
        note: "Initial ticket submission"
      }
    ]
  },
  {
    id: "TKT002",
    customerId: "CUST002",
    serialNumber: "NET-2024-003456",
    productName: "Cisco Catalyst 9300 Switch",
    category: "Network Issue",
    priority: "critical",
    subject: "Network connectivity dropping intermittently",
    description: "Switch is dropping connections every few hours. Affecting production systems.",
    status: "in_progress",
    warrantyStatus: "active",
    serviceStatus: "covered",
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 14, 15).toISOString(),
    updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 9, 0).toISOString(),
    timeline: [
      {
        action: "Ticket Created",
        by: "Beta Corporation",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 14, 15).toISOString(),
        note: "Initial ticket submission"
      },
      {
        action: "Status Updated to In Progress",
        by: "Support Team",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4, 10, 0).toISOString(),
        note: "Assigned to network specialist. Investigating firmware version."
      },
      {
        action: "Comment Added",
        by: "Support Team",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 9, 0).toISOString(),
        note: "Firmware update scheduled for tonight. Will monitor post-update."
      }
    ],
    assignedTo: "Network Team"
  },
  {
    id: "TKT003",
    customerId: "CUST001",
    serialNumber: "LAP-2024-002345",
    productName: "HP EliteBook 840 G9",
    category: "Software Issue",
    priority: "medium",
    subject: "Windows 11 update causing BSOD",
    description: "After latest Windows update, laptop experiencing blue screen errors randomly.",
    status: "resolved",
    warrantyStatus: "expiring",
    serviceStatus: "covered",
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 11, 20).toISOString(),
    updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 16, 45).toISOString(),
    timeline: [
      {
        action: "Ticket Created",
        by: "Alpha Business Solutions",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 11, 20).toISOString(),
        note: "Initial ticket submission"
      },
      {
        action: "Status Updated to In Progress",
        by: "Support Team",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9, 9, 30).toISOString(),
        note: "Investigating driver compatibility issues."
      },
      {
        action: "Comment Added",
        by: "Support Team",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 14, 0).toISOString(),
        note: "Identified graphics driver conflict. Updated drivers remotely."
      },
      {
        action: "Status Updated to Resolved",
        by: "Support Team",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 16, 45).toISOString(),
        note: "Issue resolved. Customer confirmed stable operation for 4 days."
      }
    ],
    assignedTo: "Software Team"
  },
  {
    id: "TKT004",
    customerId: "CUST003",
    serialNumber: "LIC-2024-010123",
    productName: "Adobe Creative Cloud Team",
    category: "License Issue",
    priority: "high",
    subject: "License activation failing for 5 users",
    description: "Unable to activate Adobe CC licenses for 5 new employees. Getting error code 195.",
    status: "open",
    warrantyStatus: "active",
    serviceStatus: "covered",
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 15, 10).toISOString(),
    updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 15, 10).toISOString(),
    timeline: [
      {
        action: "Ticket Created",
        by: "Gamma Industries",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 15, 10).toISOString(),
        note: "Initial ticket submission"
      }
    ]
  },
  {
    id: "TKT005",
    customerId: "CUST002",
    serialNumber: "LIC-2024-004567",
    productName: "Microsoft Office 365 E3",
    category: "General Inquiry",
    priority: "low",
    subject: "Question about license renewal process",
    description: "Licenses expiring soon. Need information about renewal pricing and process.",
    status: "closed",
    warrantyStatus: "active",
    serviceStatus: "covered",
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15, 10, 0).toISOString(),
    updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12, 14, 30).toISOString(),
    timeline: [
      {
        action: "Ticket Created",
        by: "Beta Corporation",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15, 10, 0).toISOString(),
        note: "Initial ticket submission"
      },
      {
        action: "Comment Added",
        by: "Support Team",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14, 11, 0).toISOString(),
        note: "Sent renewal quote and process documentation via email."
      },
      {
        action: "Status Updated to Closed",
        by: "Beta Corporation",
        at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12, 14, 30).toISOString(),
        note: "Thank you for the information. Proceeding with renewal."
      }
    ],
    assignedTo: "Sales Team"
  }
];

export const dummyNotifications: Notification[] = [
  {
    id: "NOT001",
    customerId: "CUST001",
    type: "warranty_expiry",
    title: "Warranty Expiring Soon",
    message: "Warranty for HP EliteBook 840 G9 (LAP-2024-002345) expires in 25 days",
    serialNumber: "LAP-2024-002345",
    isRead: false,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0).toISOString()
  },
  {
    id: "NOT002",
    customerId: "CUST001",
    type: "license_expiry",
    title: "License Renewal Required",
    message: "License for Tableau Desktop License (LIC-2024-030123) expires in 28 days",
    serialNumber: "LIC-2024-030123",
    isRead: false,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0).toISOString()
  },
  {
    id: "NOT003",
    customerId: "CUST001",
    type: "ticket_update",
    title: "Ticket Update",
    message: "Your ticket TKT003 has been resolved",
    isRead: true,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 16, 45).toISOString()
  },
  {
    id: "NOT004",
    customerId: "CUST002",
    type: "warranty_expiry",
    title: "Warranty Expiring Soon",
    message: "Warranty for Cisco Catalyst 9300 Switch (NET-2024-003456) expires in 55 days",
    serialNumber: "NET-2024-003456",
    isRead: false,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 8, 0).toISOString()
  },
  {
    id: "NOT005",
    customerId: "CUST002",
    type: "ticket_update",
    title: "Ticket Update",
    message: "Your ticket TKT002 status updated to In Progress",
    isRead: true,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4, 10, 0).toISOString()
  },
  {
    id: "NOT006",
    customerId: "CUST003",
    type: "warranty_expiry",
    title: "Warranty Expired",
    message: "Warranty for Lenovo ThinkPad X1 Carbon (LAP-2024-005678) has expired",
    serialNumber: "LAP-2024-005678",
    isRead: false,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 8, 0).toISOString()
  },
  {
    id: "NOT007",
    customerId: "CUST003",
    type: "license_expiry",
    title: "License Expiring Soon",
    message: "License for Adobe Creative Cloud Team (LIC-2024-010123) expires in 40 days",
    serialNumber: "LIC-2024-010123",
    isRead: false,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 8, 0).toISOString()
  },
  {
    id: "NOT008",
    customerId: null,
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance on Saturday 2 AM - 4 AM IST",
    isRead: true,
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 12, 0).toISOString()
  }
];

export const loginCredentials = {
  "admin@satmz.com": { password: "admin123", userId: "USR001" },
  "reseller1@satmz.com": { password: "reseller123", userId: "USR002" },
  "reseller2@satmz.com": { password: "reseller123", userId: "USR003" }
};

export function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  
  if (!localStorage.getItem("inventory_customers")) {
    localStorage.setItem("inventory_customers", JSON.stringify(dummyCustomers));
  }
  
  if (!localStorage.getItem("inventory_items")) {
    localStorage.setItem("inventory_items", JSON.stringify(dummyInventory));
  }
  
  if (!localStorage.getItem("inventory_tickets")) {
    localStorage.setItem("inventory_tickets", JSON.stringify(dummyTickets));
  }
  
  if (!localStorage.getItem("inventory_notifications")) {
    localStorage.setItem("inventory_notifications", JSON.stringify(dummyNotifications));
  }
  
  if (!localStorage.getItem("inventory_users")) {
    localStorage.setItem("inventory_users", JSON.stringify(dummyUsers));
  }
}
