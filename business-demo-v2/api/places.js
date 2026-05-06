// api/places.js — Vercel serverless function
// Proxies Google Places API so the key stays server-side and CORS is handled

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { endpoint, ...params } = req.query

  const ALLOWED_ENDPOINTS = ['textsearch', 'details', 'findplacefromtext']
  if (!endpoint || !ALLOWED_ENDPOINTS.includes(endpoint)) {
    return res.status(400).json({ error: 'Invalid endpoint' })
  }

  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) {
    return res.status(500).json({ error: 'Google Places key not configured' })
  }

  const qs = new URLSearchParams({ ...params, key }).toString()
  const url = `https://maps.googleapis.com/maps/api/place/${endpoint}/json?${qs}`

  try {
    const upstream = await fetch(url)
    const data = await upstream.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Upstream request failed', detail: err.message })
  }
}
