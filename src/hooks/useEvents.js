import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useCity } from './useCity'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// No single event credits more than this, however long it runs.
export const MAX_EVENT_HOURS = 4

function decorateEvent(event, userId) {
  const signups = event.event_signups || []
  return {
    ...event,
    hours: Math.min(Number(event.hours) || 0, MAX_EVENT_HOURS),
    org: event.organizations || null,
    // The reported pin this event was scheduled for, when there is one.
    spot: event.spots || null,
    volunteerCount: signups.length,
    isJoined: signups.some(s => s.user_id === userId),
    isPast: event.event_date < todayISO(),
  }
}

export function useEvents() {
  const { city } = useCity()
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!supabase || !city?.id) return
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_signups (id, user_id),
          spots (id, title, type, address, photo_url, photo_status)
        `)
        .eq('city_id', city.id)
        .order('event_date', { ascending: true })
      if (error) throw error
      setEvents((data || []).map(e => decorateEvent(e, user?.id)))
    } catch (err) {
      console.error('Events fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [city?.id, user?.id])

  useEffect(() => { load() }, [load])

  const upcoming = useMemo(() =>
    events.filter(e => e.event_date >= todayISO()),
    [events]
  )

  const mine = useMemo(() =>
    events.filter(e => e.isJoined),
    [events]
  )

  const joinEvent = useCallback(async (eventId) => {
    if (!supabase || !user) return
    await supabase.from('event_signups').insert({ event_id: eventId, user_id: user.id })
    await load()
  }, [user, load])

  const leaveEvent = useCallback(async (eventId) => {
    if (!supabase || !user) return
    await supabase.from('event_signups')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)
    await load()
  }, [user, load])

  return { events, upcoming, mine, joinEvent, leaveEvent, loading }
}

export function useEvent(eventId) {
  const { user } = useAuth()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    if (!supabase || !eventId) return
    supabase
      .from('events')
      .select(`*, organizations(*), event_signups(id, user_id), spots (id, title, type, address, photo_url, photo_status)`)
      .eq('id', eventId)
      .single()
      .then(({ data }) => {
        if (data) setEvent(decorateEvent(data, user?.id))
      })
  }, [eventId, user?.id])

  return event
}

export function useHours() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('volunteer_hours')
      .select(`*, organizations(name, email), events(title, event_date)`)
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .then(({ data }) => setRows(data || []))
  }, [user?.id])

  const totals = useMemo(() => {
    const verified = rows.filter(r => r.status === 'verified').reduce((n, r) => n + r.hours, 0)
    const pending  = rows.filter(r => r.status === 'pending').reduce((n, r) => n + r.hours, 0)
    return { verified, pending, total: verified + pending, events: rows.length }
  }, [rows])

  return { rows, totals }
}

export function todayISOExport() { return todayISO() }

export default useEvents
