# E-Commerce Platform

A modern, high-performance, full-stack e-commerce web application featuring a robust **ASP.NET Core 10.0 API** backend and a dynamic, responsive **React 19** SPA frontend.

---

## 🚀 Key Features

*   **Phone OTP Authentication**: Secure login/registration via phone number with simulation OTP (`0000`). Automatically registers new users and initializes a shopping cart on first login.
*   **Dynamic Catalog & Search**: Advanced product browsing with robust search capabilities, categorization, and multi-parameter sorting (Relevance, Price, Rating, Newest, Discount).
*   **Shopping Cart System**: Real-time database synchronization with the backend, quantity updates, automatic cart clearing on order placement, and tax (18%) and shipping calculations.
*   **Address Management**: Manage multiple shipping addresses (Home, Work, etc.) with custom labels and default address selection.
*   **Checkout & Order History**: Seamless conversion of cart items to persistent orders, tracking status (Placed, Confirmed, Shipped, Delivered) and payment status.
*   **Built-in Coupon System**: Fully-supported client-side coupon validations:
    *   `NEXUS10` (10% off)
    *   `FLAT200` (₹200 flat discount)
    *   `SAVE50` (50% off, up to ₹500)
    *   `NEWUSER` (15% off)
    *   `PREMIUM` (₹500 flat discount on premium items)
*   **Premium UI/UX**: Dynamic dark/light mode themes, glassmorphism UI components, and fluid micro-animations powered by **Framer Motion**.

---

## 🛠️ Technology Stack

### Backend
*   **Framework**: ASP.NET Core 10.0 Web API
*   **Database ORM**: Entity Framework Core 10.0
*   **Database**: Microsoft SQL Server (pre-configured to host on `Somee.com`)
*   **Authentication**: JWT Token-based authentication (stored securely in `HttpOnly` cookies and returned in responses)
*   **Documentation**: Swagger / OpenAPI integration for easy API exploration

### Frontend
*   **Framework**: React 19 (JavaScript)
*   **Build Tool**: Vite 8
*   **Routing**: React Router DOM 7
*   **Animations**: Framer Motion 12
*   **Styling**: Custom CSS variables for maximum performance, flexibility, and design control

---

## 📁 Directory Structure

```text
FullEcommerce/
├── EcomBackend/              # ASP.NET Core 10.0 Web API Project
│   ├── Controllers/          # API Route Controllers (Auth, Cart, Products, Orders, Users)
│   ├── Data/                 # DB Context (AppDbContext) & Seeder (DbSeeder)
│   ├── Migrations/           # EF Core Database Migrations
│   ├── Models/               # Database Entities (Product, Cart, Order, User, etc.)
│   ├── Properties/           # launchSettings.json profile configurations
│   ├── Program.cs            # App bootstrap, services container, and HTTP middleware
│   ├── WebApplication2.csproj# MSBuild project file
│   └── appsettings.json      # Database connections and JWT settings
│
└── EcomFrontend/             # React SPA Frontend Project
    ├── public/               # Public assets (icons, images)
    ├── src/
    │   ├── components/       # Reusable components (Layout, UI, Navigation)
    │   ├── context/          # Context Providers (AuthContext, CartContext, ThemeContext)
    │   ├── hooks/            # Custom React Hooks
    │   ├── pages/            # View Pages (Home, Cart, Checkout, Profile, Orders, etc.)
    │   ├── routes/           # Routing configuration (Public, Protected, Main layout)
    │   ├── services/         # API Service Calls (authService, cartService, etc.)
    │   ├── utils/            # Helper functions and app constants
    │   ├── App.jsx           # Global wrapper
    │   └── main.jsx          # Entry point
    ├── index.html            # SPA Entry HTML
    ├── package.json          # Node dependencies & npm scripts
    └── vite.config.js        # Vite compilation rules
```

---

## ⚙️ Configuration & Setup

### 1. Backend Setup (`EcomBackend`)

#### Prerequisites
*   [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) installed on your system.
*   Access to a SQL Server database (configured to connect to Somee by default, but customizable to LocalDB/local SQL server instances).

