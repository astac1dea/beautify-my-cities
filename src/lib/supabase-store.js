// Supabase data layer — replaces localStorage store.js functions one by one.
// Import from here instead of lib/store.js as each function is migrated.

import { supabase } from './supabase'
import { orgIdFor } from './cities'
import { todayISO } from './store'

// ─── Cities ──────────────────────────────────────────────────────────────────

export async function fetchCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

// ─── Organizations ────────────────────────────────────────────────────────────

export async function fetchOrgs() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
  if (error) throw error
  return data
}

export async function fetchOrgForSpot(cityId, type) {
  const { data, error } = await supabase
    .from('org_categories')
    .select('org_id, organizations(*)')
    .eq('city_id', cityId)
    .eq('type', type)
    .single()
  if (error || !data) return null
  return data.organizations
}

// ─── Spots ───────────────────────────────────────────────────────────────────

export async function fetchSpots(cityId) {
  const { data, error } = await supabase
    .from('spots')
    .select(`
      *,
      votes (id, user_id, voter_name)
    `)
    .eq('city_id', cityId)
    .neq('status', 'rejected')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchSpotById(spotId) {
  const { data, error } = await supabase
    .from('spots')
    .select(`
      *,
      profiles (id, display_name, avatar_color),
      votes (id, user_id, voter_name)
    `)
    .eq('id', spotId)
    .single()
  if (error) throw error
  return data
}

export async function insertSpot({ type, title, address, description, lat, lng, photo, cityId, userId }) {
  const { data, error } = await supabase
    .from('spots')
    .insert({
      city_id: cityId,
      user_id: userId || null,
      type,
      title: title.trim(),
      address: (address || '').trim(),
      description: description.trim(),
      lat,
      lng,
      photo_url: photo || null,
      status: userId ? 'reported' : 'pending',
      base_upvotes: 0,
      created_at: todayISO(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSpotStatus(spotId, status) {
  const { error } = await supabase
    .from('spots')
    .update({ status })
    .eq('id', spotId)
  if (error) throw error
}

// ─── Votes ───────────────────────────────────────────────────────────────────

export async function fetchVotesForSpot(spotId) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('spot_id', spotId)
  if (error) throw error
  return data
}

export async function insertVote(spotId, userId, voterName) {
  const { error } = await supabase
    .from('votes')
    .insert({
      spot_id: spotId,
      user_id: userId || null,
      voter_name: voterName || null,
      created_at: todayISO(),
    })
  if (error) throw error
}

export async function deleteVote(spotId, userId, voterName) {
  let query = supabase.from('votes').delete().eq('spot_id', spotId)
  if (userId) query = query.eq('user_id', userId)
  else if (voterName) query = query.eq('voter_name', voterName)
  const { error } = await query
  if (error) throw error
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function fetchEvents(cityId) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_signups (id, user_id)
    `)
    .eq('city_id', cityId)
    .order('event_date', { ascending: true })
  if (error) throw error
  return data
}

export async function joinEvent(eventId, userId) {
  const { error } = await supabase
    .from('event_signups')
    .insert({ event_id: eventId, user_id: userId })
  if (error) throw error
}

export async function leaveEvent(eventId, userId) {
  const { error } = await supabase
    .from('event_signups')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId)
  if (error) throw error
}

// ─── Volunteer hours ──────────────────────────────────────────────────────────

export async function fetchMyHours(userId) {
  const { data, error } = await supabase
    .from('volunteer_hours')
    .select(`*, organizations (name, email)`)
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signUp({ email, password, name, school, grade }) {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) return { error: authError.message }

  // 2. Create profile row
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      display_name: name.trim(),
      role: 'resident',
      school: school?.trim() || '',
      grade: grade?.trim() || '',
      avatar_color: '#1A1A1A',
      email: email.trim().toLowerCase(),
    })
  if (profileError) return { error: profileError.message }

  return { user: authData.user }
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { user: data.user }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateProfile(userId, patch) {
  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
  if (error) throw error
}

// ─── Realtime subscription ────────────────────────────────────────────────────
// Call this to get live map updates when anyone submits a new pin.

export function subscribeToSpots(cityId, callback) {
  return supabase
    .channel(`spots-${cityId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'spots',
      filter: `city_id=eq.${cityId}`,
    }, callback)
    .subscribe()
}
