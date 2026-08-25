import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { signIn as localSignIn, signUp as localSignUp, signOut as localSignOut, currentUser, updateProfile as localUpdateProfile } from '../lib/store'
import { useAppState } from './useStore'

// Tries Supabase auth first, falls back to localStorage if Supabase unavailable.

let _user = null
let _listeners = new Set()

function notify() { _listeners.forEach(fn => fn()) }

// Boot — check if there's an existing Supabase session
if (supabase) {
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session?.user) {
      _user = await loadProfile(session.user.id, session.user.email)
      notify()
    }
  })

  // Listen for auth state changes (login, logout, token refresh)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      _user = await loadProfile(session.user.id, session.user.email)
    } else {
      _user = null
    }
    notify()
  })
}

async function loadProfile(userId, email) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error || !data) return { id: userId, email, display_name: email, role: 'resident' }
  return data
}

export function useAuth() {
  const localState = useAppState()
  const [, setTick] = useState(0)

  useEffect(() => {
    const fn = () => setTick(t => t + 1)
    _listeners.add(fn)
    return () => _listeners.delete(fn)
  }, [])

  // Use Supabase user if available, otherwise fall back to localStorage
  const user = supabase ? _user : currentUser(localState)
  const isAuthed = !!user

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return localSignIn(email, password)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { user: data.user }
  }, [])

  const signUp = useCallback(async ({ name, email, password, school, grade }) => {
    if (!supabase) return localSignUp({ name, email, password, school, grade })

    const clean = String(email).trim().toLowerCase()
    if (!name?.trim()) return { error: 'Please enter your name.' }
    if (!clean.includes('@')) return { error: 'Please enter a valid email address.' }
    if ((password || '').length < 8) return { error: 'Password needs to be at least 8 characters.' }

    // Create auth user
    const { data, error } = await supabase.auth.signUp({ email: clean, password })
    if (error) return { error: error.message }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: clean,
        display_name: name.trim(),
        role: 'resident',
        school: school?.trim() || '',
        grade: grade?.trim() || '',
        avatar_color: '#205C99',
        city_id: '00000001-0000-0000-0000-000000000001',
      })
    if (profileError) return { error: profileError.message }

    return { user: data.user }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return localSignOut()
    await supabase.auth.signOut()
    _user = null
    notify()
  }, [])

  const updateProfile = useCallback(async (patch) => {
    if (!supabase || !user) return localUpdateProfile(patch)
    const { error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', user.id)
    if (!error) {
      _user = { ..._user, ...patch }
      notify()
    }
  }, [user])

  return { user, isAuthed, signIn, signUp, signOut, updateProfile }
}

export default useAuth
