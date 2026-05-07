// src/services/database.js
import { supabase } from '../lib/supabase'

// ========== BUSINESSES ==========

/**
 * Insert a new business
 * @param {Omit<Business, 'id' | 'created_at'>} businessData
 * @returns {Promise<Business>}
 */
export async function insertBusiness(businessData) {
  const { data, error } = await supabase
    .from('businesses')
    .insert(businessData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a business
 * @param {string} id
 * @param {Partial<Business>} updates
 * @returns {Promise<Business>}
 */
export async function updateBusiness(id, updates) {
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch all businesses
 * @param {Object} options
 * @param {string} options.category - Filter by category
 * @param {string} options.search - Search in name
 * @param {number} options.limit
 * @param {number} options.offset
 * @returns {Promise<Business[]>}
 */
export async function fetchBusinesses({ category, search, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Fetch a single business by ID
 * @param {string} id
 * @returns {Promise<Business>}
 */
export async function fetchBusiness(id) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a business
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteBusiness(id) {
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ========== LEADS ==========

/**
 * Insert a new lead
 * @param {Omit<Lead, 'id' | 'created_at'>} leadData
 * @returns {Promise<Lead>}
 */
export async function insertLead(leadData) {
  const { data, error } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a lead
 * @param {string} id
 * @param {Partial<Lead>} updates
 * @returns {Promise<Lead>}
 */
export async function updateLead(id, updates) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch leads with filters
 * @param {Object} options
 * @param {string} options.status
 * @param {string} options.assigned_to
 * @param {string} options.category
 * @param {string} options.search
 * @param {number} options.limit
 * @param {number} options.offset
 * @returns {Promise<Lead[]>}
 */
export async function fetchLeads({ status, assigned_to, category, search, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (assigned_to) query = query.eq('assigned_to', assigned_to)
  if (category) query = query.eq('category', category)
  if (search) query = query.or(`business_name.ilike.%${search}%,notes.ilike.%${search}%`)

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Fetch a single lead by ID
 * @param {string} id
 * @returns {Promise<Lead>}
 */
export async function fetchLead(id) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a lead
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteLead(id) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ========== GENERATED SITES ==========

/**
 * Insert a new generated site
 * @param {Omit<GeneratedSite, 'id' | 'created_at'>} siteData
 * @returns {Promise<GeneratedSite>}
 */
export async function insertGeneratedSite(siteData) {
  const { data, error } = await supabase
    .from('generated_sites')
    .insert(siteData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a generated site
 * @param {string} id
 * @param {Partial<GeneratedSite>} updates
 * @returns {Promise<GeneratedSite>}
 */
export async function updateGeneratedSite(id, updates) {
  const { data, error } = await supabase
    .from('generated_sites')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch generated sites
 * @param {Object} options
 * @param {string} options.business_id
 * @param {string} options.status
 * @param {number} options.limit
 * @param {number} options.offset
 * @returns {Promise<GeneratedSite[]>}
 */
export async function fetchGeneratedSites({ business_id, status, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('generated_sites')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (business_id) query = query.eq('business_id', business_id)
  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Fetch a generated site by slug
 * @param {string} slug
 * @returns {Promise<GeneratedSite>}
 */
export async function fetchGeneratedSiteBySlug(slug) {
  const { data, error } = await supabase
    .from('generated_sites')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a generated site
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteGeneratedSite(id) {
  const { error } = await supabase
    .from('generated_sites')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ========== USERS ==========

/**
 * Insert a new user
 * @param {Omit<User, 'id' | 'created_at'>} userData
 * @returns {Promise<User>}
 */
export async function insertUser(userData) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a user
 * @param {string} id
 * @param {Partial<User>} updates
 * @returns {Promise<User>}
 */
export async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch all users
 * @param {Object} options
 * @param {string} options.role
 * @param {number} options.limit
 * @param {number} options.offset
 * @returns {Promise<User[]>}
 */
export async function fetchUsers({ role, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (role) query = query.eq('role', role)

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Fetch a user by ID
 * @param {string} id
 * @returns {Promise<User>}
 */
export async function fetchUser(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a user
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ========== ACTIVITY LOGS ==========

/**
 * Insert an activity log
 * @param {Omit<ActivityLog, 'id' | 'created_at'>} logData
 * @returns {Promise<ActivityLog>}
 */
export async function insertActivityLog(logData) {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert(logData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch activity logs
 * @param {Object} options
 * @param {string} options.user_id
 * @param {string} options.action
 * @param {number} options.limit
 * @param {number} options.offset
 * @returns {Promise<ActivityLog[]>}
 */
export async function fetchActivityLogs({ user_id, action, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (user_id) query = query.eq('user_id', user_id)
  if (action) query = query.eq('action', action)

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Delete an activity log
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteActivityLog(id) {
  const { error } = await supabase
    .from('activity_logs')
    .delete()
    .eq('id', id)

  if (error) throw error
}