import { useCallback, useEffect, useState } from 'react'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// Calls the Flask JSON API. Always throws ApiError with a message fit to show a user.
export async function api(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError("Can't reach the server. Check that it is running and try again.", 0)
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // Non-JSON response (e.g. the server returned an HTML error page).
  }

  if (!res.ok) throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status)
  return data
}

// Loads data on mount (and when `path` changes). Returns { data, error, loading, reload }.
export function useApi(path) {
  // The result is stored with the path it belongs to, so a result for an old
  // path is never shown for a new one, and `loading` is derived, not set.
  const [result, setResult] = useState({ path: null, data: null, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    api(path)
      .then((data) => !cancelled && setResult({ path, data, error: null }))
      .catch((err) => !cancelled && setResult({ path, data: null, error: err.message }))
    return () => {
      cancelled = true
    }
  }, [path, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])

  const current = result.path === path
  return {
    data: current ? result.data : null,
    error: current ? result.error : null,
    loading: !current,
    reload,
  }
}
