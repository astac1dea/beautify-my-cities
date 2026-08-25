import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Topbar from '../components/layout/Topbar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import EventModal from '../components/events/EventModal'
import { useEvents } from '../hooks/useEvents'
import { monthGrid, monthLabel, formatTimeRange, formatTimeCompact, formatDateLong, DAYS, plural } from '../lib/format'

function EventRow({ event, onOpen }) {
  return (
    <button
      onClick={() => onOpen(event.id)}
      style={{
        display: 'flex', gap: 16, alignItems: 'center', width: '100%', textAlign: 'left',
        padding: '16px 18px', background: 'var(--surface)', cursor: 'pointer',
        border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'inherit',
      }}
    >
      <div style={{
        width: 54, flexShrink: 0, textAlign: 'center', padding: '8px 0',
        background: event.isPast ? 'var(--bg)' : 'var(--navy-soft)',
        borderRadius: 9,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
          color: event.isPast ? 'var(--muted)' : 'var(--navy)',
        }}>
          {formatDateLong(event.event_date).split(',')[1].trim().split(' ')[0]}
        </div>
        <div style={{
          fontSize: 21, fontWeight: 800, lineHeight: 1.1,
          color: event.isPast ? 'var(--muted)' : 'var(--navy)',
        }}>
          {event.event_date.split('-')[2]}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{event.title}</div>
        <div style={{
          fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5,
          display: 'flex', gap: 14, flexWrap: 'wrap',
        }}>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="clock" size={13} style={{ color: 'var(--muted-light)' }} />
            {formatTimeRange(event.start_time, event.end_time)}
          </span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="pin" size={13} style={{ color: 'var(--muted-light)' }} />
            {event.location}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <Badge color={event.org.color} bg="var(--navy-soft)" size="sm">{event.org.name}</Badge>
          <Badge color="var(--muted)" bg="#EEF1F8" size="sm">{event.hours} hrs</Badge>
          {event.isPast
            ? <Badge color="var(--muted)" bg="#EEF1F8" size="sm">Completed</Badge>
            : <Badge color="var(--green)" bg="var(--green-soft)" size="sm">Upcoming</Badge>}
        </div>
      </div>

      <div style={{ fontSize: 16, color: 'var(--muted)', flexShrink: 0 }}>›</div>
    </button>
  )
}

export default function CalendarPage() {
  const { mine } = useEvents()
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [openEventId, setOpenEventId] = useState(null)

  const byDate = useMemo(() => {
    const map = {}
    mine.forEach(e => { (map[e.event_date] ||= []).push(e) })
    return map
  }, [mine])

  const grid = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor])
  const upcoming = mine.filter(e => e.event_date >= today)
  const past = mine.filter(e => e.event_date < today).reverse()

  function shift(delta) {
    setCursor(c => {
      const d = new Date(c.year, c.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <div>
      <Topbar
        title="My Calendar"
        subtitle={`${plural(upcoming.length, 'upcoming event')} · ${plural(past.length, 'completed event')}`}
        actions={
          <Link to="/map" style={{ textDecoration: 'none' }}>
            <Button variant="secondary">Find events on the map</Button>
          </Link>
        }
      />

      <div className="split page-pad">
        {/* Month grid. Hidden on phones - seven columns of day cells cannot
            be read at that width, so the lists below carry the page. */}
        <div className="month-grid" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {monthLabel(cursor.year, cursor.month)}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="secondary" size="sm" onClick={() => shift(-1)}>←</Button>
              <Button variant="secondary" size="sm" onClick={() => setCursor({ year: now.getFullYear(), month: now.getMonth() })}>Today</Button>
              <Button variant="secondary" size="sm" onClick={() => shift(1)}>→</Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DAYS.map(d => (
              <div key={d} style={{
                padding: '10px 0', textAlign: 'center', fontSize: 10, fontWeight: 800,
                letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--muted)',
                borderBottom: '1px solid var(--border)',
              }}>{d}</div>
            ))}

            {grid.map(cell => {
              const events = byDate[cell.iso] || []
              const isToday = cell.iso === today
              return (
                <div key={cell.iso} style={{
                  minHeight: 78, padding: 6, borderBottom: '1px solid var(--border)',
                  borderRight: '1px solid var(--border)',
                  background: cell.inMonth ? 'var(--surface)' : 'var(--bg)',
                  opacity: cell.inMonth ? 1 : 0.55,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: isToday ? 800 : 600, marginBottom: 5,
                    width: 21, height: 21, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isToday ? 'var(--navy)' : 'transparent',
                    color: isToday ? 'white' : 'var(--muted)',
                  }}>
                    {cell.date.getDate()}
                  </div>

                  {events.map(e => (
                    <button
                      key={e.id}
                      onClick={() => setOpenEventId(e.id)}
                      title={e.title}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', marginBottom: 3,
                        padding: '4px 6px', borderRadius: 5, cursor: 'pointer',
                        fontSize: 10, fontWeight: 700, fontFamily: 'inherit',
                        background: e.isPast ? 'var(--bg)' : e.org.color,
                        color: e.isPast ? 'var(--muted)' : 'white',
                        border: e.isPast ? '1px solid var(--border)' : 'none',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}
                    >
                      {formatTimeCompact(e.start_time)} {e.title}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

          <div style={{ padding: '12px 20px', fontSize: 12, color: 'var(--muted)' }}>
            Only events you signed up for appear here. Click one for the full details.
          </div>
        </div>

        {/* Lists */}
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>Coming up</div>
            {upcoming.length === 0 ? (
              <div style={{
                padding: '20px 18px', border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
                fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, background: 'var(--surface)',
              }}>
                Nothing on your calendar yet. Open a pin on the map and hit JOIN on its event.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {upcoming.map(e => <EventRow key={e.id} event={e} onOpen={setOpenEventId} />)}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>Already attended</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {past.map(e => <EventRow key={e.id} event={e} onOpen={setOpenEventId} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {openEventId && <EventModal eventId={openEventId} onClose={() => setOpenEventId(null)} />}
    </div>
  )
}
