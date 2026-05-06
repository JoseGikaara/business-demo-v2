// src/lib/googlePlaces.js
// All calls go through /api/places (Vercel serverless proxy) to avoid CORS + hide API key

const BASE = '/api/places'

export async function searchBusinesses(query) {
  const res = await fetch(`${BASE}?endpoint=textsearch&query=${encodeURIComponent(query)}`)
  const data = await res.json()
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(data.error_message || data.status || 'Places search failed')
  }
  return data.results || []
}

export async function getPlaceDetails(placeId) {
  const fields = [
    'name',
    'formatted_phone_number',
    'international_phone_number',
    'formatted_address',
    'opening_hours',
    'website',
    'photos',
    'rating',
    'reviews',
    'geometry',
    'types',
    'url',
    'vicinity',
  ].join(',')

  const res = await fetch(`${BASE}?endpoint=details&place_id=${placeId}&fields=${fields}`)
  const data = await res.json()
  if (data.status !== 'OK') {
    throw new Error(data.error_message || data.status || 'Place details failed')
  }
  return data.result
}

// Map Google Places result → our business data shape
export function mapPlaceToBusinessData(place) {
  const phone = place.international_phone_number || place.formatted_phone_number || ''
  // Strip non-digits for whatsapp field
  const whatsapp = phone.replace(/\D/g, '')

  // Parse opening hours
  let hours = ''
  if (place.opening_hours?.weekday_text?.length) {
    // Condense to a compact string, e.g. "Mon–Fri: 8AM–6PM"
    hours = place.opening_hours.weekday_text.slice(0, 2).join(' | ')
  }

  // Map place types → our category
  const typeMap = {
    hair_care: 'salon',
    beauty_salon: 'salon',
    barber_shop: 'salon',
    restaurant: 'restaurant',
    cafe: 'restaurant',
    food: 'restaurant',
    plumber: 'plumber',
    electrician: 'electrician',
    hardware_store: 'hardware',
    doctor: 'clinic',
    pharmacy: 'clinic',
    health: 'clinic',
    gym: 'gym',
    physiotherapist: 'gym',
    store: 'hardware',
    laundry: 'cleaning',
    photographer: 'photography',
  }
  const types = place.types || []
  const category = types.map(t => typeMap[t]).find(Boolean) || 'other'

  // Get Google Maps search string from formatted_address or name
  const mapSearch = place.name && place.formatted_address
    ? `${place.name} ${place.formatted_address.split(',').slice(0, 2).join(',')}`
    : place.name || ''

  // Pull up to 3 reviews
  const reviews = (place.reviews || []).slice(0, 3).map(r => ({
    name: r.author_name,
    rating: r.rating,
    text: r.text,
  }))

  return {
    name: place.name || '',
    phone,
    whatsapp,
    address: place.formatted_address || place.vicinity || '',
    hours,
    category,
    mapSearch,
    reviews,
    website: place.website || '',
    // Leave these for the user to fill in
    tagline: '',
    about: '',
    email: '',
    facebookUrl: '',
    instagramUrl: '',
  }
}
