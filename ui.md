DETAILED UI DESIGN SPECIFICATIONS
=============================================================================

## DESIGN SYSTEM FOUNDATION

### Color Palette (CSS Variables in globals.css)
```css
:root {
  /* Primary Brand Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --success-50: #ecfdf5;
  --success-100: #d1fae5;
  --success-500: #10b981;
  --success-600: #059669;
  --success-700: #047857;
  
  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  --warning-700: #b45309;
  
  --danger-50: #fef2f2;
  --danger-100: #fee2e2;
  --danger-500: #ef4444;
  --danger-600: #dc2626;
  --danger-700: #b91c1c;
  
  --info-50: #eff6ff;
  --info-100: #dbeafe;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  
  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --bg-sidebar: #1e293b;
  --bg-sidebar-hover: #334155;
  --bg-sidebar-active: #3b82f6;
  
  /* Border Colors */
  --border-light: #e5e7eb;
  --border-medium: #d1d5db;
  --border-dark: #9ca3af;
  
  /* Shadow Definitions */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### Typography System
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes & Line Heights */
--text-xs: 0.75rem;      /* 12px - Labels, badges */
--text-sm: 0.875rem;     /* 14px - Secondary text, table cells */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Subheadings */
--text-xl: 1.25rem;      /* 20px - Card titles */
--text-2xl: 1.5rem;      /* 24px - Section headers */
--text-3xl: 1.875rem;    /* 30px - Page titles */
--text-4xl: 2.25rem;     /* 36px - Hero text */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing System (8px base unit)
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius
```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px - Badges, small elements */
--radius-md: 0.375rem;  /* 6px - Buttons, inputs */
--radius-lg: 0.5rem;    /* 8px - Cards, modals */
--radius-xl: 0.75rem;   /* 12px - Large cards */
--radius-2xl: 1rem;     /* 16px - Feature cards */
--radius-full: 9999px;  /* Pills, avatars */
```

---

## COMPONENT SPECIFICATIONS

### 1. Buttons
PRIMARY BUTTON:
┌─────────────────────────────────────┐
│  [Icon]  Button Text                │
└─────────────────────────────────────┘

Background: var(--primary-600) #2563eb
Text: white
Font: 14px, font-weight: 500
Padding: 10px 16px (py-2.5 px-4)
Border-radius: 6px
Height: 40px (default), 36px (small), 44px (large)
Hover: var(--primary-700) #1d4ed8
Active: var(--primary-800) #1e40af
Disabled: opacity 50%, cursor not-allowed
Focus: ring-2 ring-primary-500 ring-offset-2
Transition: all 150ms ease

SECONDARY BUTTON:

Background: white
Border: 1px solid var(--border-medium)
Text: var(--gray-700)
Hover: var(--gray-50) background

DANGER BUTTON:

Background: var(--danger-600)
Hover: var(--danger-700)

GHOST BUTTON:

Background: transparent
Text: var(--gray-600)
Hover: var(--gray-100) background

ICON BUTTON:

Size: 36px x 36px (square)
Border-radius: 6px
Icon size: 20px


### 2. Input Fields
TEXT INPUT:
┌─────────────────────────────────────┐
│ Label Text                          │
├─────────────────────────────────────┤
│ 🔍 Placeholder text...              │
└─────────────────────────────────────┘
Helper text or error message

Height: 40px
Padding: 10px 12px (with icon: left padding 40px)
Border: 1px solid var(--border-medium)
Border-radius: 6px
Font-size: 14px
Background: white
Focus: border-color primary-500, ring-2 ring-primary-100
Error: border-color danger-500, ring-2 ring-danger-100
Disabled: background gray-50, opacity 60%
Label: font-size 14px, font-weight 500, margin-bottom 6px
Helper text: font-size 12px, color gray-500, margin-top 4px
Error text: font-size 12px, color danger-600, margin-top 4px

SEARCH INPUT:

Same as text input
Left icon: Search (20px, gray-400)
Right icon: X button to clear (appears when has value)

TEXTAREA:

Min-height: 100px
Resize: vertical
Same styling as text input

SELECT/DROPDOWN:

Same height and styling as text input
Right icon: ChevronDown (16px)
Dropdown panel: shadow-lg, border-radius 8px, max-height 300px
Option hover: background gray-50
Selected option: background primary-50, checkmark icon


### 3. Cards
STAT CARD:
┌──────────────────────────────────────┐
│  ┌────┐                              │
│  │ 📦 │  Total Products              │
│  └────┘                              │
│                                      │
│  1,234                               │
│  ↑ 12% from last month               │
└──────────────────────────────────────┘

Background: white
Border: 1px solid var(--border-light)
Border-radius: 12px
Padding: 24px
Shadow: var(--shadow-sm)
Hover: shadow-md, translateY(-2px)
Transition: all 200ms ease
Icon container: 48px x 48px, border-radius 10px, background primary-50
Icon: 24px, color primary-600
Title: font-size 14px, color gray-500, font-weight 500
Value: font-size 32px, font-weight 700, color gray-900
Trend: font-size 12px, color success-600 (positive) or danger-600 (negative)

DATA CARD:
┌──────────────────────────────────────┐
│  Card Title              [Actions ▾] │
├──────────────────────────────────────┤
│                                      │
│  Card content goes here              │
│                                      │
└──────────────────────────────────────┘

Same base styling as stat card
Header: padding-bottom 16px, border-bottom if has content
Title: font-size 16px, font-weight 600


### 4. Tables
DATA TABLE:
┌────────────────────────────────────────────────────────────────────┐
│ ☐  Product Name        Serial No.     Status      Date    Actions │
├────────────────────────────────────────────────────────────────────┤
│ ☐  Dell PowerEdge...   SRV-2024-001   ● Active    Jan 15  ⋮      │
├────────────────────────────────────────────────────────────────────┤
│ ☐  Cisco Catalyst...   NET-2023-005   ○ Expiring  Feb 20  ⋮      │
├────────────────────────────────────────────────────────────────────┤
│ ☐  HP EliteBook...     LAP-2024-201   ◉ Expired   Mar 10  ⋮      │
└────────────────────────────────────────────────────────────────────┘
│ Showing 1-10 of 35 items          │ ◀ 1 2 3 4 5 ▶ │
HEADER ROW:

Background: var(--gray-50)
Font-size: 12px
Font-weight: 600
Text-transform: uppercase
Letter-spacing: 0.05em
Color: var(--gray-500)
Padding: 12px 16px
Border-bottom: 1px solid var(--border-light)

DATA ROW:

Background: white
Font-size: 14px
Color: var(--gray-700)
Padding: 16px
Border-bottom: 1px solid var(--border-light)
Hover: background var(--gray-50)
Selected: background var(--primary-50)

CHECKBOX:

Size: 18px x 18px
Border-radius: 4px
Checked: background primary-600, checkmark white

ACTIONS MENU:

Trigger: vertical dots icon (⋮)
Dropdown: shadow-lg, border-radius 8px
Menu items: padding 8px 12px, hover background gray-50


### 5. Badges/Status Indicators
STATUS BADGES:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ● Active     │  │ ○ Expiring   │  │ ◉ Expired    │
└──────────────┘  └──────────────┘  └──────────────┘
(Green)           (Yellow)          (Red)
ACTIVE:

Background: var(--success-50) #ecfdf5
Text: var(--success-700) #047857
Border: 1px solid var(--success-200)
Dot: var(--success-500)

EXPIRING SOON:

Background: var(--warning-50) #fffbeb
Text: var(--warning-700) #b45309
Border: 1px solid var(--warning-200)
Dot: var(--warning-500)

EXPIRED:

Background: var(--danger-50) #fef2f2
Text: var(--danger-700) #b91c1c
Border: 1px solid var(--danger-200)
Dot: var(--danger-500)

BADGE STYLING:

Font-size: 12px
Font-weight: 500
Padding: 4px 10px
Border-radius: 9999px (pill)
Display: inline-flex
Align-items: center
Gap: 6px
Dot size: 6px, border-radius full

PRIORITY BADGES:
Critical: Red background
High: Orange background
Medium: Yellow background
Low: Gray background

### 6. Modal/Dialog
MODAL STRUCTURE:
┌─────────────────────────────────────────────────────┐
│  Modal Title                              [X]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Modal content goes here. This can include         │
│  forms, information, or any other content.         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Form Field Label                             │   │
│  │ [Input field                            ]    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                    [Cancel]  [Save Changes]         │
└─────────────────────────────────────────────────────┘
OVERLAY:

Background: rgba(0, 0, 0, 0.5)
Backdrop-blur: 4px

MODAL CONTAINER:

Background: white
Border-radius: 12px
Shadow: var(--shadow-xl)
Width: 90% (max-width: 500px for small, 700px for medium, 900px for large)
Max-height: 90vh
Overflow: hidden

HEADER:

Padding: 20px 24px
Border-bottom: 1px solid var(--border-light)
Title: font-size 18px, font-weight 600
Close button: 32px x 32px, hover background gray-100

BODY:

Padding: 24px
Overflow-y: auto

FOOTER:

Padding: 16px 24px
Border-top: 1px solid var(--border-light)
Background: var(--gray-50)
Display: flex
Justify-content: flex-end
Gap: 12px

ANIMATION:

Entry: fade in overlay + scale up modal from 95% to 100%
Exit: reverse
Duration: 200ms
Easing: ease-out


### 7. Sidebar Navigation
SIDEBAR LAYOUT (Expanded - 260px):
┌────────────────────────────┐
│   ┌────┐                   │
│   │LOGO│  TechSupply       │
│   └────┘  Portal           │
├────────────────────────────┤
│                            │
│  Dashboard          🏠     │
│  Inventory          📦     │
│  Warranty           🛡️     │
│  Tickets            🎫 (3) │
│  Notifications      🔔 (5) │
│  History            📋     │
│                            │
├────────────────────────────┤
│  Settings           ⚙️     │
├────────────────────────────┤
│  ┌────┐                    │
│  │ JM │ John Mathew        │
│  └────┘ Reseller     ▾     │
└────────────────────────────┘
SIDEBAR STYLING:

Width: 260px (expanded), 72px (collapsed)
Background: var(--bg-sidebar) #1e293b
Height: 100vh
Position: fixed
Z-index: 40
Transition: width 200ms ease

LOGO SECTION:

Height: 64px
Padding: 16px
Border-bottom: 1px solid rgba(255,255,255,0.1)
Logo: 32px x 32px
Company name: font-size 16px, font-weight 600, white

NAV ITEM:

Padding: 12px 16px
Margin: 4px 12px
Border-radius: 8px
Color: rgba(255,255,255,0.7)
Font-size: 14px
Font-weight: 500
Display: flex
Align-items: center
Gap: 12px
Icon size: 20px
Hover: background var(--bg-sidebar-hover), color white
Active: background var(--bg-sidebar-active), color white

BADGE (for notifications/tickets):

Background: var(--danger-500)
Color: white
Font-size: 11px
Min-width: 20px
Height: 20px
Border-radius: full
Display: flex
Align-items: center
Justify-content: center

USER SECTION:

Padding: 16px
Border-top: 1px solid rgba(255,255,255,0.1)
Avatar: 40px x 40px, border-radius full
Name: font-size 14px, font-weight 500, white
Role badge: font-size 11px, background primary-600, padding 2px 8px

COLLAPSE TOGGLE:

Position: absolute
Right: -12px
Top: 72px
Size: 24px x 24px
Background: white
Border-radius: full
Shadow: var(--shadow-md)
Icon: ChevronLeft (rotates on collapse)


### 8. Header/Top Bar
HEADER LAYOUT:
┌────────────────────────────────────────────────────────────────────┐
│  ☰  Dashboard                    🔍 Search...        🔔 (5)  👤 JM │
└────────────────────────────────────────────────────────────────────┘
HEADER STYLING:

Height: 64px
Background: white
Border-bottom: 1px solid var(--border-light)
Padding: 0 24px
Display: flex
Align-items: center
Justify-content: space-between
Position: sticky
Top: 0
Z-index: 30

PAGE TITLE:

Font-size: 20px
Font-weight: 600
Color: var(--gray-900)

SEARCH BAR:

Width: 400px (max)
Height: 40px
Background: var(--gray-50)
Border: none
Border-radius: 8px
Focus: background white, ring-2 ring-primary-100

RIGHT SECTION:

Display: flex
Align-items: center
Gap: 8px

NOTIFICATION BELL:

Size: 40px x 40px
Position: relative
Badge: 18px, position absolute top-0 right-0, transform translate(25%, -25%)

USER MENU TRIGGER:

Display: flex
Align-items: center
Gap: 8px
Padding: 6px 12px
Border-radius: 8px
Hover: background var(--gray-50)
Avatar: 32px x 32px

USER DROPDOWN:
┌────────────────────────┐
│  John Mathew           │
│  john@alphabiz.com     │
├────────────────────────┤
│  👤 Profile            │
│  ⚙️ Settings           │
├────────────────────────┤
│  🚪 Sign Out           │
└────────────────────────┘

Width: 220px
Shadow: var(--shadow-lg)
Border-radius: 8px


### 9. Toast Notifications
TOAST TYPES:
┌──────────────────────────────────────────┐
│ ✓  Product added successfully            │  SUCCESS
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ ✕  Failed to save changes                │  ERROR
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ ⚠  Warranty expiring in 7 days           │  WARNING
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ ℹ  New update available                  │  INFO
└──────────────────────────────────────────┘
TOAST STYLING:

Position: bottom-right
Min-width: 300px
Max-width: 420px
Padding: 16px
Border-radius: 8px
Shadow: var(--shadow-lg)
Display: flex
Align-items: flex-start
Gap: 12px
Animation: slide in from right, slide out to right

SUCCESS:

Background: var(--success-50)
Border-left: 4px solid var(--success-500)
Icon: CheckCircle, color success-500

ERROR:

Background: var(--danger-50)
Border-left: 4px solid var(--danger-500)
Icon: XCircle, color danger-500

WARNING:

Background: var(--warning-50)
Border-left: 4px solid var(--warning-500)
Icon: AlertTriangle, color warning-500

INFO:

Background: var(--info-50)
Border-left: 4px solid var(--info-500)
Icon: Info, color info-500


### 10. Empty States
EMPTY STATE:
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────────────┐                    │
│              │                 │                    │
│              │    📦          │                    │
│              │   (empty)       │                    │
│              │                 │                    │
│              └─────────────────┘                    │
│                                                     │
│              No products found                      │
│                                                     │
│    Try adjusting your filters or add a new item    │
│                                                     │
│              [Clear Filters]  [Add Product]         │
│                                                     │
└─────────────────────────────────────────────────────┘
STYLING:

Text-align: center
Padding: 48px 24px
Illustration: 120px x 120px, opacity 0.5
Title: font-size 18px, font-weight 600, color gray-900
Description: font-size 14px, color gray-500, max-width 320px, margin auto
Buttons: margin-top 24px, gap 12px


### 11. Loading States
SKELETON LOADER (for cards):
┌──────────────────────────────────────┐
│  ┌────┐  ░░░░░░░░░░░░░░             │
│  │░░░░│  ░░░░░░░░                    │
│  └────┘                              │
│                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░            │
│  ░░░░░░░░░░░                         │
└──────────────────────────────────────┘
SKELETON STYLING:

Background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%)
Background-size: 200% 100%
Animation: shimmer 1.5s infinite
Border-radius: 4px

SPINNER:

Size: 20px (small), 32px (medium), 48px (large)
Border: 3px solid var(--gray-200)
Border-top: 3px solid var(--primary-600)
Border-radius: full
Animation: spin 0.8s linear infinite

FULL PAGE LOADER:

Center of screen
Spinner (large)
Text below: "Loading..."
Background: white with 80% opacity


---

## PAGE-BY-PAGE DETAILED LAYOUTS

### LOGIN PAGE
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                                                                             │
│     ┌─────────────────────────────────────────┐                            │
│     │                                         │        ┌───────────────┐   │
│     │   ┌────────┐                            │        │               │   │
│     │   │  LOGO  │                            │        │   HERO IMAGE  │   │
│     │   └────────┘                            │        │   or Pattern  │   │
│     │                                         │        │               │   │
│     │   Welcome back                          │        │               │   │
│     │   Sign in to your account               │        │               │   │
│     │                                         │        │               │   │
│     │   ┌─────────────────────────────────┐   │        │               │   │
│     │   │ Email Address                   │   │        │               │   │
│     │   └─────────────────────────────────┘   │        │               │   │
│     │                                         │        │               │   │
│     │   ┌─────────────────────────────────┐   │        │               │   │
│     │   │ Password                    👁️  │   │        │               │   │
│     │   └─────────────────────────────────┘   │        │               │   │
│     │                                         │        │               │   │
│     │   ☐ Remember me     Forgot password?   │        │               │   │
│     │                                         │        │               │   │
│     │   ┌─────────────────────────────────┐   │        │               │   │
│     │   │         Sign In                 │   │        │               │   │
│     │   └─────────────────────────────────┘   │        │               │   │
│     │                                         │        │               │   │
│     │   Demo Credentials:                     │        │               │   │
│     │   Admin: admin@techsupply.com           │        │               │   │
│     │   Reseller: reseller1@alphabiz.com      │        │               │   │
│     │                                         │        └───────────────┘   │
│     └─────────────────────────────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
LAYOUT SPECS:

Split layout: 45% form, 55% image (on desktop)
Mobile: Full width form, no image
Form container: max-width 420px, centered vertically
Logo: 48px height
Title: font-size 28px, font-weight 700
Subtitle: font-size 14px, color gray-500
Input gap: 16px
Button: full width, height 44px
Right panel: gradient background or illustration
Demo credentials box: background gray-50, border-radius 8px, padding 12px, font-size 12px


### DASHBOARD PAGE
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  Dashboard                                    🔍  🔔(5)  👤 JM   │
│         ├───────────────────────────────────────────────────────────────────┤
│         │                                                                   │
│         │  Good morning, John! 👋                                          │
│         │  Here's what's happening with your inventory today.              │
│         │                                                                   │
│   🏠    │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │
│   📦    │  │ 📦           │ │ ⚠️           │ │ 🎫           │ │ ✅       │ │
│   🛡️    │  │ Total        │ │ Expiring     │ │ Open         │ │ Resolved │ │
│   🎫    │  │ Products     │ │ Soon         │ │ Tickets      │ │ Today    │ │
│   🔔    │  │              │ │              │ │              │ │          │ │
│   📋    │  │ 156          │ │ 12           │ │ 8            │ │ 3        │ │
│         │  │ ↑ 8 new      │ │ 5 critical   │ │ 2 urgent     │ │          │ │
│         │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘ │
│         │                                                                   │
│         │  ┌────────────────────────────────────┐ ┌────────────────────────┐│
│         │  │ Expiry Alerts                      │ │ Recent Tickets         ││
│         │  │ [30 Days] [60 Days] [90 Days]      │ │                        ││
│         │  ├────────────────────────────────────┤ │ TKT-001 Server issue   ││
│         │  │ ○ Cisco Switch    25 days  [View]  │ │ ● Open    High         ││
│         │  │ ○ MS 365 License  18 days  [View]  │ │                        ││
│         │  │ ○ HP Laptops      28 days  [View]  │ │ TKT-002 Network down   ││
│         │  │ ○ Aruba Switch    22 days  [View]  │ │ ● In Progress Critical ││
│         │  │ ○ MacBook Pro     10 days  [View]  │ │                        ││
│   ──────│  │                                    │ │ TKT-003 Battery issue  ││
│   ⚙️    │  │              [View All →]          │ │ ● Open    Medium       ││
│   ──────│  └────────────────────────────────────┘ │                        ││
│         │                                         │        [View All →]    ││
│  ┌────┐ │  ┌────────────────────────────────────┐ └────────────────────────┘│
│  │ JM │ │  │ Quick Actions                      │                          │
│  └────┘ │  │                                    │                          │
│  John   │  │ [🎫 New Ticket] [📦 Inventory] [📊 Reports]                   │
│         │  └────────────────────────────────────┘                          │
│         │                                                                   │
└─────────┴───────────────────────────────────────────────────────────────────┘
LAYOUT SPECS:

Grid: 4 columns for stat cards (1 column on mobile)
Below stats: 2 columns (alerts panel 60%, tickets widget 40%)
Card gap: 24px
Page padding: 24px
Welcome message: font-size 24px, font-weight 600
Subtitle: font-size 14px, color gray-500, margin-bottom 24px

STAT CARDS:

Equal width
Hover effect: lift shadow
Click: navigates to relevant page
Second line: show contextual info (new items, critical count)

EXPIRY ALERTS PANEL:

Tabs for time ranges
List with colored indicators
Each row: product name, days remaining, view button
Scroll if >5 items

RECENT TICKETS:

Show 5 most recent
Compact card layout
Status dot + priority badge
Click to open ticket


### INVENTORY PAGE
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  Inventory                                    🔍  🔔(5)  👤 JM   │
│         ├───────────────────────────────────────────────────────────────────┤
│         │                                                                   │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │ 🔍 Search by product or serial...  │ Category ▾ │ Status ▾ │ │
│         │  │                                                              │ │
│         │  │ [All Customers ▾]  [Date Range 📅]  [Clear]  [+ Add Product]│ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
│         │  Showing 35 products  •  12 expiring soon  •  3 expired          │
│         │                                                                   │
│         │  ┌────────────────────────────────────────────────────────────┐  │
│         │  │☐│ Product         │Serial No.  │Category │Expiry    │Status│⋮││
│         │  ├──┼─────────────────┼────────────┼─────────┼──────────┼──────┼─┤│
│         │  │☐ │Dell PowerEdge   │SRV-2024-001│Server   │Jan 2027  │● Act │⋮││
│         │  │  │R750 Server      │234         │         │          │ive   │ ││
│         │  ├──┼─────────────────┼────────────┼─────────┼──────────┼──────┼─┤│
│         │  │☐ │Cisco Catalyst   │NET-2023-005│Network  │Feb 15    │○ Exp │⋮││
│         │  │  │9300 Switch      │678         │         │(25 days) │iring │ ││
│         │  ├──┼─────────────────┼────────────┼─────────┼──────────┼──────┼─┤│
│         │  │☐ │Microsoft 365    │LIC-M365-001│Software │Feb 8     │◉ Exp │⋮││
│         │  │  │Business Premium │            │         │(18 days) │iring │ ││
│         │  ├──┼─────────────────┼────────────┼─────────┼──────────┼──────┼─┤│
│         │  │☐ │Fortinet FortiGate│FW-2022-003│Security │Dec 8     │● Exp │⋮││
│         │  │  │100F             │456         │         │(Expired) │ired  │ ││
│         │  └────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │  ┌───────────────────────────────────────────────────────────┐   │
│         │  │ Rows per page: [10 ▾]    1-10 of 35    [◀] [1] [2] [3] [▶]│   │
│         │  └───────────────────────────────────────────────────────────┘   │
│         │                                                                   │
└─────────┴───────────────────────────────────────────────────────────────────┘
FILTER BAR:

Background: white
Border: 1px solid var(--border-light)
Border-radius: 12px
Padding: 16px
Margin-bottom: 16px
Gap between elements: 12px
Search input: flex-grow
Dropdowns: min-width 140px
Add button: primary style (only for distributor)

TABLE STYLING:

Full width card container
Striped rows (optional): odd rows white, even rows gray-50
Expiry column: show date + days remaining in parentheses
Status column: colored badge
Actions (⋮) dropdown:

View Details
Download Challan
Download Invoice
Edit (distributor only)



ROW HOVER ACTIONS:

Show row highlight
Actions button becomes more visible

MOBILE VIEW:

Convert table to card layout
Each product as a card with stacked info


### INVENTORY DETAIL MODAL
┌─────────────────────────────────────────────────────────────────────────────┐
│  Product Details                                                    [X]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │                             │  │                                     │  │
│  │   [Product Image/Icon]      │  │  Dell PowerEdge R750 Server         │  │
│  │                             │  │                                     │  │
│  │                             │  │  ● Active    Server    Dell         │  │
│  │                             │  │                                     │  │
│  └─────────────────────────────┘  │  Serial: SRV-2024-001234            │  │
│                                   │  Quantity: 2 units                   │  │
│                                   └─────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ [Details] [Warranty & Service] [Documents] [History]                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  DETAILS TAB:                                                               │
│  ┌─────────────────────────┬────────────────────────────────────────────┐  │
│  │ Delivery Date           │ January 15, 2024                           │  │
│  ├─────────────────────────┼────────────────────────────────────────────┤  │
│  │ Invoice Number          │ INV-2024-0001                              │  │
│  ├─────────────────────────┼────────────────────────────────────────────┤  │
│  │ Challan Number          │ DC-2024-0001                               │  │
│  ├─────────────────────────┼────────────────────────────────────────────┤  │
│  │ PO Number               │ PO-ALPHA-001                               │  │
│  ├─────────────────────────┼────────────────────────────────────────────┤  │
│  │ Unit Price              │ ₹4,50,000                                  │  │
│  ├─────────────────────────┼────────────────────────────────────────────┤  │
│  │ Total Value             │ ₹9,00,000                                  │  │
│  └─────────────────────────┴────────────────────────────────────────────┘  │
│                                                                             │
│  WARRANTY & SERVICE TAB:                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  WARRANTY                                    SERVICE CONTRACT        │  │
│  │  ┌────────────────────────────────┐         ┌────────────────────┐  │  │
│  │  │  Status: ● Active              │         │  Type: AMC         │  │  │
│  │  │  Start:  Jan 15, 2024          │         │  Start: Jan 2024   │  │  │
│  │  │  End:    Jan 14, 2027          │         │  End:   Jan 2025   │  │  │
│  │  │  Remaining: 730 days           │         │  Days: 365         │  │  │
│  │  └────────────────────────────────┘         └────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [📄 Download Challan]  [📑 Download Invoice]           [Raise Ticket]     │
└─────────────────────────────────────────────────────────────────────────────┘
MODAL SIZE: Large (max-width: 800px)
TOP SECTION:

Product icon/image: 120px x 120px container
Product name: font-size 24px, font-weight 600
Badges inline: status, category, manufacturer
Key info below name

TABS:

Underline style tabs
Active tab: primary color underline
Tab content padding: 24px 0

DETAIL ROWS:

Label: width 180px, color gray-500
Value: font-weight 500
Border between rows

WARRANTY/SERVICE CARDS:

Side by side on desktop
Stacked on mobile
Visual timeline showing remaining days


### CREATE TICKET PAGE
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  Create New Ticket                            🔍  🔔(5)  👤 JM   │
│         ├───────────────────────────────────────────────────────────────────┤
│         │                                                                   │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │  STEP INDICATOR                                             │ │
│         │  │  [1 Select Product] ─── [2 Issue Details] ─── [3 Review]   │ │
│         │  │       ●                      ○                    ○         │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │                                                             │ │
│         │  │  STEP 1: Select Product                                    │ │
│         │  │                                                             │ │
│         │  │  ┌───────────────────────────────────────────────────────┐ │ │
│         │  │  │ 🔍 Search for a product or serial number...          │ │ │
│         │  │  └───────────────────────────────────────────────────────┘ │ │
│         │  │                                                             │ │
│         │  │  Select from your inventory:                               │ │
│         │  │                                                             │ │
│         │  │  ┌─────────────────────────────────────────────────────┐   │ │
│         │  │  │ ○ │ Dell PowerEdge R750          SRV-2024-001234    │   │ │
│         │  │  │   │ Server • ● Active Warranty                      │   │ │
│         │  │  ├───┼─────────────────────────────────────────────────┤   │ │
│         │  │  │ ○ │ Cisco Catalyst 9300          NET-2023-005678    │   │ │
│         │  │  │   │ Networking • ○ Warranty Expiring (25 days)      │   │ │
│         │  │  ├───┼─────────────────────────────────────────────────┤   │ │
│         │  │  │ ○ │ Fortinet FortiGate 100F      FW-2022-003456     │   │ │
│         │  │  │   │ Security • ● Warranty Expired                   │   │ │
│         │  │  └───┴─────────────────────────────────────────────────┘   │ │
│         │  │                                                             │ │
│         │  │  ┌─────────────────────────────────────────────────────┐   │ │
│         │  │  │ ℹ️  COVERAGE INFO (shown after selection)            │   │ │
│         │  │  │                                                     │   │ │
│         │  │  │   This product is UNDER WARRANTY                    │   │ │
│         │  │  │   Support will be provided at no additional cost.   │   │ │
│         │  │  │                                                     │   │ │
│         │  │  │   ● Warranty valid until: Jan 14, 2027              │   │ │
│         │  │  │   ● Service Contract: AMC (Active)                  │   │ │
│         │  │  └─────────────────────────────────────────────────────┘   │ │
│         │  │                                                             │ │
│         │  │                              [Cancel]  [Next: Issue Details]│ │
│         │  │                                                             │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
└─────────┴───────────────────────────────────────────────────────────────────┘
STEP 2: Issue Details
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Issue Category *                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Select a category...                                 ▾  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  Categories: Hardware Issue, Software Issue, Network Issue,    │
│              License Issue, Configuration, General Inquiry     │
│                                                                 │
│  Priority *                                                     │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────────┐                  │
│  │ Low   │ │Medium │ │ High  │ │ Critical  │                  │
│  └───────┘ └───────┘ └───────┘ └───────────┘                  │
│  (Radio button style selection with colors)                    │
│                                                                 │
│  Subject *                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Brief description of the issue                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Detailed Description *                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │ Provide detailed information about the issue...         │   │
│  │                                                         │   │
│  │                                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│  Min 50 characters • 0/50                                       │
│                                                                 │
│  Attachments (Optional)                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📎  Drop files here or click to upload                 │   │
│  │      PNG, JPG, PDF up to 10MB                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                          [Back]  [Next: Review & Submit]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
STEP 3: Review & Submit
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Review Your Ticket                                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PRODUCT                                                │   │
│  │  Dell PowerEdge R750 Server (SRV-2024-001234)          │   │
│  │  ● Under Warranty  •  ● Service: AMC                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ISSUE DETAILS                                          │   │
│  │                                                         │   │
│  │  Category:  Hardware Issue                              │   │
│  │  Priority:  ● High                                      │   │
│  │  Subject:   Server overheating warning alerts           │   │
│  │                                                         │   │
│  │  Description:                                           │   │
│  │  We are receiving temperature warning alerts on the     │   │
│  │  server dashboard. The ambient temperature is normal... │   │
│  │                                                         │   │
│  │  Attachments: 2 files                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓  By submitting, I confirm the information is        │   │
│  │     accurate and I agree to the support terms.          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                          [Back]  [Submit Ticket]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
STEP INDICATOR:

Horizontal on desktop, vertical on mobile
Completed step: checkmark, primary color
Current step: filled circle, primary color
Upcoming step: empty circle, gray
Connecting line: gray (completed: primary)

COVERAGE INFO BOX:

Green background/border: Under warranty
Yellow background/border: Expiring soon
Red background/border: Expired (show message about charges)

PRIORITY SELECTION:

Button group style
Low: gray
Medium: yellow
High: orange
Critical: red


### TICKET DETAIL PAGE
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  Ticket: TKT-2025-001                         🔍  🔔(5)  👤 JM   │
│         ├───────────────────────────────────────────────────────────────────┤
│         │                                                                   │
│         │  [← Back to Tickets]                                             │
│         │                                                                   │
│         │  ┌────────────────────────────────────────┬────────────────────┐ │
│         │  │                                        │                    │ │
│         │  │  Server overheating warning alerts     │  STATUS            │ │
│         │  │                                        │  ┌──────────────┐  │ │
│         │  │  ● Open     ● High     Hardware Issue  │  │ ● Open    ▾ │  │ │
│         │  │                                        │  └──────────────┘  │ │
│         │  │  Created: Jan 20, 2025 • 2 days ago    │                    │ │
│         │  │                                        │  ASSIGNED TO       │ │
│         │  ├────────────────────────────────────────┤  ┌──────────────┐  │ │
│         │  │                                        │  │ Rajesh K. ▾  │  │ │
│         │  │  PRODUCT INFORMATION                   │  └──────────────┘  │ │
│         │  │  ┌──────────────────────────────────┐  │                    │ │
│         │  │  │ 🖥️ Dell PowerEdge R750 Server    │  │  COVERAGE          │ │
│         │  │  │   SRV-2024-001234               │  │  ┌──────────────┐  │ │
│         │  │  │   ● Under Warranty               │  │  │ ● Covered    │  │ │
│         │  │  │   ● AMC Service Active          │  │  │ No charges   │  │ │
│         │  │  └──────────────────────────────────┘  │  └──────────────┘  │ │
│         │  │                                        │                    │ │
│         │  │  DESCRIPTION                           │  QUICK ACTIONS     │ │
│         │  │  We are receiving temperature warning  │  ┌──────────────┐  │ │
│         │  │  alerts on the server dashboard. The   │  │ Add Comment  │  │ │
│         │  │  ambient temperature in the server     │  ├──────────────┤  │ │
│         │  │  room is normal (22°C). The server     │  │ Add Note     │  │ │
│         │  │  fans seem to be running at maximum    │  │ (Internal)   │  │ │
│         │  │  speed constantly...                   │  ├──────────────┤  │ │
│         │  │                                        │  │ Close Ticket │  │ │
│         │  │  ATTACHMENTS                           │  └──────────────┘  │ │
│         │  │  📎 screenshot.png (245 KB)           │                    │ │
│         │  │                                        │                    │ │
│         │  ├────────────────────────────────────────┤                    │ │
│         │  │                                        │                    │ │
│         │  │  ACTIVITY TIMELINE                     │                    │ │
│         │  │                                        │                    │ │
│         │  │  ┌─ Jan 21, 2025 ─────────────────┐   │                    │ │
│         │  │  │ 💬 Rajesh Kumar (Support)      │   │                    │ │
│         │  │  │    Reviewing server logs. Will  │   │                    │ │
│         │  │  │    schedule on-site visit if    │   │                    │ │
│         │  │  │    needed.                      │   │                    │ │
│         │  │  │    2:30 PM                      │   │                    │ │
│         │  │  └─────────────────────────────────┘   │                    │ │
│         │  │         │                              │                    │ │
│         │  │  ┌─ Jan 20, 2025 ─────────────────┐   │                    │ │
│         │  │  │ 🎫 Ticket Assigned              │   │                    │ │
│         │  │  │    Assigned to Rajesh Kumar     │   │                    │ │
│         │  │  │    10:35 AM                     │   │                    │ │
│         │  │  └─────────────────────────────────┘   │                    │ │
│         │  │         │                              │                    │ │
│         │  │  ┌─ Jan 20, 2025 ─────────────────┐   │                    │ │
│         │  │  │ ✨ Ticket Created               │   │                    │ │
│         │  │  │    by John Mathew              │   │                    │ │
│         │  │  │    10:30 AM                     │   │                    │ │
│         │  │  └─────────────────────────────────┘   │                    │ │
│         │  │                                        │                    │ │
│         │  ├────────────────────────────────────────┴────────────────────┤ │
│         │  │                                                             │ │
│         │  │  ADD COMMENT                                                │ │
│         │  │  ┌─────────────────────────────────────────────────────┐   │ │
│         │  │  │ Type your message here...                           │   │ │
│         │  │  │                                                     │   │ │
│         │  │  └─────────────────────────────────────────────────────┘   │ │
│         │  │                                         [📎] [Send Comment]│ │
│         │  │                                                             │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
└─────────┴───────────────────────────────────────────────────────────────────┘
LAYOUT:

Two column: Main content (70%) + Sidebar (30%)
Mobile: Single column, sidebar becomes horizontal cards

TICKET HEADER:

Title: font-size 24px, font-weight 600
Badges inline: status, priority, category
Meta info: created date, relative time

PRODUCT CARD:

Highlighted background
Shows warranty/service status
Click to view product details

TIMELINE:

Vertical line connecting events
Date headers grouping events
Different icons for different event types:

💬 Comment
🎫 Status change
✨ Created
👤 Assigned
✅ Resolved



SIDEBAR (For Distributor):

Status dropdown: can change
Assigned to dropdown: can reassign
Coverage status: read-only
Quick action buttons

COMMENT BOX:

Sticky at bottom on mobile
Attachment button
Send button (primary)


### NOTIFICATIONS PAGE
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  Notifications                                🔍  🔔(5)  👤 JM   │
│         ├───────────────────────────────────────────────────────────────────┤
│         │                                                                   │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │  [All] [Unread (5)] [Warranty] [License] [Tickets]          │ │
│         │  │                                              [Mark All Read]│ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
│         │  TODAY                                                            │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │ ●  ⚠️  Warranty Expiring Soon                    2 hours ago│ │
│         │  │       Warranty for Cisco Catalyst 9300 Switch               │ │
│         │  │       (NET-2023-005678) expires in 25 days                  │ │
│         │  │       [View Product]                                        │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │ ●  🔴  License Expiring - Critical               5 hours ago│ │
│         │  │       Microsoft 365 licenses (LIC-M365-ALPHA-001)           │ │
│         │  │       expire in 18 days. Renew immediately.                 │ │
│         │  │       [View Product] [Request Renewal]                      │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
│         │  YESTERDAY                                                        │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │    🎫  Ticket Updated                            Yesterday  │ │
│         │  │       Your ticket TKT-2025-001 has a new response           │ │
│         │  │       from the support team.                                │ │
│         │  │       [View Ticket]                                         │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │    ✅  Ticket Resolved                           Yesterday  │ │
│         │  │       Your ticket TKT-2025-004 has been resolved.          │ │
│         │  │       VMware license renewal completed.                     │ │
│         │  │       [View Ticket]                                         │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
│         │  THIS WEEK                                                        │
│         │  ┌─────────────────────────────────────────────────────────────┐ │
│         │  │    📦  New Delivery                              3 days ago │ │
│         │  │       New products added to your inventory.                 │ │
│         │  │       5 items delivered.                                    │ │
│         │  │       [View Inventory]                                      │ │
│         │  └─────────────────────────────────────────────────────────────┘ │
│         │                                                                   │
│         │  ─────────────────── Load More ───────────────────               │
│         │                                                                   │
└─────────┴───────────────────────────────────────────────────────────────────┘
NOTIFICATION ITEM:

Unread indicator: Blue dot on left
Icon based on type:

⚠️ Warning (yellow)
🔴 Critical (red)
🎫 Ticket
✅ Success
📦 Delivery
ℹ️ Info


Title: font-weight 600
Description: font-size 14px, color gray-600
Timestamp: font-size 12px, color gray-400
Action buttons: small, text style

DATE HEADERS:

Sticky on scroll
font-size 12px
font-weight 600
text-transform: uppercase
Color: gray-500
Background: gray-50


---

## RESPONSIVE BREAKPOINTS
```css
/* Mobile First Approach */

