import { useSyncExternalStore } from 'react'

// Kept in sync with the breakpoints in index.css.
const MOBILE = '(max-width: 860px)'

function subscribe(query) {
  return callback => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }
}

export function useMediaQuery(query) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false // server / first paint assumes desktop
  )
}

// True on phones and small tablets, where the fixed sidebar has to become a
// drawer and the page gutters tighten.
export function useIsMobile() {
  return useMediaQuery(MOBILE)
}

export default useMediaQuery
