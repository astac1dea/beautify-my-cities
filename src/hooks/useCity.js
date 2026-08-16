import { useMemo } from 'react'
import { useAppState } from './useStore'
import { currentCity, setCity } from '../lib/store'
import { CITIES } from '../lib/cities'

// The city currently being browsed. Everything geographic on screen follows it.
export function useCity() {
  const state = useAppState()
  const city = useMemo(() => currentCity(state), [state])
  return { city, cities: CITIES, setCity }
}

export default useCity
