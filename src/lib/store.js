import { ORGANIZATIONS, PROFILES, SPOTS, EVENTS, SIGNUPS, UNVERIFIED_EVENTS } from './seed'
import { CITIES, DEFAULT_CITY_ID, cityById, orgIdFor } from './cities'

// Local persistence layer. Everything the app reads and writes goes through
// here. Shapes match the Supabase tables so this can be replaced with real
// queries later - see MIGRATION.sql for the tables that still need creating.

const KEY = 'bmc.state.v2'

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function seedState() {
  const today = todayISO()
  // Past signups become hour log rows straight away; future ones do not.
  const hours = SIGNUPS.flatMap(s => {
    const event = EVENTS.find(e => e.id === s.event_id)
    if (!event || event.event_date > today) return []
    return [{
      id: `hr-${s.user_id}-${s.event_id}`,
      user_id: s.user_id,
      event_id: s.event_id,
      org_id: event.org_id,
      date: event.event_date,
      hours: event.hours,
      status: UNVERIFIED_EVENTS.includes(s.event_id) ? 'pending' : 'verified',
    }]
  })

  return {
    profiles: PROFILES.map(p => ({ ...p })),
    spots: SPOTS.map(s => ({ ...s })),
    events: EVENTS.map(e => ({ ...e })),
    signups: SIGNUPS.map(s => ({ ...s, id: `su-${s.user_id}-${s.event_id}` })),
    votes: [],
    hours,
    sessionUserId: null,
    cityId: DEFAULT_CITY_ID,
  }
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.spots)) return seedState()
    return parsed
  } catch {
    return seedState()
  }
}

let state = read()
const listeners = new Set()

function commit(next) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode */ }
  listeners.forEach(fn => fn())
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getState() {
  return state
}

export function resetDemoData() {
  const keepSession = state.sessionUserId
  commit({ ...seedState(), sessionUserId: keepSession })
}

/* ---------------------------------------------------------------- cities */

export { CITIES, cityById }

export function currentCity(s = state) {
  return cityById(s.cityId)
}

export function setCity(cityId) {
  commit({ ...state, cityId })
}

/* ------------------------------------------------------------------ auth */

export function signIn(email, password) {
  const user = state.profiles.find(
    p => p.email && p.email.toLowerCase() === String(email).trim().toLowerCase()
  )
  if (!user) return { error: 'No account found with that email.' }
  if (user.password !== password) return { error: 'That password is not right.' }
  commit({ ...state, sessionUserId: user.id })
  return { user }
}

