import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, CheckCircle2, Trash2 } from 'lucide-react';
import { notificationAPI } from '../../api';
import toast from 'react-hot-toast';

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data.notifications || []);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, is_read: true } : n))
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationAPI.delete(id);
      setNotifications(notifications.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch {}
  };

  const handleNotificationClick = (n) => {
    if (!n.is_read) handleMarkRead(n._id);
    if (n.booking_id?._id) {
      navigate(`/dashboard/bookings/${n.booking_id._id}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="font-display">Notifications</h2>
          <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Stay updated on booking approvals, notes, and alerts.</p>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <button className="btn btn-ghost btn-sm" onClick={handleMarkAllRead}>
            Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="loading-spinner" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card-glass auth-card" style={{ maxWidth: 'none', padding: '48px', textAlign: 'center' }}>
          <BellOff size={40} style={{ color: 'var(--white-40)', marginBottom: '16px' }} />
          <h4 style={{ margin: 0 }}>All caught up!</h4>
          <p style={{ color: 'var(--white-40)', fontSize: '0.9rem', marginTop: '6px' }}>No notifications to display.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => (
            <div
              key={n._id}
              className="card"
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                cursor: n.booking_id?._id ? 'pointer' : 'default',
                borderColor: !n.is_read ? 'var(--gold)' : 'var(--dark-border)',
                background: !n.is_read ? 'rgba(201,169,110,0.03)' : 'var(--dark-card)',
                padding: '20px',
              }}
              onClick={() => handleNotificationClick(n)}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: !n.is_read ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: !n.is_read ? 'var(--gold)' : 'var(--white-40)',
                  flexShrink: 0,
                }}
              >
                <Bell size={18} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: !n.is_read ? 600 : 500 }}>{n.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--white-40)' }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--white-70)', marginTop: '4px', lineHeight: 1.5 }}>
                  {n.message}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                <button
                  className="icon-btn-badge"
                  style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                  onClick={(e) => handleDelete(e, n._id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
