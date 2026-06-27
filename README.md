# 📸 DarkLight Photography Booking System

A premium, full-stack photography booking system containing a customer-facing public landing page, customer booking dashboard, and administrative photographer dashboard with calendar coordination and reports.

---

## 💻 Tech Stack

- **Frontend**: React (Vite), CSS Design System (Custom Gold Luxury theme), React Router, Axios, Recharts, React Big Calendar, Lucide Icons, React Hot Toast.
- **Backend**: Node.js, Express.js, JWT Cookie Authentication, Mongoose (MongoDB), Multer (Image uploads), Cloudinary (production asset storage or fallback local storage).

---

## 🗂 Project Structure

```
DarkLight/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios instance + backend connection routes
│   │   ├── components/      # Common modules (guards, modals)
│   │   ├── context/         # AuthContext
│   │   ├── pages/
│   │   │   ├── Landing/     # Public landing page sections
│   │   │   ├── Auth/        # LoginPage, RegisterPage, ForgotPassword
│   │   │   ├── Customer/    # Customer space (Book Shoot, My Bookings, Profile)
│   │   │   └── Admin/       # Admin space (Overview, Requests, Calendar, CRUD)
│   │   ├── index.css        # Luxury Dark Gold design tokens & components
│   │   ├── App.jsx          # Route paths mapping
│   │   └── main.jsx
│   └── package.json
└── server/                  # Node.js + Express backend
    ├── config/              # database / cloudinary configuration
    ├── controllers/         # route controllers logic
    ├── middleware/          # auth token verify / errorHandler / upload configuration
    ├── models/              # MongoDB Schemas (User, Booking, Package, Gallery)
    ├── routes/              # Express Router mapping
    ├── utils/               # database seed script
    ├── index.js             # main Express server entrypoint
    └── package.json
```

---

## ⚙️ Setup & Execution

### 1. Database & Local Requirements
Ensure you have **MongoDB** running locally on your system.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with default admin credentials, packages, and gallery photos:
   ```bash
   npm run seed
   ```
4. Start the server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

---

## 🔑 Seeded Test Credentials

To log in and test immediately, use the following accounts pre-created by the seed script:

- **Admin/Photographer Account**:
  - **Email**: `admin@darklight.com`
  - **Password**: `admin123`

- **Customer Account**:
  - **Email**: `customer@example.com`
  - **Password**: `customer123`
