import { useMemo } from 'react'
import { useAppState } from './useStore'
import { currentUser, signIn, signUp, signOut, updateProfile } from '../lib/store'

export function useAuth() {
  const state = useAppState()
  const user = useMemo(() => currentUser(state), [state])
  return { user, isAuthed: !!user, signIn, signUp, signOut, updateProfile }
}

export default useAuth
