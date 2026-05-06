// src/utils/googlePlaces.js
export async function searchBusiness(query) {
  const res = await fetch(`/api/places?endpoint=textsearch&query=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getPlaceDetails(placeId) {
  const fields = 'name,formatted_phone_number,formatted_address,opening_hours,website,photos,rating,reviews,geometry';
  const res = await fetch(`/api/places?endpoint=details&place_id=${placeId}&fields=${fields}`);
  return res.json();
}