/* Small devices (phones, 640px and up) */
@media (min-width: 640px) { ... }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { ... }

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) { ... }

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) { ... }

/* 2XL devices (1536px and up) */
@media (min-width: 1536px) { ... }
```

### Mobile Adaptations (< 768px)
SIDEBAR:

Hidden by default
Opens as full-screen overlay from left
Hamburger menu in header

HEADER:

Simplified: hamburger + logo + notifications + avatar
Search moves to a dedicated modal/page

STAT CARDS:

2x2 grid instead of 4x1
Smaller padding and font sizes

TABLES:

Convert to card layout
Each row becomes a card
Actions in dropdown or swipe gestures

MODALS:

Full screen on mobile
Bottom sheet style for small modals

FORMS:

Full width inputs
Stacked layout
Larger touch targets (min 44px height)

TICKET DETAIL:

Single column
Sidebar content becomes horizontal cards at top
Comment box sticky at bottom


---

## ANIMATIONS & TRANSITIONS
```css
/* Page Transitions */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 200ms ease-out;
}

/* Sidebar Collapse */
.sidebar {
  transition: width 200ms ease;
}

/* Card Hover */
.card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Button Press */
.button:active {
  transform: scale(0.98);
}

/* Dropdown Open */
.dropdown-content {
  transform-origin: top;
  animation: dropdownOpen 150ms ease-out;
}
@keyframes dropdownOpen {
  from {
    opacity: 0;
    transform: scaleY(0.95);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* Toast Slide In */
@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Pulse (for badges) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## ICON LIBRARY (Lucide React)
Navigation:

Home, LayoutDashboard
Package, PackageSearch (Inventory)
Shield, ShieldCheck (Warranty)
Ticket, HeadphonesIcon (Support)
Bell, BellRing (Notifications)
History, Clock (History)
Settings, Cog

Actions:

Plus, PlusCircle (Add)
Pencil, Edit (Edit)
Trash2, X (Delete)
Download, FileDown (Download)
Upload, FileUp (Upload)
Search, SearchIcon
Filter, SlidersHorizontal
MoreVertical, MoreHorizontal (Menu)
ChevronDown, ChevronRight, ChevronLeft
ExternalLink, Link

Status:

CheckCircle, Check (Success)
XCircle, X (Error)
AlertTriangle, AlertCircle (Warning)
Info, HelpCircle (Info)
Clock, Timer (Pending)
Loader2 (Loading - animate spin)

Content:

User, Users
Building, Building2 (Company)
Mail, Phone
Calendar, CalendarDays
FileText, File
Printer, Server, Laptop, Wifi
Lock, Unlock
Eye, EyeOff


---

This completes the detailed UI specifications. Combined with the dummy data from the previous response, Windsurf should have everything needed to build a fully functional and visually polished portal.