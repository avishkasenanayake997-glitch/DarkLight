import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';
import { bookingAPI } from '../../api';

export default function CustomerOverview() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings({ limit: 5 });
      const bookings = data.bookings || [];
      setRecentBookings(bookings);

      // Compute statistics locally
      const computed = bookings.reduce(
        (acc, b) => {
          acc.total++;
          if (b.status === 'pending') acc.pending++;
          else if (b.status === 'approved') acc.approved++;
          else if (b.status === 'rejected') acc.rejected++;
          return acc;
        },
        { total: 0, pending: 0, approved: 0, rejected: 0 }
      );
      setStats(computed);
    } catch {
      // Quiet fail or placeholder
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.total, Icon: Calendar, color: 'var(--gold)' },
    { label: 'Pending Requests', value: stats.pending, Icon: Clock, color: 'var(--pending)' },
    { label: 'Approved Events', value: stats.approved, Icon: CheckCircle2, color: 'var(--approved)' },
    { label: 'Rejected Shoots', value: stats.rejected, Icon: XCircle, color: 'var(--rejected)' },
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
      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.Icon;
          return (
            <div key={card.label} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `rgba(255,255,255,0.05)`, border: `1px solid var(--dark-border)` }}>
                <Icon size={24} style={{ color: card.color }} />
              </div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }} className="font-display">Recent Bookings</h3>
        <Link to="/dashboard/book" className="btn btn-primary btn-sm">New Booking 📸</Link>
      </div>

      <div className="table-container">
        {recentBookings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--white-40)' }}>
            No bookings found. <Link to="/dashboard/book" className="auth-link">Book your first session now!</Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
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
                  <td style={{ textTransform: 'capitalize' }}>{b.event_type}</td>
                  <td>{new Date(b.event_date).toLocaleDateString()}</td>
                  <td>{b.package_id?.name || 'Custom'}</td>
                  <td>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/dashboard/bookings/${b._id}`)}
                    >
                      View Details
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
