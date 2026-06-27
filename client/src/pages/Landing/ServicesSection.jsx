import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const services = [
  { icon: '💍', name: 'Wedding Photography', desc: 'Timeless wedding stories told through breathtaking images.' },
  { icon: '🎂', name: 'Birthday Photography', desc: 'Celebrate milestones with stunning visual memories.' },
  { icon: '🎓', name: 'Graduation Photography', desc: 'Honor your achievements with professional portraits.' },
  { icon: '🎊', name: 'Event Photography', desc: 'Corporate events, parties, and gatherings covered perfectly.' },
  { icon: '🏢', name: 'Commercial Photography', desc: 'Elevate your brand with high-impact professional imagery.' },
  { icon: '🌿', name: 'Outdoor Photoshoots', desc: 'Nature-inspired sessions in stunning outdoor locations.' },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="section services-section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Our Services</div>
          <h2 className="section-title">
            Photography for Every <span>Occasion</span>
          </h2>
          <p className="section-subtitle">
            From intimate portraits to grand celebrations, we bring expertise and passion to every shoot.
          </p>
          <div className="section-divider" />
        </div>

        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-desc">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
