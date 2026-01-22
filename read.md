## DUMMY CREDENTIALS
```typescript
// Distributor (Admin) Login
{
  email: "admin@satmz.com",
  password: "admin123",
  role: "distributor",
  companyName: "TechSupply Distribution"
}

// Reseller Logins
{
  email: "reseller1@satmz.com",
  password: "reseller123",
  role: "reseller",
  customerId: "CUST001",
  companyName: "Alpha Business Solutions"
}

{
  email: "reseller2@satmz.com",
  password: "reseller123",
  role: "reseller",
  customerId: "CUST002",
  companyName: "Beta Corporation"
}
```

## DUMMY DATA STRUCTURE

### Customers
```typescript
const customers = [
  { id: "CUST001", name: "Alpha Business Solutions", email: "contact@satmz.com", phone: "+91-9876543210", address: "Mumbai, India", createdAt: "2023-01-15" },
  { id: "CUST002", name: "Beta Corporation", email: "info@satmz.com", phone: "+91-9876543211", address: "Delhi, India", createdAt: "2023-03-20" },
  { id: "CUST003", name: "Gamma Industries", email: "support@satmz.com", phone: "+91-9876543212", address: "Bangalore, India", createdAt: "2023-06-10" }
];
```

### Products/Inventory (30+ items with various expiry states)
```typescript
const inventory = [
  {
    id: "INV001",
    customerId: "CUST001",
    productName: "Dell PowerEdge R750 Server",
    serialNumber: "SRV-2024-001234",
    quantity: 2,
    deliveryDate: "2024-01-15",
    warrantyStartDate: "2024-01-15",
    warrantyEndDate: "2027-01-14", // Active
    licenseEndDate: null,
    serviceType: "AMC",
    serviceStartDate: "2024-01-15",
    serviceEndDate: "2025-01-14",
    category: "Server",
    invoiceNumber: "INV-2024-0001",
    challanNumber: "DC-2024-0001",
    status: "delivered"
  },
  // Include items with:
  // - Warranty expiring in 30 days (Yellow)
  // - Warranty expiring in 60 days (Yellow)
  // - Warranty expired (Red)
  // - Active warranty (Green)
  // - Various product categories: Servers, Laptops, Networking Equipment, Software Licenses, Printers, Storage Devices
  // Mix across all 3 customers
];
```

### Tickets
```typescript
const tickets = [
  {
    id: "TKT001",
    customerId: "CUST001",
    serialNumber: "SRV-2024-001234",
    productName: "Dell PowerEdge R750 Server",
    category: "Hardware Issue",
    priority: "high",
    subject: "Server overheating warning",
    description: "Getting temperature warning alerts on server dashboard",
    status: "open",
    warrantyStatus: "active",
    serviceStatus: "covered",
    createdAt: "2025-01-20T10:30:00",
    updatedAt: "2025-01-20T10:30:00",
    timeline: [
      { action: "Ticket Created", by: "Alpha Business Solutions", at: "2025-01-20T10:30:00", note: "Initial ticket submission" }
    ]
  },
  // Include various ticket statuses: open, in_progress, resolved, closed
];
```

### Notifications
```typescript
const notifications = [
  {
    id: "NOT001",
    customerId: "CUST001", // null for distributor-wide
    type: "warranty_expiry",
    title: "Warranty Expiring Soon",
    message: "Warranty for Dell PowerEdge R750 (SRV-2024-001234) expires in 30 days",
    serialNumber: "SRV-2024-001234",
    isRead: false,
    createdAt: "2025-01-20T08:00:00"
  }
];
```

## DETAILED FEATURE REQUIREMENTS

### 1. LOGIN SCREEN
- Clean, modern login form with company logo placeholder
- Email and password fields with validation
- "Remember me" checkbox
- "Forgot Password" link (opens modal/page with email input, shows success toast)
- On successful login:
  - Store user session in localStorage and Zustand
  - Redirect to /dashboard
  - Show welcome toast notification
- On failed login: Show error message with shake animation
- Protect all dashboard routes - redirect to login if not authenticated

### 2. SIDEBAR & LAYOUT
- Collapsible sidebar with:
  - Logo/Brand area
  - Navigation items with icons:
    - Dashboard (Home icon)
    - Inventory (Package icon)
    - Warranty & Services (Shield icon)
    - Support Tickets (Headphones icon)
    - Notifications (Bell icon with badge count)
    - History & Audit (History icon)
    - Settings (Settings icon) - only for distributor
  - User profile section at bottom
  - Collapse/expand toggle
- Top header with:
  - Page title (dynamic)
  - Search bar (global search)
  - Notification bell with dropdown
  - User avatar with dropdown menu (Profile, Logout)
