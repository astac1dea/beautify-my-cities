import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'

// Voting requires a name but no account.
// Name is stored in localStorage so the user only has to enter it once.
// Votes are stored in Supabase votes table.
const NAME_KEY = 'bmc.voterName'

export function useVote() {
  const [voterName, setVoterNameState] = useState(() => localStorage.getItem(NAME_KEY) || '')

  function setVoterName(name) {
    localStorage.setItem(NAME_KEY, name)
    setVoterNameState(name)
  }

  const vote = useCallback(async (spotId, name) => {
    const n = (name || voterName).trim()
    if (!n) return false

    // Save name locally for next time
    localStorage.setItem(NAME_KEY, n)
    setVoterNameState(n)

    if (!supabase) return false

    try {
      // Check if already voted
      const { data: existing } = await supabase
        .from('votes')
        .select('id')
        .eq('spot_id', spotId)
        .eq('voter_name', n)
        .maybeSingle()

      if (existing) {
        // Toggle off — remove vote
        await supabase.from('votes').delete().eq('id', existing.id)
      } else {
        // Add vote
        await supabase.from('votes').insert({
          spot_id: spotId,
          user_id: null,
          voter_name: n,
        })
      }
      return true
    } catch (err) {
      console.error('Vote failed:', err)
      return false
    }
  }, [voterName])

  return { vote, voterName, setVoterName, canVote: true }
}

export default useVote
