// api/places.js (Vercel serverless function)
export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;
  const qs = new URLSearchParams({ ...params, key: process.env.GOOGLE_PLACES_KEY }).toString();
  const data = await fetch(`https://maps.googleapis.com/maps/api/place/${endpoint}/json?${qs}`).then(r => r.json());
  res.json(data);
}