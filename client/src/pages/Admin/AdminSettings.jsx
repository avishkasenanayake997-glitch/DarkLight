import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';
import { Camera, Save, Lock, Settings } from 'lucide-react';

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profile_image || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Custom Studio Settings (simulated state)
  const [studioName, setStudioName] = useState('DarkLight Photography');
  const [address, setAddress] = useState('123 Studio Lane, New York, NY 10001');
  const [igLink, setIgLink] = useState('https://instagram.com/darklight');
  const [fbLink, setFbLink] = useState('https://facebook.com/darklight');
  const [studioLoading, setStudioLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      const { data } = await authAPI.updateProfile(formData);
      updateUser(data.user);
      toast.success('Admin profile updated! 📸');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setPasswordLoading(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleStudioSubmit = async (e) => {
    e.preventDefault();
    setStudioLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Studio configuration saved successfully');
    setStudioLoading(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 className="font-display">Studio Settings</h2>
        <p style={{ color: 'var(--white-40)', fontSize: '0.88rem' }}>Manage admin credentials, security, contact info, and social integration links.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit} className="card-glass auth-card" style={{ maxWidth: 'none', padding: '28px' }}>
            <h3 className="font-display" style={{ marginBottom: '24px' }}>Admin Profile</h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={previewUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt="avatar"
                  style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--gold)' }}
                />
                <label
                  htmlFor="avatar-upload"
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--gold)',
                    color: 'var(--dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Camera size={16} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Read-Only)</label>
                <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={profileLoading}>
                <Save size={16} /> {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          {/* Studio settings form */}
          <form onSubmit={handleStudioSubmit} className="card-glass auth-card" style={{ maxWidth: 'none', padding: '28px' }}>
            <h3 className="font-display" style={{ marginBottom: '24px' }}>Business Configuration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Studio Display Name</label>
                <input type="text" className="form-input" value={studioName} onChange={(e) => setStudioName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Office Address / Map Coordinate</label>
                <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Instagram Profile</label>
                  <input type="url" className="form-input" value={igLink} onChange={(e) => setIgLink(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Facebook Profile</label>
                  <input type="url" className="form-input" value={fbLink} onChange={(e) => setFbLink(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="btn btn-outline w-full" disabled={studioLoading}>
                <Settings size={16} /> {studioLoading ? 'Saving...' : 'Save Studio Config'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit} className="card-glass auth-card" style={{ maxWidth: 'none', padding: '28px' }}>
          <h3 className="font-display" style={{ marginBottom: '24px' }}>Admin Password</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-outline w-full" disabled={passwordLoading}>
              <Lock size={16} /> {passwordLoading ? 'Updating Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
