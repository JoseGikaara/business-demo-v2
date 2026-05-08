// src/lib/demoSites.js
// Demo site persistence via Supabase, plus static page generation and deployment records.

import { supabase } from './supabase'

const DEFAULT_DEPLOYMENT_DOMAIN = import.meta.env.VITE_DEPLOYMENT_BASE_DOMAIN || 'mydomain.com'

export function generateSubdomainFromName(name) {
  const base = String(name || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40)

  return base || `demo-${Math.random().toString(36).slice(2, 8)}`
}

export function getDeploymentUrl(subdomain, baseDomain = DEFAULT_DEPLOYMENT_DOMAIN) {
  if (!subdomain) return ''
  return `https://${subdomain}.${baseDomain}`
}

export function buildStaticSiteHtml(business, subdomain, baseDomain = DEFAULT_DEPLOYMENT_DOMAIN) {
  const escape = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  const title = escape(business.name || 'Business Demo')
  const tagline = escape(business.tagline || '')
  const about = escape(business.about || '')
  const phone = escape(business.phone || '')
  const whatsapp = escape(business.whatsapp || '')
  const email = escape(business.email || '')
  const address = escape(business.address || '')
  const hours = escape(business.hours || '')
  const primaryColor = escape(business.primaryColor || '#0ea5e9')
  const accentColor = escape(business.accentColor || '#06b6d4')
  const subdomainUrl = getDeploymentUrl(subdomain, baseDomain)

  const servicesHtml = (business.services || []).map(service => `
          <li class="service-item">
            <span class="service-name">${escape(service.name)}</span>
            <span class="service-price">KES ${escape(service.price || '')}</span>
            <p class="service-desc">${escape(service.desc || '')}</p>
          </li>
        `).join('')

  const faqsHtml = (business.faqs || []).map(faq => `
          <div class="faq-item">
            <strong>${escape(faq.q)}</strong>
            <p>${escape(faq.a)}</p>
          </div>
        `).join('')

  const galleryHtml = (business.galleryImages || []).filter(Boolean).map(url => `
          <img src="${escape(url)}" alt="Gallery image" />
        `).join('')

  const socialHtml = [
    business.facebookUrl && `<a href="${escape(business.facebookUrl)}" target="_blank">Facebook</a>`,
    business.instagramUrl && `<a href="${escape(business.instagramUrl)}" target="_blank">Instagram</a>`,
  ].filter(Boolean).join(' · ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    :root { --primary: ${primaryColor}; --accent: ${accentColor}; --bg: #020617; --surface: #0f172a; --muted: #94a3b8; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background: var(--bg); color: #f8fafc; }
    .page { max-width: 1080px; margin: 0 auto; padding: 32px; }
    .hero { display: grid; gap: 24px; padding: 40px 0; }
    .hero h1 { margin: 0; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.05; }
    .hero p { margin: 0; font-size: 1.05rem; color: var(--muted); max-width: 720px; }
    .btn { display: inline-flex; align-items: center; gap: 12px; background: var(--primary); color: #fff; padding: 14px 22px; border-radius: 999px; text-decoration: none; font-weight: 700; }
    .section { margin-top: 60px; }
    .section h2 { margin-bottom: 18px; font-size: 1.75rem; }
    .cards { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); }
    .card, .service-item, .faq-item { background: #0f172a; border-radius: 24px; padding: 24px; }
    .service-item { list-style: none; }
    .service-name { display: block; font-weight: 700; margin-bottom: 10px; }
    .service-price { color: var(--primary); font-weight: 700; }
    .service-desc { color: var(--muted); margin: 10px 0 0; }
    .gallery { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); }
    .gallery img { width: 100%; border-radius: 18px; object-fit: cover; }
    .footer { margin-top: 60px; padding-top: 32px; border-top: 1px solid rgba(148, 196, 255, 0.12); color: var(--muted); }
    a { color: var(--primary); }
  </style>
</head>
<body>
  <div class="page">
    <header class="hero">
      <div>
        <p style="text-transform: uppercase; letter-spacing: .24em; margin: 0; color: var(--primary);">${address}</p>
        <h1>${title}</h1>
        <p>${tagline}</p>
        <a class="btn" href="https://wa.me/${whatsapp.replace(/\D/g, '')}" target="_blank">Chat on WhatsApp</a>
      </div>
      <div style="background: linear-gradient(180deg, rgba(14,165,233,.12), transparent), #071023; border-radius: 32px; padding: 28px;">
        <p style="margin: 0 0 10px 0; color: var(--muted);">Contact</p>
        <p style="margin: 0; font-size: 1.05rem; font-weight: 600;">${phone}</p>
        <p style="margin: 8px 0 0 0; color: var(--muted);">${email}</p>
        <p style="margin: 8px 0 0 0; color: var(--muted);">${hours}</p>
      </div>
    </header>

    <section class="section">
      <h2>About Us</h2>
      <div class="card"><p>${about}</p></div>
    </section>

    ${servicesHtml ? `
    <section class="section">
      <h2>Services</h2>
      <div class="cards">${servicesHtml}</div>
    </section>
    ` : ''}

    ${faqsHtml ? `
    <section class="section">
      <h2>FAQs</h2>
      <div class="card">${faqsHtml}</div>
    </section>
    ` : ''}

    ${galleryHtml ? `
    <section class="section">
      <h2>Gallery</h2>
      <div class="gallery">${galleryHtml}</div>
    </section>
    ` : ''}

    <footer class="footer">
      <p>Live demo site: <a href="${subdomainUrl}" target="_blank">${subdomainUrl}</a></p>
      <p>${socialHtml || ''}</p>
    </footer>
  </div>
</body>
</html>`
}

export async function ensureUniqueSubdomain(base) {
  if (!supabase) return `${base}-${Math.floor(Math.random() * 9999)}`
  let candidate = base
  let count = 0

  while (count < 10) {
    const { data, error } = await supabase
      .from('demo_sites')
      .select('id')
      .eq('subdomain', candidate)
      .limit(1)
      .maybeSingle()

    if (error) break
    if (!data) return candidate

    candidate = `${base}-${Math.floor(Math.random() * 900 + 100)}`
    count += 1
  }

  return `${base}-${Math.floor(Math.random() * 900 + 100)}`
}

export async function saveDeploymentSite({ leadId, businessName, fullUrl }) {
  if (!supabase) return { error: 'Supabase not configured', data: null }

  // generate a unique slug from business name
  const base = String(businessName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'demo'
  const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`

  const { data, error } = await supabase
    .from('generated_sites')
    .insert({ slug, full_url: fullUrl, status: 'active' })
    .select()
    .single()

  return { data, error }
}

export async function loadDeploymentByBusinessName(businessName) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }

  const { data, error } = await supabase
    .from('demo_sites')
    .select('*')
    .ilike('business_name', businessName)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { data, error }
}

export async function loadDemoSites({ status } = {}) {
  if (!supabase) return { data: [], error: null }

  let query = supabase
    .from('demo_sites')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('deployment_status', status)

  const { data, error } = await query
  return { data: data || [], error }
}

export async function updateSiteStatus(id, status) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase
    .from('demo_sites')
    .update({ deployment_status: status })
    .eq('id', id)
  return { error }
}

export async function deleteSite(id) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase
    .from('demo_sites')
    .delete()
    .eq('id', id)
  return { error }
}

export async function bulkDeleteInactive({ olderThanDays = 30 } = {}) {
  if (!supabase) return { error: 'Supabase not configured', count: 0 }

  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('demo_sites')
    .delete()
    .eq('status', 'inactive')
    .lt('created_at', cutoff)
    .select()

  return { error, count: data?.length || 0 }
}

export async function updateShortUrl(id, shortUrl) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase
    .from('demo_sites')
    .update({ short_url: shortUrl })
    .eq('id', id)
  return { error }
}

function generateSlug(length = 6) {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
