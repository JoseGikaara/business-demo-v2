// src/types/database.js

/**
 * @typedef {Object} User
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} created_at - ISO timestamp
 */

/**
 * @typedef {Object} Business
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} category
 * @property {string|null} phone
 * @property {string|null} whatsapp
 * @property {string|null} email
 * @property {string|null} address
 * @property {string|null} hours
 * @property {string|null} about
 * @property {string|null} tagline
 * @property {string|null} map_search
 * @property {string|null} map_url
 * @property {string} primary_color
 * @property {string} accent_color
 * @property {Array<Service>} services
 * @property {Array<Review>} reviews
 * @property {Array<FAQ>} faqs
 * @property {Array<string>} gallery_images
 * @property {Array<string>} social_images
 * @property {boolean} show_booking
 * @property {string|null} facebook_url
 * @property {string|null} instagram_url
 * @property {string} created_at - ISO timestamp
 */

/**
 * @typedef {Object} Service
 * @property {string} name
 * @property {string} price
 * @property {string} desc
 * @property {string} icon
 */

/**
 * @typedef {Object} Review
 * @property {string} name
 * @property {number} rating
 * @property {string} text
 */

/**
 * @typedef {Object} FAQ
 * @property {string} q
 * @property {string} a
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - UUID
 * @property {string} business_name
 * @property {string|null} phone
 * @property {string|null} whatsapp
 * @property {string|null} category
 * @property {string|null} address
 * @property {string|null} facebook_url
 * @property {string|null} instagram_url
 * @property {string} status
 * @property {string|null} assigned_to
 * @property {string|null} demo_url
 * @property {string|null} short_url
 * @property {string|null} notes
 * @property {string} created_at - ISO timestamp
 * @property {string|null} built_at - ISO timestamp
 */

/**
 * @typedef {Object} GeneratedSite
 * @property {string} id - UUID
 * @property {string} business_id - UUID reference
 * @property {string} slug
 * @property {string} full_url
 * @property {string} status
 * @property {string} created_at - ISO timestamp
 */

/**
 * @typedef {Object} ActivityLog
 * @property {string} id - UUID
 * @property {string|null} user_id - UUID reference
 * @property {string} action
 * @property {Object} details - JSON object
 * @property {string} created_at - ISO timestamp
 */