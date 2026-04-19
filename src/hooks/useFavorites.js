import { useState, useCallback } from 'react'

const STORAGE_KEY = 'fse_favorites'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function save(ids) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => load())

  const toggle = useCallback((installation) => {
    const id = installation.id
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      save(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  return { favorites, toggle, isFavorite }
}
