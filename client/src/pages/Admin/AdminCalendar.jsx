import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { bookingAPI } from '../../api';
import toast from 'react-hot-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AdminCalendar.css';

const localizer = momentLocalizer(moment);

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      const { data } = await bookingAPI.getCalendar();
      const formatted = (data.bookings || []).map((b) => {
        const dateStr = b.event_date.split('T')[0];
        const start = moment(`${dateStr} ${b.start_time}`, 'YYYY-MM-DD HH:mm').toDate();
        const end = moment(`${dateStr} ${b.end_time}`, 'YYYY-MM-DD HH:mm').toDate();
        return {
          id: b._id,
          title: `📸 [${b.booking_id}] ${b.customer_name} - ${b.event_type}`,
          start,
          end,
          resource: b,
        };
      });
      setEvents(formatted);
    } catch {
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#C9A96E'; // Default gold
    const category = event.resource?.event_type;

    if (category === 'wedding') backgroundColor = '#E28743';
    else if (category === 'birthday') backgroundColor = '#76B5C5';
    else if (category === 'graduation') backgroundColor = '#1E3D59';
    else if (category === 'event') backgroundColor = '#5D8B56';

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.85,
        color: '#0d0d0d',
        border: 'none',
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: 600,
        padding: '2px 6px',
      },
    };
  };

  return (
    <div style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-display">Monthly Event Calendar</h2>
        <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Overview of all approved bookings and scheduled photo sessions.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', flex: 1 }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="card-glass" style={{ flex: 1, padding: '20px', minHeight: '500px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            onSelectEvent={(event) => {
              window.location.href = `/admin/bookings?id=${event.id}`;
            }}
          />
        </div>
      )}
    </div>
  );
}
