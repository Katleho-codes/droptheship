# 📦 Dropshipping App To-Do (Laravel)

## ✅ Core Features

### 🛍️ Product Management

- [x] Add/Edit/Delete products
- [x] Product variants (size, color, etc.)
- [x] Bulk import via CSV/Excel
- [ ] Sync inventory from suppliers (API or scraping)
- [x] Product status (active, inactive, archived)

### 📦 Order Management

- [x] Add/Delete orders
- [x] Order list with filters (status)
- [ ] Auto-order from supplier (via API or browser automation)
- [ ] Track order fulfillment & status
- [x] Export orders to excel format

### 🤝 Supplier Integration

- [ ] Integrate with AliExpress, Zendrop, etc.
- [ ] Product import from supplier
- [ ] Auto place orders (optional: Puppeteer/Laravel Dusk for non-API sources)

### 👤 Customer Management

- [x] Customer profiles
- [x] Order history
- [ ] Internal notes / communication log
- [ ] Customer segmentation

---

## 📬 Fulfillment & Logistics

### 🚚 Shipping & Tracking

- [ ] Auto-calculate shipping
- [ ] Track packages (e.g., AfterShip API)
- [ ] Notify customers of shipping updates

### 🔁 Returns & Refunds

- [ ] Return request form
- [ ] Return approval workflow
- [ ] Refund log or integration with payment gateway

---

## 📈 Finance & Analytics

### 💳 Payments

- [ ] Track payments (Stripe, PayPal, etc.)
- [ ] Payment status (paid/unpaid/refunded)
- [ ] Supplier cost tracking

### 📊 Sales & Reports

- [ ] Revenue reports
- [ ] Profit margin analysis
- [ ] Best-selling products
- [ ] Export financials

---

## 🧠 Dashboard & UX

### 🧮 Dashboard Widgets

- [ ] Orders today/week/month
- [ ] Sales chart
- [ ] Low stock alerts
- [ ] Top customers/products

---

## 🛠 Admin & Settings

### 👥 User Management

- [ ] Roles: Admin, Partner, Support, etc.
- [ ] Activity logs (audit trail)

### 🔔 Notifications

- [ ] New order alerts
- [ ] Return/refund notifications
- [ ] Low stock warnings

### 🔌 Integrations

- [ ] Shopify/WooCommerce (optional)
- [ ] Mailchimp/Brevo for email
- [ ] Cron jobs for syncing data

---

## 🧪 Optional & Advanced

- [ ] Affiliate/referral system
- [ ] Chat widget (customer support)
- [ ] Mobile companion app (Laravel + Flutter/React Native)
- [ ] Multilingual support
- [ ] Queue system (Redis + Laravel Queues)

---

## ⚙️ Laravel-Specific Stack

- [ ] UI: Blade + Tailwind + Livewire or Alpine.js
- [ ] Queues: Redis/Laravel Horizon
- [ ] API Clients: Guzzle or Laravel HTTP
- [ ] Jobs & Scheduler: Laravel Scheduler
- [ ] Exports: Laravel Excel, DomPDF
- [ ] Notifications: Laravel Notifications
