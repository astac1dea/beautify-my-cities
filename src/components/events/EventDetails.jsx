import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDateLong, formatTimeRange, plural } from '../../lib/format'
import { joinEvent, leaveEvent } from '../../lib/store'

function Row({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ fontSize: 15, width: 20, flexShrink: 0, lineHeight: 1.4 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--muted)' }}>
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, lineHeight: 1.45 }}>{children}</div>
      </div>
    </div>
  )
}

// The body of the event popup. Shared by the map pin detail and the calendar
// so clicking either one shows exactly the same information.
export default function EventDetails({ event, showJoin = true }) {
  if (!event) return null

  const spotsLeft = Math.max(0, (event.max_volunteers || 0) - event.volunteerCount)
  const full = spotsLeft === 0 && !event.isJoined

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge color={event.org.color} bg="#F4F6FC">{event.org.name}</Badge>
        {event.isPast
          ? <Badge color="#6B7A9F" bg="#EEF1F8">Completed</Badge>
          : <Badge color="#16A34A" bg="#DCFCE7">Open for signup</Badge>}
        {event.isJoined && <Badge color="#1B4FD8" bg="#E8EFFE">✓ You are signed up</Badge>}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 16, padding: '16px 18px', background: 'var(--bg)',
        border: '1px solid var(--border)', borderRadius: 12,
      }}>
        <Row icon="📅" label="Date">{formatDateLong(event.event_date)}</Row>
        <Row icon="🕘" label="Time">{formatTimeRange(event.start_time, event.end_time)}</Row>
        <Row icon="📍" label="Where">{event.location}</Row>
        <Row icon="⏱️" label="Service hours">{event.hours} hours credited</Row>
      </div>

      <div>
        <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)' }}>{event.description}</div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          What you would do if you volunteered
        </div>
        <ul style={{ listStyle: 'none', display: 'grid', gap: 8 }}>
          {event.tasks?.map((task, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{
                width: 18, height: 18, borderRadius: 5, background: 'var(--blue-light)',
                color: 'var(--blue)', fontSize: 10, fontWeight: 800, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
              }}>{i + 1}</span>
              <span style={{ fontSize: 13, lineHeight: 1.5 }}>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 12, flexWrap: 'wrap', paddingTop: 4,
      }}>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>{plural(event.volunteerCount, 'volunteer')}</strong> signed up
          {!event.isPast && ` · ${spotsLeft} of ${event.max_volunteers} spots left`}
        </div>

        {showJoin && !event.isPast && (
          event.isJoined ? (
            <Button variant="danger" size="sm" onClick={() => leaveEvent(event.id)}>
              Cancel my signup
            </Button>
          ) : (
            <Button variant="success" onClick={() => joinEvent(event.id)} disabled={full}>
              {full ? 'Event is full' : 'JOIN this event'}
            </Button>
          )
        )}
      </div>

      <div style={{
        fontSize: 12, color: 'var(--muted)', lineHeight: 1.55,
        borderTop: '1px solid var(--border)', paddingTop: 14,
      }}>
        Hours are credited once <strong style={{ color: 'var(--text)' }}>{event.org.name}</strong> confirms
        you attended. Questions before the day? Email{' '}
        <a href={`mailto:${event.org.email}`} style={{ color: 'var(--blue)', fontWeight: 600 }}>
          {event.org.email}
        </a>.
      </div>
    </div>
  )
}
