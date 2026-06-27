import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/Logo/Logo W.webp';
import './Auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email');
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Password reset link sent to your email! 📧');
    setEmail('');
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="card-glass auth-card">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="DarkLight Logo" style={{ height: '44px', objectFit: 'contain' }} />
        </Link>
        <p className="auth-subtitle">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--gold)' }} />
              <input
                type="email"
                placeholder="john@example.com"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
