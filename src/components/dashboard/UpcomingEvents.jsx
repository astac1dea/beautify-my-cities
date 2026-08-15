import { Link } from 'react-router-dom'
import { formatDateLong, formatTimeRange } from '../../lib/format'

export default function UpcomingEvents({ events = [], onOpen, limit = 4 }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontWeight: 700, fontSize: 13,
      }}>
        My next events
        <Link to="/calendar" style={{ fontSize: 11, color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
          Calendar →
        </Link>
      </div>

      {events.length === 0 ? (
        <div style={{ padding: '22px 18px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Nothing booked. Find a spot on the map and join its event to start logging hours.
        </div>
      ) : (
        events.slice(0, limit).map(event => (
          <button
            key={event.id}
            onClick={() => onOpen?.(event.id)}
            style={{
              display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%', textAlign: 'left',
              padding: '13px 18px', cursor: 'pointer', background: 'none',
              border: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'inherit',
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: event.org.color, marginTop: 5,
            }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{event.title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
                {formatDateLong(event.event_date)} · {formatTimeRange(event.start_time, event.end_time)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                📍 {event.location}
              </div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 800, color: 'var(--blue)',
              background: 'var(--blue-light)', padding: '3px 8px', borderRadius: 50,
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>
              {event.hours} hrs
            </div>
          </button>
        ))
      )}
    </div>
  )
}
