import { useState } from 'react'
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

export function useCity() {
  const [, setTick] = useState(0)

  useState(() => {
    const fn = () => setTick(t => t + 1)
    _listeners.add(fn)
    return () => _listeners.delete(fn)
  })

  const city = cityBySlug(_slug) || CITIES[0]
  return { city, cities: CITIES, setCity }
}

export default useCity
