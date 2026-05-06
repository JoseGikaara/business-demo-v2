import { useState, useEffect } from 'react'
import { buildShareableURL } from '../App'
import { supabase } from '../utils/supabase'

async function shortenURL(longUrl) {
  try {
    const r = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`)
    return r.ok ? (await r.text()).trim() : null
  } catch { return null }
}

const CATEGORY_DEFAULTS = {
  salon: { tagline: 'Where Style Meets Luxury', hours: 'Mon–Sat: 8AM–8PM | Sun: 10AM–6PM', about: "Nairobi's premier destination for hair, nails, and wellness.", primaryColor: '#0ea5e9', accentColor: '#06b6d4', showBooking: true, services: [{ name: 'Hair Styling', price: '1,500', desc: 'Cut, blow-dry, and styling', icon: '✂️' }, { name: 'Manicure & Pedicure', price: '2,000', desc: 'Luxury nail care', icon: '💅' }, { name: 'Facial Treatment', price: '3,500', desc: 'Rejuvenating skin therapy', icon: '✨' }, { name: 'Massage Therapy', price: '4,000', desc: 'Full body relaxation', icon: '🫧' }] },
  restaurant: { tagline: 'Flavors That Delight', hours: 'Mon–Sun: 11AM–10PM', about: 'Authentic cuisine with a modern twist.', primaryColor: '#dc2626', accentColor: '#ef4444', showBooking: true, services: [{ name: 'Lunch Special', price: '1,000', desc: 'Daily changing lunch menu', icon: '🍽️' }, { name: 'Dinner for Two', price: '3,500', desc: 'Romantic dinner experience', icon: '🍷' }, { name: 'Family Platter', price: '5,000', desc: 'Large sharing platter', icon: '👨‍👩‍👧‍👦' }, { name: 'Catering', price: 'Contact', desc: 'Event catering services', icon: '🎉' }] },
  plumber: { tagline: 'Reliable Plumbing Solutions', hours: 'Mon–Sat: 8AM–6PM | Emergency: 24/7', about: 'Professional plumbing for residential and commercial.', primaryColor: '#059669', accentColor: '#10b981', showBooking: false, services: [{ name: 'Pipe Repair', price: '2,000', desc: 'Fix leaking pipes', icon: '🔧' }, { name: 'Drain Cleaning', price: '1,500', desc: 'Clear clogged drains', icon: '🚰' }, { name: 'Installation', price: '3,000', desc: 'New plumbing fixtures', icon: '🛠️' }, { name: 'Emergency', price: '4,000', desc: '24/7 emergency repairs', icon: '🚨' }] },
  electrician: { tagline: 'Powering Your Home', hours: 'Mon–Sat: 8AM–6PM | Emergency: 24/7', about: 'Certified electrical services for all needs.', primaryColor: '#d97706', accentColor: '#f59e0b', showBooking: false, services: [{ name: 'Wiring', price: '5,000', desc: 'Electrical wiring setup', icon: '⚡' }, { name: 'Outlet Repair', price: '1,000', desc: 'Fix faulty outlets', icon: '🔌' }, { name: 'Lighting', price: '2,500', desc: 'New lighting fixtures', icon: '💡' }, { name: 'Emergency', price: '3,000', desc: '24/7 electrical fixes', icon: '🚨' }] },
  gym: { tagline: 'Build Your Strength', hours: 'Mon–Fri: 5AM–10PM | Sat–Sun: 7AM–8PM', about: 'State-of-the-art fitness facility.', primaryColor: '#7c3aed', accentColor: '#8b5cf6', showBooking: true, services: [{ name: 'Personal Training', price: '3,000', desc: 'One-on-one sessions', icon: '🏋️' }, { name: 'Group Classes', price: '1,500', desc: 'Yoga, HIIT, strength', icon: '🤸' }, { name: 'Membership', price: '5,000', desc: 'Monthly unlimited access', icon: '💳' }, { name: 'Nutrition', price: '2,000', desc: 'Diet planning', icon: '🥗' }] },
  clinic: { tagline: 'Caring for Your Health', hours: 'Mon–Fri: 8AM–6PM | Sat: 9AM–2PM', about: 'Comprehensive healthcare with experienced doctors.', primaryColor: '#be185d', accentColor: '#db2777', showBooking: true, services: [{ name: 'Consultation', price: '1,500', desc: 'General health check', icon: '👨‍⚕️' }, { name: 'Specialist', price: '3,000', desc: 'Specialist consultation', icon: '🩺' }, { name: 'Lab Tests', price: '2,000', desc: 'Diagnostics', icon: '🧪' }, { name: 'Vaccines', price: '1,000', desc: 'Routine vaccinations', icon: '💉' }] },
  cleaning: { tagline: 'Sparkling Clean Spaces', hours: 'Mon–Sat: 7AM–7PM', about: 'Professional cleaning for homes and offices.', primaryColor: '#0d9488', accentColor: '#14b8a6', showBooking: false, services: [{ name: 'House Cleaning', price: '3,000', desc: 'Home deep cleaning', icon: '🧹' }, { name: 'Office Cleaning', price: '2,500', desc: 'Regular office care', icon: '🏢' }, { name: 'Carpet Cleaning', price: '1,500', desc: 'Deep carpet cleaning', icon: '🧽' }, { name: 'Windows', price: '1,000', desc: 'Streak-free cleaning', icon: '🪟' }] },
  photography: { tagline: 'Capturing Your Moments', hours: 'Mon–Sat: 9AM–6PM', about: 'Professional photography for all occasions.', primaryColor: '#7c2d12', accentColor: '#ea580c', showBooking: true, services: [{ name: 'Portrait', price: '5,000', desc: 'Professional headshots', icon: '📸' }, { name: 'Events', price: '10,000', desc: 'Wedding & event coverage', icon: '🎉' }, { name: 'Products', price: '3,000', desc: 'Commercial shoots', icon: '📦' }, { name: 'Editing', price: '1,000', desc: 'Post-production', icon: '🖼️' }] },
  hardware: { tagline: 'Your Home Improvement Store', hours: 'Mon–Sat: 8AM–7PM', about: 'Complete hardware with tools and expert advice.', primaryColor: '#374151', accentColor: '#6b7280', showBooking: false, services: [{ name: 'Tool Rental', price: '500', desc: 'Power tools rental', icon: '🔨' }, { name: 'Consultation', price: 'Free', desc: 'Expert project advice', icon: '🛠️' }, { name: 'Delivery', price: '1,000', desc: 'Home delivery', icon: '🚚' }, { name: 'Installation', price: '2,000', desc: 'Professional help', icon: '⚙️' }] },
  other: { tagline: 'Quality Service You Can Trust', hours: 'Mon–Fri: 8AM–6PM', about: 'Professional services delivered with excellence.', primaryColor: '#0ea5e9', accentColor: '#06b6d4', showBooking: false, services: [{ name: 'Consultation', price: 'Free', desc: 'Initial assessment', icon: '💬' }, { name: 'Standard Service', price: 'Contact', desc: 'Core service delivery', icon: '⭐' }, { name: 'Premium Package', price: 'Contact', desc: 'Full-service offering', icon: '🏆' }, { name: 'Support', price: 'Included', desc: 'Ongoing support', icon: '🛠️' }] },
}

const GENERIC_REVIEWS = [
  { name: 'Happy Customer', rating: 5, text: 'Excellent service! Highly recommend.' },
  { name: 'Satisfied Client', rating: 5, text: 'Professional and reliable. Will use again.' },
  { name: 'Loyal Patron', rating: 5, text: 'Great experience from start to finish.' },
]
const GENERIC_FAQS = [
  { q: 'Do I need to book in advance?', a: 'We recommend booking at least 24 hours ahead.' },
  { q: 'What payment methods do you accept?', a: 'M-Pesa, cash, and major cards.' },
  { q: 'How long do services take?', a: "Duration varies — we'll give you an estimate when booking." },
  { q: 'Do you offer packages?', a: 'Yes, contact us for custom packages and promotions.' },
]

function buildBusinessFromLead(lead) {
  const cat = lead.category || 'other'
  const defaults = CATEGORY_DEFAULTS[cat] || CATEGORY_DEFAULTS.other
  return {
    name: lead.name,
    tagline: lead.tagline || defaults.tagline,
    category: cat,
    phone: lead.phone || '',
    whatsapp: lead.whatsapp || lead.phone || '',
    email: lead.email || '',
    address: lead.address || '',
    mapSearch: lead.mapSearch || `${lead.name} ${lead.address}`,
    hours: lead.hours || defaults.hours,
    about: lead.about || defaults.about,
    primaryColor: defaults.primaryColor,
    accentColor: defaults.accentColor,
    showBooking: defaults.showBooking,
    services: lead.services || defaults.services,
    reviews: lead.reviews?.length ? lead.reviews : GENERIC_REVIEWS,
    faqs: GENERIC_FAQS,
    galleryImages: [],
    socialImages: [],
    facebookUrl: lead.facebookUrl || '',
    instagramUrl: lead.instagramUrl || '',
  }
}

function buildOutreachMessage(lead) {
  const url = lead.shortUrl || lead.demoUrl || '[URL pending]'
  const openers = {
    salon: "imagine a potential client searching *\"best salon near me\"* tonight — your site comes up, they see your work, read 5-star reviews, and book a slot. All while you sleep.",
    restaurant: "imagine someone hungry nearby searching for a restaurant — they land on your page, see the menu, read reviews, and call to reserve. Done.",
    clinic: "patients today search before they visit. A professional site with your services and booking builds trust before they walk through your door.",
    gym: "fitness clients want to see the vibe before they commit. Your demo shows classes, pricing, and reviews — closes them before the first call.",
    hardware: "contractors and homeowners search for suppliers online. Your site puts your stock, location, and contact front and centre.",
  }
  const opener = openers[lead.category] || "customers today search online before they visit anywhere. A professional site means they find you, trust you, and reach out — before your competitor."
  return `Hi! 👋

I built a *free demo website* for *${lead.name}* — check it out:
👉 ${url}

Here's the thing: ${opener}

Your demo already includes:
📅 *Online Booking* — customers book 24/7, no missed calls
⭐ *Customer Reviews* — show your best reviews upfront
📢 *Broadcast Messaging* — send promos to your whole customer list
🎁 *Loyalty & Referrals* — turn one customer into five automatically
🗺️ *Google Maps* — customers find you and get directions instantly
📊 *Business Dashboard* — track revenue, bookings & engagement

This is what growing businesses in Nairobi are using right now.
I can have your real site live in *24 hours*.

Interested? Just reply *YES* 🚀`
}

const S = {
  card: { background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: 20, marginBottom: 16 },
  btn: { padding: '8px 16px', background: '#0ea5e9', color: '#020617', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },
  btnPurple: { padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },
  btnGreen: { padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },
  btnRed: { padding: '8px 16px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },
  inp: { padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, fontFamily: 'inherit' },
}

export default function LeadManager({ onBack }) {
  const [tab, setTab] = useState('leads')
  const [leads, setLeads] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [building, setBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  // CRM state
  const [crmLeads, setCrmLeads] = useState([])
  const [crmSearch, setCrmSearch] = useState('')
  const [deletingInactive, setDeletingInactive] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('demobuilder_leads')
    if (saved) setLeads(JSON.parse(saved))
  }, [])

  // Reload leads when switching to CRM tab so it's always fresh
  useEffect(() => {
    if (tab === 'crm') {
      const saved = localStorage.getItem('demobuilder_leads')
      const all = saved ? JSON.parse(saved) : []
      setCrmLeads(all.filter(l => l.status === 'built' && (l.shortUrl || l.demoUrl)))
    }
  }, [tab])

  const save = (updated) => { setLeads(updated); localStorage.setItem('demobuilder_leads', JSON.stringify(updated)) }

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || l.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    built: leads.filter(l => l.status === 'built').length,
    sent: leads.filter(l => l.status === 'sent').length,
    dead: leads.filter(l => l.status === 'dead').length,
  }

  const toggleSelect = (id) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s) }
  const toggleAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(l => l.id)))

  const deleteLead = (id) => { if (!confirm('Delete this lead?')) return; save(leads.filter(l => l.id !== id)) }
  const updateLead = (id, updates) => save(leads.map(l => l.id === id ? { ...l, ...updates } : l))

  // ── Bulk Build ────────────────────────────────────────────────────────────
  const handleBulkBuild = async () => {
    const toBuild = leads.filter(l => selected.has(l.id) && l.status !== 'built')
    if (!toBuild.length) { alert('Select some new leads first'); return }
    setBuilding(true)
    setBuildProgress({ current: 0, total: toBuild.length })

    const updated = [...leads]
    for (let i = 0; i < toBuild.length; i++) {
      const lead = toBuild[i]
      try {
        const biz = buildBusinessFromLead(lead)
        const fullUrl = buildShareableURL(biz)
        const shortUrl = await shortenURL(fullUrl)

        // Save to Supabase if available
        try {
          if (supabase) {
            await supabase.from('demo_sites').insert({
              business_name: lead.name,
              phone: lead.phone || lead.whatsapp || '',
              category: lead.category || '',
              full_url: fullUrl,
              short_url: shortUrl || '',
              status: 'active',
            })
          }
        } catch { /* supabase optional */ }

        const idx = updated.findIndex(l => l.id === lead.id)
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], status: 'built', demoUrl: fullUrl, shortUrl: shortUrl || '', builtAt: new Date().toISOString() }
        }
      } catch (e) {
        console.error('Build failed for', lead.name, e)
      }
      setBuildProgress({ current: i + 1, total: toBuild.length })
      if (i < toBuild.length - 1) await new Promise(r => setTimeout(r, 400))
    }

    save(updated)
    setSelected(new Set())
    setBuilding(false)
    setBuildProgress(null)
  }

  // ── Delete inactive sites ─────────────────────────────────────────────────
  const handleDeleteInactive = async () => {
    if (!confirm('Delete all dead/inactive leads and their sites?')) return
    setDeletingInactive(true)
    const toKeep = leads.filter(l => l.status !== 'dead')
    // Also remove from Supabase
    const deadNames = leads.filter(l => l.status === 'dead').map(l => l.name)
    try {
      if (supabase && deadNames.length) {
        for (const name of deadNames) {
          await supabase.from('demo_sites').update({ status: 'inactive' }).eq('business_name', name)
        }
      }
    } catch { /* ok */ }
    save(toKeep)
    setDeletingInactive(false)
  }

  const statusColor = { new: '#334155', built: '#14532d', sent: '#713f12', dead: '#450a0a', assigned: '#1e3a8a' }
  const statusText = { new: '#cbd5e1', built: '#4ade80', sent: '#fbbf24', dead: '#fca5a5', assigned: '#93c5fd' }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', fontSize: 22, padding: 0 }}>←</button>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Leads & CRM</h1>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Select leads → bulk build sites → copy outreach messages from CRM</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[['leads', `📋 Leads (${leads.length})`], ['crm', `💬 CRM (${leads.filter(l => l.status === 'built' && (l.shortUrl || l.demoUrl)).length} ready)`]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: '10px 22px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', background: tab === id ? (id === 'crm' ? '#7c3aed' : '#0ea5e9') : '#1e293b', color: tab === id ? '#fff' : '#94a3b8' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ═══ LEADS TAB ═══════════════════════════════════════════════════ */}
        {tab === 'leads' && (
          <>
            {/* Status filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {Object.entries(counts).map(([s, c]) => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '6px 16px', borderRadius: 20, border: filterStatus === s ? 'none' : '1px solid #334155', background: filterStatus === s ? '#0ea5e9' : '#1e293b', color: filterStatus === s ? '#020617' : '#cbd5e1', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                  {s} ({c})
                </button>
              ))}
            </div>

            {/* Search + actions bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..." style={{ ...S.inp, flex: 1, minWidth: 180 }} />
              <button onClick={toggleAll} style={{ ...S.btn, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
                {selected.size === filtered.length && filtered.length > 0 ? '☑ Deselect All' : '☐ Select All'}
              </button>
              {selected.size > 0 && (
                <>
                  <button onClick={handleBulkBuild} disabled={building} style={{ ...S.btnPurple, opacity: building ? 0.6 : 1 }}>
                    {building ? `⏳ Building ${buildProgress?.current}/${buildProgress?.total}...` : `⚡ Build ${selected.size} Site${selected.size > 1 ? 's' : ''}`}
                  </button>
                  <button onClick={() => { if (confirm(`Mark ${selected.size} as dead?`)) { save(leads.map(l => selected.has(l.id) ? { ...l, status: 'dead' } : l)); setSelected(new Set()) } }} style={S.btnRed}>
                    🗑 Mark Dead
                  </button>
                </>
              )}
              <button onClick={handleDeleteInactive} disabled={deletingInactive} style={{ ...S.btnRed, background: '#7f1d1d', marginLeft: 'auto' }}>
                {deletingInactive ? 'Deleting...' : '🗑 Delete All Dead'}
              </button>
            </div>

            {/* Leads list */}
            {filtered.length === 0 ? (
              <div style={{ ...S.card, textAlign: 'center', padding: 40, color: '#64748b' }}>
                {leads.length === 0 ? (
                  <div>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No leads yet</div>
                    <div style={{ fontSize: 13 }}>Go to Builder → search Google Maps → select businesses → Add to Leads</div>
                  </div>
                ) : 'No leads match this filter.'}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {filtered.map(lead => (
                  <div key={lead.id} style={{ background: '#0f172a', border: `1px solid ${selected.has(lead.id) ? '#0ea5e9' : '#1e293b'}`, borderRadius: 10, padding: '14px 16px', transition: 'border-color 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      {/* Checkbox */}
                      <div onClick={() => toggleSelect(lead.id)} style={{ width: 22, height: 22, borderRadius: 5, border: `2px solid ${selected.has(lead.id) ? '#0ea5e9' : '#334155'}`, background: selected.has(lead.id) ? '#0ea5e9' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        {selected.has(lead.id) && <span style={{ color: '#fff', fontSize: 14 }}>✓</span>}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15 }}>{lead.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{lead.category} · {lead.phone || lead.whatsapp || 'no phone'} · {lead.address?.split(',')[0] || ''}</div>
                        {lead.shortUrl && <div style={{ fontSize: 11, color: '#4ade80', marginTop: 3, fontFamily: 'monospace' }}>{lead.shortUrl}</div>}
                      </div>

                      {/* Status badge */}
                      <div style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: statusColor[lead.status] || '#334155', color: statusText[lead.status] || '#cbd5e1', textTransform: 'capitalize' }}>
                        {lead.status}
                      </div>

                      {/* Status change */}
                      <select value={lead.status} onChange={e => updateLead(lead.id, { status: e.target.value })} style={{ ...S.inp, fontSize: 12 }}>
                        {['new', 'built', 'sent', 'dead'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>

                      {/* Actions */}
                      {lead.status === 'built' && (lead.shortUrl || lead.demoUrl) && (
                        <button onClick={() => setTab('crm')} style={{ ...S.btnPurple, fontSize: 12, padding: '5px 12px' }}>💬 CRM →</button>
                      )}
                      <button onClick={() => deleteLead(lead.id)} style={{ ...S.btnRed, fontSize: 12, padding: '5px 10px' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══ CRM TAB ════════════════════════════════════════════════════ */}
        {tab === 'crm' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <input value={crmSearch} onChange={e => setCrmSearch(e.target.value)} placeholder="Search CRM..." style={{ ...S.inp, width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontSize: 14 }} />
            </div>

            {crmLeads.filter(l => l.name.toLowerCase().includes(crmSearch.toLowerCase())).length === 0 ? (
              <div style={{ ...S.card, textAlign: 'center', padding: 40, color: '#64748b' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No sites built yet</div>
                <div style={{ fontSize: 13 }}>Go to Leads tab → select leads → click Build Sites. Once built they appear here with their outreach message ready to send.</div>
                <button onClick={() => setTab('leads')} style={{ ...S.btn, marginTop: 16 }}>← Back to Leads</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 14 }}>
                {crmLeads
                  .filter(l => l.name.toLowerCase().includes(crmSearch.toLowerCase()))
                  .map(lead => {
                    const url = lead.shortUrl || lead.demoUrl
                    const waNumber = (lead.whatsapp || lead.phone || '').replace(/\D/g, '')
                    const message = buildOutreachMessage(lead)
                    const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}` : null
                    const isExpanded = expandedId === lead.id
                    const isCopied = copiedId === lead.id

                    return (
                      <div key={lead.id} style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 12, overflow: 'hidden' }}>
                        {/* Header row */}
                        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 160 }}>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#f1f5f9' }}>{lead.name}</div>
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{lead.category} · {lead.phone || lead.whatsapp || 'no phone'}</div>
                          </div>

                          {/* Short URL */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, color: '#4ade80', fontFamily: 'monospace', background: '#052e16', padding: '4px 10px', borderRadius: 6 }}>{url}</span>
                            <button onClick={() => { navigator.clipboard.writeText(url); setCopiedId(lead.id + '_url'); setTimeout(() => setCopiedId(null), 2000) }} style={{ ...S.btn, fontSize: 11, padding: '4px 10px' }}>
                              {copiedId === lead.id + '_url' ? '✅' : '📋 URL'}
                            </button>
                          </div>

                          {/* Status */}
                          <select value={lead.status} onChange={e => { updateLead(lead.id, { status: e.target.value }); setCrmLeads(crmLeads.map(l => l.id === lead.id ? { ...l, status: e.target.value } : l)) }} style={{ ...S.inp, fontSize: 12 }}>
                            {['built', 'sent', 'dead'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>

                          {/* Action buttons */}
                          <button onClick={() => { navigator.clipboard.writeText(message); setCopiedId(lead.id); setTimeout(() => setCopiedId(null), 3000) }} style={{ ...S.btnGreen, fontSize: 12, padding: '6px 14px' }}>
                            {isCopied ? '✅ Copied!' : '📋 Copy Message'}
                          </button>

                          {waLink && (
                            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ ...S.btn, background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff', textDecoration: 'none', fontSize: 12, padding: '6px 14px' }}>
                              💬 Open WhatsApp
                            </a>
                          )}

                          <button onClick={() => setExpandedId(isExpanded ? null : lead.id)} style={{ ...S.inp, cursor: 'pointer', fontSize: 12, padding: '6px 12px', color: '#94a3b8' }}>
                            {isExpanded ? '▲ Hide' : '▼ Preview'}
                          </button>
                        </div>

                        {/* Expanded message preview */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid #1e3a5f', padding: '16px 20px', background: '#080f1a' }}>
                            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>WhatsApp outreach message preview</div>
                            <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: 13, color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{message}</pre>
                            <button onClick={() => { navigator.clipboard.writeText(message); setCopiedId(lead.id); setTimeout(() => setCopiedId(null), 3000) }} style={{ ...S.btnGreen, marginTop: 14, fontSize: 13 }}>
                              {isCopied ? '✅ Copied to clipboard!' : '📋 Copy Full Message'}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
