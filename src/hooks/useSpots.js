import { useMemo, useEffect, useState, useCallback } from 'react'
import { useAppState } from './useStore'
import { allSpots, mySpots, spotRanking, decorateSpot } from '../lib/store'
import { fetchSpots, insertSpot, fetchOrgForSpot, subscribeToSpots } from '../lib/supabase-store'
import { supabase } from '../lib/supabase'
import { useCity } from './useCity'
import { useAuth } from './useAuth'

// ─── useSpots ─────────────────────────────────────────────────────────────────
// Fetches spots from Supabase if available, falls back to localStorage.

export function useSpots() {
  const state = useAppState()
  const { city } = useCity()
  const { user } = useAuth()
  const [supaSpots, setSupaSpots] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!supabase || !city?.id) return
    try {
      const data = await fetchSpots(city.id)
      // Decorate each spot with vote count and hasVoted
      const decorated = data.map(spot => ({
        ...spot,
        upvotes: (spot.base_upvotes || 0) + (spot.votes?.length || 0),
        hasVoted: user
          ? spot.votes?.some(v => v.user_id === user.id)
          : false,
        reporter: spot.profiles || null,
        org: null, // loaded separately when needed
        event: null,
      }))
      setSupaSpots(decorated)
      setError(null)
    } catch (err) {
      console.error('Supabase spots fetch failed, falling back to localStorage:', err)
      setError(err)
      setSupaSpots(null)
    } finally {
      setLoading(false)
    }
  }, [city?.id, user?.id])

  // Initial load
  useEffect(() => { load() }, [load])

  // Realtime subscription — map updates instantly when anyone pins a spot
  useEffect(() => {
    if (!supabase || !city?.id) return
    const channel = subscribeToSpots(city.id, () => load())
    return () => supabase.removeChannel(channel)
  }, [city?.id, load])

  // Use Supabase data if available, otherwise fall back to localStorage
  const spots = supaSpots ?? allSpots(state)
  const mine = useMemo(() => {
    if (supaSpots && user) return supaSpots.filter(s => s.user_id === user.id)
    return mySpots(state)
  }, [supaSpots, user, state])

  const ranking = useMemo(() => {
    return [...spots]
      .filter(s => s.status !== 'pending' && s.status !== 'rejected')
      .sort((a, b) => b.upvotes - a.upvotes)
      .map((s, i) => ({ ...s, rank: i + 1 }))
  }, [spots])

  async function addSpot(params) {
    if (!supabase) {
      // Fallback to localStorage
      const { addSpot: localAdd } = await import('../lib/store')
      return localAdd(params)
    }
    try {
      const spot = await insertSpot({
        ...params,
        cityId: city.id,
        userId: user?.id || null,
      })
      await load() // refresh
      return spot
    } catch (err) {
      console.error('Supabase insertSpot failed:', err)
      const { addSpot: localAdd } = await import('../lib/store')
      return localAdd(params)
    }
  }

  return { spots, mine, ranking, addSpot, loading, error }
}

// ─── useSpot ──────────────────────────────────────────────────────────────────
// Single spot — tries Supabase first, falls back to localStorage.

export function useSpot(spotId) {
  const state = useAppState()
  const { user } = useAuth()
  const [supaSpot, setSupaSpot] = useState(null)

  useEffect(() => {
    if (!supabase || !spotId) return
    supabase
      .from('spots')
      .select(`
        *,
        profiles (id, display_name, avatar_color),
        votes (id, user_id, voter_name),
        organizations (id, name, email, phone, focus, blurb, contact_name)
      `)
      .eq('id', spotId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) return
        setSupaSpot({
          ...data,
          upvotes: (data.base_upvotes || 0) + (data.votes?.length || 0),
          hasVoted: user
            ? data.votes?.some(v => v.user_id === user.id)
            : false,
          reporter: data.profiles || null,
          org: data.organizations || null,
          event: null,
        })
      })
  }, [spotId, user?.id])

  if (supaSpot) return supaSpot

  // Fallback to localStorage
  const raw = state.spots.find(s => s.id === spotId)
  return raw ? decorateSpot(raw, state) : null
}

export default useSpots
