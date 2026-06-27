import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/Logo/Logo W.webp';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter all fields');
    }
    setLoading(true);
    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name}! 👋`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card-glass auth-card">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="DarkLight Logo" style={{ height: '44px', objectFit: 'contain' }} />
        </Link>
        <p className="auth-subtitle">Sign in to manage your photography bookings</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--gold)' }} />
              <input
                type="email"
                placeholder="email@example.com"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--gold)' }} />
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-actions-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" style={{ accentColor: 'var(--gold)' }} />
              <label htmlFor="remember" style={{ color: 'var(--white-70)', cursor: 'pointer' }}>Remember me</label>
            </div>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
