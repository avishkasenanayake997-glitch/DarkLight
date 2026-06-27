import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageAPI } from '../../api';
import toast from 'react-hot-toast';
import { Check, Star } from 'lucide-react';

export default function CustomerPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    packageAPI.getAll()
      .then(({ data }) => setPackages(data.packages || []))
      .catch(() => toast.error('Failed to load packages'))
      .finally(() => setLoading(false));
  }, []);

  const handleBookPackage = (pkgId) => {
    navigate(`/dashboard/book?packageId=${pkgId}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="font-display">Our Photography Packages</h2>
        <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Select a package below to start booking your session with us.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className={`card ${pkg.is_popular ? 'card-glass' : ''}`}
            style={{
              borderColor: pkg.is_popular ? 'var(--gold)' : 'var(--dark-border)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
            }}
          >
            {pkg.is_popular && (
              <span
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  backgroundColor: 'var(--gold)',
                  color: 'var(--dark)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Star size={10} fill="var(--dark)" /> Popular Selection
              </span>
            )}

            <div style={{ marginBottom: '16px' }}>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--white)', margin: 0 }}>
                {pkg.name}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--white-40)' }}>📅 {pkg.duration}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 16px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                LKR {pkg.price.toLocaleString()}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--white-70)', lineHeight: 1.6, marginBottom: '20px', minHeight: '40px' }}>
              {pkg.description}
            </p>

            <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '16px', marginTop: 'auto', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--white-40)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                Included Specifications:
              </span>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                {pkg.features?.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--white-70)', lineHeight: 1.4 }}>
                    <Check size={12} style={{ color: 'var(--gold)', marginTop: '3px', flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="btn btn-primary w-full" onClick={() => handleBookPackage(pkg._id)}>
              Select & Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
