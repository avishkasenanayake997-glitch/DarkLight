import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingAPI } from '../../api';
import toast from 'react-hot-toast';
import { Search, X, Check, XCircle, Calendar, MapPin, Clock, Info, ExternalLink } from 'lucide-react';

export default function BookingRequests() {
  const [searchParams] = useSearchParams();
  const deepLinkId = searchParams.get('id');

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Form Fields
  const [meetingTime, setMeetingTime] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState(0);

  const [rejectionType, setRejectionType] = useState('unavailable');
  const [rejectionReason, setRejectionReason] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page, search]);

  useEffect(() => {
    if (deepLinkId && bookings.length > 0) {
      const match = bookings.find((b) => b._id === deepLinkId);
      if (match) handleViewBooking(match._id);
    }
  }, [deepLinkId, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (statusFilter !== 'all') params.status = statusFilter;

      const { data } = await bookingAPI.getAll(params);
      setBookings(data.bookings || []);
      setTotalPages(data.pages || 1);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = async (id) => {
    try {
      const { data } = await bookingAPI.getOne(id);
      setSelectedBooking(data.booking);
    } catch {
      toast.error('Could not load booking details');
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await bookingAPI.approve(selectedBooking._id, {
        meeting_time: meetingTime,
        admin_note: adminNote,
        additional_charges: Number(additionalCharges),
      });
      toast.success('Booking request approved!');
      setShowApproveModal(false);
      // reset forms
      setMeetingTime('');
      setAdminNote('');
      setAdditionalCharges(0);
      // Reload details
      handleViewBooking(selectedBooking._id);
      fetchBookings();
    } catch {
      toast.error('Failed to approve booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await bookingAPI.reject(selectedBooking._id, {
        rejection_type: rejectionType,
        rejection_reason: rejectionReason,
      });
      toast.success('Booking request rejected');
      setShowRejectModal(false);
      // reset forms
      setRejectionType('unavailable');
      setRejectionReason('');
      // Reload details
      handleViewBooking(selectedBooking._id);
      fetchBookings();
    } catch {
      toast.error('Failed to reject booking');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="font-display">Booking Requests</h2>
          <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Review events, coordinate meeting details, charge adjustments, or reject bookings.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--white-40)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '44px' }}
            placeholder="Search by customer, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedBooking ? '1.2fr 1fr' : '1fr', gap: '24px' }}>
        {/* Bookings List */}
        <div className="table-container" style={{ height: 'fit-content' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="loading-spinner" />
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--white-40)' }}>
              No bookings found matching filters.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Event Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    style={{
                      cursor: 'pointer',
                      background: selectedBooking?._id === b._id ? 'rgba(201,169,110,0.05)' : 'none',
                    }}
                    onClick={() => handleViewBooking(b._id)}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--white)' }}>{b.booking_id}</td>
                    <td>{b.customer_name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{b.event_type}</td>
                    <td>{new Date(b.event_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleViewBooking(b._id)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Details Panel */}
        {selectedBooking && (
          <div className="card-glass auth-card" style={{ maxWidth: 'none', padding: '24px', alignSelf: 'start', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--dark-border)', paddingBottom: '12px' }}>
              <h3 className="font-display" style={{ margin: 0 }}>Request Details</h3>
              <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--white-40)', fontSize: '0.78rem' }}>CUSTOMER DETAILS</span>
                <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '2px' }}>{selectedBooking.customer_name}</div>
                <div style={{ color: 'var(--white-70)' }}>{selectedBooking.customer_email} | {selectedBooking.customer_phone}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: 'var(--white-40)', fontSize: '0.78rem' }}>EVENT CATEGORY</span>
                  <div style={{ textTransform: 'capitalize', fontWeight: 500 }}>{selectedBooking.event_type}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--white-40)', fontSize: '0.78rem' }}>PACKAGE SELECTED</span>
                  <div style={{ fontWeight: 500 }}>{selectedBooking.package_id?.name || 'Custom'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Calendar size={16} style={{ color: 'var(--gold)', marginTop: '2px' }} />
                <div>
                  <span style={{ color: 'var(--white-40)', fontSize: '0.75rem' }}>DATE & TIME</span>
                  <div>{new Date(selectedBooking.event_date).toLocaleDateString()} | {selectedBooking.start_time} - {selectedBooking.end_time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--gold)', marginTop: '2px' }} />
                <div>
                  <span style={{ color: 'var(--white-40)', fontSize: '0.75rem' }}>LOCATION</span>
                  <div>{selectedBooking.location}</div>
                </div>
              </div>

              {selectedBooking.special_request && (
                <div>
                  <span style={{ color: 'var(--white-40)', fontSize: '0.78rem' }}>SPECIAL REQUESTS</span>
                  <p style={{ background: 'var(--dark-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--dark-border)', fontSize: '0.85rem', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                    {selectedBooking.special_request}
                  </p>
                </div>
              )}

              {selectedBooking.reference_images?.length > 0 && (
                <div>
                  <span style={{ color: 'var(--white-40)', fontSize: '0.78rem' }}>REFERENCE IMAGES</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {selectedBooking.reference_images.map((img, i) => (
                      <a href={img.url} target="_blank" rel="noreferrer" key={i} className="preview-thumb" style={{ width: '60px', height: '60px' }}>
                        <img src={img.url} alt="Reference" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedBooking.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button className="btn btn-success w-full" onClick={() => setShowApproveModal(true)}>
                    <Check size={16} /> Approve
                  </button>
                  <button className="btn btn-danger w-full" onClick={() => setShowRejectModal(true)}>
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}

              {selectedBooking.status === 'approved' && (
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
                  <div style={{ color: 'var(--approved)', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '8px' }}>Approved Details</div>
                  {selectedBooking.meeting_time && <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>💬 Meeting Time: {selectedBooking.meeting_time}</div>}
                  {selectedBooking.additional_charges > 0 && <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>💵 Extra Cost: LKR {selectedBooking.additional_charges.toLocaleString()}</div>}
                  {selectedBooking.admin_note && <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--white-70)' }}>Notes: "{selectedBooking.admin_note}"</div>}
                </div>
              )}

              {selectedBooking.status === 'rejected' && (
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
                  <div style={{ color: 'var(--rejected)', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '4px' }}>Rejected Details</div>
                  <div style={{ fontSize: '0.85rem', textTransform: 'capitalize', color: 'var(--white-70)' }}>Reason Category: {selectedBooking.rejection_type || 'Other'}</div>
                  {selectedBooking.rejection_reason && <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px' }}>Reason: "{selectedBooking.rejection_reason}"</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
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

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Approve Booking Request</h3>
              <button className="modal-close" onClick={() => setShowApproveModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleApprove} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Meeting / Session Location Details (Time & Date)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Meet 1hr prior at main gates / Zoom on Friday 2pm"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Surcharges (Optional)</label>
                <input
                  type="number"
                  className="form-input"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Studio Notes / Instructions</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Notes about dress codes, props, delays, weather contingencies..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={actionLoading}>
                {actionLoading ? 'Approving...' : 'Confirm Approval'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Reject Booking Request</h3>
              <button className="modal-close" onClick={() => setShowRejectModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleReject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Rejection Reason Type</label>
                <select
                  className="form-select"
                  value={rejectionType}
                  onChange={(e) => setRejectionType(e.target.value)}
                >
                  <option value="unavailable">Unavailable (Date Blocked)</option>
                  <option value="fully_booked">Fully Booked</option>
                  <option value="outside_area">Outside Service Area</option>
                  <option value="other">Other / Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Explanation / Custom Message</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Provide details to the customer explaining the cancellation..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-danger w-full" disabled={actionLoading}>
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
