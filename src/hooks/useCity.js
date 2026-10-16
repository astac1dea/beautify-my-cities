import { useSyncExternalStore } from 'react'
import { CITIES, cityBySlug, cityById } from '../lib/cities'

const DEFAULT_SLUG = 'milpitas'

let _slug = DEFAULT_SLUG
let _listeners = new Set()

export function setCity(slugOrId) {
  // Accept both slug ('milpitas') and UUID
  const city = slugOrId.includes('-') && slugOrId.length > 10
    ? cityById(slugOrId)
    : cityBySlug(slugOrId)
  _slug = city?.slug || DEFAULT_SLUG
  _listeners.forEach(fn => fn())
}

function subscribe(fn) {
  _listeners.add(fn)
  return () => _listeners.delete(fn)
}

// Every component that shows city data (the map, the pin list, the events)
// re-renders on a switch. The old version subscribed from a useState
// initializer, which never unsubscribed and could leave a component behind.
export function useCity() {
  const slug = useSyncExternalStore(subscribe, () => _slug, () => _slug)
  const city = cityBySlug(slug) || CITIES[0]
  return { city, cities: CITIES, setCity }
}

export default useCity
