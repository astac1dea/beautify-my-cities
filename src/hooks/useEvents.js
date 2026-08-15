import { useMemo } from 'react'
import { useAppState } from './useStore'
import { allEvents, myEvents, eventById, myHours, hourTotals, joinEvent, leaveEvent } from '../lib/store'
import { todayISO } from '../lib/store'

export function useEvents() {
  const state = useAppState()
  return useMemo(() => {
    const all = allEvents(state)
    const today = todayISO()
    return {
      events: all,
      upcoming: all.filter(e => e.event_date >= today).sort((a, b) => a.event_date.localeCompare(b.event_date)),
      mine: myEvents(state),
      joinEvent,
      leaveEvent,
    }
  }, [state])
}

export function useEvent(eventId) {
  const state = useAppState()
  return useMemo(() => (eventId ? eventById(eventId, state) : null), [state, eventId])
}

export function useHours() {
  const state = useAppState()
  return useMemo(() => ({ rows: myHours(state), totals: hourTotals(state) }), [state])
}

export default useEvents
