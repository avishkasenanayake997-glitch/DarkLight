import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' } }),
};

export default function HeroSection() {
  const nextRef = useRef(null);

  const scrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg" />

      <div className="container hero-content">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div className="hero-tag" variants={fadeUp} custom={0}>
            <span>✦</span> Premium Photography Studio
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
            Capture Your
            <span className="accent">Beautiful Moments</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp} custom={2}>
            We transform fleeting moments into timeless memories. Professional photography for weddings, events, portraits, and beyond.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp} custom={3}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Book a Session
            </Link>
            <a href="#portfolio" className="btn btn-outline btn-lg">
              View Portfolio
            </a>
          </motion.div>

          <motion.div className="hero-stats" variants={fadeUp} custom={4}>
            {[
              { value: '500+', label: 'Happy Clients' },
              { value: '12+', label: 'Years Experience' },
              { value: '50+', label: 'Awards Won' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <button className="hero-scroll" onClick={scrollDown} aria-label="Scroll down">
        <div className="scroll-line" />
        <ChevronDown size={14} />
        <span>Scroll</span>
      </button>
    </section>
  );
}
