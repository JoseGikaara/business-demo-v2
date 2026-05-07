// src/hooks/useImport.js
import { useState, useCallback } from 'react'
import {
  importBusinessFromPlaces,
  importMultipleBusinesses,
  importFromCSV,
  getImportStats
} from '../services/importService'
import { parseCSV, validateBusinessCSV, readFileAsText } from '../services/csvParser'

/**
 * Hook for business import operations
 * @returns {Object} Import functions and state
 */
export function useImport() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [stats, setStats] = useState(null)

  /**
   * Import a single business from Google Places
   * @param {string} query - Search query
   * @param {Object} options
   */
  const importSingle = useCallback(async (query, options = {}) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const result = await importBusinessFromPlaces(query, options)
      setResults(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Import multiple businesses from queries
   * @param {string[]} queries - Array of search queries
   * @param {Object} options
   */
  const importMultiple = useCallback(async (queries, options = {}) => {
    setLoading(true)
    setError(null)
    setResults(null)
    setProgress({ current: 0, total: queries.length })

    try {
      const result = await importMultipleBusinesses(queries, {
        ...options,
        onProgress: (current, total) => {
          setProgress({ current, total })
        }
      })
      setResults(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }, [])

  /**
   * Import businesses from CSV file
   * @param {File} file - CSV file
   * @param {Object} options
   */
  const importFromFile = useCallback(async (file, options = {}) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // Read file content
      const csvText = await readFileAsText(file)

      // Parse CSV
      const csvData = parseCSV(csvText, { hasHeaders: true })

      // Validate data
      const validation = validateBusinessCSV(csvData)
      if (!validation.valid) {
        throw new Error(`CSV validation failed: ${validation.errors.join(', ')}`)
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('CSV validation warnings:', validation.warnings)
      }

      // Import data
      setProgress({ current: 0, total: csvData.length })
      const result = await importFromCSV(csvData, {
        ...options,
        onProgress: (current, total) => {
          setProgress({ current, total })
        }
      })

      setResults(result)
      return result

    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }, [])

  /**
   * Get import statistics
   */
  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const statsData = await getImportStats()
      setStats(statsData)
      return statsData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Reset import state
   */
  const reset = useCallback(() => {
    setLoading(false)
    setProgress(null)
    setError(null)
    setResults(null)
  }, [])

  return {
    // State
    loading,
    progress,
    error,
    results,
    stats,

    // Actions
    importSingle,
    importMultiple,
    importFromFile,
    fetchStats,
    reset
  }
}