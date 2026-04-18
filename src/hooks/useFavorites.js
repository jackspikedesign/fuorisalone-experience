import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useFavorites(user) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }
    setLoading(true)
    supabase
      .from('favorites')
      .select('installation_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setFavorites(data?.map(r => r.installation_id) ?? [])
        setLoading(false)
      })
  }, [user])

  const toggle = useCallback(async (installation) => {
    if (!user) return
    const id = installation.id
    const isFav = favorites.includes(id)

    // Optimistic update
    setFavorites(prev => isFav ? prev.filter(f => f !== id) : [...prev, id])

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('installation_id', id)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, installation_id: id })
    }
  }, [user, favorites])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  return { favorites, loading, toggle, isFavorite }
}
