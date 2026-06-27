import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How do I book a photography session?',
    a: 'Simply create an account, go to your dashboard, and click "Book Photography". Fill in your event details, choose a package, and submit. We\'ll review your request within 24 hours.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 4-6 weeks in advance for events, and 3-6 months ahead for weddings. Popular dates fill quickly, so earlier is always better.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'You can cancel a pending booking anytime before it\'s approved at no cost. Once approved, please contact us at least 14 days before the event for a full refund.',
  },
  {
    q: 'How long until I receive my photos?',
    a: 'Standard delivery is 2-3 weeks after your event. Premium package clients receive a 48-hour priority edit with same-day preview images delivered within 24 hours.',
  },
  {
    q: 'Do you travel for photography sessions?',
    a: 'Yes! We cover events throughout the region. For events more than 50km from our studio, a travel fee may apply. Contact us for specific location quotes.',
  },
  {
    q: 'Can I request specific shots or styles?',
    a: 'Absolutely! When booking, you can upload reference images and describe your vision in the special requirements field. We love collaborating with our clients on their ideal shots.',
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">FAQ</div>
          <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          <p className="section-subtitle">Everything you need to know before booking your session.</p>
          <div className="section-divider" />
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIdx === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                {faq.q}
                <span className="faq-icon">
                  {openIdx === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              {openIdx === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
