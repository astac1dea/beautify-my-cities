import { useMemo, useEffect, useState, useCallback } from 'react'
import { useAppState } from './useStore'
import { allSpots, mySpots, spotRanking } from '../lib/store'
import { fetchSpots, insertSpot } from '../lib/supabase-store'
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

  // Clear old localStorage demo data so Supabase takes over
  useEffect(() => {
    try { localStorage.removeItem('bmc.state.v2') } catch {}
  }, [])

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

  // Reload spots every 30 seconds as a simple alternative to realtime
  useEffect(() => {
    const interval = setInterval(() => load(), 30000)
    return () => clearInterval(interval)
  }, [load])

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

// ─── useSpot ──────────────────────────────────────────────────────────────────
export function useSpot(spotId) {
  const { user } = useAuth()
  const [supaSpot, setSupaSpot] = useState(null)

  const loadSpot = useCallback(async () => {
    if (!supabase || !spotId) return
    const { data, error } = await supabase
      .from('spots')
      .select(`*, votes (id, user_id, voter_name), organizations (id, name, email, phone, focus, blurb, contact_name)`)
      .eq('id', spotId)
      .single()
    if (error || !data) return
    setSupaSpot({
      ...data,
      upvotes: (data.base_upvotes || 0) + (data.votes?.length || 0),
      hasVoted: user ? data.votes?.some(v => v.user_id === user.id || v.voter_name) : false,
      reporter: null,
      org: data.organizations || null,
      event: null,
    })
  }, [spotId, user?.id])

  useEffect(() => { loadSpot() }, [loadSpot])

  return [supaSpot, loadSpot]
}

export default useSpots
