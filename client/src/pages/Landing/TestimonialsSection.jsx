import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    name: 'Emily & James',
    event: 'Wedding Photography',
    text: 'DarkLight captured every magical moment of our wedding day. The photos are absolutely stunning — we cry happy tears every time we look at them. Truly the best investment we made!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    event: 'Corporate Event',
    text: 'Professional, creative, and incredibly talented. The team at DarkLight delivered beyond our expectations for our annual conference. Every shot was perfectly composed.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
  },
  {
    name: 'Sophia Chen',
    event: 'Graduation Portraits',
    text: 'My graduation photos are breathtaking! DarkLight knew exactly how to capture my personality and the significance of this milestone. I will cherish these forever.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
  },
  {
    name: 'The Rodriguez Family',
    event: 'Family Portraits',
    text: 'From booking to delivery, the entire experience was seamless. The photographers were patient with our kids and captured the most genuine, joyful moments.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    event: 'Birthday Celebration',
    text: 'I hired DarkLight for my 30th birthday party and the results were incredible. Every guest looked amazing and the energy of the party shines through every photo.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    rating: 5,
  },
  {
    name: 'David & Sarah Kim',
    event: 'Wedding Photography',
    text: 'We are still overwhelmed by how beautifully our wedding was documented. The attention to detail, lighting, and emotions captured are beyond anything we could have imagined.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Testimonials</div>
          <h2 className="section-title">Words From Our <span>Happy Clients</span></h2>
          <p className="section-subtitle">Real stories from people who trusted us with their most important moments.</p>
          <div className="section-divider" />
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-event">{t.event}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
