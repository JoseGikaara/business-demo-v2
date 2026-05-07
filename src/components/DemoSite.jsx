import { useState, useEffect, useRef } from 'react'
import { getTemplate } from '../templates'

const GIKS_WHATSAPP = '254116239739'

// ─── Stock images per category ────────────────────────────────────────────────
const STOCK = {
  salon: {
    hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',
      'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1617896848219-0b9c49099a9f?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&q=80',
    beforeLabel: 'Dull, Unmanaged Hair',
    afterLabel:  'Styled to Perfection',
  },
  barbershop: {
    hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&q=80',
    beforeLabel: 'Overgrown & Unkempt',
    afterLabel:  'Sharp & Fresh Cut',
  },
  restaurant: {
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',
    beforeLabel: 'Basic, Uninspiring Plating',
    afterLabel:  'Chef-Crafted Presentation',
  },
  plumber: {
    hero: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
      'https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?w=600&q=80',
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=700&q=80',
    beforeLabel: 'Leaking, Damaged Pipes',
    afterLabel:  'Clean Professional Repair',
  },
  electrician: {
    hero: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548702289-cff82c0e9ec1?w=600&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
      'https://images.unsplash.com/photo-1509391111581-f804a4a8d41c?w=600&q=80',
      'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=700&q=80',
    beforeLabel: 'Faulty, Dangerous Wiring',
    afterLabel:  'Safe, Certified Installation',
  },
  gym: {
    hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
      'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
      'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80',
    beforeLabel: 'Out of Shape, Low Energy',
    afterLabel:  'Fit, Strong & Confident',
  },
  clinic: {
    hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1666214280391-8ff5bd3d9939?w=600&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=80',
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1618939291225-8d558ea4369f?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&q=80',
    beforeLabel: 'Unwell & Seeking Help',
    afterLabel:  'Healthy & Back to Life',
  },
  cleaning: {
    hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
      'https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&q=80',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1573160403429-23a1e8bd6e49?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
    beforeLabel: 'Dirty, Cluttered Space',
    afterLabel:  'Spotlessly Clean',
  },
  photography: {
    hero: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80',
      'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80',
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=600&q=80',
      'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=600&q=80',
      'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=600&q=80',
      'https://images.unsplash.com/photo-1509721434272-b79147e0e708?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=700&q=80',
    beforeLabel: 'Blurry, Amateur Shot',
    afterLabel:  'Professional, Frame-Worthy',
  },
  hardware: {
    hero: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80',
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&q=80',
    beforeLabel: 'Old, Disorganised Store',
    afterLabel:  'Well-Stocked & Organised',
  },
  other: {
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
      'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=600&q=80',
    ],
    before: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80',
    after:  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    beforeLabel: 'Before Our Service',
    afterLabel:  'After Our Service',
  },
}

const getStock = (category) => STOCK[category] || STOCK.other

const MARQUEE_WORDS = {
  salon: ['Premium Styling','Expert Team','Luxury Experience','Nails & Hair','Bridal Packages','Walk-ins Welcome'],
  barbershop: ['Sharp Fades','Expert Barbers','Clean Lines','Hot Towel Shave','Fresh Cuts','Walk-ins Welcome'],
  restaurant: ['Fresh Ingredients','Chef Crafted','Dine In & Takeout','Daily Specials','Group Bookings','Authentic Flavors'],
  plumber: ['24/7 Service','Fast Response','Licensed & Insured','Emergency Repairs','Free Quotes','Expert Plumbing'],
  electrician: ['Certified Electrician','Safe & Reliable','Emergency Callouts','Solar Installation','Free Quotes','Fast Response'],
  gym: ['Transform Your Body','Expert Trainers','Modern Equipment','Group Classes','Nutrition Plans','Results Guaranteed'],
  clinic: ['Professional Care','Qualified Staff','Trusted Healthcare','Fast Appointments','Modern Facilities','Patient First'],
  cleaning: ['Sparkling Clean','Eco Friendly','Reliable & Trusted','Residential & Commercial','Weekly Plans','Free Quotes'],
  photography: ['Capturing Moments','Creative Vision','Studio & Outdoor','Weddings & Events','Fast Delivery','Professional Edits'],
  hardware: ['Quality Products','Expert Advice','Competitive Prices','In Stock Always','Delivery Available','Trade Welcome'],
  other: ['Professional Service','Expert Team','Customer First','Quality Guaranteed','Fast Response','Trusted by Many'],
}

