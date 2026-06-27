import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Logo/Logo W.webp';
import './Landing.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Packages', href: '#packages' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboard = () => {
    navigate(isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="DarkLight Logo" style={{ height: '40px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links hide-mobile">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="nav-actions hide-mobile">
          {isAuthenticated ? (
            <button className="btn btn-primary btn-sm" onClick={handleDashboard}>
              My Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Book Now</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn show-mobile" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mobile-menu-inner">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <div className="mobile-nav-actions">
                {isAuthenticated ? (
                  <button className="btn btn-primary w-full" onClick={handleDashboard}>My Dashboard</button>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-ghost w-full" onClick={() => setMenuOpen(false)}>Sign In</Link>
                    <Link to="/register" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>Book Now</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
