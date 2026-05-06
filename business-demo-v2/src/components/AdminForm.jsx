import { useState } from 'react'
import { buildShareableURL } from '../App'
import { searchBusiness, getPlaceDetails } from '../utils/googlePlaces'

// ── Category templates (from BulkGenerator) ──────────────────────────────────
const CATEGORY_DEFAULTS = {
  salon: { tagline: 'Where Style Meets Luxury', hours: 'Mon–Sat: 8AM–8PM | Sun: 10AM–6PM', about: "Nairobi's premier destination for hair, nails, and wellness.", primaryColor: '#0ea5e9', accentColor: '#06b6d4', showBooking: true, services: [{ name: 'Hair Styling', price: '1,500', desc: 'Cut, blow-dry, and professional styling', icon: '✂️' }, { name: 'Manicure & Pedicure', price: '2,000', desc: 'Luxury nail care with premium polish', icon: '💅' }, { name: 'Facial Treatment', price: '3,500', desc: 'Deep cleansing and rejuvenating skin therapy', icon: '✨' }, { name: 'Massage Therapy', price: '4,000', desc: 'Full body relaxation and therapeutic massage', icon: '🫧' }] },
  restaurant: { tagline: 'Flavors That Delight', hours: 'Mon–Sun: 11AM–10PM', about: 'Authentic cuisine with a modern twist. Fresh ingredients, creative presentations.', primaryColor: '#dc2626', accentColor: '#ef4444', showBooking: true, services: [{ name: 'Lunch Special', price: '1,000', desc: 'Daily changing lunch menu with drink', icon: '🍽️' }, { name: 'Dinner for Two', price: '3,500', desc: 'Romantic dinner with wine pairing', icon: '🍷' }, { name: 'Family Platter', price: '5,000', desc: 'Large sharing platter for families', icon: '👨‍👩‍👧‍👦' }, { name: 'Catering Service', price: 'Contact', desc: 'Event catering with custom menus', icon: '🎉' }] },
  plumber: { tagline: 'Reliable Plumbing Solutions', hours: 'Mon–Sat: 8AM–6PM | Emergency: 24/7', about: 'Professional plumbing services for residential and commercial properties.', primaryColor: '#059669', accentColor: '#10b981', showBooking: false, services: [{ name: 'Pipe Repair', price: '2,000', desc: 'Fix leaking or broken pipes', icon: '🔧' }, { name: 'Drain Cleaning', price: '1,500', desc: 'Clear clogged drains and sewers', icon: '🚰' }, { name: 'Installation', price: '3,000', desc: 'Install new plumbing fixtures', icon: '🛠️' }, { name: 'Emergency Service', price: '4,000', desc: '24/7 emergency plumbing repairs', icon: '🚨' }] },
  electrician: { tagline: 'Powering Your Home', hours: 'Mon–Sat: 8AM–6PM | Emergency: 24/7', about: 'Certified electrical services for safe and efficient installations.', primaryColor: '#d97706', accentColor: '#f59e0b', showBooking: false, services: [{ name: 'Wiring Installation', price: '5,000', desc: 'Complete electrical wiring setup', icon: '⚡' }, { name: 'Outlet Repair', price: '1,000', desc: 'Fix faulty outlets and switches', icon: '🔌' }, { name: 'Lighting Installation', price: '2,500', desc: 'Install new lighting fixtures', icon: '💡' }, { name: 'Emergency Repair', price: '3,000', desc: '24/7 emergency electrical fixes', icon: '🚨' }] },
  gym: { tagline: 'Build Your Strength', hours: 'Mon–Fri: 5AM–10PM | Sat–Sun: 7AM–8PM', about: 'State-of-the-art fitness facility with expert trainers and modern equipment.', primaryColor: '#7c3aed', accentColor: '#8b5cf6', showBooking: true, services: [{ name: 'Personal Training', price: '3,000', desc: 'One-on-one training sessions', icon: '🏋️' }, { name: 'Group Classes', price: '1,500', desc: 'Yoga, HIIT, and strength classes', icon: '🤸' }, { name: 'Membership', price: '5,000', desc: 'Monthly unlimited access', icon: '💳' }, { name: 'Nutrition Consult', price: '2,000', desc: 'Diet planning and advice', icon: '🥗' }] },
  clinic: { tagline: 'Caring for Your Health', hours: 'Mon–Fri: 8AM–6PM | Sat: 9AM–2PM | Sun: Closed', about: 'Comprehensive healthcare services with experienced doctors and modern facilities.', primaryColor: '#be185d', accentColor: '#db2777', showBooking: true, services: [{ name: 'General Consultation', price: '1,500', desc: 'Comprehensive health check-up', icon: '👨‍⚕️' }, { name: 'Specialist Visit', price: '3,000', desc: 'Consultation with specialists', icon: '🩺' }, { name: 'Lab Tests', price: '2,000', desc: 'Blood work and diagnostics', icon: '🧪' }, { name: 'Vaccinations', price: '1,000', desc: 'Routine and travel vaccines', icon: '💉' }] },
  cleaning: { tagline: 'Sparkling Clean Spaces', hours: 'Mon–Sat: 7AM–7PM | Sun: 9AM–5PM', about: 'Professional cleaning services for homes and offices.', primaryColor: '#0d9488', accentColor: '#14b8a6', showBooking: false, services: [{ name: 'House Cleaning', price: '3,000', desc: 'Complete home deep cleaning', icon: '🧹' }, { name: 'Office Cleaning', price: '2,500', desc: 'Regular office maintenance', icon: '🏢' }, { name: 'Carpet Cleaning', price: '1,500', desc: 'Deep carpet and upholstery cleaning', icon: '🧽' }, { name: 'Window Cleaning', price: '1,000', desc: 'Streak-free window cleaning', icon: '🪟' }] },
  photography: { tagline: 'Capturing Your Moments', hours: 'Mon–Sat: 9AM–6PM | Sun: By Appointment', about: 'Professional photography services for events, portraits, and commercial needs.', primaryColor: '#7c2d12', accentColor: '#ea580c', showBooking: true, services: [{ name: 'Portrait Session', price: '5,000', desc: 'Professional headshots and portraits', icon: '📸' }, { name: 'Event Photography', price: '10,000', desc: 'Wedding and event coverage', icon: '🎉' }, { name: 'Product Photography', price: '3,000', desc: 'Commercial product shoots', icon: '📦' }, { name: 'Photo Editing', price: '1,000', desc: 'Post-production and retouching', icon: '🖼️' }] },
  hardware: { tagline: 'Your Home Improvement Store', hours: 'Mon–Sat: 8AM–7PM | Sun: 10AM–4PM', about: 'Complete hardware store with tools, materials, and expert advice.', primaryColor: '#374151', accentColor: '#6b7280', showBooking: false, services: [{ name: 'Tool Rental', price: '500', desc: 'Rent power tools and equipment', icon: '🔨' }, { name: 'Consultation', price: 'Free', desc: 'Expert advice on projects', icon: '🛠️' }, { name: 'Delivery Service', price: '1,000', desc: 'Home delivery of materials', icon: '🚚' }, { name: 'Installation Help', price: '2,000', desc: 'Professional installation assistance', icon: '⚙️' }] },
  other: { tagline: 'Quality Service You Can Trust', hours: 'Mon–Fri: 8AM–6PM | Sat: 9AM–2PM', about: 'Professional services delivered with excellence and reliability.', primaryColor: '#0ea5e9', accentColor: '#06b6d4', showBooking: false, services: [{ name: 'Consultation', price: 'Free', desc: 'Initial consultation and assessment', icon: '💬' }, { name: 'Standard Service', price: 'Contact', desc: 'Core service delivery', icon: '⭐' }, { name: 'Premium Package', price: 'Contact', desc: 'Full-service premium offering', icon: '🏆' }, { name: 'Support', price: 'Included', desc: 'Ongoing support and maintenance', icon: '🛠️' }] },
}

