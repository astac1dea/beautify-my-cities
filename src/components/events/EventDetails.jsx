import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { formatDateLong, formatTimeRange, plural } from '../../lib/format'
import { joinEvent, leaveEvent } from '../../lib/store'
import { useAuth } from '../../hooks/useAuth'

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
export default function EventDetails({ event, showJoin = true }) {
  const { isAuthed } = useAuth()
  if (!event) return null

  const spotsLeft = Math.max(0, (event.max_volunteers || 0) - event.volunteerCount)
  const full = spotsLeft === 0 && !event.isJoined

  return (
    <div style={{ display: 'grid', gap: 22 }}>
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
            <Button variant="danger" size="sm" onClick={() => leaveEvent(event.id)}>
              Cancel my signup
            </Button>
          ) : (
            <Button variant="success" icon="check" onClick={() => joinEvent(event.id)} disabled={full}>
              {full ? 'Event is full' : 'Join this event'}
            </Button>
          )
        )}
      </div>

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
