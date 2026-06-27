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
    name: 'Basic',
    price: 100,
    duration: '2 Hours',
    description: 'Perfect for small events and personal photoshoots',
    features: ['2 Hours of Photography', '50+ Edited Photos', 'Online Gallery', '1 Photographer', 'Digital Downloads'],
    is_popular: false,
  },
  {
    _id: '2',
    name: 'Standard',
    price: 250,
    duration: '5 Hours',
    description: 'Great for birthdays, graduations and medium events',
    features: ['5 Hours of Photography', '150+ Edited Photos', 'Online Gallery', '1 Photographer', 'Print Rights', 'Same-Day Previews'],
    is_popular: true,
  },
  {
    _id: '3',
    name: 'Premium',
    price: 500,
    duration: 'Full Day',
    description: 'Complete coverage for weddings and large events',
    features: ['Full Day Coverage (8h)', '300+ Edited Photos', '2 Photographers', 'Photo Album', 'Drone Photography', 'Priority Editing'],
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

              <div className="package-price">
                <sup>$</sup>{pkg.price}
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
