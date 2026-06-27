import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { bookingAPI } from '../../api';
import toast from 'react-hot-toast';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      const { data } = await bookingAPI.getOne(id);
      setBooking(data.booking);
    } catch {
      toast.error('Failed to load booking details');
      navigate('/dashboard/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled successfully');
      fetchBookingDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="icon-btn-badge" onClick={() => navigate('/dashboard/bookings')} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-display" style={{ margin: 0 }}>Booking Details</h2>
          <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>ID: {booking.booking_id}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className={`badge badge-${booking.status}`}>{booking.status}</span>
          {booking.status === 'pending' && (
            <button className="btn btn-danger btn-sm" onClick={handleCancel}>Cancel Booking</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '28px' }}>
        {/* Main Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Info Card */}
          <div className="card-glass auth-card" style={{ maxWidth: 'none', padding: '28px' }}>
            <h3 className="font-display" style={{ marginBottom: '20px', borderBottom: '1px solid var(--dark-border)', paddingBottom: '12px' }}>
              Event Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Calendar size={18} style={{ color: 'var(--gold)', marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--white-40)', textTransform: 'uppercase' }}>Date</div>
                  <div style={{ fontWeight: 500 }}>{new Date(booking.event_date).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} style={{ color: 'var(--gold)', marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--white-40)', textTransform: 'uppercase' }}>Time</div>
                  <div style={{ fontWeight: 500 }}>{booking.start_time} - {booking.end_time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} style={{ color: 'var(--gold)', marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--white-40)', textTransform: 'uppercase' }}>Location</div>
                  <div style={{ fontWeight: 500 }}>{booking.location}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <HelpCircle size={18} style={{ color: 'var(--gold)', marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--white-40)', textTransform: 'uppercase' }}>Event Category</div>
                  <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{booking.event_type}</div>
                </div>
              </div>
            </div>

            {booking.special_request && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--dark-border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--white-40)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Special Requests
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--white-70)', whiteSpace: 'pre-wrap' }}>{booking.special_request}</p>
              </div>
            )}
          </div>

          {/* Admin response details */}
          {(booking.admin_note || booking.rejection_reason || booking.meeting_time || booking.additional_charges > 0) && (
            <div className="card-glass auth-card" style={{ maxWidth: 'none', padding: '28px', borderLeft: `4px solid ${booking.status === 'approved' ? 'var(--approved)' : 'var(--rejected)'}` }}>
              <h3 className="font-display" style={{ marginBottom: '16px' }}>Photographer Notes & Updates</h3>

              {booking.status === 'approved' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {booking.meeting_time && (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--white-40)' }}>📅 MEETING TIME SCHEDULED</span>
                      <p style={{ fontWeight: 600, color: 'var(--approved)' }}>{booking.meeting_time}</p>
                    </div>
                  )}
                  {booking.additional_charges > 0 && (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--white-40)' }}>💵 ADDITIONAL CHARGES</span>
                      <p style={{ fontWeight: 600 }}>LKR {booking.additional_charges.toLocaleString()}</p>
                    </div>
                  )}
                  {booking.admin_note && (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--white-40)' }}>📝 SPECIAL NOTES</span>
                      <p style={{ fontStyle: 'italic', color: 'var(--white-70)' }}>"{booking.admin_note}"</p>
                    </div>
                  )}
                </div>
              )}

              {booking.status === 'rejected' && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--white-40)' }}>REJECTION REASON</span>
                  <p style={{ color: 'var(--rejected)', fontWeight: 500, marginTop: '4px' }}>
                    {booking.rejection_reason || 'Photographer is unavailable for the selected date.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reference Images */}
          {booking.reference_images?.length > 0 && (
            <div className="card-glass auth-card" style={{ maxWidth: 'none', padding: '28px' }}>
              <h3 className="font-display" style={{ marginBottom: '16px' }}>Uploaded Reference Images</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                {booking.reference_images.map((img, i) => (
                  <a href={img.url} target="_blank" rel="noreferrer" key={i} className="preview-thumb" style={{ border: '1px solid var(--dark-border)' }}>
                    <img src={img.url} alt={`Reference ${i + 1}`} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing / Package Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card-glass auth-card" style={{ maxWidth: 'none', padding: '28px' }}>
            <h3 className="font-display" style={{ marginBottom: '16px' }}>Package Details</h3>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--gold)' }}>
              {booking.package_id?.name || 'Custom Package'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>LKR {(booking.package_id?.price || 0).toLocaleString()}</span>
              <span style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>/ {booking.package_id?.duration}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--white-40)', lineHeight: 1.6, marginBottom: '20px' }}>
              {booking.package_id?.description}
            </p>

            <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--white-70)' }}>Package Price</span>
                <span>LKR {(booking.package_id?.price || 0).toLocaleString()}</span>
              </div>
              {booking.additional_charges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--white-70)' }}>Add-ons / Meeting Charges</span>
                  <span>LKR {booking.additional_charges.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.05rem', borderTop: '1.5px solid var(--dark-border)', paddingTop: '12px', marginTop: '12px' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--gold)' }}>
                  LKR {((booking.package_id?.price || 0) + (booking.additional_charges || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
