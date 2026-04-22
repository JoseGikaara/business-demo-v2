import { useState } from 'react'
import { buildShareableURL } from '../App'

const SUPPORTED_CATEGORIES = {
  salon: {
    tagline: 'Where Style Meets Luxury',
    hours: 'Mon–Sat: 8AM–8PM | Sun: 10AM–6PM',
    about: "Nairobi's premier destination for hair, nails, and wellness. Our expert team brings international techniques and premium products to transform your look and rejuvenate your spirit.",
    primaryColor: '#0ea5e9',
    accentColor: '#06b6d4',
    showBooking: true,
    services: [
      { name: 'Hair Styling', price: '1,500', desc: 'Cut, blow-dry, and professional styling by our expert stylists', icon: '✂️' },
      { name: 'Manicure & Pedicure', price: '2,000', desc: 'Luxury nail care with premium polish and treatments', icon: '💅' },
      { name: 'Facial Treatment', price: '3,500', desc: 'Deep cleansing and rejuvenating skin therapy', icon: '✨' },
      { name: 'Massage Therapy', price: '4,000', desc: 'Full body relaxation and therapeutic massage sessions', icon: '🫧' },
    ]
  },
  barbershop: {
    tagline: 'Classic Cuts & Modern Style',
    hours: 'Mon–Sat: 9AM–7PM | Sun: Closed',
    about: 'Traditional barbering meets contemporary grooming. From classic haircuts to modern beard styling, we deliver precision and style for the discerning gentleman.',
    primaryColor: '#1e40af',
    accentColor: '#3b82f6',
    showBooking: true,
    services: [
      { name: 'Haircut & Shave', price: '1,200', desc: 'Professional haircut with hot towel shave', icon: '✂️' },
      { name: 'Beard Trim', price: '800', desc: 'Expert beard shaping and trimming', icon: '🪒' },
      { name: 'Hair Styling', price: '600', desc: 'Modern styling with premium products', icon: '💇‍♂️' },
      { name: 'Head Massage', price: '500', desc: 'Relaxing scalp massage during service', icon: '🫧' },
    ]
  },
  restaurant: {
    tagline: 'Flavors That Delight',
    hours: 'Mon–Sun: 11AM–10PM',
    about: 'Authentic cuisine with a modern twist. Fresh ingredients, creative presentations, and an atmosphere that makes every meal memorable.',
    primaryColor: '#dc2626',
    accentColor: '#ef4444',
    showBooking: true,
    services: [
      { name: 'Lunch Special', price: '1,000', desc: 'Daily changing lunch menu with drink', icon: '🍽️' },
      { name: 'Dinner for Two', price: '3,500', desc: 'Romantic dinner with wine pairing', icon: '🍷' },
      { name: 'Family Platter', price: '5,000', desc: 'Large sharing platter for families', icon: '👨‍👩‍👧‍👦' },
      { name: 'Catering Service', price: 'Contact', desc: 'Event catering with custom menus', icon: '🎉' },
    ]
  },
  plumber: {
    tagline: 'Reliable Plumbing Solutions',
    hours: 'Mon–Sat: 8AM–6PM | Emergency: 24/7',
    about: 'Professional plumbing services for residential and commercial properties. Fast response, quality work, and guaranteed satisfaction.',
    primaryColor: '#059669',
    accentColor: '#10b981',
    showBooking: false,
    services: [
      { name: 'Pipe Repair', price: '2,000', desc: 'Fix leaking or broken pipes', icon: '🔧' },
      { name: 'Drain Cleaning', price: '1,500', desc: 'Clear clogged drains and sewers', icon: '🚰' },
      { name: 'Installation', price: '3,000', desc: 'Install new plumbing fixtures', icon: '🛠️' },
      { name: 'Emergency Service', price: '4,000', desc: '24/7 emergency plumbing repairs', icon: '🚨' },
    ]
  },
  electrician: {
    tagline: 'Powering Your Home',
    hours: 'Mon–Sat: 8AM–6PM | Emergency: 24/7',
    about: 'Certified electrical services for safe and efficient installations. From wiring to repairs, we handle all your electrical needs.',
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    showBooking: false,
    services: [
      { name: 'Wiring Installation', price: '5,000', desc: 'Complete electrical wiring setup', icon: '⚡' },
      { name: 'Outlet Repair', price: '1,000', desc: 'Fix faulty outlets and switches', icon: '🔌' },
      { name: 'Lighting Installation', price: '2,500', desc: 'Install new lighting fixtures', icon: '💡' },
      { name: 'Emergency Repair', price: '3,000', desc: '24/7 emergency electrical fixes', icon: '🚨' },
    ]
  },
  gym: {
    tagline: 'Build Your Strength',
    hours: 'Mon–Fri: 5AM–10PM | Sat–Sun: 7AM–8PM',
    about: 'State-of-the-art fitness facility with expert trainers and modern equipment. Achieve your goals in a motivating environment.',
    primaryColor: '#7c3aed',
    accentColor: '#8b5cf6',
    showBooking: true,
    services: [
      { name: 'Personal Training', price: '3,000', desc: 'One-on-one training sessions', icon: '🏋️' },
      { name: 'Group Classes', price: '1,500', desc: 'Yoga, HIIT, and strength classes', icon: '🤸' },
      { name: 'Membership', price: '5,000', desc: 'Monthly unlimited access', icon: '💳' },
      { name: 'Nutrition Consult', price: '2,000', desc: 'Diet planning and advice', icon: '🥗' },
    ]
  },
  clinic: {
    tagline: 'Caring for Your Health',
    hours: 'Mon–Fri: 8AM–6PM | Sat: 9AM–2PM | Sun: Closed',
    about: 'Comprehensive healthcare services with experienced doctors and modern facilities. Your well-being is our priority.',
    primaryColor: '#be185d',
    accentColor: '#db2777',
    showBooking: true,
    services: [
      { name: 'General Consultation', price: '1,500', desc: 'Comprehensive health check-up', icon: '👨‍⚕️' },
      { name: 'Specialist Visit', price: '3,000', desc: 'Consultation with specialists', icon: '🩺' },
      { name: 'Lab Tests', price: '2,000', desc: 'Blood work and diagnostics', icon: '🧪' },
      { name: 'Vaccinations', price: '1,000', desc: 'Routine and travel vaccines', icon: '💉' },
    ]
  },
  cleaning: {
    tagline: 'Sparkling Clean Spaces',
    hours: 'Mon–Sat: 7AM–7PM | Sun: 9AM–5PM',
    about: 'Professional cleaning services for homes and offices. Thorough, reliable, and eco-friendly cleaning solutions.',
    primaryColor: '#0d9488',
    accentColor: '#14b8a6',
    showBooking: false,
    services: [
      { name: 'House Cleaning', price: '3,000', desc: 'Complete home deep cleaning', icon: '🧹' },
      { name: 'Office Cleaning', price: '2,500', desc: 'Regular office maintenance', icon: '🏢' },
      { name: 'Carpet Cleaning', price: '1,500', desc: 'Deep carpet and upholstery cleaning', icon: '🧽' },
      { name: 'Window Cleaning', price: '1,000', desc: 'Streak-free window cleaning', icon: '🪟' },
    ]
  },
  photography: {
    tagline: 'Capturing Your Moments',
    hours: 'Mon–Sat: 9AM–6PM | Sun: By Appointment',
    about: 'Professional photography services for events, portraits, and commercial needs. Creative vision with stunning results.',
    primaryColor: '#7c2d12',
    accentColor: '#ea580c',
    showBooking: true,
    services: [
      { name: 'Portrait Session', price: '5,000', desc: 'Professional headshots and portraits', icon: '📸' },
      { name: 'Event Photography', price: '10,000', desc: 'Wedding and event coverage', icon: '🎉' },
      { name: 'Product Photography', price: '3,000', desc: 'Commercial product shoots', icon: '📦' },
      { name: 'Photo Editing', price: '1,000', desc: 'Post-production and retouching', icon: '🖼️' },
    ]
  },
  hardware: {
    tagline: 'Your Home Improvement Store',
    hours: 'Mon–Sat: 8AM–7PM | Sun: 10AM–4PM',
    about: 'Complete hardware store with tools, materials, and expert advice. Everything you need for your DIY projects and repairs.',
    primaryColor: '#374151',
    accentColor: '#6b7280',
    showBooking: false,
    services: [
      { name: 'Tool Rental', price: '500', desc: 'Rent power tools and equipment', icon: '🔨' },
      { name: 'Consultation', price: 'Free', desc: 'Expert advice on projects', icon: '🛠️' },
      { name: 'Delivery Service', price: '1,000', desc: 'Home delivery of materials', icon: '🚚' },
      { name: 'Installation Help', price: '2,000', desc: 'Professional installation assistance', icon: '⚙️' },
    ]
  }
}

