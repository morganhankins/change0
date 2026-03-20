const STORAGE_KEY = 'change0_progress'

/**
 * Safely saves progress data to localStorage.
 * @param {Object} data - Progress data to serialize and store
 */
export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    // Storage may be unavailable (private browsing, quota exceeded, etc.)
    console.warn('Failed to save progress:', err)
  }
}

/**
 * Safely loads and parses progress from localStorage.
 * @returns {Object|null} Parsed progress data, or null if missing or unreadable
 */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to load progress:', err)
    return null
  }
}

/**
 * Clears stored progress from localStorage.
 */
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Failed to clear progress:', err)
  }
}
