// src/utils/shortLinks.js
import { supabase } from './supabase'

export async function createShortLink(fullUrl, businessId) {
  const slug = Math.random().toString(36).slice(2, 7); // e.g. "k3x9p"
  const { data, error } = await supabase
    .from('demo_sites')
    .insert({ id: businessId, slug, full_url: fullUrl, status: 'active', created_at: new Date().toISOString() })
    .select().single();

  if (error) throw error;
  return `https://yourdomain.com/d/${data.slug}`;
}

export async function getFullUrl(slug) {
  const { data, error } = await supabase
    .from('demo_sites')
    .select('full_url')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error) throw error;
  return data.full_url;
}