#### Connection Settings
Open `EcomBackend/appsettings.json` and adjust the connection strings or JWT configuration if necessary:
```json
"ConnectionStrings": {
  "DefaultConnection": "your_sql_connection_string"
},
"Jwt": {
  "Key": "your_secure_secret_key_here_at_least_32_characters",
  "Issuer": "YourEcommerceApp",
  "Audience": "YourEcommerceUsers"
}
```

#### Run Database Migrations
If you're using a new database instance, run the following commands inside the `EcomBackend` folder to apply the schema:
```bash
cd EcomBackend
dotnet ef database update
```

#### Run the Backend API
Start the developer server with live-reloads:
```bash
dotnet run
```
*   The application will bootstrap, and the `DbSeeder` class will automatically detect if the database is empty and populate it with premium sample products (electronics, laptops, audio, smartphones, etc.).
*   Open the Swagger API documentation in your browser to inspect or test endpoints:
    `http://localhost:5000/swagger/index.html` (or port listed in your console).

---

### 2. Frontend Setup (`EcomFrontend`)

#### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended).

#### Configuration
Open `EcomFrontend/src/utils/constants.js` to configure global parameters, API URLs, and settings:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api'; // Point this to your backend server URL
export const OTP_DEFAULT = '0000'; // Simulation login code
```

#### Installation & Run
Execute the following commands in the frontend folder:
```bash
cd EcomFrontend
npm install
npm run dev
```
*   The development server will spin up (usually at `http://localhost:5173`).
*   Open the address in your browser to interact with the web app!

---

## 🔌 API Reference

### 🔐 Authentication (`api/Auth`)
*   `POST /api/auth/verify-otp`: Verifies the login credentials.
    *   **Request Body**: `{ "phone": "string", "otp": "string" }`
    *   **Behavior**: Validation OTP is hardcoded to `0000`. Returns JWT Token and signs the user in via cookie. Creates user and cart if they do not exist.

### 📦 Products (`api/Products`)
*   `GET /api/products`: Retrieve all products in the store database.
*   `GET /api/products/{id}`: Retrieve detailed specifications, badges, images, and reviews for a single product.
*   `POST /api/products`: Create a new product (Admin feature).

### 🛒 Shopping Cart (`api/Cart`)
*   `GET /api/cart/{userId}`: Retrieve the current user's cart items, subtotal, and dynamically calculated item counts.
*   `POST /api/cart/add`: Add an item to the cart (or increment quantity if already added).
    *   **Request Body**: `{ "userId": "string", "productId": "string", "quantity": int }`
*   `PUT /api/cart/update`: Modify the quantity of a specific item in the cart.
*   `DELETE /api/cart/remove`: Remove an item completely from the cart.
*   `DELETE /api/cart/clear/{userId}`: Clear all items from the user's cart.

### 🧾 Orders (`api/Orders`)
*   `POST /api/orders/checkout`: Place an order using the active cart.
    *   **Request Body**: `{ "userId": "string", "shippingAddress": "string" }`
    *   **Behavior**: Creates Order & OrderItems, copies unit prices, flushes user cart items, and saves records.
*   `GET /api/orders/user/{userId}`: Retrieve a complete list of historical orders placed by a specific user.

### 👤 Profile & Addresses (`api/Users`) *(Protected)*
*   `GET /api/users/profile`: Retrieves profile details (Name, Email, Role, Addresses).
*   `PUT /api/users/profile`: Update details like name, email, or avatar.
*   `GET /api/users/addresses`: Retrieve the user's registered delivery addresses.
*   `POST /api/users/addresses`: Add a new address (automatically marks default settings if selected).
*   `DELETE /api/users/addresses/{id}`: Delete a registered address.

---

## 🧪 Testing Credentials
For testing flows without configuring third-party providers:
*   **Phone Number**: Any valid phone format (e.g. `9876543210`)
*   **OTP**: `0000` (Defaults to local mock verification)
*   **CORS Settings**: The backend allows cross-origin requests from ports `5173`, `5174`, and `3000` by default.