const CHATBOT_QA = {
  salon: [
    { q: 'What services do you offer?', a: 'We offer hair styling, manicure & pedicure, facial treatments, and bridal packages. Check our Services section for full pricing.' },
    { q: 'How do I book?', a: 'Tap the Book Appointment button or WhatsApp us directly! We confirm within 1 hour.' },
    { q: 'Do you accept walk-ins?', a: 'Yes! Walk-ins are welcome based on availability. Booking ahead guarantees your slot.' },
    { q: 'What are your hours?', a: 'We are open Mon–Sat 8AM–8PM and Sunday 10AM–6PM.' },
    { q: 'What payment methods?', a: 'We accept M-Pesa, cash, and all major cards. M-Pesa is most popular!' },
  ],
  barbershop: [
    { q: 'How much is a haircut?', a: 'A standard cut starts from KES 500. Combo packages with shave start from KES 800.' },
    { q: 'Do you do kids cuts?', a: 'Yes! We are patient with little ones. Kids cuts start from KES 350.' },
    { q: 'How long is the wait?', a: 'Walk-in wait is usually 15–30 mins. Book on WhatsApp to skip the queue.' },
    { q: 'Do you do beard trims?', a: 'Absolutely — hot towel shave and beard shaping from KES 400.' },
  ],
  restaurant: [
    { q: 'Do you do takeaway?', a: 'Yes! WhatsApp your order and we will have it ready for pickup in 20–30 minutes.' },
    { q: 'Can I book a table?', a: 'Yes, WhatsApp us with your party size and time. We will confirm within the hour.' },
    { q: 'What are your hours?', a: 'We are open 7 days a week, 7AM–10PM.' },
    { q: 'Do you have vegetarian options?', a: 'Yes, we have a full vegetarian section on our menu.' },
  ],
  plumber: [
    { q: 'Do you do emergency work?', a: 'Yes — 24/7 emergency response. Call or WhatsApp us anytime.' },
    { q: 'Do you give a quote first?', a: 'Always. We assess the job and provide a clear quote before starting any work.' },
    { q: 'Are you licensed?', a: 'Yes, all our plumbers are fully licensed and insured.' },
    { q: 'How fast can you come?', a: 'We aim to arrive within 2 hours for emergencies in our service area.' },
  ],
  electrician: [
    { q: 'Do you do solar installation?', a: 'Yes — full solar setup including panels, inverters, and batteries.' },
    { q: 'Are you certified?', a: 'Yes, we are fully certified and registered electricians.' },
    { q: 'Do you do emergency callouts?', a: 'Yes, 24/7 emergency electrical response available.' },
    { q: 'Can you do a free quote?', a: 'Yes! WhatsApp us your job details and we will give you a free estimate.' },
  ],
  gym: [
    { q: 'Do you offer a free trial?', a: 'Yes — your first day is free. Come in and experience everything we offer.' },
    { q: 'What is the monthly fee?', a: 'Monthly membership starts from KES 3,500 with full access to all facilities and classes.' },
    { q: 'Do you have personal trainers?', a: 'Yes, certified personal trainers are available for one-on-one sessions from KES 2,000.' },
    { q: 'What are your opening hours?', a: 'Mon–Fri 5AM–10PM, Sat–Sun 6AM–8PM. We are always open early for morning workouts.' },
  ],
  clinic: [
    { q: 'Do I need an appointment?', a: 'Walk-ins welcome. Booking ahead reduces waiting time significantly.' },
    { q: 'Do you accept NHIF?', a: 'Yes, we accept NHIF and most major insurance providers.' },
    { q: 'Do you have a pharmacy?', a: 'Yes, we have a fully stocked in-house pharmacy for prescriptions and OTC medication.' },
    { q: 'What are your consultation fees?', a: 'General consultation starts from KES 500. Specialist services vary — WhatsApp for details.' },
  ],
  cleaning: [
    { q: 'Do you bring your own supplies?', a: 'Yes — all equipment and eco-friendly products are included in the price.' },
    { q: 'How long does a clean take?', a: 'A standard home takes 2–4 hours depending on size. Offices vary by space.' },
    { q: 'Do you do one-off cleans?', a: 'Yes! We do one-off, weekly, and monthly cleaning contracts.' },
    { q: 'How do I get a quote?', a: 'WhatsApp us your location and home/office size for an instant quote.' },
  ],
  photography: [
    { q: 'When do I receive my photos?', a: 'Edited photos are delivered within 7 days via Google Drive or WeTransfer.' },
    { q: 'Do you travel outside Nairobi?', a: 'Yes, with a travel fee. WhatsApp us your location for a custom quote.' },
    { q: 'What is included in a wedding package?', a: 'Full day coverage, edited gallery of 500+ photos, and a highlight reel. WhatsApp for pricing.' },
    { q: 'Do you offer product photography?', a: 'Yes — professional product shots for e-commerce and marketing from KES 8,000.' },
  ],
  hardware: [
    { q: 'Do you do delivery?', a: 'Yes — same-day delivery available within the area. Fee depends on distance.' },
    { q: 'Do you offer bulk discounts?', a: 'Yes, contact us on WhatsApp for bulk pricing on large orders.' },
    { q: 'Do you have [specific item]?', a: 'WhatsApp us what you need and we will confirm availability and price immediately.' },
    { q: 'What are your opening hours?', a: 'Mon–Sat 7AM–7PM, Sunday 8AM–4PM.' },
  ],
  other: [
    { q: 'How do I get started?', a: 'Send us a WhatsApp message and we will guide you through the process step by step.' },
    { q: 'What payment methods do you accept?', a: 'M-Pesa, cash, and bank transfer all accepted.' },
    { q: 'Do you offer a free consultation?', a: 'Yes! First consultation is free. WhatsApp us to schedule.' },
    { q: 'What areas do you serve?', a: 'We serve Nairobi and surrounding areas. WhatsApp us your location to confirm.' },
  ],
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Reveal({ children, delay = 0, direction = 'up', style = {} }) {
  const [ref, visible] = useReveal()
  const transforms = { up: 'translateY(36px)', down: 'translateY(-36px)', left: 'translateX(-36px)', right: 'translateX(36px)' }
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : transforms[direction], transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee({ items, primary, accent, reverse = false }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
      <div style={{ display: 'flex', animation: `marquee${reverse ? 'R' : ''} 30s linear infinite`, width: 'max-content' }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginRight: 44, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>{item}</span>
            <span style={{ fontSize: 16, background: `linear-gradient(135deg, ${primary}, ${accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Mobile Navbar ────────────────────────────────────────────────────────────
function DemoNavbar({ business, primary }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const links = ['Services', 'Gallery', 'About', 'Reviews', business.showBooking ? 'Book' : null, 'FAQ', 'Contact'].filter(Boolean)

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 40); if (window.scrollY > 40) setMenuOpen(false) }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .demo-desktop-nav { display: none !important; }
          .demo-mobile-bottom { display: flex !important; }
          .demo-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .demo-desktop-nav { display: flex !important; }
          .demo-mobile-bottom { display: none !important; }
          .demo-hamburger { display: none !important; }
        }
      `}</style>

      {/* Desktop navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(2,6,23,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.4s',
      }}>
        <div style={{ padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
            {business.name}
          </div>
          {/* Desktop links */}
          <div className="demo-desktop-nav" style={{ gap: 24, alignItems: 'center' }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                {l}
              </a>
            ))}
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer"
              style={{ background: primary, borderRadius: 8, padding: '9px 18px', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              Chat Now
            </a>
          </div>
          {/* Hamburger for mobile — opens fullscreen menu */}
          <button className="demo-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: '12px', flexShrink: 0 }}>
            <div style={{ width: 18, height: 2, background: '#fff', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <div style={{ width: 18, height: 2, background: '#fff', borderRadius: 2, transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: 18, height: 2, background: '#fff', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile fullscreen dropdown */}
        <div style={{ maxHeight: menuOpen ? 600 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', background: 'rgba(2,6,23,0.99)' }}>
          <div style={{ padding: '8px 20px 100px', display: 'flex', flexDirection: 'column' }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 18, fontWeight: 500, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'block', letterSpacing: '0.02em' }}>
                {l}
              </a>
            ))}
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer"
              style={{ background: `linear-gradient(135deg, ${primary}, #06b6d4)`, borderRadius: 12, padding: '16px', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', textAlign: 'center', marginTop: 20, display: 'block' }}>
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="demo-mobile-bottom"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(2,6,23,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', padding: '8px 0 max(8px, env(safe-area-inset-bottom))', justifyContent: 'space-around', alignItems: 'center' }}>
        {[
          { href: '#services', icon: '🛠️', label: 'Services' },
          { href: '#gallery', icon: '📸', label: 'Gallery' },
          { href: `https://wa.me/${business.whatsapp}`, icon: '💬', label: 'WhatsApp', external: true, highlight: true },
          { href: business.showBooking ? '#book' : '#contact', icon: '📅', label: 'Book' },
          { href: '#contact', icon: '📍', label: 'Contact' },
        ].map((tab, i) => (
          <a key={i}
            href={tab.href}
            target={tab.external ? '_blank' : undefined}
            rel={tab.external ? 'noreferrer' : undefined}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', flex: 1, padding: '4px 0' }}>
            <div style={{ width: tab.highlight ? 48 : 32, height: tab.highlight ? 48 : 32, borderRadius: tab.highlight ? '50%' : 8, background: tab.highlight ? `linear-gradient(135deg, #25d366, #128c7e)` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: tab.highlight ? 22 : 18, boxShadow: tab.highlight ? '0 4px 16px rgba(37,211,102,0.5)' : 'none', marginTop: tab.highlight ? -16 : 0 }}>
              {tab.icon}
            </div>
            <span style={{ fontSize: 10, color: tab.highlight ? '#25d366' : 'rgba(255,255,255,0.5)', fontWeight: tab.highlight ? 700 : 500, letterSpacing: '0.04em' }}>{tab.label}</span>
          </a>
        ))}
      </div>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ business, primary, accent, heroImg }) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const fn = () => setOffset(window.scrollY * 0.35)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${offset}px)`, backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(2,6,23,0.93) 0%, rgba(2,6,23,0.65) 60%, rgba(2,6,23,0.85) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: 'clamp(100px,15vw,140px) clamp(20px,5vw,48px) 60px' }}>
        <Reveal delay={0}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'blink 2s infinite' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Open Now · {business.address}</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px,8vw,88px)', fontWeight: 700, lineHeight: 1.05, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>{business.name}</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ fontSize: 'clamp(18px,3vw,28px)', fontWeight: 300, background: `linear-gradient(135deg, ${primary}, ${accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 24, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>{business.tagline}</div>
        </Reveal>
        <Reveal delay={0.3}>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.62)', maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>{business.about}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, borderRadius: 12, padding: 'clamp(12px,2vw,16px) clamp(20px,3vw,32px)', color: '#fff', fontWeight: 700, fontSize: 'clamp(13px,1.5vw,15px)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              💬 Chat on WhatsApp
            </a>
            {business.showBooking && (
              <a href="#book" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, padding: 'clamp(12px,2vw,16px) clamp(20px,3vw,32px)', color: '#fff', fontWeight: 600, fontSize: 'clamp(13px,1.5vw,15px)', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                Book Appointment
              </a>
            )}
          </div>
        </Reveal>
        <div style={{ display: 'flex', gap: 'clamp(24px,5vw,48px)', marginTop: 64, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
          {[{ val: '5.0', label: 'Star Rating' }, { val: '500+', label: 'Happy Clients' }, { val: (business.services || []).length + '+', label: 'Services' }].map((s, i) => (
            <Reveal key={i} delay={0.5 + i * 0.1}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,36px)', fontWeight: 800, color: '#fff' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services({ business, primary, accent }) {
  return (
    <section id="services" style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal><SectionHeader label="What We Offer" title="Our Services" sub="Premium quality crafted for every client" primary={primary} /></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          {(business.services || []).map((svc, i) => (
            <Reveal key={i} delay={i * 0.07} direction="up">
              <div style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s,border-color 0.3s', height: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = primary + '70' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle,${primary}20,transparent 70%)`, transform: 'translate(35px,-35px)' }} />
                <div style={{ fontSize: 36, marginBottom: 16 }}>{svc.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{svc.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>{svc.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>From</div>
                    <div style={{ fontSize: 22, fontWeight: 800, background: `linear-gradient(135deg,${primary},${accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KES {svc.price}</div>
                  </div>
                  <a href={`https://wa.me/${business.whatsapp}?text=Hi, I'm interested in ${svc.name}`} target="_blank" rel="noreferrer"
                    style={{ background: `${primary}20`, border: `1px solid ${primary}50`, borderRadius: 10, padding: '9px 16px', color: primary, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                    Book Now
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Before & After ───────────────────────────────────────────────────────────
function BeforeAfter({ business, primary, accent, stock }) {
  const [slider, setSlider] = useState(50)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setSlider(pct)
  }

  return (
    <section style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#020617' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal><SectionHeader label="Transformation" title="Before & After" sub="See the difference we make — drag the slider" primary={primary} /></Reveal>
        <Reveal delay={0.1}>
          <div ref={containerRef}
            style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none', aspectRatio: '16/9', maxHeight: 500 }}
            onMouseMove={e => handleMove(e.clientX)}
            onTouchMove={e => handleMove(e.touches[0].clientX)}>
            {/* After (full) */}
            <img src={stock.after} alt="After" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Before (clipped) */}
            <div style={{ position: 'absolute', inset: 0, width: `${slider}%`, overflow: 'hidden' }}>
              <img src={stock.before} alt="Before" style={{ width: `${10000 / slider}%`, height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Divider */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${slider}%`, width: 3, background: '#fff', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', fontSize: 16 }}>⇔</div>
            </div>
            {/* Labels */}
            <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '6px 14px', color: '#fca5a5', fontWeight: 700, fontSize: 13 }}>✗ {stock.beforeLabel}</div>
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '6px 14px', color: '#4ade80', fontWeight: 700, fontSize: 13 }}>✓ {stock.afterLabel}</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function Gallery({ business, primary, accent, stockImages }) {
  const images = (business.galleryImages || []).filter(Boolean).length > 0 ? (business.galleryImages || []).filter(Boolean) : stockImages
  const [lightbox, setLightbox] = useState(null)
  return (
    <section id="gallery" style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal><SectionHeader label="Our Work" title="Gallery" sub="Click any image to view full size" primary={primary} /></Reveal>
        <div style={{ columns: 'clamp(2,3,3) clamp(200px,30vw,300px)', gap: 14 }}>
          {images.map((src, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div onClick={() => setLightbox(src)} style={{ marginBottom: 14, borderRadius: 14, overflow: 'hidden', cursor: 'zoom-in', position: 'relative', display: 'block', breakInside: 'avoid' }}
                onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'; e.currentTarget.querySelector('.ov').style.opacity = '1' }}
                onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; e.currentTarget.querySelector('.ov').style.opacity = '0' }}>
                <img src={src} alt="" style={{ width: '100%', display: 'block', transition: 'transform 0.5s', objectFit: 'cover' }} />
                <div className="ov" style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${primary}60,${accent}40)`, opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, color: '#fff' }}>🔍</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {lightbox && (
          <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}>
            <img src={lightbox} alt="" style={{ maxWidth: '92vw', maxHeight: '92vh', objectFit: 'contain', borderRadius: 12 }} />
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function About({ business, primary, accent }) {
  return (
    <section id="about" style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#020617', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${primary}07,transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'center' }}>
        <Reveal direction="left">
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: 14, padding: '5px 14px', background: `${primary}18`, borderRadius: 100 }}>Our Story</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px,5vw,44px)', fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1.1 }}>About {business.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>{business.about}</p>
          {[{ icon: '📍', text: business.address }, { icon: '🕐', text: business.hours }, { icon: '📞', text: business.phone }].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>{item.text}</span>
            </div>
          ))}
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[{ icon: '🏆', title: 'Top Quality', desc: 'Only the finest products and techniques' }, { icon: '⏱️', title: 'On Time', desc: 'We respect your schedule, guaranteed' }, { icon: '👨‍💼', title: 'Expert Team', desc: 'Trained professionals at your service' }, { icon: '💯', title: 'Satisfaction', desc: '100% satisfaction or we make it right' }].map((f, i) => (
            <Reveal key={i} delay={i * 0.08} direction="right">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 22, transition: 'transform 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 5 }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Booking ──────────────────────────────────────────────────────────────────
function BookingForm({ business, primary, accent }) {
  const [form, setForm] = useState({ name: '', phone: '', service: '', date: '', time: '', notes: '' })
  const [sent, setSent] = useState(false)
  const fi = { width: '100%', padding: '13px 15px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }
  const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }
  const handleSubmit = () => {
    const msg = `Hi ${business.name}! Booking request:%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AService: ${form.service}%0ADate: ${form.date}%0ATime: ${form.time}%0ANotes: ${form.notes || 'None'}`
    window.open(`https://wa.me/${business.whatsapp}?text=${msg}`, '_blank')
    setSent(true)
  }
  return (
    <section id="book" style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Reveal><SectionHeader label="Reserve Your Spot" title="Book Appointment" sub="Fill in your details — we confirm via WhatsApp" primary={primary} /></Reveal>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#fff', marginBottom: 10 }}>Booking Sent!</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>We will confirm on WhatsApp shortly.</p>
            <button onClick={() => setSent(false)} style={{ marginTop: 20, background: primary, border: 'none', borderRadius: 10, padding: '12px 28px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Book Another</button>
          </div>
        ) : (
          <Reveal>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: 'clamp(24px,5vw,40px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18, marginBottom: 18 }}>
                <div><label style={lbl}>Full Name</label><input style={fi} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" onFocus={e => e.target.style.borderColor = primary} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} /></div>
                <div><label style={lbl}>Phone Number</label><input style={fi} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+254 7XX XXX XXX" onFocus={e => e.target.style.borderColor = primary} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} /></div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Service</label>
                <select style={{ ...fi, appearance: 'none' }} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} onFocus={e => e.target.style.borderColor = primary} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                  <option value="">Select a service...</option>
                  {(business.services || []).map((s, i) => <option key={i} value={s.name}>{s.name} — KES {s.price}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 18, marginBottom: 18 }}>
                <div><label style={lbl}>Preferred Date</label><input type="date" style={{ ...fi, colorScheme: 'dark' }} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} onFocus={e => e.target.style.borderColor = primary} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} /></div>
                <div><label style={lbl}>Preferred Time</label><input type="time" style={{ ...fi, colorScheme: 'dark' }} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} onFocus={e => e.target.style.borderColor = primary} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} /></div>
              </div>
              <div style={{ marginBottom: 24 }}><label style={lbl}>Notes (optional)</label><textarea style={{ ...fi, height: 80, resize: 'vertical' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Special requests..." onFocus={e => e.target.style.borderColor = primary} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} /></div>
              <button onClick={handleSubmit} style={{ width: '100%', background: `linear-gradient(135deg,${primary},${accent})`, border: 'none', borderRadius: 12, padding: 16, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
                📅 Confirm Booking via WhatsApp
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

// ─── Reviews Marquee ──────────────────────────────────────────────────────────
function Reviews({ business, primary }) {
  const reviews = business.reviews || []
  const doubled = [...reviews, ...reviews, ...reviews]
  return (
    <section id="reviews" style={{ padding: 'clamp(60px,10vw,100px) 0', background: '#020617', overflow: 'hidden' }}>
      <div style={{ padding: '0 clamp(20px,5vw,48px)', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal><SectionHeader label="Testimonials" title="What Clients Say" primary={primary}
          extra={<div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 10 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: '#fbbf24', fontSize: 18 }}>★</span>)}<span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginLeft: 8 }}>5.0 · {reviews.length} reviews</span></div>} /></Reveal>
      </div>
      {/* Scrolling review cards */}
      <div style={{ marginTop: 40, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 20, animation: 'marquee 40s linear infinite', width: 'max-content', padding: '8px 0' }}>
          {doubled.map((rev, i) => (
            <div key={i} style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '28px 28px', minWidth: 300, maxWidth: 340, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= rev.rating ? '#fbbf24' : '#334155', fontSize: 14 }}>★</span>)}</div>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{rev.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${primary},#0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 14 }}>{rev.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{rev.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Verified Customer</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Social Feed ──────────────────────────────────────────────────────────────
function SocialFeed({ business, primary, accent, stockImages }) {
  const hasSocial = business.facebookUrl || business.instagramUrl
  const images = (business.socialImages || []).filter(Boolean).length > 0 ? (business.socialImages || []).filter(Boolean).slice(0, 6) : stockImages.slice(0, 6)
  if (!hasSocial && images.length === 0) return null
  const profileUrl = business.instagramUrl || business.facebookUrl
  const platform = business.instagramUrl ? 'Instagram' : 'Facebook'
  const icon = business.instagramUrl ? '📸' : '👤'
  return (
    <section style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal><SectionHeader label={`${icon} Follow Us`} title={`Our ${platform}`} sub="See our latest work and updates" primary={primary} /></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 32 }}>
          {images.map((src, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <a href={profileUrl || '#'} target="_blank" rel="noreferrer" style={{ display: 'block', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.08)'; e.currentTarget.querySelector('.sov').style.opacity = '1' }}
                onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; e.currentTarget.querySelector('.sov').style.opacity = '0' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }} />
                <div className="sov" style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${primary}80,${accent}60)`, opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 24 }}>{icon}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        {profileUrl && (
          <Reveal>
            <div style={{ textAlign: 'center' }}>
              <a href={profileUrl} target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '13px 28px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                {icon} View More on {platform} →
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

// ─── FAQ + Chatbot ────────────────────────────────────────────────────────────
function FAQAndChat({ business, primary, accent, chatbotQA = [] }) {
  const [open, setOpen] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: `Hi! 👋 I'm here to answer questions about ${business.name}. What would you like to know?` }])
  const [input, setInput] = useState('')
  const chatRef = useRef(null)
  const faqs = business.faqs || []
  const qaBank = chatbotQA

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, chatOpen])

  const handleSend = (text) => {
    const q = text || input.trim()
    if (!q) return
    setMessages(m => [...m, { from: 'user', text: q }])
    setInput('')
    setTimeout(() => {
      const lower = q.toLowerCase()
      const match = qaBank.find(qa => lower.includes(qa.q.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase()) || qa.q.toLowerCase().split(' ').some(w => w.length > 4 && lower.includes(w)))
      const reply = match
        ? match.a
        : `Great question! For the most accurate answer about "${q}", please reach out directly on WhatsApp — we respond within minutes! 📱`
      setMessages(m => [...m, { from: 'bot', text: reply }])
    }, 700)
  }

  return (
    <section id="faq" style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#020617' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {faqs.length > 0 && (
          <>
            <Reveal><SectionHeader label="Got Questions?" title="FAQ" primary={primary} /></Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 60 }}>
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div style={{ background: open === i ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${open === i ? primary + '50' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, overflow: 'hidden', transition: 'all 0.3s' }}>
                    <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'inherit' }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', textAlign: 'left' }}>{faq.q}</span>
                      <span style={{ fontSize: 20, color: primary, transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
                    </button>
                    <div style={{ maxHeight: open === i ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                      <div style={{ padding: '0 24px 20px', color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.8 }}>{faq.a}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {/* Chatbot */}
        <Reveal>
          <div style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))', border: `1px solid ${primary}30`, borderRadius: 22, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', background: `linear-gradient(135deg,${primary}20,${accent}10)`, borderBottom: `1px solid ${primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setChatOpen(o => !o)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${primary},${accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Ask Us Anything</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>AI assistant • replies instantly</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#052e16', border: '1px solid #166534', borderRadius: 100, padding: '3px 10px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'blink 2s infinite' }} />
                  <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Online</span>
                </div>
              </div>
              <span style={{ color: primary, fontSize: 20, transition: 'transform 0.3s', transform: chatOpen ? 'rotate(180deg)' : 'none' }}>⌄</span>
            </div>

            {/* Quick questions */}
            {!chatOpen && (
              <div style={{ padding: '16px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {qaBank.slice(0, 3).map((qa, i) => (
                  <button key={i} onClick={() => { setChatOpen(true); setTimeout(() => handleSend(qa.q), 100) }}
                    style={{ background: `${primary}15`, border: `1px solid ${primary}30`, borderRadius: 100, padding: '7px 14px', color: primary, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {qa.q}
                  </button>
                ))}
                <button onClick={() => setChatOpen(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '7px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  More questions →
                </button>
              </div>
            )}

            {/* Chat window */}
            {chatOpen && (
              <div>
                <div ref={chatRef} style={{ height: 280, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '80%', background: msg.from === 'user' ? `linear-gradient(135deg,${primary},${accent})` : 'rgba(255,255,255,0.07)', border: msg.from === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none', borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '12px 16px', color: '#fff', fontSize: 14, lineHeight: 1.6 }}>
                        {msg.text}
                        {msg.from === 'bot' && (
                          <div style={{ marginTop: 10 }}>
                            <a href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(messages[messages.length - 2]?.text || 'Hi!')}`} target="_blank" rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#25d36620', border: '1px solid #25d36640', borderRadius: 8, padding: '5px 10px', color: '#25d366', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                              💬 Ask on WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Quick reply chips */}
                <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {qaBank.slice(0, 4).map((qa, i) => (
                    <button key={i} onClick={() => handleSend(qa.q)}
                      style={{ background: `${primary}12`, border: `1px solid ${primary}25`, borderRadius: 100, padding: '5px 12px', color: primary, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {qa.q.split(' ').slice(0, 4).join(' ')}...
                    </button>
                  ))}
                </div>
                <div style={{ padding: '10px 16px 16px', display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type your question..." style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                  <button onClick={() => handleSend()} style={{ background: `linear-gradient(135deg,${primary},${accent})`, border: 'none', borderRadius: 10, padding: '11px 18px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>→</button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact({ business, primary, accent }) {
  return (
    <section id="contact" style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#0a0f1e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal><SectionHeader label="Get In Touch" title="Contact Us" primary={primary} /></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
          {[{ icon: '📱', label: 'Phone', value: business.phone, href: `tel:${business.phone}` }, { icon: '💬', label: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${business.whatsapp}` }, { icon: '📧', label: 'Email', value: business.email, href: `mailto:${business.email}` }, { icon: '📍', label: 'Location', value: business.address, href: '#' }].filter(c => c.value).map((c, i) => (
            <Reveal key={i} delay={i * 0.08} direction="up">
              <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 20px', textDecoration: 'none', display: 'block', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = primary + '60'; e.currentTarget.style.background = `${primary}10` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{c.label}</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{c.value}</div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div style={{ background: `linear-gradient(135deg,${primary}20,${accent}10)`, border: `1px solid ${primary}30`, borderRadius: 14, padding: '24px 28px', textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: primary, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 6 }}>Business Hours</div>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 500 }}>{business.hours}</div>
          </div>
        </Reveal>
        {business.mapSearch && (
          <Reveal>
            <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapSearch)}&output=embed`}
              style={{ width: '100%', height: 340, borderRadius: 16, border: 'none', boxShadow: `0 0 40px ${primary}25` }} allowFullScreen title="map" />
          </Reveal>
        )}
      </div>
    </section>
  )
}

// ─── Value Section (why get a website) ───────────────────────────────────────
function WhyWebsite({ business, primary, accent }) {
  const [active, setActive] = useState(null)
  const items = [
    { icon: '🔍', title: 'Found on Google', short: 'Customers searching for you can\'t find you right now', detail: `Every day someone searches "${business.category} ${business.address}" on Google and picks a competitor who has a website. Your site puts you on that map permanently.` },
    { icon: '💬', title: 'WhatsApp Leads 24/7', short: 'Never miss a customer again', detail: 'One tap on the WhatsApp button and a customer is chatting with you. No missed calls. No lost leads. Works while you sleep.' },
    { icon: '🏆', title: 'Look Professional', short: '75% of people judge credibility by website', detail: 'Someone hears about you and searches your name. A professional site builds trust before you even speak. No website means they move on.' },
    { icon: '📅', title: 'Automatic Bookings', short: '60% of bookings happen outside business hours', detail: 'Your booking form takes appointments at midnight, on weekends, on public holidays. You wake up to confirmed bookings ready to fulfill.' },
    { icon: '💰', title: 'Charge Premium Prices', short: 'Professional businesses command 20-40% more', detail: 'Customers pay more for businesses that look established. A great website is the fastest way to justify higher prices.' },
    { icon: '📊', title: 'Beat Competitors', short: 'Most businesses in your area still have no website', detail: 'The window is still open. Be the first business in your area with a professional online presence and own that space.' },
  ]
  return (
    <section style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,48px)', background: '#020617' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: 14, padding: '5px 14px', background: `${primary}18`, borderRadius: 100 }}>The Business Case</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>Why Your Business Needs This</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 500, margin: '0 auto 40px' }}>Click each card to see exactly how it gets you more customers</p>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 32 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div onClick={() => setActive(active === i ? null : i)}
                style={{ background: active === i ? `linear-gradient(135deg,${primary}18,${accent}10)` : 'rgba(255,255,255,0.03)', border: `1px solid ${active === i ? primary + '60' : 'rgba(255,255,255,0.08)'}`, borderRadius: 18, padding: 24, cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { if (active !== i) { e.currentTarget.style.borderColor = primary + '40'; e.currentTarget.style.transform = 'translateY(-3px)' } }}
                onMouseLeave={e => { if (active !== i) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none' } }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.6, marginBottom: active === i ? 14 : 0 }}>{item.short}</p>
                {active === i && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.7, borderTop: `1px solid ${primary}30`, paddingTop: 14 }}>{item.detail}</p>}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div style={{ background: 'linear-gradient(135deg,#450a0a,#1c0505)', border: '1px solid #7f1d1d', borderRadius: 18, padding: 'clamp(20px,4vw,32px)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 36 }}>🚨</div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Right Now — Customers Are Choosing Your Competitors</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.6 }}>Every day without a website is customers going to someone else. This is fixable today.</div>
            </div>
            <a href={`https://wa.me/${GIKS_WHATSAPP}?text=Hi! I want to get my business website live today.`} target="_blank" rel="noreferrer"
              style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', borderRadius: 12, padding: '14px 24px', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Fix This Today →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ business, primary }) {
  return (
    <footer style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(32px,5vw,48px)', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{business.name}</div>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 20 }}>{business.tagline}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        {business.facebookUrl && <a href={business.facebookUrl} target="_blank" rel="noreferrer" style={{ color: primary, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Facebook</a>}
        {business.instagramUrl && <a href={business.instagramUrl} target="_blank" rel="noreferrer" style={{ color: primary, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Instagram</a>}
        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: primary, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>WhatsApp</a>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12 }}>© {new Date().getFullYear()} {business.name}</div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <a href={`https://wa.me/${GIKS_WHATSAPP}?text=Hi! I want a website like this for my business.`} target="_blank" rel="noreferrer"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
          Want a website like this? → Built by Giks Studio
        </a>
      </div>
    </footer>
  )
}

// ─── WhatsApp FAB ─────────────────────────────────────────────────────────────
function WhatsAppFAB({ number, name }) {
  return (
    <a href={`https://wa.me/${number}?text=Hi ${encodeURIComponent(name)}, I found your website and would like to inquire about your services.`}
      target="_blank" rel="noreferrer"
      style={{ position: 'fixed', bottom: 28, right: 28, width: 58, height: 58, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.5)', zIndex: 1000, animation: 'pulse 2s infinite' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  )
}

// ─── Shared Section Header ────────────────────────────────────────────────────
function SectionHeader({ label, title, sub, primary, extra }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: 14, padding: '5px 14px', background: `${primary}18`, borderRadius: 100 }}>{label}</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>{sub}</p>}
      {extra}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function DemoSite({ business, onBack, isSharedView = false, isDemo = false, onDashboard }) {
  const primary = business.primaryColor || '#0ea5e9'
  const accent = business.accentColor || '#06b6d4'
  const siteTemplate = getTemplate(business.category)
  const stock = siteTemplate
  const marqueeWords = siteTemplate.marqueeWords || []

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#020617', color: '#e2e8f0', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes pulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.5)}50%{box-shadow:0 4px 36px rgba(37,211,102,0.8),0 0 0 10px rgba(37,211,102,0.1)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes marqueeR{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.28)!important}
        input[type=date]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.5}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        @media(max-width:768px){.desktop-nav{display:none!important}.hamburger{display:flex!important}}
      `}</style>

      {!isSharedView && (
        <button onClick={onBack} style={{ position: 'fixed', top: 80, left: 16, zIndex: 300, background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', backdropFilter: 'blur(8px)', fontFamily: 'inherit' }}>
          ← Edit
        </button>
      )}

      <DemoNavbar business={business} primary={primary} />
      <Hero business={business} primary={primary} accent={accent} heroImg={stock.hero} />
      <Marquee items={marqueeWords} primary={primary} accent={accent} />
      <Services business={business} primary={primary} accent={accent} />
      <BeforeAfter business={business} primary={primary} accent={accent} stock={stock} />
      <Gallery business={business} primary={primary} accent={accent} stockImages={stock.gallery} />
      <Marquee items={[...marqueeWords].reverse()} primary={primary} accent={accent} reverse />
      <About business={business} primary={primary} accent={accent} />
      {business.showBooking && <BookingForm business={business} primary={primary} accent={accent} />}
      <Reviews business={business} primary={primary} accent={accent} />
      <SocialFeed business={business} primary={primary} accent={accent} stockImages={stock.gallery} />
      <FAQAndChat business={business} primary={primary} accent={accent} chatbotQA={siteTemplate.chatbotQA} />
      <WhyWebsite business={business} primary={primary} accent={accent} />
      <Contact business={business} primary={primary} accent={accent} />
      <Footer business={business} primary={primary} />
      {onDashboard && (
  <button
    onClick={onDashboard}
    style={{
      position: 'fixed', bottom: 100, right: 28, zIndex: 1000,
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      border: 'none', borderRadius: 50, padding: '14px 20px',
      color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
      fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(34,197,94,0.5)',
      display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
    }}
  >
    📊 Business Dashboard
  </button>
)}
      <WhatsAppFAB number={business.whatsapp} name={business.name} />
    </div>
  )
}