export function signUp({ name, email, password, school, grade }) {
  const clean = String(email).trim().toLowerCase()
  if (!name?.trim()) return { error: 'Please enter your name.' }
  if (!clean.includes('@')) return { error: 'Please enter a valid email address.' }
  if ((password || '').length < 8) return { error: 'Password needs to be at least 8 characters.' }
  if (state.profiles.some(p => p.email?.toLowerCase() === clean)) {
    return { error: 'An account with that email already exists.' }
  }
  const user = {
    id: `u-${Date.now()}`,
    email: clean,
    password,
    display_name: name.trim(),
    role: 'resident',
    city_id: state.cityId,
    school: school?.trim() || '',
    grade: grade?.trim() || '',
    bio: '',
    created_at: todayISO(),
    avatar_color: '#205C99',
  }
  commit({ ...state, profiles: [...state.profiles, user], sessionUserId: user.id })
  return { user }
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

/* ----------------------------------------------------------------- spots */

export function addSpot({ type, title, address, description, lat, lng }) {
  const spot = {
    id: `sp-${Date.now()}`,
    city_id: state.cityId,
    user_id: state.sessionUserId,
    type,
    title: title.trim(),
    address: (address || '').trim(),
    description: description.trim(),
    lat,
    lng,
    status: state.sessionUserId ? 'reported' : 'pending',
    base_upvotes: 0,
    created_at: todayISO(),
  }
  commit({ ...state, spots: [spot, ...state.spots] })
  return spot
}

export function toggleVote(spotId, voterName) {
  // Works for both logged-in users (sessionUserId) and guests (voterName).
  const me = state.sessionUserId || voterName
  if (!me) return
  const existing = state.votes.find(v => v.spot_id === spotId && (v.user_id === me || v.voter_name === me))
  commit({
    ...state,
    votes: existing
      ? state.votes.filter(v => v !== existing)
      : [...state.votes, {
          id: `vt-${spotId}-${Date.now()}`,
          spot_id: spotId,
          user_id: state.sessionUserId || null,
          voter_name: voterName || null,
          created_at: todayISO(),
        }],
  })
}

/* ---------------------------------------------------------------- events */

export function joinEvent(eventId) {
  const me = state.sessionUserId
  if (!me) return
  if (state.signups.some(s => s.event_id === eventId && s.user_id === me)) return
  commit({
    ...state,
    signups: [...state.signups, { id: `su-${me}-${eventId}`, event_id: eventId, user_id: me, created_at: todayISO() }],
  })
}

export function leaveEvent(eventId) {
  const me = state.sessionUserId
  if (!me) return
  commit({
    ...state,
    signups: state.signups.filter(s => !(s.event_id === eventId && s.user_id === me)),
    // drop any hour row that came from this signup
    hours: state.hours.filter(h => !(h.event_id === eventId && h.user_id === me)),
  })
}

/* ------------------------------------------------------------- selectors */

export const organizations = ORGANIZATIONS

export function orgById(id) {
  return ORGANIZATIONS.find(o => o.id === id) || ORGANIZATIONS[ORGANIZATIONS.length - 1]
}

export function currentUser(s = state) {
  return s.profiles.find(p => p.id === s.sessionUserId) || null
}

export function profileById(id, s = state) {
  return s.profiles.find(p => p.id === id) || null
}

// A spot with its live vote count, owner, organization and scheduled event.
export function decorateSpot(spot, s = state) {
  const extra = s.votes.filter(v => v.spot_id === spot.id).length
  const event = s.events.find(e => e.spot_id === spot.id && e.event_date >= todayISO())
    || s.events.find(e => e.spot_id === spot.id)
  return {
    ...spot,
    upvotes: (spot.base_upvotes || 0) + extra,
    hasVoted: s.votes.some(v => v.spot_id === spot.id && v.user_id === s.sessionUserId),
    reporter: profileById(spot.user_id, s),
    org: orgById(spot.org_id || orgIdFor(spot.city_id, spot.type)),
    event: event ? decorateEvent(event, s) : null,
  }
}

// Everything the map, leaderboard and events lists show is scoped to the
// city currently being browsed. Personal data (hours, calendar) is not.
export function allSpots(s = state) {
  return s.spots.filter(sp => sp.city_id === s.cityId).map(sp => decorateSpot(sp, s))
}

export function decorateEvent(event, s = state) {
  const signups = s.signups.filter(su => su.event_id === event.id)
  return {
    ...event,
    org: orgById(event.org_id),
    spot: s.spots.find(sp => sp.id === event.spot_id) || null,
    volunteerCount: signups.length,
    volunteers: signups.map(su => profileById(su.user_id, s)).filter(Boolean),
    isJoined: signups.some(su => su.user_id === s.sessionUserId),
    isPast: event.event_date < todayISO(),
  }
}

export function allEvents(s = state) {
  return s.events.filter(e => e.city_id === s.cityId).map(e => decorateEvent(e, s))
}

export function eventById(id, s = state) {
  const e = s.events.find(ev => ev.id === id)
  return e ? decorateEvent(e, s) : null
}

// Events the signed-in user has joined, soonest first.
export function myEvents(s = state) {
  const mine = s.signups.filter(su => su.user_id === s.sessionUserId).map(su => su.event_id)
  return s.events
    .filter(e => mine.includes(e.id))
    .map(e => decorateEvent(e, s))
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
}

// Personal views span every city the resident has been active in.
export function mySpots(s = state) {
  return s.spots
    .filter(sp => sp.user_id === s.sessionUserId)
    .map(sp => decorateSpot(sp, s))
    .sort((a, b) => b.upvotes - a.upvotes)
}

// Volunteer hour rows for the signed-in user, newest first.
export function myHours(s = state) {
  return s.hours
    .filter(h => h.user_id === s.sessionUserId)
    .map(h => ({
      ...h,
      event: s.events.find(e => e.id === h.event_id) || null,
      org: orgById(h.org_id),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function hourTotals(s = state) {
  const rows = myHours(s)
  const verified = rows.filter(r => r.status === 'verified').reduce((n, r) => n + r.hours, 0)
  const pending = rows.filter(r => r.status === 'pending').reduce((n, r) => n + r.hours, 0)
  return { verified, pending, total: verified + pending, events: rows.length }
}

// Every spot ranked by upvotes - used for the "#1 most popular" ranking.
export function spotRanking(s = state) {
  return allSpots(s)
    .map(sp => ({ ...sp, volunteerCount: sp.event ? sp.event.volunteerCount : 0 }))
    .sort((a, b) => b.upvotes - a.upvotes || b.volunteerCount - a.volunteerCount)
    .map((sp, i) => ({ ...sp, rank: i + 1 }))
}

// Residents ranked by the total upvotes across every pin they reported.
export function residentRanking(s = state) {
  const spots = allSpots(s)
  const cityEventIds = new Set(s.events.filter(e => e.city_id === s.cityId).map(e => e.id))
  return s.profiles
    .map(p => {
      const theirs = spots.filter(sp => sp.user_id === p.id)
      return {
        profile: p,
        pins: theirs.length,
        upvotes: theirs.reduce((n, sp) => n + sp.upvotes, 0),
        hours: s.hours
          .filter(h => h.user_id === p.id && h.status === 'verified' && cityEventIds.has(h.event_id))
          .reduce((n, h) => n + h.hours, 0),
      }
    })
    .filter(r => r.pins > 0 || r.hours > 0)
    .sort((a, b) => b.upvotes - a.upvotes || b.hours - a.hours)
    .map((r, i) => ({ ...r, rank: i + 1 }))
}

export function cityStats(s = state) {
  const spots = s.spots.filter(sp => sp.city_id === s.cityId)
  const events = s.events.filter(e => e.city_id === s.cityId)
  const eventIds = new Set(events.map(e => e.id))
  return {
    open: spots.filter(sp => sp.status !== 'resolved').length,
    resolved: spots.filter(sp => sp.status === 'resolved').length,
    volunteers: new Set(s.signups.filter(su => eventIds.has(su.event_id)).map(su => su.user_id)).size,
    upcoming: events.filter(e => e.event_date >= todayISO()).length,
    nextEvent: events
      .filter(e => e.event_date >= todayISO())
      .sort((a, b) => a.event_date.localeCompare(b.event_date))[0] || null,
  }
}
