// store.js — minimal stub after Supabase migration.
// All data (spots, events, votes, auth) now lives in Supabase.
// This file keeps only the utility functions and empty state
// that remaining components still import.

import { CITIES, DEFAULT_CITY_ID, cityById, orgIdFor } from './cities'

// ─── Minimal state (no localStorage data) ────────────────────────────────────

const EMPTY_STATE = {
  cityId: DEFAULT_CITY_ID,
  sessionUserId: null,
  profiles: [],
  spots: [],
  votes: [],
  events: [],
  signups: [],
  volunteerHours: [],
}

let state = { ...EMPTY_STATE }
const listeners = new Set()

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getState() { return state }

function commit(next) {
  state = next
  listeners.forEach(fn => fn())
}

// ─── Date utility ────────────────────────────────────────────────────────────

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// ─── Cities ───────────────────────────────────────────────────────────────────

export { CITIES, cityById, orgIdFor }

export function currentCity(s = state) {
  return cityById(s.cityId) || CITIES[0]
}

export function setCity(cityId) {
  // Accept slug or UUID
  const city = cityId.includes('-') && cityId.length > 10
    ? cityById(cityId)
    : CITIES.find(c => c.slug === cityId)
  commit({ ...state, cityId: city?.id || DEFAULT_CITY_ID })
}

// ─── Auth (localStorage stub — real auth is in useAuth/Supabase) ──────────────

export function currentUser(s = state) {
  if (!s.sessionUserId) return null
  return s.profiles.find(p => p.id === s.sessionUserId) || null
}

export function signIn(email, password) {
  const profile = state.profiles.find(
    p => p.email === email && p.password === password
  )
  if (!profile) return { error: 'No account found with that email.' }
  commit({ ...state, sessionUserId: profile.id })
  return { user: profile }
}

export function signUp({ name, email, password, school, grade }) {
  if (!name?.trim()) return { error: 'Please enter your name.' }
  if (!email?.includes('@')) return { error: 'Please enter a valid email address.' }
  if ((password || '').length < 8) return { error: 'Password needs to be at least 8 characters.' }
  const id = `u-${Date.now()}`
  const profile = { id, display_name: name.trim(), email, password, role: 'resident', school, grade, avatar_color: '#205C99' }
  commit({ ...state, profiles: [...state.profiles, profile], sessionUserId: id })
  return { user: profile }
}

export function signOut() {
  commit({ ...state, sessionUserId: null })
}

export function updateProfile(patch) {
  commit({
    ...state,
    profiles: state.profiles.map(p =>
      p.id === state.sessionUserId ? { ...p, ...patch } : p
    ),
  })
}

// ─── Spots (Supabase handles real data — these are stubs) ────────────────────

export function allSpots(s = state) { return s.spots }
export function mySpots(s = state) {
  return s.spots.filter(sp => sp.user_id === s.sessionUserId)
}

export function addSpot({ type, title, address, description, lat, lng, photo }) {
  const spot = {
    id: `sp-${Date.now()}`,
    city_id: state.cityId,
    user_id: state.sessionUserId || null,
    type, title, address, description, lat, lng,
    photo_url: photo || null,
    status: state.sessionUserId ? 'reported' : 'pending',
    base_upvotes: 0,
    votes: [],
    created_at: todayISO(),
  }
  commit({ ...state, spots: [spot, ...state.spots] })
  return spot
}

export function toggleVote(spotId, voterName) {
  const me = state.sessionUserId || voterName
  if (!me) return
  const existing = state.votes.find(
    v => v.spot_id === spotId && (v.user_id === me || v.voter_name === me)
  )
  commit({
    ...state,
    votes: existing
      ? state.votes.filter(v => v !== existing)
      : [...state.votes, { id: `vt-${Date.now()}`, spot_id: spotId, user_id: state.sessionUserId || null, voter_name: voterName || null, created_at: todayISO() }],
  })
}

export function decorateSpot(spot, s = state) {
  const votes = s.votes.filter(v => v.spot_id === spot.id)
  return {
    ...spot,
    upvotes: (spot.base_upvotes || 0) + votes.length,
    hasVoted: s.sessionUserId
      ? votes.some(v => v.user_id === s.sessionUserId)
      : false,
    reporter: s.profiles.find(p => p.id === spot.user_id) || null,
    org: null,
    event: null,
  }
}

export function spotRanking(s = state) {
  return allSpots(s)
    .map(sp => decorateSpot(sp, s))
    .filter(sp => sp.status !== 'pending' && sp.status !== 'rejected')
    .sort((a, b) => b.upvotes - a.upvotes)
    .map((sp, i) => ({ ...sp, rank: i + 1 }))
}

// ─── Events (stubs) ──────────────────────────────────────────────────────────

export function allEvents(s = state) { return s.events }
export function myEvents(s = state) {
  const mySignups = new Set(
    s.signups.filter(sg => sg.user_id === s.sessionUserId).map(sg => sg.event_id)
  )
  return s.events.filter(e => mySignups.has(e.id))
}
export function eventById(id, s = state) { return s.events.find(e => e.id === id) || null }

export function joinEvent(eventId) {
  if (!state.sessionUserId) return
  if (state.signups.some(sg => sg.event_id === eventId && sg.user_id === state.sessionUserId)) return
  commit({ ...state, signups: [...state.signups, { event_id: eventId, user_id: state.sessionUserId }] })
}

export function leaveEvent(eventId) {
  commit({
    ...state,
    signups: state.signups.filter(
      sg => !(sg.event_id === eventId && sg.user_id === state.sessionUserId)
    ),
  })
}

export function myHours(s = state) { return s.volunteerHours.filter(h => h.user_id === s.sessionUserId) }
export function hourTotals(s = state) {
  const hours = myHours(s)
  return {
    verified: hours.filter(h => h.status === 'verified').reduce((n, h) => n + h.hours, 0),
    pending: hours.filter(h => h.status === 'pending').reduce((n, h) => n + h.hours, 0),
    events: hours.length,
  }
}

// ─── Rankings ─────────────────────────────────────────────────────────────────

export function residentRanking(s = state) { return [] }

// ─── Stats ────────────────────────────────────────────────────────────────────

export function cityStats(s = state) {
  const spots = allSpots(s)
  const events = allEvents(s)
  const today = todayISO()
  return {
    open: spots.filter(sp => sp.status !== 'resolved' && sp.status !== 'rejected').length,
    resolved: spots.filter(sp => sp.status === 'resolved').length,
    volunteers: new Set(s.signups.map(sg => sg.user_id)).size,
    upcoming: events.filter(e => e.event_date >= today).length,
  }
}

export function decorateEvent(event, s = state) { return { ...event, org: null, volunteerCount: 0, isJoined: false } }
export function orgById(id) { return null }
export function profileById(id, s = state) { return s.profiles.find(p => p.id === id) || null }

// ─── Reset ────────────────────────────────────────────────────────────────────

export function resetDemoData() { commit({ ...EMPTY_STATE }) }
