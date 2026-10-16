import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { formatDateLong, formatTimeRange, plural } from '../../lib/format'
import { joinEvent, leaveEvent } from '../../lib/supabase-store'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { photoIsPublic } from '../../lib/photos'
import { PIN_TYPES } from '../../lib/constants'

function Fact({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
      <Icon name={icon} size="sm" style={{ marginTop: 3, color: 'var(--muted-light)' }} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 11.5, fontWeight: 700, letterSpacing: 0.05, textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, lineHeight: 1.45 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// The body of the event popup. Shared by the map pin detail and the calendar
// so clicking either one shows exactly the same information.
export default function EventDetails({ event: initial, showJoin = true }) {
  const { isAuthed, user } = useAuth()
  // The signup count and "joined" state live here so joining updates the popup
  // at once, without the page that opened it having to reload its events.
  const [signup, setSignup] = useState(null)
  const [busy, setBusy] = useState(false)
  const [joinError, setJoinError] = useState('')
  useEffect(() => { setSignup(null); setJoinError('') }, [initial?.id])
  if (!initial) return null
  const event = signup ? { ...initial, ...signup } : initial

  // Re-read this event's signups from the database after a join or cancel.
  async function refreshSignups() {
    const { data } = await supabase.from('event_signups').select('user_id').eq('event_id', event.id)
    const rows = data || []
    setSignup({ volunteerCount: rows.length, isJoined: rows.some(r => r.user_id === user?.id) })
  }

  async function toggle(join) {
    if (!user || busy) return
    setBusy(true); setJoinError('')
    try {
      if (join) await joinEvent(event.id, user.id)
      else await leaveEvent(event.id, user.id)
    } catch (err) {
      // Joining twice is harmless: the row is already there.
      if (!(join && String(err?.code) === '23505')) {
        setJoinError(join ? 'Could not sign you up. Please try again.' : 'Could not cancel your signup. Please try again.')
        console.error('Event signup failed:', err)
      }
    }
    await refreshSignups()
    setBusy(false)
  }

  const spotsLeft = Math.max(0, (event.max_volunteers || 0) - event.volunteerCount)
  const full = spotsLeft === 0 && !event.isJoined
  const spot = event.spot
  const photo = photoIsPublic(spot) ? spot.photo_url : null
  const spotType = spot ? PIN_TYPES[spot.type] : null

  return (
    <div style={{ display: 'grid', gap: 22 }}>
      {photo && (
        <img
          src={photo}
          alt={spot.title}
          style={{
            width: '100%', maxHeight: 280, objectFit: 'cover',
            display: 'block', background: 'var(--surface-alt)',
          }}
        />
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge color="var(--navy-deep)" bg="var(--navy-soft)">{event.org.name}</Badge>
        {event.isPast
          ? <Badge>Completed</Badge>
          : <Badge color="var(--green)" bg="var(--green-soft)">Open for signup</Badge>}
        {event.isJoined && (
          <Badge color="var(--green)" bg="var(--green-soft)" icon="check">You are signed up</Badge>
        )}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(158px, 1fr))',
        gap: 18, padding: '18px 20px', background: 'var(--surface-alt)',
        border: '1px solid var(--border)', borderRadius: 0,
      }}>
        <Fact icon="calendar" label="Date">{formatDateLong(event.event_date)}</Fact>
        <Fact icon="clock" label="Time">{formatTimeRange(event.start_time, event.end_time)}</Fact>
        <Fact icon="pin" label="Where">{event.location}</Fact>
        <Fact icon="award" label="Service hours">{event.hours} hours credited</Fact>
      </div>

      {spot && (
        <div style={{
          display: 'flex', gap: 11, alignItems: 'flex-start',
          padding: '13px 16px', background: 'var(--surface-alt)',
          border: '1px solid var(--border)',
        }}>
          <Icon
            name={spotType?.icon || 'pin'}
            size="sm"
            style={{ marginTop: 2, color: 'var(--muted-light)', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 11.5, fontWeight: 700, letterSpacing: 0.05,
              textTransform: 'uppercase', color: 'var(--muted)',
            }}>
              Scheduled for a reported spot
            </div>
            <div style={{ fontSize: 14, marginTop: 3, lineHeight: 1.5 }}>
              {spot.title}
              {spot.address && <span style={{ color: 'var(--muted)' }}> · {spot.address}</span>}
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 14.5, lineHeight: 1.65 }}>{event.description}</div>

      <div>
        <h4 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 12 }}>
          What you would do if you volunteered
        </h4>
        <ul style={{ listStyle: 'none', display: 'grid', gap: 9 }}>
          {event.tasks?.map((task, i) => (
            <li key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
              <span style={{
                width: 20, height: 20, borderRadius: 0, background: 'var(--navy-soft)',
                color: 'var(--navy)', fontSize: 11, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
              }}>{i + 1}</span>
              <span style={{ fontSize: 14, lineHeight: 1.55 }}>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 14, flexWrap: 'wrap', paddingTop: 2,
      }}>
        <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>{plural(event.volunteerCount, 'volunteer')}</strong> signed up
          {!event.isPast && ` · ${spotsLeft} of ${event.max_volunteers} spots left`}
        </div>

        {showJoin && !event.isPast && (
          !isAuthed ? (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="primary" iconAfter="arrowRight">Log in to join</Button>
            </Link>
          ) : event.isJoined ? (
            <Button variant="danger" size="sm" onClick={() => toggle(false)} disabled={busy}>
              {busy ? 'Cancelling…' : 'Cancel my signup'}
            </Button>
          ) : (
            <Button variant="success" icon="check" onClick={() => toggle(true)} disabled={full || busy}>
              {full ? 'Event is full' : busy ? 'Joining…' : 'Join this event'}
            </Button>
          )
        )}
      </div>
      {joinError && (
        <div style={{
          fontSize: 13, color: 'var(--red)', background: 'var(--red-soft)',
          border: '1px solid #E4C7C8', padding: '10px 13px', marginTop: -8,
        }}>{joinError}</div>
      )}

      <div style={{
        fontSize: 13, color: 'var(--muted)', lineHeight: 1.6,
        borderTop: '1px solid var(--border)', paddingTop: 16,
      }}>
        Hours are credited once <strong style={{ color: 'var(--text)' }}>{event.org.name}</strong> confirms
        you attended. Questions before the day? Email{' '}
        <a href={`mailto:${event.org.email}`} style={{ fontWeight: 600 }}>{event.org.email}</a>.
      </div>
    </div>
  )
}
