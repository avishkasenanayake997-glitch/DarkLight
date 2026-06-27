import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  'Award-Winning Photography',
  'Luxury Photo Albums',
  'Same-Day Previews',
  'Drone Photography',
  '4K Video Coverage',
  'Online Gallery Access',
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <div className="about-grid">
          {/* Image */}
          <motion.div
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80"
              alt="Professional photographer at work"
              className="about-image"
            />
            <div className="about-image-badge">
              <div className="about-badge-num">12+</div>
              <div className="about-badge-label">Years of Excellence</div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="section-tag">About Us</div>
            <h2 className="about-title">
              We Create Visual Stories<br />
              <span className="text-gold">That Last Forever</span>
            </h2>
            <p className="about-text">
              DarkLight Photography is a premium studio dedicated to capturing life's most precious moments. Founded in 2012, we've had the privilege of documenting over 500 weddings, hundreds of events, and thousands of portraits.
            </p>
            <p className="about-text">
              Our team of passionate photographers brings artistry, technical mastery, and an eye for authentic emotion to every shoot. We don't just take photos — we craft narratives.
            </p>

            <div className="about-features">
              {features.map((f) => (
                <div key={f} className="about-feature">
                  <div className="about-feature-dot" />
                  {f}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '36px' }}>
              <a href="#contact" className="btn btn-primary">Get In Touch</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
