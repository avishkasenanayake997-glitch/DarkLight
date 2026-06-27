import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';

// Public
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';

// Customer Dashboard
import CustomerLayout from './pages/Customer/CustomerLayout';
import CustomerOverview from './pages/Customer/CustomerOverview';
import BookPhotography from './pages/Customer/BookPhotography';
import MyBookings from './pages/Customer/MyBookings';
import BookingDetail from './pages/Customer/BookingDetail';
import CustomerNotifications from './pages/Customer/CustomerNotifications';
import CustomerProfile from './pages/Customer/CustomerProfile';

// Admin Dashboard
import AdminLayout from './pages/Admin/AdminLayout';
import AdminOverview from './pages/Admin/AdminOverview';
import BookingRequests from './pages/Admin/BookingRequests';
import AdminCalendar from './pages/Admin/AdminCalendar';
import CustomersPage from './pages/Admin/CustomersPage';
import PackagesPage from './pages/Admin/PackagesPage';
import GalleryPage from './pages/Admin/GalleryPage';
import ReportsPage from './pages/Admin/ReportsPage';
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminSettings from './pages/Admin/AdminSettings';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#C9A96E', secondary: '#0D0D0D' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Customer Dashboard */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>}
          >
            <Route index element={<CustomerOverview />} />
            <Route path="book" element={<BookPhotography />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="notifications" element={<CustomerNotifications />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}
          >
            <Route index element={<AdminOverview />} />
            <Route path="bookings" element={<BookingRequests />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