const genericReviews = [
  { name: 'Happy Customer', rating: 5, text: 'Excellent service! Highly recommend.' },
  { name: 'Satisfied Client', rating: 5, text: 'Professional and reliable. Will use again.' },
  { name: 'Loyal Patron', rating: 5, text: 'Great experience from start to finish.' }
]

const genericFaqs = [
  { q: 'Do I need to book in advance?', a: 'We recommend booking at least 24 hours in advance to ensure availability.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, cash, and major cards.' },
  { q: 'How long do services take?', a: 'Duration varies by service; we\'ll provide estimates when booking.' },
  { q: 'Do you offer packages or discounts?', a: 'Yes, contact us for custom packages and current promotions.' }
]

const INPUT_MODES = {
  gmb: {
    label: 'GMB Leads',
    example: 'Elite Cuts | +254712345678 | 254712345678 | barbershop | Ruiru Town',
    format: 'BusinessName | phone | whatsapp | category | address',
  },
  social: {
    label: 'Social Media Leads',
    example: 'Mama Ngina Hair | +254711222333 | 254711222333 | salon | Ruiru | https://facebook.com/mamanginahair | ',
    format: 'BusinessName | phone | whatsapp | category | address | facebook_url | instagram_url',
  }
}

export default function BulkGenerator() {
  const [vercelUrl, setVercelUrl] = useState(() => localStorage.getItem('vercelUrl') || window.location.origin)
  const [inputMode, setInputMode] = useState('gmb')
  const [inputText, setInputText] = useState('')
  const [generatedLinks, setGeneratedLinks] = useState([])
  const [status, setStatus] = useState('')

  const handleVercelUrlChange = (e) => {
    const value = e.target.value
    setVercelUrl(value)
    localStorage.setItem('vercelUrl', value)
  }

  const generateLinks = () => {
    const lines = inputText.trim().split('\n').filter(line => line.trim())
    const businesses = lines.map(line => {
      const parts = line.split(' | ').map(s => s.trim())
      if (inputMode === 'gmb') {
        if (parts.length !== 5) return null
        const [name, phone, whatsapp, category, address] = parts
        if (!name || !phone || !whatsapp || !category || !address || !SUPPORTED_CATEGORIES[category]) return null
        const defaults = SUPPORTED_CATEGORIES[category]
        return {
          name,
          phone,
          whatsapp,
          category,
          address,
          email: 'hello@business.com',
          mapUrl: '',
          ...defaults,
          reviews: genericReviews,
          faqs: genericFaqs,
          galleryImages: [],
          socialImages: [],
          facebookUrl: '',
          instagramUrl: '',
          badge: ''
        }
      }

      if (parts.length !== 7) return null
      const [name, phone, whatsapp, category, address, facebookUrl, instagramUrl] = parts
      if (!name || !phone || !whatsapp || !category || !address || !SUPPORTED_CATEGORIES[category]) return null
      const defaults = SUPPORTED_CATEGORIES[category]
      return {
        name,
        phone,
        whatsapp,
        category,
        address,
        email: 'hello@business.com',
        mapUrl: '',
        ...defaults,
        reviews: genericReviews,
        faqs: genericFaqs,
        galleryImages: [],
        socialImages: [],
        facebookUrl: facebookUrl || '',
        instagramUrl: instagramUrl || '',
        badge: facebookUrl ? '📘 FB' : instagramUrl ? '📸 IG' : ''
      }
    }).filter(Boolean)

    const links = businesses.map(business => ({
      ...business,
      link: buildShareableURL(business).replace(window.location.origin, vercelUrl)
    }))

    setGeneratedLinks(links)
    setStatus(`${businesses.length} businesses parsed, ${links.length} links generated`)
  }

  const copyLink = (link) => {
    navigator.clipboard.writeText(link)
  }

  const copyAllWhatsApp = () => {
    const text = generatedLinks.map(l => `*${l.name}* — ${l.link}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#020617', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Bulk Demo Link Generator</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Vercel Deployment URL:</label>
        <input
          type="text"
          value={vercelUrl}
          onChange={handleVercelUrlChange}
          style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: 'white', borderRadius: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {Object.entries(INPUT_MODES).map(([key, mode]) => (
          <button
            key={key}
            onClick={() => setInputMode(key)}
            style={{
              flex: '1 1 140px', padding: '10px 14px', borderRadius: 8, border: '1px solid #1e293b', backgroundColor: inputMode === key ? '#0ea5e9' : '#0f172a', color: inputMode === key ? '#fff' : '#94a3b8', cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Paste Business List (one per line: {INPUT_MODES[inputMode].format}):</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={10}
          style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: 'white', borderRadius: '5px', fontFamily: 'Outfit, sans-serif' }}
          placeholder={INPUT_MODES[inputMode].example}
        />
        <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#cbd5e1' }}>
          Example: {INPUT_MODES[inputMode].example}
        </div>
      </div>

      <button
        onClick={generateLinks}
        style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
      >
        Generate All Links
      </button>

      {generatedLinks.length > 0 && (
        <button
          onClick={copyAllWhatsApp}
          style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Copy All as WhatsApp List
        </button>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '5px' }}>
        Status: {status}
      </div>

      {generatedLinks.length > 0 && (
        <>
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #1e293b' }}>Business Name</th>
              <th style={{ padding: '10px', border: '1px solid #1e293b' }}>Category</th>
              <th style={{ padding: '10px', border: '1px solid #1e293b' }}>Phone</th>
              <th style={{ padding: '10px', border: '1px solid #1e293b' }}>Demo Link</th>
              <th style={{ padding: '10px', border: '1px solid #1e293b' }}>Check WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            {generatedLinks.map((business, index) => {
              const whatsappNumber = business.whatsapp.replace(/\D/g, '')
              return (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{business.name}</span>
                      {business.badge && <span style={{ fontSize: 12, color: '#cbd5e1', background: '#1e293b', padding: '2px 6px', borderRadius: 999 }}>{business.badge}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #1e293b' }}>{business.category}</td>
                  <td style={{ padding: '10px', border: '1px solid #1e293b' }}>{business.phone}</td>
                  <td style={{ padding: '10px', border: '1px solid #1e293b' }}>
                    <a href={business.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none' }}>{business.link}</a>
                    <button
                      onClick={() => copyLink(business.link)}
                      style={{ marginLeft: '10px', backgroundColor: '#1e293b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #1e293b' }}>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>Test on WhatsApp →</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div style={{ marginTop: '14px', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#cbd5e1' }}>
          Click each link — if WhatsApp opens a chat, the number is active. If it says 'number not found', use the call-first script to get their real WhatsApp.
        </div>
        </>
      )}
    </div>
  )
}