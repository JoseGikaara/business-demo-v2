// src/services/csvParser.js

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV content
 * @param {Object} options
 * @param {string} options.delimiter - CSV delimiter (default: ',')
 * @param {boolean} options.hasHeaders - Whether first row contains headers
 * @returns {Array<Object>} Parsed data
 */
export function parseCSV(csvText, options = {}) {
  const { delimiter = ',', hasHeaders = true } = options

  const lines = csvText.trim().split('\n').filter(line => line.trim())

  if (lines.length === 0) {
    throw new Error('CSV file is empty')
  }

  let headers = []
  let dataStartIndex = 0

  if (hasHeaders) {
    headers = parseCSVLine(lines[0], delimiter)
    dataStartIndex = 1
  } else {
    // Generate column names if no headers
    const firstLine = parseCSVLine(lines[0], delimiter)
    headers = firstLine.map((_, index) => `column_${index + 1}`)
  }

  const data = []

  for (let i = dataStartIndex; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter)

    if (values.length !== headers.length) {
      throw new Error(`Line ${i + 1}: Expected ${headers.length} columns, got ${values.length}`)
    }

    const row = {}
    headers.forEach((header, index) => {
      row[header.trim()] = values[index].trim()
    })

    data.push(row)
  }

  return data
}

/**
 * Parse a single CSV line handling quotes and escaped characters
 * @param {string} line - CSV line
 * @param {string} delimiter - Field delimiter
 * @returns {Array<string>} Parsed values
 */
function parseCSVLine(line, delimiter) {
  const values = []
  let current = ''
  let inQuotes = false
  let quoteChar = null

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (!inQuotes && (char === '"' || char === "'")) {
      // Start of quoted field
      inQuotes = true
      quoteChar = char
    } else if (inQuotes && char === quoteChar) {
      if (nextChar === quoteChar) {
        // Escaped quote
        current += char
        i++ // Skip next quote
      } else {
        // End of quoted field
        inQuotes = false
        quoteChar = null
      }
    } else if (!inQuotes && char === delimiter) {
      // Field separator
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  // Add the last field
  values.push(current)

  return values
}

/**
 * Validate CSV data for business import
 * @param {Array<Object>} data - Parsed CSV data
 * @returns {Object} Validation result
 */
export function validateBusinessCSV(data) {
  const errors = []
  const warnings = []

  if (data.length === 0) {
    errors.push('No data rows found')
    return { valid: false, errors, warnings }
  }

  // Check required fields
  const requiredFields = ['name']
  const optionalFields = [
    'category', 'phone', 'whatsapp', 'email', 'address', 'hours',
    'about', 'tagline', 'map_search', 'map_url', 'primary_color',
    'accent_color', 'services', 'reviews', 'faqs', 'gallery_images',
    'social_images', 'show_booking', 'facebook_url', 'instagram_url',
    'place_id', 'website'
  ]

  const allowedFields = [...requiredFields, ...optionalFields]

  data.forEach((row, index) => {
    const rowNum = index + 1

    // Check required fields
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${rowNum}: Missing required field '${field}'`)
      }
    })

    // Check for unknown fields
    Object.keys(row).forEach(field => {
      if (!allowedFields.includes(field)) {
        warnings.push(`Row ${rowNum}: Unknown field '${field}' will be ignored`)
      }
    })

    // Validate JSON fields
    const jsonFields = ['services', 'reviews', 'faqs', 'gallery_images', 'social_images']
    jsonFields.forEach(field => {
      if (row[field]) {
        try {
          JSON.parse(row[field])
        } catch (e) {
          errors.push(`Row ${rowNum}: Invalid JSON in field '${field}'`)
        }
      }
    })

    // Validate boolean field
    if (row.show_booking && !['true', 'false', '1', '0'].includes(row.show_booking.toLowerCase())) {
      warnings.push(`Row ${rowNum}: Invalid value for 'show_booking', expected true/false`)
    }

    // Validate URLs
    const urlFields = ['facebook_url', 'instagram_url', 'website']
    urlFields.forEach(field => {
      if (row[field] && row[field].trim()) {
        try {
          new URL(row[field])
        } catch (e) {
          warnings.push(`Row ${rowNum}: Invalid URL format in '${field}'`)
        }
      }
    })
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    rowCount: data.length
  }
}

/**
 * Generate CSV template for business import
 * @returns {string} CSV template
 */
export function generateBusinessCSVTemplate() {
  const headers = [
    'name',
    'category',
    'phone',
    'whatsapp',
    'email',
    'address',
    'hours',
    'about',
    'tagline',
    'map_search',
    'map_url',
    'primary_color',
    'accent_color',
    'services',
    'reviews',
    'faqs',
    'gallery_images',
    'social_images',
    'show_booking',
    'facebook_url',
    'instagram_url',
    'place_id',
    'website'
  ]

  const sampleData = [
    'Apex Salon & Spa',
    'salon',
    '+254 712 345 678',
    '254712345678',
    'hello@apexsalon.co.ke',
    'Westlands, Nairobi',
    'Mon–Sat: 8AM–8PM | Sun: 10AM–6PM',
    'Nairobi\'s premier destination for hair, nails, and wellness',
    'Where Style Meets Luxury',
    'Apex Salon Westlands Nairobi',
    '',
    '#0ea5e9',
    '#06b6d4',
    '[{"name": "Hair Styling", "price": "1,500", "desc": "Cut, blow-dry, and professional styling", "icon": "✂️"}]',
    '[{"name": "Amina K.", "rating": 5, "text": "Absolutely loved my experience!"}]',
    '[{"q": "Do I need to book in advance?", "a": "We recommend booking at least 24 hours in advance"}]',
    '["https://example.com/image1.jpg"]',
    '["https://example.com/social1.jpg"]',
    'true',
    'https://facebook.com/apexsalon',
    'https://instagram.com/apexsalon',
    '',
    'https://apexsalon.co.ke'
  ]

  return [headers.join(','), sampleData.map(field => `"${field}"`).join(',')].join('\n')
}

/**
 * Read file as text
 * @param {File} file - File object
 * @returns {Promise<string>} File content
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}