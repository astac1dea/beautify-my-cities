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
      _user = await loadProfile(session.user)
      notify()
    }
  })

  // Listen for auth state changes (login, logout, token refresh)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      _user = await loadProfile(session.user)
    } else {
      _user = null
    }
    notify()
  })
}

// Where the confirmation email's link sends people back to. Supabase only
// honours it if this address is on the project's Redirect URLs list; otherwise
// it falls back to the project's Site URL.
const confirmRedirect = () => `${window.location.origin}/login?confirmed=1`

function profileRow(user) {
  const meta = user.user_metadata || {}
  return {
    id: user.id,
    email: user.email,
    display_name: (meta.display_name || '').trim() || user.email,
    role: 'resident',
    school: (meta.school || '').trim(),
    grade: (meta.grade || '').trim(),
    avatar_color: '#1A1A1A',
    city_id: '00000001-0000-0000-0000-000000000001',
  }
}

// Loads the signed-in user's profile. A new account that had to confirm its
// email first has no profile yet (it could not be created while signed out),
// so the first sign-in creates it from what was typed at signup.
async function loadProfile(user) {
  if (!supabase) return null
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (data) return data
  const row = profileRow(user)
  const { data: created } = await supabase.from('profiles').insert(row).select().maybeSingle()
  return created || row
}

// Supabase's own wording for these is hard to read ("Password should contain at
// least one character of each: abcdefghijklmnopqrstuvwxyz, ..."), so say it plainly.
export function friendlyAuthError(error) {
  const msg = String(error?.message || error || '')
  const low = msg.toLowerCase()
  if (low.includes('at least one character of each')) {
    const needs = []
    if (msg.includes('abcdefghijklmnopqrstuvwxyz')) needs.push('a lowercase letter')
    if (msg.includes('ABCDEFGHIJKLMNOPQRSTUVWXYZ')) needs.push('an uppercase letter')
    if (msg.includes('0123456789')) needs.push('a number')
    if (/[!@#$%^&*]/.test(msg.split('0123456789').pop() || '')) needs.push('a symbol such as ! or #')
    const list = needs.length > 1 ? needs.slice(0, -1).join(', ') + ' and ' + needs[needs.length - 1] : needs[0]
    return `Your password needs at least ${list || 'one of each kind of character'}.`
  }
  if (low.includes('password should be at least')) {
    const n = msg.match(/at least (\d+)/)
    return `Your password needs to be at least ${n ? n[1] : 8} characters long.`
  }
  if (error?.code === 'weak_password' || low.includes('weak') || low.includes('pwned') || low.includes('leaked')) {
    return 'That password is too easy to guess or has shown up in a data breach. Please choose a different one.'
  }
  if (low.includes('email not confirmed')) {
    return 'Please confirm your email first. Click the link in the email we sent you, then log in.'
  }
  if (low.includes('invalid login credentials')) {
    return 'That email and password do not match an account. Check them, or create an account if you are new.'
  }
  if (low.includes('already registered') || low.includes('already been registered')) {
    return 'An account with this email already exists. Try logging in instead.'
  }
  if (low.includes('rate limit') || low.includes('too many')) {
    return 'Too many tries in a short time. Please wait a minute and try again.'
  }
  return msg || 'Something went wrong. Please try again.'
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(), password,
    })
    if (error) {
      const unconfirmed = String(error.message || '').toLowerCase().includes('email not confirmed')
      return { error: friendlyAuthError(error), unconfirmed }
    }
    return { user: data.user }
  }, [])

  const signUp = useCallback(async ({ name, email, password, school, grade }) => {
    if (!supabase) return localSignUp({ name, email, password, school, grade })

    const clean = String(email).trim().toLowerCase()
    if (!name?.trim()) return { error: 'Please enter your name.' }
    if (!clean.includes('@')) return { error: 'Please enter a valid email address.' }
    if ((password || '').length < 8) return { error: 'Your password needs to be at least 8 characters long.' }
    const missing = []
    if (!/[a-z]/.test(password)) missing.push('a lowercase letter')
    if (!/[A-Z]/.test(password)) missing.push('an uppercase letter')
    if (!/[0-9]/.test(password)) missing.push('a number')
    if (missing.length) {
      const list = missing.length > 1 ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1] : missing[0]
      return { error: `Your password needs at least ${list}.` }
    }

    // Name, school and grade ride along on the account, so the profile can be
    // made on first sign-in when the email has to be confirmed first.
    const { data, error } = await supabase.auth.signUp({
      email: clean, password,
      options: {
        emailRedirectTo: confirmRedirect(),
        data: { display_name: name.trim(), school: school?.trim() || '', grade: grade?.trim() || '' },
      },
    })
    if (error) return { error: friendlyAuthError(error) }

    // Supabase hides whether an email is taken: it returns a user with no
    // identities instead of an error.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return { error: 'An account with this email already exists. Try logging in instead.' }
    }

    // Email confirmation is on: the account exists and the email has gone out,
    // but nobody is signed in yet, so the profile waits for the first sign-in.
    if (!data.session) return { needsConfirmation: true, email: clean }

    _user = await loadProfile(data.user)
    notify()
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

  const resendConfirmation = useCallback(async (email) => {
    if (!supabase) return {}
    const { error } = await supabase.auth.resend({
      type: 'signup', email: String(email).trim().toLowerCase(),
      options: { emailRedirectTo: confirmRedirect() },
    })
    return error ? { error: friendlyAuthError(error) } : { ok: true }
  }, [])

  return { user, isAuthed, signIn, signUp, signOut, updateProfile, resendConfirmation }
}

export default useAuth
