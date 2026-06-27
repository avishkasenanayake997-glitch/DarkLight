import { useState, useEffect } from 'react';
import { customerAPI } from '../../api';
import toast from 'react-hot-toast';
import { Search, X, Calendar, Phone, Mail, Clock, ShieldAlert } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected customer history
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await customerAPI.getAll({ page, limit: 10, search });
      setCustomers(data.customers || []);
      setTotalPages(data.pages || 1);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async (customer) => {
    setSelectedCustomer(customer);
    setHistoryLoading(true);
    try {
      const { data } = await customerAPI.getBookings(customer._id);
      setCustomerBookings(data.bookings || []);
    } catch {
      toast.error('Failed to load booking history');
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="font-display">Customer Registry</h2>
        <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Monitor client accounts and audit full booking histories.</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--white-40)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '44px' }}
            placeholder="Search customer by name, email or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1.2fr 1fr' : '1fr', gap: '24px' }}>
        <div className="table-container" style={{ height: 'fit-content' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="loading-spinner" />
            </div>
          ) : customers.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--white-40)' }}>
              No customers found matching search filters.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Bookings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} style={{ background: selectedCustomer?._id === c._id ? 'rgba(201,169,110,0.05)' : 'none' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={c.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'}
                          alt={c.name}
                          style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ fontWeight: 600, color: 'var(--white)' }}>{c.name}</div>
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>
                      <span className="badge badge-completed" style={{ fontWeight: 700 }}>
                        {c.bookingCount} shoots
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleViewHistory(c)}>
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected Customer History Panel */}
        {selectedCustomer && (
          <div className="card-glass auth-card" style={{ maxWidth: 'none', padding: '24px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--dark-border)', paddingBottom: '12px' }}>
              <h3 className="font-display" style={{ margin: 0 }}>Client History</h3>
              <button className="modal-close" onClick={() => setSelectedCustomer(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={selectedCustomer.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={selectedCustomer.name}
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ margin: 0 }}>{selectedCustomer.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--white-40)' }}>Client since {new Date(selectedCustomer.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {historyLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div className="loading-spinner" />
                </div>
              ) : customerBookings.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--white-40)', padding: '20px' }}>
                  No bookings found for this customer.
                </div>
              ) : (
                customerBookings.map((b) => (
                  <div
                    key={b._id}
                    className="card"
                    style={{ padding: '16px', border: '1px solid var(--dark-border)', background: 'var(--dark-surface)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--white)' }}>{b.booking_id}</span>
                      <span className={`badge badge-${b.status}`} style={{ fontSize: '0.7rem' }}>{b.status}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--white-70)', marginTop: '8px', textTransform: 'capitalize' }}>
                      📸 {b.event_type} ({b.package_id?.name || 'Custom'})
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--white-40)', marginTop: '4px' }}>
                      📅 {new Date(b.event_date).toLocaleDateString()} | {b.location}
                    </div>
                    {b.additional_charges > 0 && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--gold)', marginTop: '4px', fontWeight: 600 }}>
                        + Addon: ${b.additional_charges}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ justifyContent: 'flex-start' }}>
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
