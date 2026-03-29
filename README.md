# FurniShop — React E-commerce Website

A professional single-page furniture store built with React. Customers can browse, filter, quick-view, add to cart, and pay via Paystack. You manage everything from the Admin panel.

---

## 🚀 Getting Started

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

- **Paystack**: Get your public key from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
- **Cloudinary**: Get your cloud name and upload preset from [Cloudinary Dashboard](https://cloudinary.com/console)
- **Admin Password**: Set a secure password for admin access
- **Social Media**: Update Instagram username and WhatsApp number

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

**For local development (localhost only):**

```bash
npm run dev
```

**For local network access (accessible from other devices):**

```bash
npm run dev -- --host
```

or

```bash
npx vite --host
```

When running with `--host`, you'll see a network URL like `http://192.168.1.100:5173/` that other devices on your network can access.

---

## 🔧 Personalise Your Store

### Paystack (Payment)

Update your Paystack public key in `.env`:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

Get it from: 👉 https://dashboard.paystack.com/#/settings/developer

### Cloudinary (Image Uploads)

Configure your Cloudinary credentials in `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

See [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) for detailed instructions.

### Admin Password

Set your admin password in `.env`:

```env
VITE_ADMIN_PASSWORD=your_secure_password
```

### WhatsApp & Instagram (Footer)

Update your social media details in `.env`:

```env
VITE_INSTAGRAM_USERNAME=your_instagram_handle
VITE_WHATSAPP_NUMBER=2348012345678
```

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root app, routing, Paystack loader
├── styles/
│   └── global.css             # Global styles, animations, shared classes
├── data/
│   └── products.js            # Default products + categories + currency formatter
├── context/
│   └── CartContext.jsx        # Cart state (add, remove, qty, total)
├── components/
│   ├── Header.jsx             # Sticky nav with cart icon
│   ├── Hero.jsx               # Hero section
│   ├── ProductCard.jsx        # Individual product card
│   ├── CartDrawer.jsx         # Slide-in cart sidebar
│   ├── CheckoutModal.jsx      # Checkout form + Paystack integration
│   ├── QuickViewModal.jsx     # Product quick-view popup
│   └── Footer.jsx             # Footer with WhatsApp & Instagram links
└── pages/
    ├── Shop.jsx               # Main shop page
    ├── AdminLogin.jsx         # Admin password screen
    └── Admin.jsx              # Admin dashboard (add/edit/delete products)
```

---

## 💡 Features

- 🛍️ Product grid with category filter
- 🔍 Quick-view modal per product
- 🛒 Cart drawer with qty controls
- 💳 Checkout with Paystack popup
- 🔐 Password-protected admin panel
- 📦 Add / Edit / Delete products
- 💾 Products saved in localStorage (persist on refresh)
- 📱 Fully responsive
- 💬 WhatsApp & Instagram contact links in footer