- Mobile responsive with hamburger menu
- Show role badge (Distributor/Reseller) in sidebar

### 3. DASHBOARD
Design a visually appealing dashboard with:

**Stats Cards Row (4 cards):**
- Total Products/Devices (with icon)
- Expiring Soon (30/60/90 days combined) - clickable to filter
- Open Tickets (with trend indicator)
- Closed Tickets This Month

**Expiry Alerts Panel:**
- Tabbed view: 30 Days | 60 Days | 90 Days | Expired
- List of items with: Product name, Serial, Expiry date, Status badge
- Quick action: "View Details" → Opens inventory item
- Color coding: Green (>90), Yellow (30-90), Red (<30 or expired)

**Recent Tickets Widget:**
- Last 5 tickets with status badges
- Quick link to view all tickets

**Quick Actions Card:**
- Raise New Ticket button
- View Inventory button
- Download Reports button (shows coming soon toast)

**Activity Feed:**
- Recent activities (deliveries, ticket updates, renewals)
- Timestamp and description

**For Distributor:** Show customer selector dropdown to filter dashboard by customer or "All Customers"
**For Reseller:** Show only their data, no customer selector

### 4. INVENTORY MANAGEMENT SCREEN
**Filters Bar:**
- Search input (search by product name, serial number)
- Category dropdown (All, Servers, Laptops, Networking, Software, etc.)
- Status dropdown (All, Active, Expiring Soon, Expired)
- Customer dropdown (Distributor only)
- Date range picker for delivery date
- Clear filters button

**Data Table:**
- Columns: Product Name, Serial Number, Category, Quantity, Delivery Date, Warranty Expiry, License Expiry, Status, Actions
- Sortable columns
- Status column with color-coded badges
- Actions column:
  - View Details (eye icon) → Opens modal with full details
  - Download Challan (document icon) → Simulates PDF download with success toast
  - Download Invoice (file icon) → Simulates PDF download with success toast
- Pagination (10, 25, 50 per page)
- Export to CSV button (simulated)

**For Distributor:** Show all inventory with customer name column, can add new inventory (modal form)
**For Reseller:** Show only their inventory, read-only, no add button

### 5. WARRANTY & SERVICES SCREEN
**Summary Cards:**
- Total Active Warranties
- Expiring in 30 Days
- Expired Warranties
- Active Service Contracts (AMC/Support)

**Warranty Table:**
- Product/Serial Number
- Customer Name (distributor only)
- Warranty Start Date
- Warranty End Date
- Warranty Status (Active/Expiring/Expired) with badge
- Service Type (AMC/Support/None)
- Service End Date
- Actions

**For Distributor Actions:**
- Edit Warranty Dates (modal)
- Add/Edit Service Contract (modal)
- Renew Warranty (modal with new dates)
- Mark as Expired (confirmation dialog)
- All actions show success toast on completion

**Service Contract Modal:**
- Service Type dropdown (AMC, Extended Support, Premium Support)
- Start Date picker
- End Date picker
- Notes textarea
- Save button

**For Reseller:**
- View only mode
- No action buttons
- Can see warranty and service status
- Helpful message: "Contact distributor for warranty renewal"

### 6. SUPPORT TICKETING INTERFACE

**Ticket List Page:**
- Filter tabs: All | Open | In Progress | Resolved | Closed
- Search by ticket ID or serial number
- Sort by: Date Created, Priority, Status

**Ticket Cards/Table showing:**
- Ticket ID
- Subject
- Product/Serial Number
- Priority badge (Low/Medium/High/Critical)
- Status badge with color
- Warranty Status (Under Warranty / Out of Warranty)
- Service Coverage (Covered / Not Covered)
- Created date
- Last updated
- Assigned to (distributor view)

**Raise New Ticket Page:**
- Step 1: Select Product
  - Searchable dropdown of user's products
  - Shows serial number and product name
  - Auto-displays warranty and service status after selection
  - Coverage info card: "This product is under warranty" or "This product is out of warranty - charges may apply"
  
- Step 2: Ticket Details
  - Issue Category dropdown (Hardware Issue, Software Issue, Network Issue, License Issue, General Inquiry)
  - Priority dropdown (Low, Medium, High, Critical)
  - Subject input
  - Description textarea (min 50 characters)
  - Attachment upload zone (simulated - shows file name, no actual upload)
  
- Step 3: Review & Submit
  - Summary of all entered information
  - Submit button
  - On submit: Show success toast, redirect to ticket detail page

**Ticket Detail Page:**
- Full ticket information
- Coverage status prominently displayed
- Timeline/Activity feed showing all updates
- For Distributor:
  - Update Status dropdown
  - Add Internal Note
  - Add Customer Response
  - Assign to team member (dummy list)
  - Close ticket button (with resolution note)
