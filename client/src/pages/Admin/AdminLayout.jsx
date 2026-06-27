import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileCheck, Users, HardDrive, Image, BarChart3, Bell, Settings, LogOut, Camera, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../api';
import logo from '../../assets/Logo/Logo W.webp';
import './AdminLayout.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll({ limit: 1 });
      setUnreadCount(data.unread || 0);
    } catch {}
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src={logo}
              alt="DarkLight Logo"
              style={{
                height: '46px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 6px rgba(201, 169, 110, 0.35))'
              }}
            />
            <span style={{ fontSize: '0.65rem', background: 'var(--gold)', color: 'var(--dark)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', fontWeight: 700 }}>ADMIN</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FileCheck size={18} />
            Booking Requests
          </NavLink>
          <NavLink
            to="/admin/calendar"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Calendar size={18} />
            Calendar
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={18} />
            Customers
          </NavLink>
          <NavLink
            to="/admin/packages"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <HardDrive size={18} />
            Packages
          </NavLink>
          <NavLink
            to="/admin/gallery"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Image size={18} />
            Gallery
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <BarChart3 size={18} />
            Reports
          </NavLink>
          <NavLink
            to="/admin/notifications"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Bell size={18} />
            Notifications
            {unreadCount > 0 && <span className="notif-dot" style={{ marginLeft: 'auto' }} />}
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link w-full" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="main-wrapper">
        <header className="dashboard-header">
          <button className="mobile-menu-btn show-mobile" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>

          <h2 className="header-title hide-mobile">Photographer Dashboard</h2>

          <div className="header-right">
            <button className="icon-btn-badge" onClick={() => navigate('/admin/notifications')}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="badge-dot" />}
            </button>

            <div className="user-profile-menu" onClick={() => navigate('/admin/settings')}>
              <img
                src={user?.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user?.name}
                className="user-avatar"
              />
              <div className="hide-mobile">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">Photographer (Admin)</div>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
