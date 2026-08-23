import { useMemo } from 'react'
import { useSpots } from './useSpots'
import { useEvents } from './useEvents'

// Replaces cityStats() from store.js — derives stats from Supabase hooks
export function useCityStats() {
  const { spots } = useSpots()
  const { events, upcoming } = useEvents()

  return useMemo(() => {
    const volunteers = new Set(
      events.flatMap(e => (e.event_signups || []).map(s => s.user_id))
    ).size
    const nextEvent = upcoming[0] || null
    return {
      open: spots.filter(s => s.status !== 'resolved' && s.status !== 'rejected').length,
      resolved: spots.filter(s => s.status === 'resolved').length,
      volunteers,
      upcoming: upcoming.length,
      nextEvent,
    }
  }, [spots, events, upcoming])
}

export default useCityStats
