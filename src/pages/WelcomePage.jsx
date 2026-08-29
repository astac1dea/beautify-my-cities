import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import { Logo } from '../components/layout/Wordmark'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import CommunityMap from '../components/map/CommunityMap'
import FilterPills from '../components/map/FilterPills'
import AddPinModal from '../components/map/AddPinModal'
import PinPopup from '../components/map/PinPopup'
import EventModal from '../components/events/EventModal'
import { useSpots } from '../hooks/useSpots'
import { useEvents } from '../hooks/useEvents'
import { useCityStats } from '../hooks/useCityStats'
import { PIN_TYPES } from '../lib/constants'
import { formatDateLong, formatTimeRange, plural } from '../lib/format'
import { useCity } from '../hooks/useCity'
import { useIsMobile } from '../hooks/useMediaQuery'

const SHELL = { maxWidth: 1220, margin: '0 auto', padding: '0 var(--shell-pad, 28px)' }

const STEPS = [
  { icon: 'pinPlus', title: 'Put it on the map',
    body: 'Drop a pin on the spot: an overflowing bin, a tagged wall, a bus stop with no shade. The report goes to the organization that handles that kind of work.' },
  { icon: 'thumbsUp', title: 'Neighbours back it',
    body: 'Spots with the most support move up the list. Watch a pin climb the city ranking and see when an organization puts a work day on the calendar for it.' },
  { icon: 'users', title: 'Join a work day',
    body: 'Every scheduled event lists the date, the place and exactly what you would be doing. One tap to sign up, and it lands on your calendar.' },
  { icon: 'award', title: 'Get the hours signed off',
    body: 'Hours are logged as a spreadsheet you can hand to anyone, with the email of the organization that can confirm you were there.' },
]

function SectionHead({ eyebrow, title, blurb, action }) {
  return (
    <>
      <div className="section-head">
        <div style={{ maxWidth: 640 }}>
          {eyebrow && (
            <div className="eyebrow" style={{ color: 'var(--link)', marginBottom: 12 }}>
              {eyebrow}
            </div>
          )}
          <h2 style={{ fontSize: 30, fontWeight: 800 }}>{title}</h2>
          {blurb && (
            <p style={{ fontSize: 15.5, color: 'var(--muted)', marginTop: 10, lineHeight: 1.6 }}>
              {blurb}
            </p>
          )}
        </div>
        {action}
      </div>
    </>
  )
}