const GENERIC_REVIEWS = [
  { name: 'Happy Customer', rating: 5, text: 'Excellent service! Highly recommend to anyone looking for quality.' },
  { name: 'Satisfied Client', rating: 5, text: 'Professional and reliable. Will definitely use again.' },
  { name: 'Loyal Patron', rating: 5, text: 'Great experience from start to finish. Very impressed.' },
]

const GENERIC_FAQS = [
  { q: 'Do I need to book in advance?', a: 'We recommend booking at least 24 hours in advance to ensure availability.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, cash, and major cards.' },
  { q: 'How long do services take?', a: 'Duration varies by service — we will give you an estimate when booking.' },
  { q: 'Do you offer packages or discounts?', a: 'Yes, contact us for custom packages and current promotions.' },
]

const TYPE_TO_CATEGORY = {
  hair_care: 'salon', beauty_salon: 'salon', barber_shop: 'salon',
  restaurant: 'restaurant', cafe: 'restaurant', food: 'restaurant', meal_takeaway: 'restaurant',
  doctor: 'clinic', pharmacy: 'clinic', hospital: 'clinic', health: 'clinic',
  gym: 'gym', physiotherapist: 'gym',
  electrician: 'electrician', plumber: 'plumber',
  hardware_store: 'hardware', store: 'hardware',
  laundry: 'cleaning',
  photographer: 'photography',
}