- For Reseller:
  - Add comment/reply
  - View updates
  - Read-only for status changes

### 7. NOTIFICATIONS PAGE
**Notification List:**
- Grouped by date (Today, Yesterday, This Week, Earlier)
- Each notification shows:
  - Type icon (warranty, license, ticket, system)
  - Title and message
  - Related serial number (clickable)
  - Timestamp
  - Read/Unread status (dot indicator)
- Mark as read on click
- "Mark all as read" button

**Notification Preferences (Settings):**
- Toggle for email notifications
- Configure reminder days (30, 60, 90 days checkboxes)
- Notification types toggle (Warranty, License, Tickets)

**Header Bell Icon:**
- Badge showing unread count
- Dropdown with latest 5 notifications
- "View All" link

### 8. HISTORY & AUDIT SECTION
**Tabbed Interface:**

**Tab 1: Delivered Assets**
- Timeline view of all deliveries
- Date, products delivered, challan number
- Download challan button

**Tab 2: Renewals**
- History of warranty and service renewals
- Old date → New date
- Renewed by (distributor only shows who)
- Renewal date

**Tab 3: Ticket History**
- All closed tickets
- Resolution summary
- Time to resolution
- Satisfaction rating (if applicable)

**Export Options:**
- Export each tab to CSV (simulated)
- Date range filter

### 9. SETTINGS PAGE (Distributor Only)
- Company Profile (view/edit company details)
- User Management (list of users - just display, no actual functionality)
- Notification Settings
- System Preferences
- All with appropriate forms and success toasts on save

## UI/UX REQUIREMENTS

### Design System:
- Color palette:
  - Primary: Blue (#2563EB)
  - Success/Active: Green (#10B981)
  - Warning/Expiring: Amber (#F59E0B)
  - Danger/Expired: Red (#EF4444)
  - Neutral grays for backgrounds and text
- Consistent border radius (8px for cards, 6px for buttons)
- Subtle shadows for elevation
- Clean, professional typography

### Interactive Elements:
- All buttons have hover and active states
- Loading states for all actions (spinners)
- Skeleton loaders for data fetching
- Smooth transitions and animations
- Toast notifications for all actions (success, error, info)
- Confirmation dialogs for destructive actions
- Form validation with inline error messages
- Empty states with helpful messages and actions

### Responsive Design:
- Fully responsive for desktop, tablet, mobile
- Sidebar collapses to icons on tablet
- Bottom navigation or hamburger menu on mobile
- Tables become cards on mobile
- Touch-friendly tap targets

### Accessibility:
- Proper ARIA labels
- Keyboard navigation
- Focus indicators
- Sufficient color contrast

## STATE MANAGEMENT & DATA FLOW

Use Zustand stores with localStorage persistence:
```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// inventoryStore.ts
interface InventoryState {
  items: InventoryItem[];
  filters: FilterState;
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  setFilters: (filters: FilterState) => void;
}

// ticketStore.ts
interface TicketState {
  tickets: Ticket[];
  createTicket: (ticket: NewTicket) => Ticket;
  updateTicketStatus: (id: string, status: string, note: string) => void;
  addComment: (ticketId: string, comment: Comment) => void;
}

// notificationStore.ts
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}
```

## IMPORTANT IMPLEMENTATION NOTES:

1. **Role-Based Rendering:** Create a wrapper component or hook that checks user role and conditionally renders UI elements

2. **Data Filtering:** All data queries should filter by customerId for resellers, show all for distributors

3. **Protected Routes:** Implement middleware or layout-level auth checks

4. **Dummy PDF Downloads:** Create a function that shows a loading state, waits 1-2 seconds, then shows success toast "Challan downloaded successfully"

5. **Date Calculations:** Create utility functions to calculate days until expiry and return appropriate status

6. **Search & Filter:** Implement client-side filtering that updates URL params for shareable links

7. **Form Handling:** Use React Hook Form with Zod schemas for all forms

8. **Optimistic Updates:** Update UI immediately on actions, show success toast

9. **Error Boundaries:** Implement error boundaries for graceful error handling

10. **Initialize dummy data on first load if localStorage is empty

## GENERATE THE COMPLETE PROJECT

Please generate all files with complete, working code. Start with:
1. Install required dependencies (provide npm install command)
2. Configure Tailwind and Shadcn
3. Create types and dummy data
4. Create Zustand stores
5. Build all components
6. Create all pages
7. Implement routing and protection
8. Add all interactive functionality

Make sure every feature is fully functional with the dummy data, all buttons work, all forms submit with validation, and appropriate feedback is shown to users.