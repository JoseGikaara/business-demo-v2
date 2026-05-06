import { useState } from 'react'
import { buildShareableURL } from '../App'
import { searchBusinesses, getPlaceDetails, mapPlaceToBusinessData } from '../lib/googlePlaces'

const CATEGORIES = [
  { value: 'salon', label: '💇 Salon / Barbershop' },
  { value: 'restaurant', label: '🍽️ Restaurant / Cafe' },
  { value: 'plumber', label: '🔧 Plumber' },
  { value: 'electrician', label: '⚡ Electrician' },
  { value: 'hardware', label: '🏗️ Hardware / Retail' },
  { value: 'clinic', label: '🏥 Clinic / Pharmacy' },
  { value: 'gym', label: '💪 Gym / Fitness' },
  { value: 'cleaning', label: '🧹 Cleaning Services' },
  { value: 'photography', label: '📷 Photography' },
  { value: 'other', label: '🏢 Other' },
]

const inp = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1.5px solid #334155', background: '#0f172a', color: '#e2e8f0',
  fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit',
}
const lbl = {
  display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
}
const card = { background: '#1e293b', borderRadius: 12, padding: '24px', marginBottom: 20, border: '1px solid #334155' }
const cardTitle = { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #334155' }

function PlacesSearchPanel({ onAutoFill }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(null)
  const [error, setError] = useState('')
  const [filled, setFilled] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true); setError(''); setResults([])
    try {
      const places = await searchBusinesses(query)
      setResults(places)
      if (places.length === 0) setError('No results found. Try a more specific name + city.')
    } catch (e) {
      setError(e.message || 'Search failed. Check GOOGLE_PLACES_KEY is set in Vercel env vars.')
    } finally { setLoading(false) }
  }

  const handleSelect = async (place) => {
    setLoadingDetail(place.place_id); setError('')
    try {
      const detail = await getPlaceDetails(place.place_id)
      onAutoFill(mapPlaceToBusinessData(detail))
      setResults([]); setQuery(''); setFilled(true)
      setTimeout(() => setFilled(false), 4000)
    } catch (e) {
      setError('Could not load details: ' + e.message)
    } finally { setLoadingDetail(null) }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0c1a2e, #0f2d1e)', borderRadius: 14, padding: 24, marginBottom: 28, border: '1.5px solid #0ea5e9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🔍</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#38bdf8' }}>Auto-fill from Google Maps</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Search a business name → pull phone, address, hours & reviews automatically</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <input style={{ ...inp, flex: 1 }} value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. Zara Beauty Salon Nairobi or Java House Westlands" />
        <button onClick={handleSearch} disabled={loading} style={{
          background: loading ? '#334155' : 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
          border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff',
          fontWeight: 700, fontSize: 14, cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
        }}>{loading ? '⏳ Searching...' : '🔍 Search'}</button>
      </div>
      {error && <div style={{ marginTop: 10, padding: '10px 14px', background: '#450a0a', borderRadius: 8, color: '#fca5a5', fontSize: 13 }}>⚠️ {error}</div>}
      {filled && <div style={{ marginTop: 10, padding: '10px 14px', background: '#052e16', borderRadius: 8, color: '#4ade80', fontSize: 13, fontWeight: 600 }}>✅ Business details auto-filled! Review and edit below.</div>}
      {results.length > 0 && (
        <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', border: '1px solid #1e3a5f' }}>
          {results.map(place => (
            <button key={place.place_id} onClick={() => handleSelect(place)} disabled={!!loadingDetail}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', textAlign: 'left', padding: '14px 16px',
                background: loadingDetail === place.place_id ? '#1e3a5f' : '#0f1e30',
                border: 'none', borderBottom: '1px solid #1e3a5f', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>🏢</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>{place.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{place.formatted_address}</div>
                {place.rating && <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 2 }}>{'★'.repeat(Math.round(place.rating))} {place.rating} ({place.user_ratings_total || 0} reviews)</div>}
              </div>
              <div style={{ color: '#38bdf8', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {loadingDetail === place.place_id ? '⏳ Loading...' : '→ Use this'}
              </div>
            </button>
          ))}
        </div>
      )}
      <div style={{ marginTop: 10, fontSize: 11, color: '#334155' }}>💡 Requires GOOGLE_PLACES_KEY in Vercel environment variables</div>
    </div>
  )
}

