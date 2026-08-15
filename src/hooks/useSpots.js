import { useMemo } from 'react'
import { useAppState } from './useStore'
import { allSpots, mySpots, spotRanking, decorateSpot, addSpot } from '../lib/store'

export function useSpots() {
  const state = useAppState()
  return useMemo(() => ({
    spots: allSpots(state),
    mine: mySpots(state),
    ranking: spotRanking(state),
    addSpot,
  }), [state])
}

// Keeps a single selected spot in sync as votes and status change.
export function useSpot(spotId) {
  const state = useAppState()
  return useMemo(() => {
    const raw = state.spots.find(s => s.id === spotId)
    return raw ? decorateSpot(raw, state) : null
  }, [state, spotId])
}

export default useSpots
