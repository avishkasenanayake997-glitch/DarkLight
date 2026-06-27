import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Company: ['About Us', 'Our Team', 'Careers', 'Press'],
  Services: ['Wedding Photography', 'Event Photography', 'Portraits', 'Commercial'],
  Support: ['Book Now', 'FAQ', 'Contact Us', 'Privacy Policy'],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Camera size={20} style={{ color: 'var(--gold)' }} />
              Dark<span style={{ color: 'var(--gold)' }}>Light</span>
            </div>
            <p className="footer-tagline">
              Transforming fleeting moments into timeless visual stories. Premium photography for life's most important occasions.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <Link to="/register" className="btn btn-primary btn-sm">Book Now</Link>
              <a href="#portfolio" className="btn btn-ghost btn-sm">View Work</a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div className="footer-col-title">{title}</div>
              <ul className="footer-links">
                {links.map((link) => (
                  <li key={link}>
                    <span className="footer-link">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} <span>DarkLight Photography</span>. All rights reserved.
          </p>
          <p className="footer-copy">
            Crafted with ❤️ for capturing beautiful moments
          </p>
        </div>
      </div>
    </footer>
  );
}