function EventCard({ event, onOpen }) {
  const spotsLeft = Math.max(0, (event.max_volunteers || 0) - event.volunteerCount)
  return (
    <button
      onClick={() => onOpen(event.id)}
      className="card"
      style={{
        textAlign: 'left', cursor: 'pointer', padding: 0, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{
        padding: '13px 18px', background: 'var(--navy)', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon name="calendar" size="sm" />
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>
          {formatDateLong(event.event_date)}
        </span>
      </div>

      <div style={{ padding: '18px', display: 'grid', gap: 12, flex: 1 }}>
        <div style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.35 }}>{event.title}</div>

        <div style={{ display: 'grid', gap: 7, fontSize: 13.5, color: 'var(--muted)' }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <Icon name="clock" size="sm" style={{ marginTop: 2, color: 'var(--muted-light)' }} />
            {formatTimeRange(event.start_time, event.end_time)}
          </div>
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <Icon name="pin" size="sm" style={{ marginTop: 2, color: 'var(--muted-light)' }} />
            {event.location}
          </div>
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <Icon name="building" size="sm" style={{ marginTop: 2, color: 'var(--muted-light)' }} />
            {event.org?.name || 'Local organization'}
          </div>
        </div>

        <div style={{
          marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
        }}>
          <Badge color="var(--navy)" bg="var(--navy-soft)">{event.hours} service hours</Badge>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {spotsLeft} of {event.max_volunteers} spots left
          </span>
        </div>
      </div>
    </button>
  )
}

export default function WelcomePage() {
  const { cityId } = useParams()
  const { spots } = useSpots()
  const { upcoming } = useEvents()
  const { city, setCity } = useCity()
  const stats = useCityStats()

  useEffect(() => { if (cityId) setCity(cityId) }, [cityId])

  const isMobile = useIsMobile()

  const [filter, setFilter] = useState('all')
  const [placing, setPlacing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [openSpotId, setOpenSpotId] = useState(null)
  const [openEventId, setOpenEventId] = useState(null)
  const [focusSpotId, setFocusSpotId] = useState(null)

  const visible = filter === 'all' ? spots : spots.filter(s => s.type === filter)
  const topSpots = useMemo(
    () => [...spots].sort((a, b) => b.upvotes - a.upvotes).slice(0, 6),
    [spots]
  )

  function handleMapClick(coords) {
    if (!placing) return
    setDraft(coords)
    setPlacing(false)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <PublicHeader />

      {/* ------------------------------------------------------------ hero */}
      <section style={{ background: 'var(--navy)', color: '#fff', paddingTop: 64 }}>
        <div style={{ ...SHELL, paddingBottom: 90 }}>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.7)', marginBottom: 20 }}>
            {city.name}, {city.state}
          </div>

          <h1 style={{
            fontSize: 'clamp(34px, 4.6vw, 52px)', fontWeight: 800,
            lineHeight: 1.1, maxWidth: 880, marginBottom: 20,
          }}>
            The parts of the city that need work, and the people fixing them.
          </h1>

          <p style={{
            fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,.78)',
            maxWidth: 660, marginBottom: 36,
          }}>
            Beautify My City is a public record of spots around {city.name} that need
            attention, and the volunteer days local organizations are running to deal with
            them. Browse all of it below. You only need an account when you want to report a
            spot or sign up. Not your city? Switch it at the top of the page.
          </p>

          <div style={{ display: 'flex', gap: 34, flexWrap: 'wrap' }}>
            {[
              [stats.open, 'spots open'],
              [stats.resolved, 'resolved'],
              [stats.volunteers, 'volunteers'],
              [stats.upcoming, 'events scheduled'],
            ].map(([n, label]) => (
              <div key={label}>
                <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {n}
                </div>
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.6)', marginTop: 6 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action bar, overlapping the hero the way volunteer.gov does */}
      <div style={{ ...SHELL, marginTop: -52, position: 'relative', zIndex: 10 }}>
        <div className="card" style={{
          padding: 22, boxShadow: 'var(--shadow-lg)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16,
        }}>
          <a href="#events" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              display: 'flex', gap: 15, alignItems: 'center', padding: '16px 18px',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)', height: '100%',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius)', flexShrink: 0,
                background: 'var(--navy-soft)', color: 'var(--navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="calendar" size="lg" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>
                  See the volunteer events in your area
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 3 }}>
                  {plural(upcoming.length, 'event')} coming up across {city.name}
                </div>
              </div>
              <Icon name="arrowRight" size="md" style={{ marginLeft: 'auto', color: 'var(--muted-light)' }} />
            </div>
          </a>

          <a href="#map" onClick={() => setPlacing(true)} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              display: 'flex', gap: 15, alignItems: 'center', padding: '16px 18px',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)', height: '100%',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius)', flexShrink: 0,
                background: 'var(--navy-soft)', color: 'var(--navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="pinPlus" size="lg" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>
                  Put a spot on the map
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 3 }}>
                  Report something that needs cleaning up or fixing
                </div>
              </div>
              <Icon name="arrowRight" size="md" style={{ marginLeft: 'auto', color: 'var(--muted-light)' }} />
            </div>
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------- map */}
      <section id="map" style={{ paddingTop: 56, paddingBottom: 56 }}>
        {/* Section header — centered, stays in SHELL */}
        <div style={{ ...SHELL, marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ maxWidth: 560 }}>
              <div className="eyebrow" style={{ color: 'var(--link)', marginBottom: 12 }}>
                Every reported spot
              </div>
              <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
                The {city.name} map
              </h2>
              <p style={{ fontSize: 15.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                Each pin is something a resident reported. Click one to see who is responsible for it,
                where the request stands, and whether there is a volunteer day scheduled.
              </p>
            </div>
            <div style={{ paddingTop: 4 }}>
              <FilterPills value={filter} onChange={v => { setFilter(v); setFocusSpotId(null) }} spots={spots} />
            </div>
          </div>
        </div>

        {/* Full-width map + leaderboard — breaks out of SHELL */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : '1fr 340px',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          borderLeft: isMobile ? 'none' : '1px solid var(--border)',
          marginLeft: isMobile ? 0 : 28,
          background: 'var(--surface)',
        }}>
          {/* Map */}
          <div style={{
            overflow: 'hidden', minWidth: 0,
            borderRight: isMobile ? 'none' : '1px solid var(--border)',
            borderBottom: isMobile ? '1px solid var(--border)' : 'none',
          }}>
            {/* Toolbar */}
            <div style={{
              padding: '12px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                {placing
                  ? 'Click the map to place your pin.'
                  : `Showing ${visible.length} of ${spots.length} reported spots${filter !== 'all' ? ` · ${filter}` : ''}.`}
              </span>
              <Button
                variant={placing ? 'secondary' : 'primary'}
                icon={placing ? undefined : 'pinPlus'}
                size="sm"
                onClick={() => { setPlacing(p => !p); setDraft(null) }}
              >
                {placing ? 'Cancel' : 'Report a spot'}
              </Button>
            </div>
            <CommunityMap
              spots={visible}
              placing={placing}
              draft={draft}
              onMapClick={handleMapClick}
              onOpenSpot={id => { setOpenSpotId(id); setFocusSpotId(id) }}
              height={isMobile ? 380 : 580}
              focusSpotId={focusSpotId}
              filter={filter}
            />
          </div>

          {/* Leaderboard */}
          <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 628 }}>
            <div style={{
              padding: '15px 18px', borderBottom: '1px solid var(--border)',
              fontSize: 14.5, fontWeight: 700, flexShrink: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Most upvoted right now</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
                Click to locate on map
              </span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {topSpots.map((spot, i) => {
                const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
                const focused = spot.id === focusSpotId
                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setFocusSpotId(spot.id)
                      setOpenSpotId(spot.id)
                    }}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'center', width: '100%',
                      textAlign: 'left', padding: '13px 18px', cursor: 'pointer',
                      background: focused ? 'var(--navy-soft)' : 'none',
                      border: 'none',
                      borderBottom: i === topSpots.length - 1 ? 'none' : '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{
                      width: 22, fontSize: 13, fontWeight: 700,
                      color: focused ? 'var(--navy)' : 'var(--muted-light)', flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      width: 34, height: 34, borderRadius: 'var(--radius)', flexShrink: 0,
                      background: type.bg, color: type.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={type.icon} size="sm" />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        display: 'block', fontSize: 13.5, fontWeight: 600,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        color: focused ? 'var(--navy)' : 'inherit',
                      }}>
                        {spot.title}
                      </span>
                      <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                        {type.label}
                      </span>
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{spot.upvotes}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- events */}
      <section id="events" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...SHELL, paddingTop: 64, paddingBottom: 64 }}>
          <SectionHead
            eyebrow="Coming up"
            title={`Volunteer events in ${city.name}`}
            blurb="Run by local organizations, open to anyone. Each one lists what you would actually be doing and how many service hours it is worth."
          />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 18,
          }}>
            {upcoming.slice(0, 6).map(event => (
              <EventCard key={event.id} event={event} onOpen={setOpenEventId} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- how */}
      <section id="how" style={{ ...SHELL, paddingTop: 64, paddingBottom: 64 }}>
        <SectionHead
          eyebrow="Start to finish"
          title="How it works"
          blurb="Four steps, from noticing a problem to holding the hours that prove you helped fix it."
        />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(238px, 1fr))', gap: 18,
        }}>
          {STEPS.map((step, i) => (
            <div key={step.title} className="card" style={{ padding: '24px 22px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius)', marginBottom: 18,
                background: 'var(--navy-soft)', color: 'var(--navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={step.icon} size="lg" />
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--muted-light)',
                letterSpacing: 0.07, textTransform: 'uppercase', marginBottom: 7,
              }}>
                Step {i + 1}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 9 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- footer */}
      <footer style={{ background: 'var(--navy-dark)', color: 'rgba(255,255,255,.6)' }}>
        <div style={{
          ...SHELL, paddingTop: 40, paddingBottom: 40,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo size={32} background="rgba(255,255,255,.14)" />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Beautify My City</div>
              <div style={{ fontSize: 12.5, marginTop: 2 }}>A civic platform for {city.name}, {city.state}</div>
            </div>
          </div>
          <div style={{ fontSize: 13.5 }}>
            Map data © OpenStreetMap contributors
          </div>
        </div>
      </footer>

      {draft && (
        <AddPinModal
          coords={draft}
          onClose={() => setDraft(null)}
          onCreated={(spot, openIt) => { if (openIt) setOpenSpotId(spot.id) }}
        />
      )}
      {openSpotId && <PinPopup spotId={openSpotId} onClose={() => setOpenSpotId(null)} />}
      {openEventId && <EventModal eventId={openEventId} onClose={() => setOpenEventId(null)} />}
    </div>
  )
}
