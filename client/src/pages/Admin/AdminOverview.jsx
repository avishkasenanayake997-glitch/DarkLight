import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, Clock, CheckSquare } from 'lucide-react';
import { reportAPI, bookingAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    pending: 0,
    todayEvents: 0,
    completed: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        reportAPI.getOverview(),
        bookingAPI.getAll({ limit: 5 }),
      ]);
      setStats(statsRes.data.stats || {});
      setRecentBookings(bookingsRes.data.bookings || []);
    } catch {
      toast.error('Failed to load overview data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Pending Bookings', value: stats.pending, Icon: Clock, color: 'var(--pending)' },
    { label: "Today's Events", value: stats.todayEvents, Icon: Calendar, color: 'var(--approved)' },
    { label: 'Completed Jobs', value: stats.completed, Icon: CheckSquare, color: 'var(--completed)' },
    { label: 'Total Customers', value: stats.totalCustomers, Icon: Users, color: 'var(--gold)' },
    { label: 'Monthly Revenue', value: `LKR ${(stats.monthlyRevenue || 0).toLocaleString()}`, Icon: DollarSign, color: 'var(--approved)' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {statCards.map((card) => {
          const Icon = card.Icon;
          return (
            <div key={card.label} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--dark-border)' }}>
                <Icon size={24} style={{ color: card.color }} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.8rem' }}>{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }} className="font-display">Recent Booking Requests</h3>
        <Link to="/admin/bookings" className="btn btn-outline btn-sm">View All Requests</Link>
      </div>

      <div className="table-container">
        {recentBookings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--white-40)' }}>
            No booking requests yet.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Package</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id}>
                  <td style={{ fontWeight: 600, color: 'var(--white)' }}>{b.booking_id}</td>
                  <td>{b.customer_name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{b.event_type}</td>
                  <td>{new Date(b.event_date).toLocaleDateString()}</td>
                  <td>{b.package_id?.name || 'Custom'}</td>
                  <td>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/admin/bookings?id=${b._id}`)}
                    >
                      View & Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
