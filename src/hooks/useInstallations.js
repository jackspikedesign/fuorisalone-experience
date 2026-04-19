import { useState, useEffect, useMemo } from 'react'
import { APP_CONFIG } from '../config/app.config'
// TODO FASE 2: sostituire con chiamata Supabase
import data from '../data/events.json'

const ROUTE_STOPS = { '30min': 3, pausa: 5, mezza: 10, full: Infinity, notte: Infinity }

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function isInMilan(lat, lng) {
  return haversineKm(lat, lng, APP_CONFIG.milanCenter.lat, APP_CONFIG.milanCenter.lng) < APP_CONFIG.milanRadiusKm
}

function nearestNeighbor(stops, startPos) {
  const result = []
  const remaining = [...stops]
  let current = startPos
  while (remaining.length > 0) {
    let bestIdx = 0
    let bestDist = haversineKm(current.lat, current.lng, remaining[0].lat, remaining[0].lng)
    for (let i = 1; i < remaining.length; i++) {
      const d = haversineKm(current.lat, current.lng, remaining[i].lat, remaining[i].lng)
      if (d < bestDist) { bestDist = d; bestIdx = i }
    }
    result.push(remaining[bestIdx])
    current = remaining[bestIdx]
    remaining.splice(bestIdx, 1)
  }
  return result
}

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
    if (filters.zone) result = result.filter(i => i.zone === filters.zone)
    if (filters.setting) result = result.filter(i => i.setting === filters.setting)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.artist_studio.toLowerCase().includes(q))
    }
    if (filters.highlightOnly) result = result.filter(i => i.highlight)
    return result
  }, [installations, filters.zone, filters.setting, filters.search, filters.highlightOnly])

  const getRoute = useMemo(() => (routeId, userPos) => {
    const maxStops = ROUTE_STOPS[routeId] ?? Infinity
    // Percorso notturno: solo installazioni con night_note
    const pool = routeId === 'notte'
      ? installations.filter(i => i.night_note)
      : installations

    if (userPos && isInMilan(userPos.lat, userPos.lng)) {
      // Prende le N installazioni più vicine, poi ottimizza l'ordine di visita
      const byDistance = [...pool]
        .sort((a, b) =>
          haversineKm(userPos.lat, userPos.lng, a.lat, a.lng) -
          haversineKm(userPos.lat, userPos.lng, b.lat, b.lng)
        )
        .slice(0, maxStops === Infinity ? pool.length : maxStops)
      return nearestNeighbor(byDistance, userPos)
    }

    // Fallback senza posizione: ordine editoriale
    return pool
      .filter(i => i.routes?.[routeId] != null)
      .sort((a, b) => a.routes[routeId] - b.routes[routeId])
      .slice(0, maxStops)
  }, [installations])

  const highlights = useMemo(() => installations.filter(i => i.highlight), [installations])

  return { installations: filtered, getRoute, highlights, loading }
}
