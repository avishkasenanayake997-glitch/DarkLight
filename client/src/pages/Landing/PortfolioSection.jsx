import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryAPI } from '../../api';

const categories = ['all', 'wedding', 'birthday', 'graduation', 'events', 'portraits', 'commercial', 'nature', 'outdoor'];

export default function PortfolioSection() {
  const [filter, setFilter] = useState('all');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await galleryAPI.getAll({ limit: 16 });
      setImages(data.images);
    } catch {
      // Fallback to placeholder images
      setImages(placeholderImages);
    } finally {
      setLoading(false);
    }
  };

  const placeholderImages = [
    { _id: '1', title: 'Wedding Ceremony', category: 'wedding', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600' },
    { _id: '2', title: 'Wedding Reception', category: 'wedding', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600' },
    { _id: '3', title: 'Birthday Celebration', category: 'birthday', image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600' },
    { _id: '4', title: 'Graduation Day', category: 'graduation', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600' },
    { _id: '5', title: 'Corporate Event', category: 'commercial', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' },
    { _id: '6', title: 'Nature Portrait', category: 'nature', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
    { _id: '7', title: 'Portrait Session', category: 'portraits', image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600' },
    { _id: '8', title: 'Event Photography', category: 'events', image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600' },
  ];

  const filtered = filter === 'all' ? images : images.filter((img) => img.category === filter);

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Portfolio</div>
          <h2 className="section-title">Our <span>Creative Work</span></h2>
          <p className="section-subtitle">Browse through our portfolio of stunning photography across all categories.</p>
          <div className="section-divider" />
        </div>

        {/* Filters */}
        <div className="portfolio-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--white-40)' }}>Loading gallery...</div>
        ) : (
          <motion.div className="portfolio-grid" layout>
            <AnimatePresence>
              {filtered.map((img) => (
                <motion.div
                  key={img._id}
                  className="portfolio-item"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                >
                  <img src={img.image_url} alt={img.title} className="portfolio-img" loading="lazy" />
                  <div className="portfolio-overlay">
                    <span className="portfolio-label">{img.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
