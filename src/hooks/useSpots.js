import { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import { useAppState } from './useStore'
import { allSpots, mySpots, spotRanking } from '../lib/store'
import { fetchSpots, insertSpot } from '../lib/supabase-store'
import { supabase } from '../lib/supabase'
import { useCity } from './useCity'
import { useAuth } from './useAuth'
import { MAX_EVENT_HOURS } from './useEvents'

// ─── useSpots ─────────────────────────────────────────────────────────────────
// Fetches spots from Supabase if available, falls back to localStorage.

export function useSpots() {
  const state = useAppState()
  const { city } = useCity()
  const { user } = useAuth()
  const [supaSpots, setSupaSpots] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // The city whose pins we want right now. A slow answer for the previous city
  // must not overwrite the new one (Fremont's map showing Milpitas pins).
  const wantCity = useRef(city?.id)
  wantCity.current = city?.id

  // Clear old localStorage demo data so Supabase takes over
  useEffect(() => {
    try { localStorage.removeItem('bmc.state.v2') } catch {}
  }, [])

  const load = useCallback(async () => {
    if (!supabase || !city?.id) return
    const forCity = city.id
    try {
      const data = await fetchSpots(forCity)
      if (wantCity.current !== forCity) return
      // Decorate each spot with vote count and hasVoted
      const decorated = data.map(spot => ({
        ...spot,
        upvotes: (spot.base_upvotes || 0) + (spot.votes?.length || 0),
        hasVoted: user
          ? spot.votes?.some(v => v.user_id === user.id)
          : false,
        reporter: spot.profiles || null,
        org: null, // loaded separately when needed
        // The volunteer event an organization scheduled for this pin, if any.
        event: spot.events?.[0] || null,
      }))
      setSupaSpots(decorated)
      setError(null)
    } catch (err) {
      if (wantCity.current !== forCity) return
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

// The event popup inside a pin expects the same shape useEvents produces.
function decorateSpotEvent(event, org, userId) {
  if (!event) return null
  const signups = event.event_signups || []
  return {
    ...event,
    hours: Math.min(Number(event.hours) || 0, MAX_EVENT_HOURS),
    org: org || null,
    volunteerCount: signups.length,
    isJoined: signups.some(s => s.user_id === userId),
    isPast: event.event_date < new Date().toISOString().split('T')[0],
  }
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
      .select(`
        *,
        votes (id, user_id, voter_name),
        organizations (id, name, email, phone, focus, blurb, contact_name),
        events (id, title, description, event_date, start_time, end_time, location, hours, max_volunteers, tasks, org_id, event_signups (id, user_id))
      `)
      .eq('id', spotId)
      .single()
    if (error || !data) return
    setSupaSpot({
      ...data,
      upvotes: (data.base_upvotes || 0) + (data.votes?.length || 0),
      hasVoted: user
        ? data.votes?.some(v => v.user_id === user.id)
        : false,
      reporter: null,
      org: data.organizations || null,
      event: decorateSpotEvent(data.events?.[0], data.organizations, user?.id),
    })
  }, [spotId, user?.id])

  useEffect(() => { loadSpot() }, [loadSpot])

  return [supaSpot, loadSpot]
}

export default useSpots
