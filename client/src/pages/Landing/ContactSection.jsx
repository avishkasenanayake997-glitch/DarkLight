import { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you shortly. 📸');
    setForm({ name: '', email: '', phone: '', message: '' });
    setSubmitting(false);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Contact Us</div>
          <h2 className="section-title">Let's Create Something <span>Beautiful</span></h2>
          <p className="section-subtitle">Ready to book your session or have questions? We'd love to hear from you.</p>
          <div className="section-divider" />
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div className="contact-info">
            <div>
              <h3 className="contact-info-title">Get In Touch</h3>
              <p style={{ color: 'var(--white-40)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                Whether you're planning a wedding, a birthday celebration, or a corporate event, we're here to help you capture every moment perfectly.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { Icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                { Icon: Mail, label: 'Email', value: 'hello@darklight.photography' },
                { Icon: MapPin, label: 'Location', value: '123 Studio Lane, New York, NY 10001' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="contact-item">
                  <div className="contact-icon"><Icon size={20} /></div>
                  <div>
                    <div className="contact-item-label">{label}</div>
                    <div className="contact-item-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="contact-item-label" style={{ marginBottom: '16px' }}>Follow Us</div>
              <div className="social-links">
                {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                  <button key={i} className="social-link"><Icon size={18} /></button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-card">
            <h3 className="contact-form-title">Send a Message</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    className="form-input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell us about your event and what you're looking for..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message 📸'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
