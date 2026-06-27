import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import { packageAPI } from '../../api';

const defaultPackages = [
  {
    _id: '1',
    name: 'ROYAL SIGNATURE PACKAGE #01',
    price: 150000,
    duration: 'Two Days',
    description: 'Luxurious wedding & homecoming full day photography package.',
    features: [
      'Two Days Full Coverage (Wedding Day & Homecoming)',
      '+ Free Pre-Shoot',
      'Premium 12×30 or 16×24 Magazine Album (50-60 Pages) with Custom Box',
      'Premium 8×24 preshoot Album (10-12 Pages)',
      '20×30 Enlargement',
      '16×24 Enlargement 03',
      'Thank You Card 150',
      'Pen Drive',
      'All High-Resolution Edited Photos Provided in a Pen Drive'
    ],
    is_popular: true,
  },
  {
    _id: '2',
    name: 'PLATINUM ELEGANCE PACKAGE #02',
    price: 120000,
    duration: 'Two Days',
    description: 'Premium wedding & homecoming coverage with high-end magazine album.',
    features: [
      'Two Days Full Coverage (Wedding & Homecoming)',
      'Free Pre-Shoot (Only One Location)',
      'Premium 12×30 Magazine Album (20-30 Page) with Box',
      '20×30 Enlargement 01',
      '16×24 Enlargement 01',
      'Thank You Card 150',
      'All High-Resolution Edited Photos (Soft Copy)'
    ],
    is_popular: false,
  },
  {
    _id: '3',
    name: 'CLASSIC STORYTELLER PACKAGE #03',
    price: 85000,
    duration: 'One Day',
    description: 'Classic wedding storytelling photography with magazine album and frames.',
    features: [
      'One Day Full Coverage (wedding Day Only)',
      'Standard 10×24 Magazine Album (25-30 Pages) with Box',
      '16×24 Premium Enlargement',
      '12×18 Table Wall Frames',
      'Thank You Card (5×7) 100',
      'High - Resolution Edited Photo (Soft Copy)'
    ],
    is_popular: false,
  },
];

export default function PackagesSection() {
  const [packages, setPackages] = useState(defaultPackages);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    packageAPI.getAll().then(({ data }) => {
      if (data.packages?.length > 0) setPackages(data.packages);
    }).catch(() => {});
  }, []);

  return (
    <section id="packages" className="section packages-section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Packages</div>
          <h2 className="section-title">Simple, Transparent <span>Pricing</span></h2>
          <p className="section-subtitle">Choose the package that fits your needs. No hidden fees, no surprises.</p>
          <div className="section-divider" />
        </div>

        <div className="packages-grid">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              className={`package-card ${pkg.is_popular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {pkg.is_popular && <div className="package-popular-badge">⭐ Most Popular</div>}

              <div className="package-name">{pkg.name}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--white-40)', lineHeight: 1.6 }}>{pkg.description}</p>

              <div className="package-price" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gold-light)' }}>LKR</span>
                <span>{pkg.price.toLocaleString()}</span>
              </div>
              <div className="package-duration">📅 {pkg.duration}</div>

              <div className="package-divider" />

              <ul className="package-features">
                {pkg.features?.map((f) => (
                  <li key={f} className="package-feature">
                    <Check size={14} className="feature-check" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`btn ${pkg.is_popular ? 'btn-primary' : 'btn-outline'} w-full`}
              >
                Book This Package
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
