import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/Logo/Logo W.webp';
import './Auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      await register({ name, email, phone, password });
      toast.success('Registration successful! Welcome 📸');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
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
        <p className="auth-subtitle">Create an account to start booking sessions</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--gold)' }} />
              <input
                type="text"
                placeholder="John Doe"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--gold)' }} />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                placeholder="Minimum 6 characters"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
