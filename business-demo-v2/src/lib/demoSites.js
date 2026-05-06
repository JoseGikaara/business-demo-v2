// src/lib/demoSites.js
// All demo site persistence via Supabase. Falls back gracefully if Supabase not configured.

import { supabase } from './supabase'

// ─── Save a new demo site ────────────────────────────────────────────────────
export async function saveDemoSite({ leadId, businessName, phone, category, fullUrl, shortUrl }) {
  if (!supabase) return { error: 'Supabase not configured', data: null }

  const slug = generateSlug()
  const { data, error } = await supabase
    .from('demo_sites')
    .insert({
      lead_id: leadId || null,
      business_name: businessName,
      phone: phone || '',
      category: category || '',
      full_url: fullUrl,
      short_url: shortUrl || '',
      slug,
      status: 'active',
    })
    .select()
    .single()

  return { data, error }
}

// ─── Load all demo sites ─────────────────────────────────────────────────────
export async function loadDemoSites({ status } = {}) {
  if (!supabase) return { data: [], error: null }

  let query = supabase
    .from('demo_sites')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  return { data: data || [], error }
}

// ─── Update demo site status ─────────────────────────────────────────────────
export async function updateSiteStatus(id, status) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase
    .from('demo_sites')
    .update({ status })
    .eq('id', id)
  return { error }
}

// ─── Delete a single site ─────────────────────────────────────────────────────
export async function deleteSite(id) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase
    .from('demo_sites')
    .delete()
    .eq('id', id)
  return { error }
}

// ─── Bulk delete inactive sites ───────────────────────────────────────────────
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

// ─── Update short URL on a site ───────────────────────────────────────────────
export async function updateShortUrl(id, shortUrl) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase
    .from('demo_sites')
    .update({ short_url: shortUrl })
    .eq('id', id)
  return { error }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateSlug(length = 6) {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