function guessCategory(types = []) {
  for (const t of types) { if (TYPE_TO_CATEGORY[t]) return TYPE_TO_CATEGORY[t] }
  return 'other'
}

function normalisePhone(raw = '') {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 10) return '254' + digits.slice(1)
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('7') || digits.startsWith('1')) return '254' + digits
  return digits
}

function placeToLead(placeData) {
  const phone = placeData.formatted_phone_number || placeData.international_phone_number || ''
  const whatsapp = normalisePhone(placeData.international_phone_number || placeData.formatted_phone_number || '')
  const category = guessCategory(placeData.types)
  const defaults = CATEGORY_DEFAULTS[category] || CATEGORY_DEFAULTS.other
  const address = placeData.formatted_address || placeData.vicinity || ''
  const mapSearch = placeData.name && address ? `${placeData.name}, ${address}` : placeData.name || ''
  const hours = placeData.opening_hours?.weekday_text?.slice(0, 2).join(' | ') || defaults.hours

  // Pull real reviews if available
  const reviews = placeData.reviews?.length
    ? placeData.reviews.slice(0, 3).map(r => ({ name: r.author_name, rating: r.rating, text: r.text }))
    : GENERIC_REVIEWS

  return {
    id: crypto.randomUUID(),
    // lead fields
    name: placeData.name || '',
    phone,
    whatsapp,
    address,
    category,
    status: 'new',
    assignedTo: '',
    demoUrl: '',
    shortUrl: '',
    builtAt: null,
    createdAt: new Date().toISOString(),
    // business site fields (for building the demo)
    tagline: defaults.tagline,
    about: defaults.about,
    email: '',
    mapSearch,
    hours,
    primaryColor: defaults.primaryColor,
    accentColor: defaults.accentColor,
    showBooking: defaults.showBooking,
    services: defaults.services,
    reviews,
    faqs: GENERIC_FAQS,
    galleryImages: [],
    socialImages: [],
    facebookUrl: '',
    instagramUrl: '',
    website: placeData.website || '',
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────
const inp = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }
const card = { background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 20, border: '1px solid #334155' }
const cardTitle = { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #334155' }

// ── Google Search + Queue Panel ───────────────────────────────────────────────
function SearchPanel({ onAddToLeads }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [searching, setSearching] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(0)

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true); setError(''); setResults([]); setSelected(new Set())
    try {
      const data = await searchBusiness(query)
      const places = data.results || []
      setResults(places)
      if (places.length === 0) setError('No results found. Try a different search.')
    } catch (e) {
      setError('Search failed. Check GOOGLE_PLACES_KEY is set in Vercel.')
    } finally { setSearching(false) }
  }

  const toggleSelect = (id) => {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }

  const toggleAll = () => {
    setSelected(selected.size === results.length ? new Set() : new Set(results.map(p => p.place_id)))
  }

  const handleAddSelected = async () => {
    const toAdd = results.filter(p => selected.has(p.place_id))
    if (!toAdd.length) return
    setLoadingDetails(true); setError('')
    try {
      const leads = []
      for (const place of toAdd) {
        try {
          const detail = await getPlaceDetails(place.place_id)
          leads.push(placeToLead(detail.result || place))
        } catch {
          // Fallback to basic data if details fail
          leads.push(placeToLead(place))
        }
      }
      onAddToLeads(leads)
      setAdded(leads.length)
      setResults([]); setSelected(new Set()); setQuery('')
      setTimeout(() => setAdded(0), 4000)
    } catch (e) {
      setError('Failed to load business details: ' + e.message)
    } finally { setLoadingDetails(false) }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0c1a2e, #0c2210)', borderRadius: 14, padding: 24, marginBottom: 28, border: '1.5px solid #0ea5e9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>🔍</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: '#38bdf8' }}>Search Google Maps</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Find businesses → select → add to Leads in one click</div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input style={{ ...inp, flex: 1 }} value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. salons Westlands Nairobi  or  restaurants Karen" />
        <button onClick={handleSearch} disabled={searching} style={{ background: searching ? '#334155' : 'linear-gradient(135deg, #0ea5e9, #06b6d4)', border: 'none', borderRadius: 8, padding: '10px 22px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: searching ? 'default' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
          {searching ? '⏳ Searching...' : '🔍 Search'}
        </button>
      </div>

      {error && <div style={{ marginTop: 10, padding: '10px 14px', background: '#450a0a', borderRadius: 8, color: '#fca5a5', fontSize: 13 }}>⚠️ {error}</div>}

      {added > 0 && (
        <div style={{ marginTop: 10, padding: '12px 16px', background: '#052e16', borderRadius: 8, color: '#4ade80', fontWeight: 700, fontSize: 14 }}>
          ✅ {added} business{added > 1 ? 'es' : ''} added to Leads! Go to Leads & CRM to build their sites.
        </div>
      )}

      {/* Results list */}
      {results.length > 0 && (
        <div style={{ marginTop: 14 }}>
          {/* Select all + count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button onClick={toggleAll} style={{ background: 'none', border: '1px solid #334155', borderRadius: 6, padding: '6px 14px', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              {selected.size === results.length ? '☑ Deselect All' : `☐ Select All (${results.length})`}
            </button>
            <span style={{ fontSize: 12, color: '#64748b' }}>{selected.size} of {results.length} selected</span>
          </div>

          {/* Place cards */}
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #1e3a5f' }}>
            {results.map((place, i) => (
              <div key={place.place_id} onClick={() => toggleSelect(place.place_id)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: selected.has(place.place_id) ? '#0c2233' : '#0a1628', borderBottom: i < results.length - 1 ? '1px solid #1e3a5f' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}>
                {/* Checkbox */}
                <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${selected.has(place.place_id) ? '#0ea5e9' : '#334155'}`, background: selected.has(place.place_id) ? '#0ea5e9' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  {selected.has(place.place_id) && <span style={{ color: '#fff', fontSize: 13, lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>{place.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{place.formatted_address}</div>
                  {place.rating && <div style={{ fontSize: 11, color: '#fbbf24', marginTop: 3 }}>{'★'.repeat(Math.round(place.rating))} {place.rating} · {place.user_ratings_total || 0} reviews</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Add button */}
          {selected.size > 0 && (
            <button onClick={handleAddSelected} disabled={loadingDetails} style={{ marginTop: 12, width: '100%', padding: 14, background: loadingDetails ? '#334155' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: 15, cursor: loadingDetails ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              {loadingDetails ? '⏳ Fetching business details...' : `➕ Add ${selected.size} Business${selected.size > 1 ? 'es' : ''} to Leads`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main AdminForm ────────────────────────────────────────────────────────────
export default function AdminForm({ business, onChange, onPreview, onGoToLeads }) {
  const [activeTab, setActiveTab] = useState('basics')
  const [copied, setCopied] = useState(false)

  const handleAddToLeads = (newLeads) => {
    const existing = JSON.parse(localStorage.getItem('demobuilder_leads') || '[]')
    // Dedupe by name+phone
    const existingKeys = new Set(existing.map(l => `${l.name}|${l.phone}`))
    const fresh = newLeads.filter(l => !existingKeys.has(`${l.name}|${l.phone}`))
    localStorage.setItem('demobuilder_leads', JSON.stringify([...existing, ...fresh]))
  }

  const generateLink = () => {
    const url = buildShareableURL(business)
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000) })
  }

  const u = (key, val) => onChange({ ...business, [key]: val })
  const updArr = (arr, i, key, val) => { const next = [...business[arr]]; next[i] = { ...next[i], [key]: val }; onChange({ ...business, [arr]: next }) }
  const addItem = (arr, item) => onChange({ ...business, [arr]: [...(business[arr] || []), item] })
  const removeItem = (arr, i) => onChange({ ...business, [arr]: business[arr].filter((_, idx) => idx !== i) })

  const tabs = ['basics', 'services', 'reviews', 'faq', 'gallery', 'design']
  const tabLabels = { basics: '📋 Basics', services: '🛠️ Services', reviews: '⭐ Reviews', faq: '❓ FAQ', gallery: '🖼️ Gallery', design: '🎨 Design' }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@media(max-width:768px){.grid-2col{grid-template-columns:1fr!important}.admin-main{padding:16px!important}}`}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }} className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Business Builder</h1>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Search Google Maps to find businesses → add to Leads → build sites in bulk</div>
          </div>
          <button onClick={onGoToLeads} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: 'none', borderRadius: 10, padding: '12px 22px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            📋 Go to Leads & CRM →
          </button>
        </div>

        {/* Google Search Panel */}
        <SearchPanel onAddToLeads={handleAddToLeads} />

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: '#1e293b' }} />
          <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>OR BUILD A SINGLE SITE MANUALLY</span>
          <div style={{ flex: 1, height: 1, background: '#1e293b' }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: '#0f172a', padding: 8, borderRadius: 10, border: '1px solid #1e293b', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, minWidth: 90, padding: '10px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, background: activeTab === tab ? '#0ea5e9' : 'transparent', color: activeTab === tab ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* BASICS */}
        {activeTab === 'basics' && (
          <div>
            <div style={card}>
              <div style={cardTitle}>Business Identity</div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-2col">
                  <div><label style={lbl}>Business Name</label><input style={inp} value={business.name} onChange={e => u('name', e.target.value)} /></div>
                  <div><label style={lbl}>Category</label>
                    <select style={inp} value={business.category} onChange={e => u('category', e.target.value)}>
                      {Object.keys(CATEGORY_DEFAULTS).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div><label style={lbl}>Tagline</label><input style={inp} value={business.tagline} onChange={e => u('tagline', e.target.value)} /></div>
                <div><label style={lbl}>About</label><textarea style={{ ...inp, height: 90, resize: 'vertical' }} value={business.about} onChange={e => u('about', e.target.value)} /></div>
              </div>
            </div>
            <div style={card}>
              <div style={cardTitle}>Contact</div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-2col">
                  <div><label style={lbl}>Phone</label><input style={inp} value={business.phone} onChange={e => { u('phone', e.target.value); u('whatsapp', normalisePhone(e.target.value)) }} placeholder="+254 712 345 678" /></div>
                  <div><label style={lbl}>WhatsApp (digits)</label><input style={inp} value={business.whatsapp} onChange={e => u('whatsapp', e.target.value)} placeholder="254712345678" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-2col">
                  <div><label style={lbl}>Email</label><input style={inp} value={business.email} onChange={e => u('email', e.target.value)} /></div>
                  <div><label style={lbl}>Address</label><input style={inp} value={business.address} onChange={e => u('address', e.target.value)} /></div>
                </div>
                <div><label style={lbl}>Business Hours</label><input style={inp} value={business.hours} onChange={e => u('hours', e.target.value)} /></div>
                <div>
                  <label style={lbl}>Google Maps Search Term</label>
                  <input style={inp} value={business.mapSearch || ''} onChange={e => u('mapSearch', e.target.value)} placeholder="e.g. Apex Salon Westlands Nairobi" />
                  {business.mapSearch && <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapSearch)}&output=embed`} style={{ width: '100%', height: 180, borderRadius: 8, border: 'none', marginTop: 10 }} allowFullScreen />}
                </div>
              </div>
            </div>
            <div style={card}>
              <div style={cardTitle}>Social & Features</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }} className="grid-2col">
                <div><label style={lbl}>Facebook URL</label><input style={inp} value={business.facebookUrl} onChange={e => u('facebookUrl', e.target.value)} /></div>
                <div><label style={lbl}>Instagram URL</label><input style={inp} value={business.instagramUrl} onChange={e => u('instagramUrl', e.target.value)} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div onClick={() => u('showBooking', !business.showBooking)} style={{ width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer', background: business.showBooking ? '#0ea5e9' : '#334155', transition: 'background 0.3s' }}>
                  <div style={{ position: 'absolute', top: 2, left: business.showBooking ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s' }} />
                </div>
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>Show Booking Form</span>
              </label>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === 'services' && (
          <div style={card}>
            <div style={cardTitle}>Services / Products</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(business.services || []).map((svc, i) => (
                <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: 16, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Service {i + 1}</span>
                    <button onClick={() => removeItem('services', i)} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 130px', gap: 10, marginBottom: 10 }}>
                    <div><label style={lbl}>Icon</label><input style={{ ...inp, textAlign: 'center', fontSize: 18 }} value={svc.icon} onChange={e => updArr('services', i, 'icon', e.target.value)} /></div>
                    <div><label style={lbl}>Name</label><input style={inp} value={svc.name} onChange={e => updArr('services', i, 'name', e.target.value)} /></div>
                    <div><label style={lbl}>Price (KES)</label><input style={inp} value={svc.price} onChange={e => updArr('services', i, 'price', e.target.value)} /></div>
                  </div>
                  <div><label style={lbl}>Description</label><input style={inp} value={svc.desc} onChange={e => updArr('services', i, 'desc', e.target.value)} /></div>
                </div>
              ))}
              <button onClick={() => addItem('services', { name: '', price: '', desc: '', icon: '⭐' })} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Service</button>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <div style={card}>
            <div style={cardTitle}>Customer Reviews</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(business.reviews || []).map((rev, i) => (
                <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: 16, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Review {i + 1}</span>
                    <button onClick={() => removeItem('reviews', i)} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10, marginBottom: 10 }}>
                    <div><label style={lbl}>Name</label><input style={inp} value={rev.name} onChange={e => updArr('reviews', i, 'name', e.target.value)} /></div>
                    <div><label style={lbl}>Rating</label>
                      <select style={inp} value={rev.rating} onChange={e => updArr('reviews', i, 'rating', Number(e.target.value))}>
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={lbl}>Text</label><textarea style={{ ...inp, height: 70, resize: 'vertical' }} value={rev.text} onChange={e => updArr('reviews', i, 'text', e.target.value)} /></div>
                </div>
              ))}
              <button onClick={() => addItem('reviews', { name: '', rating: 5, text: '' })} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Review</button>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div style={card}>
            <div style={cardTitle}>FAQ</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(business.faqs || []).map((faq, i) => (
                <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: 16, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>FAQ {i + 1}</span>
                    <button onClick={() => removeItem('faqs', i)} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ marginBottom: 10 }}><label style={lbl}>Question</label><input style={inp} value={faq.q} onChange={e => updArr('faqs', i, 'q', e.target.value)} /></div>
                  <div><label style={lbl}>Answer</label><textarea style={{ ...inp, height: 70, resize: 'vertical' }} value={faq.a} onChange={e => updArr('faqs', i, 'a', e.target.value)} /></div>
                </div>
              ))}
              <button onClick={() => addItem('faqs', { q: '', a: '' })} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add FAQ</button>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div style={card}>
            <div style={cardTitle}>Gallery — Image URLs</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(business.galleryImages || []).map((url, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input style={{ ...inp, flex: 1 }} value={url} onChange={e => { const n = [...business.galleryImages]; n[i] = e.target.value; u('galleryImages', n) }} placeholder="https://..." />
                  {url && <img src={url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.style.display='none'} />}
                  <button onClick={() => u('galleryImages', business.galleryImages.filter((_, idx) => idx !== i))} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '6px 10px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                </div>
              ))}
              <button onClick={() => u('galleryImages', [...(business.galleryImages || []), ''])} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Image URL</button>
            </div>
          </div>
        )}

        {/* DESIGN */}
        {activeTab === 'design' && (
          <div style={card}>
            <div style={cardTitle}>Brand Colors</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[['Primary Color', 'primaryColor'], ['Accent Color', 'accentColor']].map(([label, key]) => (
                <div key={key}>
                  <label style={lbl}>{label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="color" value={business[key]} onChange={e => u(key, e.target.value)} style={{ width: 44, height: 38, borderRadius: 8, border: '2px solid #334155', cursor: 'pointer', background: 'none', padding: 2 }} />
                    <input style={{ ...inp, flex: 1 }} value={business[key]} onChange={e => u(key, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: 20, borderRadius: 8, background: `linear-gradient(135deg, ${business.primaryColor}, ${business.accentColor})` }}>
              <div style={{ color: '#fff', fontWeight: 700 }}>Color Preview</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>This gradient is used across the demo site</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          <button onClick={generateLink} style={{ background: copied ? '#16a34a' : '#0f172a', border: `2px solid ${copied ? '#16a34a' : business.primaryColor}`, borderRadius: 12, padding: 16, color: copied ? '#fff' : business.primaryColor, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.3s' }}>
            {copied ? '✅ Link Copied!' : '🔗 Copy Demo Link'}
          </button>
          <button onClick={onPreview} style={{ background: `linear-gradient(135deg, ${business.primaryColor}, ${business.accentColor})`, border: 'none', borderRadius: 12, padding: 16, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
            👁️ Preview Site →
          </button>
        </div>
      </div>
    </div>
  )
}
