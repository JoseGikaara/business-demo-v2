import { useState } from 'react'
import Navbar from './components/Navbar'
import AdminForm from './components/AdminForm'
import BulkGenerator from './components/BulkGenerator'
import DemoSite from './components/DemoSite'
import LeadManager from './components/LeadManager'
import BusinessDashboard from './components/BusinessDashboard'

function getBusinessFromURL() {
  try {
    const hash = window.location.hash.slice(1)
    const params = new URLSearchParams(hash)
    const data = params.get('d')
    if (!data) return null
    const decoded = JSON.parse(decodeURIComponent(atob(data)))
    if (!decoded.name) return null
    return decoded
  } catch { return null }
}

export function buildShareableURL(business) {
  const encoded = btoa(encodeURIComponent(JSON.stringify(business)))
  return `${window.location.origin}${window.location.pathname}#d=${encoded}`
}

const defaultBusiness = {
  name: 'Apex Salon & Spa',
  tagline: 'Where Style Meets Luxury',
  category: 'salon',
  phone: '+254 712 345 678',
  whatsapp: '254712345678',
  email: 'hello@apexsalon.co.ke',
  address: 'Westlands, Nairobi',
  mapUrl: '',
  mapSearch: 'Apex Salon Westlands Nairobi',
  hours: 'Mon–Sat: 8AM–8PM | Sun: 10AM–6PM',
  about: "Nairobi's premier destination for hair, nails, and wellness. Our expert team brings international techniques and premium products to transform your look and rejuvenate your spirit.",
  primaryColor: '#0ea5e9',
  accentColor: '#06b6d4',
  services: [
    { name: 'Hair Styling', price: '1,500', desc: 'Cut, blow-dry, and professional styling by our expert stylists', icon: '✂️' },
    { name: 'Manicure & Pedicure', price: '2,000', desc: 'Luxury nail care with premium polish and treatments', icon: '💅' },
    { name: 'Facial Treatment', price: '3,500', desc: 'Deep cleansing and rejuvenating skin therapy', icon: '✨' },
    { name: 'Massage Therapy', price: '4,000', desc: 'Full body relaxation and therapeutic massage sessions', icon: '🫧' },
  ],
  reviews: [
    { name: 'Amina K.', rating: 5, text: 'Absolutely loved my experience! The team is professional and the results are always stunning.' },
    { name: 'Brian M.', rating: 5, text: 'Best salon in Westlands. Been coming for 2 years and always leave satisfied.' },
    { name: 'Grace W.', rating: 5, text: 'The facial treatment changed my skin completely. Highly recommend!' },
  ],
  faqs: [
    { q: 'Do I need to book in advance?', a: 'We recommend booking at least 24 hours in advance to secure your preferred slot, though walk-ins are always welcome based on availability.' },
    { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, cash, and all major cards. M-Pesa is our most popular payment method.' },
    { q: 'How long do sessions take?', a: 'Session lengths vary by service — haircuts take about 45 minutes, facials about 60–90 minutes. We will give you a precise estimate when you book.' },
    { q: 'Do you offer group or bridal packages?', a: 'Yes! We have special packages for bridal parties, birthdays, and group bookings. Contact us on WhatsApp for a custom quote.' },
  ],
  galleryImages: [],
  socialImages: [],
  showBooking: true,
  facebookUrl: '',
  instagramUrl: '',
}

function SharedDemoWrapper({ business }) {
  const [sharedView, setSharedView] = useState('site')
  if (sharedView === 'dashboard') {
    return <BusinessDashboard business={business} onBack={() => setSharedView('site')} onEditSite={null} isClientView={true} />
  }
  return <DemoSite business={business} onBack={null} isSharedView={true} isDemo={true} onDashboard={() => setSharedView('dashboard')} />
}

export default function App() {
  const urlBusiness = getBusinessFromURL()
  const isDemo = window.location.hash.length > 1

  const [view, setView] = useState('admin')
  const [business, setBusiness] = useState(urlBusiness || defaultBusiness)
  const [pendingBulkLeads, setPendingBulkLeads] = useState([])

  if (isDemo && urlBusiness) {
    return <SharedDemoWrapper business={urlBusiness} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar activeView={view} onViewChange={setView} />
      <div>
        {view === 'admin' && (
          <AdminForm
            business={business}
            onChange={setBusiness}
            onPreview={() => setView('demo')}
            onBulk={() => setView('bulk')}
            onGoToLeads={() => setView('leads')}
            onSendToBulk={(leads) => { setPendingBulkLeads(leads); setView('bulk') }}
          />
        )}
        {view === 'bulk' && <BulkGenerator onBack={() => setView('admin')} initialLeads={pendingBulkLeads} onClearInitial={() => setPendingBulkLeads([])} />}
        {view === 'demo' && (
          <DemoSite business={business} onBack={() => setView('admin')} isSharedView={false} isDemo={false} onDashboard={() => setView('dashboard')} />
        )}
        {view === 'leads' && <LeadManager onBack={() => setView('admin')} />}
        {view === 'dashboard' && <BusinessDashboard business={business} onBack={() => setView('demo')} onEditSite={() => setView('admin')} />}
      </div>
    </div>
  )
}
