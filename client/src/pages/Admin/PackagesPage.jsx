import { useState, useEffect } from 'react';
import { packageAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data } = await packageAPI.getAll({ active_only: 'false' });
      setPackages(data.packages || []);
    } catch {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setName('');
    setPrice(0);
    setDuration('');
    setDescription('');
    setFeatures([]);
    setIsPopular(false);
    setShowModal(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setPrice(pkg.price);
    setDuration(pkg.duration);
    setDescription(pkg.description || '');
    setFeatures(pkg.features || []);
    setIsPopular(pkg.is_popular || false);
    setShowModal(true);
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pkgData = {
      name,
      price: Number(price),
      duration,
      description,
      features,
      is_popular: isPopular,
    };

    try {
      if (editingPackage) {
        await packageAPI.update(editingPackage._id, pkgData);
        toast.success('Package updated successfully! 📦');
      } else {
        await packageAPI.create(pkgData);
        toast.success('Package created successfully! 📦');
      }
      setShowModal(false);
      fetchPackages();
    } catch {
      toast.error('Failed to save package');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await packageAPI.delete(id);
      toast.success('Package deleted');
      fetchPackages();
    } catch {
      toast.error('Failed to delete package');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 className="font-display">Service Packages</h2>
          <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Configure photography package tiers, specs, inclusions, and prices.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Package
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {packages.map((pkg) => (
            <div key={pkg._id} className={`card ${pkg.is_popular ? 'card-glass' : ''}`} style={{ borderColor: pkg.is_popular ? 'var(--gold)' : 'var(--dark-border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600 }}>{pkg.name}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="icon-btn-badge" style={{ width: '32px', height: '32px', borderRadius: '6px' }} onClick={() => handleOpenEdit(pkg)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="icon-btn-badge" style={{ width: '32px', height: '32px', borderRadius: '6px' }} onClick={() => handleDelete(pkg._id)} title="Delete">
                    <Trash2 size={14} style={{ color: 'var(--rejected)' }} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '14px 0 4px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>LKR {pkg.price.toLocaleString()}</span>
                <span style={{ color: 'var(--white-40)', fontSize: '0.8rem' }}>/ {pkg.duration}</span>
              </div>

              {pkg.is_popular && <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '12px' }}>⭐ Popular Option</span>}

              <p style={{ fontSize: '0.85rem', color: 'var(--white-70)', minHeight: '40px', lineHeight: 1.5, marginBottom: '16px' }}>{pkg.description}</p>

              <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '16px', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--white-40)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Features Includes:</span>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {pkg.features?.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--white-70)' }}>
                      <Check size={12} style={{ color: 'var(--gold)' }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingPackage ? 'Edit Package' : 'Create New Package'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Package Name</label>
                  <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input type="text" className="form-input" placeholder="e.g. 5 Hours / Full Day" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Price (LKR)</label>
                  <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
                </div>
                <div className="form-group" style={{ justifyContent: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                    <input type="checkbox" id="modal-popular" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} style={{ accentColor: 'var(--gold)' }} />
                    <label htmlFor="modal-popular" style={{ color: 'var(--white-70)', cursor: 'pointer' }}>Mark as Popular</label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} placeholder="Brief summary of the package details..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              {/* Inclusions / Features management */}
              <div className="form-group">
                <label className="form-label">Features / Inclusions</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 150+ Edited Photos / Drone Photography"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                  />
                  <button type="button" className="btn btn-ghost" onClick={handleAddFeature}>Add</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {features.map((f, i) => (
                    <span key={i} className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--white-10)', border: '1px solid var(--dark-border)', color: 'var(--white)' }}>
                      {f}
                      <button type="button" onClick={() => handleRemoveFeature(i)} style={{ display: 'inline-flex', alignSelf: 'center', color: 'var(--rejected)' }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                {editingPackage ? 'Save Changes' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