export default function AdminForm({ business, onChange, onPreview, onBulk }) {
  const [activeTab, setActiveTab] = useState('basics')
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    const url = buildShareableURL(business)
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000) })
  }

  const handleAutoFill = (mappedData) => { onChange({ ...business, ...mappedData }); setActiveTab('basics') }
  const u = (key, val) => onChange({ ...business, [key]: val })
  const updArr = (arr, i, key, val) => { const next = [...business[arr]]; next[i] = { ...next[i], [key]: val }; onChange({ ...business, [arr]: next }) }
  const addItem = (arr, item) => onChange({ ...business, [arr]: [...(business[arr] || []), item] })
  const removeItem = (arr, i) => onChange({ ...business, [arr]: business[arr].filter((_, idx) => idx !== i) })

  const tabs = ['basics', 'services', 'reviews', 'faq', 'gallery', 'design']
  const tabLabels = { basics: '📋 Basics', services: '🛠️ Services', reviews: '⭐ Reviews', faq: '❓ FAQ', gallery: '🖼️ Gallery', design: '🎨 Design' }
  const tabBadge = { width: 10, height: 10, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 0 4px rgba(56,189,248,0.18)' }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 768px) {
          .admin-header { padding: 0 16px !important; flex-direction: column !important; gap: 12px !important; height: auto !important; padding-top: 16px !important; padding-bottom: 16px !important; }
          .admin-header-buttons { width: 100% !important; justify-content: center !important; }
          .admin-tabs { flex-direction: column !important; }
          .grid-2col { grid-template-columns: 1fr !important; }
          .grid-3col { grid-template-columns: 1fr !important; }
          .service-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .review-grid { grid-template-columns: 1fr !important; }
          .admin-main { padding: 16px !important; }
          .admin-title { font-size: 24px !important; }
        }
      `}</style>

      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }} className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>DemoBuilder</span>
          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>by Giks Studio</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }} className="admin-header-buttons">
          <button onClick={onBulk} style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>⚡ Bulk Create</button>
          <button onClick={onPreview} style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>👁️ Preview Demo Site</button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }} className="admin-main">
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px' }} className="admin-title">Business Details</h1>
        <div style={{ marginBottom: 28, color: '#94a3b8', fontSize: 14 }}>Search Google Maps to auto-fill → review details → generate link → send via WhatsApp.</div>

        <PlacesSearchPanel onAutoFill={handleAutoFill} />

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#0f172a', padding: 8, borderRadius: 10, border: '1px solid #1e293b', flexWrap: 'wrap' }} className="admin-tabs">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, minWidth: 100, padding: '12px 10px', borderRadius: 10, border: '1px solid transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, background: activeTab === tab ? '#0ea5e9' : 'transparent', color: activeTab === tab ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{activeTab === tab && <span style={tabBadge} />}{tabLabels[tab]}</span>
            </button>
          ))}
        </div>

        {activeTab === 'basics' && (
          <div>
            <div style={card}>
              <div style={cardTitle}>Business Identity</div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-2col">
                  <div><label style={lbl}>Business Name *</label><input style={inp} value={business.name} onChange={e => u('name', e.target.value)} placeholder="e.g. Apex Salon & Spa" /></div>
                  <div><label style={lbl}>Category *</label>
                    <select style={inp} value={business.category} onChange={e => u('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div><label style={lbl}>Tagline / Slogan</label><input style={inp} value={business.tagline} onChange={e => u('tagline', e.target.value)} placeholder="e.g. Where Style Meets Luxury" /></div>
                <div><label style={lbl}>About / Description</label><textarea style={{ ...inp, height: 100, resize: 'vertical' }} value={business.about} onChange={e => u('about', e.target.value)}></textarea></div>
              </div>
            </div>
            <div style={card}>
              <div style={cardTitle}>Contact & Location</div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-2col">
                  <div><label style={lbl}>Phone *</label><input style={inp} value={business.phone} onChange={e => u('phone', e.target.value)} placeholder="+254 712 345 678" /></div>
                  <div><label style={lbl}>WhatsApp (digits only) *</label><input style={inp} value={business.whatsapp} onChange={e => u('whatsapp', e.target.value)} placeholder="254712345678" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-2col">
                  <div><label style={lbl}>Email</label><input style={inp} value={business.email} onChange={e => u('email', e.target.value)} /></div>
                  <div><label style={lbl}>Address</label><input style={inp} value={business.address} onChange={e => u('address', e.target.value)} /></div>
                </div>
                <div><label style={lbl}>Business Hours</label><input style={inp} value={business.hours} onChange={e => u('hours', e.target.value)} placeholder="Mon–Fri: 8AM–6PM | Sat: 9AM–4PM" /></div>
                <div>
                  <label style={lbl}>Google Maps Search Term (for embed)</label>
                  <input style={inp} value={business.mapSearch || ''} onChange={e => u('mapSearch', e.target.value)} placeholder="e.g. Apex Salon Westlands Nairobi" />
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Type exactly how you'd search for this business on Google Maps</div>
                  {business.mapSearch && <iframe src={"https://maps.google.com/maps?q=" + encodeURIComponent(business.mapSearch) + "&output=embed"} style={{ width: '100%', height: '200px', borderRadius: '8px', border: 'none', marginTop: '10px' }} allowFullScreen></iframe>}
                </div>
              </div>
            </div>
            <div style={card}>
              <div style={cardTitle}>Social Media</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-2col">
                <div><label style={lbl}>Facebook URL</label><input style={inp} value={business.facebookUrl} onChange={e => u('facebookUrl', e.target.value)} placeholder="https://facebook.com/yourbusiness" /></div>
                <div><label style={lbl}>Instagram URL</label><input style={inp} value={business.instagramUrl} onChange={e => u('instagramUrl', e.target.value)} placeholder="https://instagram.com/yourbusiness" /></div>
              </div>
            </div>
            <div style={card}>
              <div style={cardTitle}>Features</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div onClick={() => u('showBooking', !business.showBooking)} style={{ width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer', background: business.showBooking ? '#0ea5e9' : '#334155', transition: 'background 0.3s' }}>
                  <div style={{ position: 'absolute', top: 2, left: business.showBooking ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s' }} />
                </div>
                <span style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>Show Booking / Appointment Form</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div style={card}>
            <div style={cardTitle}>Services / Products</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(business.services || []).map((svc, i) => (
                <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: 16, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Service {i + 1}</span>
                    <button onClick={() => removeItem('services', i)} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 140px', gap: 10, marginBottom: 10 }} className="service-grid">
                    <div><label style={lbl}>Icon</label><input style={{ ...inp, textAlign: 'center', fontSize: 20 }} value={svc.icon} onChange={e => updArr('services', i, 'icon', e.target.value)} /></div>
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

        {activeTab === 'reviews' && (
          <div style={card}>
            <div style={cardTitle}>Customer Reviews</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(business.reviews || []).map((rev, i) => (
                <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: 16, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Review {i + 1}</span>
                    <button onClick={() => removeItem('reviews', i)} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 10 }} className="review-grid">
                    <div><label style={lbl}>Name</label><input style={inp} value={rev.name} onChange={e => updArr('reviews', i, 'name', e.target.value)} /></div>
                    <div><label style={lbl}>Rating</label>
                      <select style={inp} value={rev.rating} onChange={e => updArr('reviews', i, 'rating', Number(e.target.value))}>
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={lbl}>Review Text</label><textarea style={{ ...inp, height: 70, resize: 'vertical' }} value={rev.text} onChange={e => updArr('reviews', i, 'text', e.target.value)}></textarea></div>
                </div>
              ))}
              <button onClick={() => addItem('reviews', { name: '', rating: 5, text: '' })} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Review</button>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div style={card}>
            <div style={cardTitle}>FAQ</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(business.faqs || []).map((faq, i) => (
                <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: 16, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>FAQ {i + 1}</span>
                    <button onClick={() => removeItem('faqs', i)} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ marginBottom: 10 }}><label style={lbl}>Question</label><input style={inp} value={faq.q} onChange={e => updArr('faqs', i, 'q', e.target.value)} /></div>
                  <div><label style={lbl}>Answer</label><textarea style={{ ...inp, height: 80, resize: 'vertical' }} value={faq.a} onChange={e => updArr('faqs', i, 'a', e.target.value)}></textarea></div>
                </div>
              ))}
              <button onClick={() => addItem('faqs', { q: '', a: '' })} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add FAQ</button>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div style={card}>
              <div style={cardTitle}>Gallery — Image URLs</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {(business.galleryImages || []).map((url, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input style={{ ...inp, flex: 1 }} value={url} onChange={e => { const next = [...business.galleryImages]; next[i] = e.target.value; u('galleryImages', next) }} placeholder="https://..." />
                    {url && <img src={url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #334155' }} onError={e => e.target.style.display='none'} />}
                    <button onClick={() => { const next = business.galleryImages.filter((_, idx) => idx !== i); u('galleryImages', next) }} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => u('galleryImages', [...(business.galleryImages || []), ''])} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Image URL</button>
              </div>
            </div>
            <div style={card}>
              <div style={cardTitle}>Social Media Photos</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {(business.socialImages || []).map((url, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input style={{ ...inp, flex: 1 }} value={url} onChange={e => { const next = [...business.socialImages]; next[i] = e.target.value; u('socialImages', next) }} placeholder="https://..." />
                    {url && <img src={url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #334155' }} onError={e => e.target.style.display='none'} />}
                    <button onClick={() => { const next = business.socialImages.filter((_, idx) => idx !== i); u('socialImages', next) }} style={{ background: '#7f1d1d', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#fca5a5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => u('socialImages', [...(business.socialImages || []), ''])} style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: 10, padding: 14, color: '#0ea5e9', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Social Image URL</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div style={card}>
            <div style={cardTitle}>Brand Colors</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={lbl}>Primary Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="color" value={business.primaryColor} onChange={e => u('primaryColor', e.target.value)} style={{ width: 48, height: 40, borderRadius: 8, border: '2px solid #334155', cursor: 'pointer', background: 'none', padding: 2 }} />
                  <input style={{ ...inp, flex: 1 }} value={business.primaryColor} onChange={e => u('primaryColor', e.target.value)} />
                </div>
              </div>
              <div>
                <label style={lbl}>Accent Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="color" value={business.accentColor} onChange={e => u('accentColor', e.target.value)} style={{ width: 48, height: 40, borderRadius: 8, border: '2px solid #334155', cursor: 'pointer', background: 'none', padding: 2 }} />
                  <input style={{ ...inp, flex: 1 }} value={business.accentColor} onChange={e => u('accentColor', e.target.value)} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: 20, borderRadius: 8, background: `linear-gradient(135deg, ${business.primaryColor}, ${business.accentColor})` }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Color Preview</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>This gradient is used throughout the demo site</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          <button onClick={generateLink} style={{ background: copied ? '#16a34a' : '#0f172a', border: `2px solid ${copied ? '#16a34a' : business.primaryColor}`, borderRadius: 12, padding: 16, color: copied ? '#fff' : business.primaryColor, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.3s' }}>
            {copied ? '✅ Link Copied!' : '🔗 Generate Shareable Link'}
          </button>
          <button onClick={onPreview} style={{ background: `linear-gradient(135deg, ${business.primaryColor}, ${business.accentColor})`, border: 'none', borderRadius: 12, padding: 16, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
            👁️ Preview Demo Site →
          </button>
        </div>
        {copied && (
          <div style={{ marginTop: 12, padding: '12px 16px', background: '#052e16', border: '1px solid #16a34a', borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>✅ Link copied — send via WhatsApp:</div>
            <div style={{ fontSize: 11, color: '#86efac', wordBreak: 'break-all', fontFamily: 'monospace' }}>{buildShareableURL(business)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
