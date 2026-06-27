import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingAPI } from '../../api';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [filter, page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filter !== 'all') params.status = filter;

      const { data } = await bookingAPI.getMyBookings(params);
      setBookings(data.bookings || []);
      setTotalPages(data.pages || 1);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const tabs = [
    { label: 'All Bookings', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="font-display">My Bookings</h2>
          <p style={{ color: 'var(--white-40)', fontSize: '0.88rem' }}>View, track, and manage your booked photography events.</p>
        </div>
        <Link to="/dashboard/book" className="btn btn-primary btn-sm">New Booking 📸</Link>
      </div>

      {/* Tabs */}
      <div className="portfolio-filters" style={{ justifyContent: 'flex-start', marginBottom: '24px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`filter-btn ${filter === tab.value ? 'active' : ''}`}
            onClick={() => { setFilter(tab.value); setPage(1); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="table-container">
          {bookings.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--white-40)' }}>
              No bookings matching filter.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Event Type</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600, color: 'var(--white)' }}>{b.booking_id}</td>
                    <td style={{ textTransform: 'capitalize' }}>{b.event_type}</td>
                    <td>{new Date(b.event_date).toLocaleDateString()}</td>
                    <td>{b.start_time} - {b.end_time}</td>
                    <td>{b.package_id?.name || 'Custom'}</td>
                    <td>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/dashboard/bookings/${b._id}`)}
                        >
                          View
                        </button>
                        {b.status === 'pending' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(b._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      )}
    </div>
  );
}
