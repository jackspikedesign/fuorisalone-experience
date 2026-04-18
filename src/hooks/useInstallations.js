import { useState, useEffect, useMemo } from 'react'
// TODO FASE 2: sostituire con chiamata Supabase
import data from '../data/events.json'

export function useInstallations(filters = {}) {
  const [installations, setInstallations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO FASE 2: fetch da Supabase invece del JSON statico
    setInstallations(data)
    setLoading(false)
  }, [])

  const filtered = useMemo(() => {
    let result = installations

    if (filters.zone) {
      result = result.filter(i => i.zone === filters.zone)
    }
    if (filters.setting) {
      result = result.filter(i => i.setting === filters.setting)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        i => i.name.toLowerCase().includes(q) || i.artist_studio.toLowerCase().includes(q)
      )
    }
    if (filters.highlightOnly) {
      result = result.filter(i => i.highlight)
    }

    return result
  }, [installations, filters.zone, filters.setting, filters.search, filters.highlightOnly])

  // Returns installations for a specific route, sorted by route order
  const getRoute = useMemo(() => (routeId) => {
    return installations
      .filter(i => i.routes?.[routeId] != null)
      .sort((a, b) => a.routes[routeId] - b.routes[routeId])
  }, [installations])

  const highlights = useMemo(() => installations.filter(i => i.highlight), [installations])

  return { installations: filtered, getRoute, highlights, loading }
}
