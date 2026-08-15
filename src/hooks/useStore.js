import { useSyncExternalStore } from 'react'
import { subscribe, getState } from '../lib/store'

// Returns the raw state object. Its identity only changes when the store
// commits, so this is a stable snapshot - important, because useSyncExternalStore
// loops forever if getSnapshot builds a new object on every call. Derive lists
// with useMemo(..., [state]) in the component instead.
export function useAppState() {
  return useSyncExternalStore(subscribe, getState, getState)
}
