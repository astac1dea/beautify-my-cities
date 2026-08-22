import { useCallback, useState } from 'react'
import { toggleVote } from '../lib/store'

// Voting requires a name but no account.
// Name is stored in localStorage so the user only has to enter it once.
const NAME_KEY = 'bmc.voterName'

export function useVote() {
  const [voterName, setVoterName] = useState(() => localStorage.getItem(NAME_KEY) || '')

  const vote = useCallback((spotId, name) => {
    const n = (name || voterName).trim()
    if (!n) return false
    localStorage.setItem(NAME_KEY, n)
    setVoterName(n)
    toggleVote(spotId, n)
    return true
  }, [voterName])

  return { vote, voterName, setVoterName, canVote: true }
}

export default useVote
