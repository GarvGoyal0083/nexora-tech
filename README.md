# ⚡ Nexora Tech | Modern Electronics & Certified Refurbished Hardware E-Commerce Platform

A premium, modern full-stack e-commerce platform engineered for selling new and certified refurbished laptops, custom gaming PCs, desktop workstations, OLED & 4K monitors, enterprise printers, PC components (GPUs, CPUs, RAM, SSDs), and pro esports accessories.

Built with a futuristic **Cyber-Blue & Obsidian-Black** theme, glassmorphic UI cards, instant live search, faceted catalog filters, a side-by-side product comparison matrix, shopping cart with dynamic coupon calculation, multi-step secure checkout, printable invoices with real-time order milestone tracking, user accounts, and an administrative inventory control center.

---

## 🚀 Key Features

### 💻 1. Futuristic Cyber Aesthetic & Modern UI
- **Futuristic Palette:** Deep obsidian blacks (`#07090e`, `#0c1322`), electric cyan (`#00F0FF`), neon blue, and glassmorphic panels.
- **Micro-Interactions:** Hover glows, card animations, stock indicators, and responsive mobile drawers.
- **Clear Condition Badges:** 
  - `Certified Refurbished - Grade A+` (Emerald glow, 52-point check passed, >95% battery health, 1-Year Nexora Warranty).
  - `Brand New` (Factory sealed).

### 🔍 2. Smart Search & Faceted Category Filtering
- **Real-Time Autocomplete Search:** Instant dropdown with product photos, prices, condition badges, and keyboard navigation.
- **Multi-Facet Catalog Filters:**
  - Categories: *Laptops, Desktop PCs, Monitors, Components, Printers, Accessories*.
  - Conditions: *All, Brand New, Certified Refurbished*.
  - Brands: *Apple, ASUS ROG, NVIDIA, Razer, Samsung, Dell, Corsair, HP, Brother, Logitech, SteelSeries, Sony, Nexora*.
  - Budget Slider ($50 – $5,000).
  - In-Stock Only filter.
  - Sorting: *Featured Picks, Price: Low to High, Price: High to Low, Highest Rated, Newest Arrivals*.
  - Toggle between **Grid View** and **List View**.

### ⚖️ 3. Product Comparison Tool (`/compare`)
- Compare up to 4 hardware products side-by-side.
- Sticky comparison table evaluating: Processor, GPU, RAM, Storage, Screen, Warranty, Condition grade, Price, and Availability.
- Floating bottom dock with mini thumbnails and 1-click comparison launcher.

### 🛒 4. Shopping Cart & Dynamic Discounts (`/cart`)
- Interactive quantity adjustment, item deletion, and subtotal calculation.
- **Priority Freight Progress Bar:** Free express shipping unlocked on orders over $150.
- **Promotional Coupon Engine:**
  - `NEXORA10` &rarr; 10% Off Entire Order
  - `CYBER50` &rarr; $50 Off Orders over $300
  - `GAMER100` &rarr; $100 Off Orders over $800
  - `REFURB15` &rarr; 15% Off Refurbished Units

### 💳 5. Secure Multi-Step Checkout (`/checkout`)
- Step 1: Contact Information & Shipping Address (with 1-click *"Auto-fill Demo Details"* button).
- Step 2: Shipping Speed (Standard Freight, Express Insured Courier, Priority Overnight).
- Step 3: Payment Method:
  - Interactive Credit Card visual preview with live cardholder and chip graphics.
  - UPI Instant QR scan simulation.
  - PayPal Express.
  - Cash / Wire on Delivery.
- Step 4: Final authorization and order creation.
- Confetti celebration animation upon successful placement.

### 📦 6. Order Confirmation & Live Tracking (`/order-confirmation/:id`)
- Order confirmation with generated ID (e.g. `NEX-2026-XXXX`) and tracking number.
- **Live Milestone Tracker:** *Order Placed &rarr; 52-Point Diagnostic Inspection &rarr; Secure Foam Packaging &rarr; Dispatched FedEx Tech Express &rarr; Out for Delivery*.
- **Printable Tax Invoice:** Complete itemized receipt with printable CSS view and download/print trigger.

### 👤 7. User Accounts & Saved Addresses (`/account`)
- User Profile management: Name, phone, delivery address.
- Order History with live status badges and invoice links.
- Saved Wishlist with *"Move to Cart"* capability.
- Instant 1-Click Demo Login switcher between **Demo Customer** and **Demo Admin**.

### 🛡️ 8. Comprehensive Admin Dashboard (`/admin`)
- **Executive KPIs:** Total Revenue, Orders count, Catalog size, Low stock alerts.
- **Inventory Management Table:** Searchable catalog with inline stock steppers (`+` / `-`), *"Add New Product"* modal, *"Edit Product"* modal, and Delete.
- **Order Fulfillment Center:** View all platform orders with instant status dropdown (*Pending &rarr; Processing &rarr; Shipped &rarr; Delivered &rarr; Cancelled*) that updates the database in real time.
- **Low Stock Replenishment Warnings:** Instant alerts for hardware with &le; 5 units remaining.

---

## 🔑 Demo Credentials

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@nexoratech.com` | `admin123` | Full access to Admin Console, stock controls, catalog editor, and order status updates |
| **Customer** | `customer@nexoratech.com` | `customer123` | Standard shopper account with order history and saved addresses |

*(Both accounts are accessible via the 1-click Fast Demo buttons in the top navbar and login page)*

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Node.js, Express 5, Better-SQLite3, JWT authentication, bcryptjs password hashing.
- **Database:** SQLite (`backend/nexora.db`) with WAL mode for concurrency and automated schema migration.
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React icons, Canvas Confetti.
- **SEO Optimization:** Dynamic page titles, semantic HTML5 tags, and schema structure.

---

## 🏃 Running the Application

### Method 1: Double-Click Launcher (Windows)
Double-click `run.bat` in this folder. It starts the server on `http://localhost:5000` and automatically opens your browser.

### Method 2: Command Line
```bash
# Start full-stack server (serves API & pre-built frontend)
npm start
```
Then navigate to: **`http://localhost:5000`**

### Development Mode (with hot-reload):
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend Vite
npm run dev:frontend
```
Vite dev server will run on `http://localhost:3000` with automatic API proxying to `http://localhost:5000`.
