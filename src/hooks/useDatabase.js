// src/hooks/useDatabase.js
import { useState, useEffect } from 'react'
import {
  fetchBusinesses,
  fetchBusiness,
  fetchLeads,
  fetchLead,
  fetchGeneratedSites,
  fetchUsers,
  fetchUser,
  fetchActivityLogs
} from '../services/database'

/**
 * Hook for fetching businesses
 * @param {Object} options
 * @returns {Object} { businesses, loading, error, refetch }
 */
export function useBusinesses(options = {}) {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchBusinesses(options)
      setBusinesses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [JSON.stringify(options)])

  return { businesses, loading, error, refetch: fetchData }
}

/**
 * Hook for fetching a single business
 * @param {string} id
 * @returns {Object} { business, loading, error, refetch }
 */
export function useBusiness(id) {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await fetchBusiness(id)
      setBusiness(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  return { business, loading, error, refetch: fetchData }
}

/**
 * Hook for fetching leads
 * @param {Object} options
 * @returns {Object} { leads, loading, error, refetch }
 */
export function useLeads(options = {}) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchLeads(options)
      setLeads(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [JSON.stringify(options)])

  return { leads, loading, error, refetch: fetchData }
}

/**
 * Hook for fetching a single lead
 * @param {string} id
 * @returns {Object} { lead, loading, error, refetch }
 */
export function useLead(id) {
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await fetchLead(id)
      setLead(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  return { lead, loading, error, refetch: fetchData }
}

/**
 * Hook for fetching generated sites
 * @param {Object} options
 * @returns {Object} { sites, loading, error, refetch }
 */
export function useGeneratedSites(options = {}) {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchGeneratedSites(options)
      setSites(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [JSON.stringify(options)])

  return { sites, loading, error, refetch: fetchData }
}

/**
 * Hook for fetching users
 * @param {Object} options
 * @returns {Object} { users, loading, error, refetch }
 */
export function useUsers(options = {}) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchUsers(options)
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [JSON.stringify(options)])

  return { users, loading, error, refetch: fetchData }
}

/**
 * Hook for fetching a single user
 * @param {string} id
 * @returns {Object} { user, loading, error, refetch }
 */
export function useUser(id) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await fetchUser(id)
      setUser(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  return { user, loading, error, refetch: fetchData }
}

/**
 * Hook for fetching activity logs
 * @param {Object} options
 * @returns {Object} { logs, loading, error, refetch }
 */
export function useActivityLogs(options = {}) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchActivityLogs(options)
      setLogs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [JSON.stringify(options)])

  return { logs, loading, error, refetch: fetchData }
}