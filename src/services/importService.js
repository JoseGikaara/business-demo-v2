// src/services/importService.js
import { supabase } from '../lib/supabase'
import { searchBusinesses, getPlaceDetails, mapPlaceToBusinessData } from './googlePlaces'
import { insertBusiness, fetchBusinesses } from './database'

/**
 * Check if a business already exists by phone or place_id
 * @param {string} phone
 * @param {string} placeId
 * @returns {Promise<boolean>}
 */
export async function checkDuplicate(phone, placeId) {
  if (!phone && !placeId) return false

  const { data, error } = await supabase
    .from('businesses')
    .select('id')
    .or(`phone.eq.${phone},place_id.eq.${placeId}`)
    .limit(1)

  if (error) throw error
  return data.length > 0
}

/**
 * Detect if a business has a website
 * @param {Object} businessData
 * @returns {boolean}
 */
export function hasWebsite(businessData) {
  return !!(businessData.website && businessData.website.trim())
}

/**
 * Import a single business from Google Places
 * @param {string} query - Search query
 * @param {Object} options
 * @param {boolean} options.force - Skip duplicate check
 * @param {boolean} options.flagNoWebsite - Add flag for businesses without websites
 * @returns {Promise<Object>} Import result
 */
export async function importBusinessFromPlaces(query, options = {}) {
  try {
    // Search for businesses
    const searchResults = await searchBusinesses(query)

    if (searchResults.length === 0) {
      return { success: false, error: 'No businesses found for query: ' + query }
    }

    const place = searchResults[0] // Take the first result

    // Check for duplicates
    if (!options.force) {
      const isDuplicate = await checkDuplicate(place.formatted_phone_number, place.place_id)
      if (isDuplicate) {
        return { success: false, error: 'Business already exists', duplicate: true }
      }
    }

    // Get detailed place information
    const placeDetails = await getPlaceDetails(place.place_id)

    // Map to our business format
    const businessData = mapPlaceToBusinessData(placeDetails)

    // Add place_id for duplicate checking
    businessData.place_id = place.place_id

    // Flag if no website
    if (options.flagNoWebsite && !hasWebsite(businessData)) {
      businessData.needs_website = true
    }

    // Insert into database
    const insertedBusiness = await insertBusiness(businessData)

    return {
      success: true,
      business: insertedBusiness,
      hasWebsite: hasWebsite(businessData)
    }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Import multiple businesses from queries
 * @param {string[]} queries - Array of search queries
 * @param {Object} options
 * @param {boolean} options.force - Skip duplicate check
 * @param {boolean} options.flagNoWebsite - Flag businesses without websites
 * @param {Function} options.onProgress - Progress callback
 * @returns {Promise<Object>} Import results
 */
export async function importMultipleBusinesses(queries, options = {}) {
  const results = {
    total: queries.length,
    successful: 0,
    failed: 0,
    duplicates: 0,
    noWebsite: 0,
    errors: [],
    businesses: []
  }

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i]

    if (options.onProgress) {
      options.onProgress(i + 1, queries.length)
    }

    const result = await importBusinessFromPlaces(query, options)

    if (result.success) {
      results.successful++
      results.businesses.push(result.business)
      if (!result.hasWebsite) results.noWebsite++
    } else {
      results.failed++
      if (result.duplicate) results.duplicates++
      results.errors.push({ query, error: result.error })
    }

    // Small delay to avoid rate limiting
    if (i < queries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  return results
}

/**
 * Import businesses from CSV data
 * @param {Array<Object>} csvData - Parsed CSV data
 * @param {Object} options
 * @param {boolean} options.force - Skip duplicate check
 * @param {boolean} options.flagNoWebsite - Flag businesses without websites
 * @param {Function} options.onProgress - Progress callback
 * @returns {Promise<Object>} Import results
 */
export async function importFromCSV(csvData, options = {}) {
  const results = {
    total: csvData.length,
    successful: 0,
    failed: 0,
    duplicates: 0,
    noWebsite: 0,
    errors: [],
    businesses: []
  }

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i]

    if (options.onProgress) {
      options.onProgress(i + 1, csvData.length)
    }

    try {
      // Check for duplicates if we have phone or place_id
      if (!options.force && (row.phone || row.place_id)) {
        const isDuplicate = await checkDuplicate(row.phone, row.place_id)
        if (isDuplicate) {
          results.duplicates++
          results.errors.push({ row: i + 1, error: 'Business already exists' })
          continue
        }
      }

      // Prepare business data
      const businessData = {
        name: row.name || '',
        category: row.category || 'other',
        phone: row.phone || null,
        whatsapp: row.whatsapp || null,
        email: row.email || null,
        address: row.address || null,
        hours: row.hours || null,
        about: row.about || null,
        tagline: row.tagline || null,
        map_search: row.map_search || null,
        map_url: row.map_url || null,
        primary_color: row.primary_color || '#0ea5e9',
        accent_color: row.accent_color || '#06b6d4',
        services: row.services ? JSON.parse(row.services) : [],
        reviews: row.reviews ? JSON.parse(row.reviews) : [],
        faqs: row.faqs ? JSON.parse(row.faqs) : [],
        gallery_images: row.gallery_images ? JSON.parse(row.gallery_images) : [],
        social_images: row.social_images ? JSON.parse(row.social_images) : [],
        show_booking: row.show_booking !== 'false',
        facebook_url: row.facebook_url || null,
        instagram_url: row.instagram_url || null,
        place_id: row.place_id || null,
        needs_website: options.flagNoWebsite && !row.website
      }

      // Insert business
      const insertedBusiness = await insertBusiness(businessData)

      results.successful++
      results.businesses.push(insertedBusiness)
      if (!hasWebsite(businessData)) results.noWebsite++

    } catch (error) {
      results.failed++
      results.errors.push({ row: i + 1, error: error.message })
    }
  }

  return results
}

/**
 * Get import statistics
 * @returns {Promise<Object>}
 */
export async function getImportStats() {
  try {
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, needs_website, created_at')

    if (error) throw error

    const total = businesses.length
    const needsWebsite = businesses.filter(b => b.needs_website).length
    const recent = businesses.filter(b => {
      const created = new Date(b.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return created > weekAgo
    }).length

    return {
      total,
      needsWebsite,
      recent,
      withWebsite: total - needsWebsite
    }
  } catch (error) {
    throw error
  }
}