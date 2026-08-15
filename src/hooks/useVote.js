import { useCallback } from 'react'
import { toggleVote } from '../lib/store'
import { useAuth } from './useAuth'

// Upvoting is one vote per resident per spot, and toggles off if you click again.
export function useVote() {
  const { isAuthed } = useAuth()
  const vote = useCallback(spotId => {
    if (!isAuthed) return false
    toggleVote(spotId)
    return true
  }, [isAuthed])
  return { vote, canVote: isAuthed }
}

export default useVote
