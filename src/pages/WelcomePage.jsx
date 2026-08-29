import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import { Logo } from '../components/layout/Wordmark'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import CitySearch from '../components/layout/CitySearch'
import CommunityMap from '../components/map/CommunityMap'
import FilterPills from '../components/map/FilterPills'
import AddPinModal from '../components/map/AddPinModal'
import PinPopup from '../components/map/PinPopup'
import EventModal from '../components/events/EventModal'
import { useSpots } from '../hooks/useSpots'
import { useEvents } from '../hooks/useEvents'
import { useCityStats } from '../hooks/useCityStats'
import { PIN_TYPES } from '../lib/constants'
import { formatDateLong, formatTimeRange } from '../lib/format'
import { useCity } from '../hooks/useCity'
import { useIsMobile } from '../hooks/useMediaQuery'

const SHELL = { maxWidth: 1220, margin: '0 auto', padding: '0 var(--shell-pad, 28px)' }

// Drop the real photographs at these paths in /public and they take over.
// Until then each band falls back to a dark hatched placeholder.
const HERO_IMAGE = '/hero.jpg'
const BAND_IMAGE = '/band.jpg'

// A full-bleed photo band. The image sits over a hatch so a missing file
// still reads as a deliberate dark band rather than a broken page.
function photoBand(src, dim = 0.55) {
  return {
    backgroundColor: '#1A1A1A',
    backgroundImage: [
      `linear-gradient(rgba(12,12,12,${dim}), rgba(12,12,12,${dim}))`,
      `url("${src}")`,
      'repeating-linear-gradient(135deg, #1F1F1F 0 14px, #191919 14px 28px)',
    ].join(', '),
    backgroundSize: 'cover, cover, auto',
    backgroundPosition: 'center, center, center',
    backgroundRepeat: 'no-repeat, no-repeat, repeat',
  }
}

const STEPS = [
  { icon: 'pinPlus', title: 'Put it on the map',
    body: 'Drop a pin on the spot: an overflowing bin, a tagged wall, a bus stop with no shade. The report goes to the organization that handles that kind of work.' },
  { icon: 'thumbsUp', title: 'Neighbours back it',
    body: 'Spots with the most support move up the list. Watch a pin climb the city ranking and see when an organization puts a work day on the calendar for it.' },
  { icon: 'users', title: 'Join a work day',
    body: 'Every scheduled event lists the date, the place and exactly what you would be doing. One tap to sign up, and it lands on your calendar.' },
  { icon: 'clock', title: 'Get the hours signed off',
    body: 'Hours are logged as a spreadsheet you can hand to anyone, with the email of the organization that can confirm you were there.' },
]

function SectionTitle({ title, blurb }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <div className="rule" />
      {blurb && <p>{blurb}</p>}
    </div>
  )
}

// One of the dark "find the right fit" tiles. Clicking it filters the map.
function FitTile({ icon, label, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
        height: 190, borderRadius: 'var(--radius)', padding: 18,
        background: hov ? '#111' : 'var(--navy)', color: '#fff',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14,
        transition: 'background .15s ease, transform .15s ease',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}
    >
      <Icon name={icon} size={38} stroke={1.4} />
      <span style={{ fontSize: 15, fontWeight: 700, textAlign: 'center' }}>{label}</span>
    </button>
  )
}

function EventCard({ event, onOpen }) {
  const spotsLeft = Math.max(0, (event.max_volunteers || 0) - event.volunteerCount)
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {event.org?.name || 'Local organization'}
        </div>
        <h3 style={{ fontSize: 17.5, fontWeight: 800, marginTop: 6, lineHeight: 1.35 }}>
          {event.title}
        </h3>
        <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

        <div style={{ display: 'grid', gap: 9, fontSize: 13.5, color: 'var(--text)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="pin" size="sm" style={{ marginTop: 2, color: 'var(--muted-light)' }} />
            {event.location}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="calendar" size="sm" style={{ marginTop: 2, color: 'var(--muted-light)' }} />
            {formatDateLong(event.event_date)}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="clock" size="sm" style={{ marginTop: 2, color: 'var(--muted-light)' }} />
            {formatTimeRange(event.start_time, event.end_time)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 20px' }}>
          <Badge color="var(--navy)" bg="var(--navy-soft)">{event.hours} service hours</Badge>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {spotsLeft} of {event.max_volunteers} spots left
          </span>
        </div>
      </div>

      <button
        onClick={() => onOpen(event.id)}
        style={{
          marginTop: 'auto', width: '100%', padding: '14px 16px', cursor: 'pointer',
          background: 'var(--surface-alt)', border: 'none',
          borderTop: '1px solid var(--border)',
          fontSize: 14, fontWeight: 700, color: 'var(--text)',
        }}
      >
        More info
      </button>
    </div>
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

  function showOnMap(type) {
    setFilter(type)
    setFocusSpotId(null)
    document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <PublicHeader />

      {/* ------------------------------------------------------------ hero */}
      <section style={{ ...photoBand(HERO_IMAGE), color: '#fff', position: 'relative' }}>
        <div style={{ ...SHELL, paddingTop: isMobile ? 64 : 108, paddingBottom: isMobile ? 96 : 132 }}>
          <div className="eyebrow" style={{ color: '#fff', marginBottom: 22 }}>
            Find a spot. Fix it together.
          </div>

          <h1 style={{
            fontSize: 'clamp(30px, 4.4vw, 50px)', fontWeight: 800,
            lineHeight: 1.14, maxWidth: 920, marginBottom: 18,
          }}>
            See what needs work in {city.name}, and join the people already fixing it.
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.55,
            color: 'rgba(255,255,255,.85)', maxWidth: 760, marginBottom: 30,
          }}>
            Every pin on this map was put there by a resident. Local organizations run the
            volunteer days that clear them, and the hours you put in get signed off by the
            organization that supervised you.
          </p>

          <a href="#how" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            color: '#fff', fontSize: 17, fontWeight: 700, textDecoration: 'underline',
            textUnderlineOffset: 5,
          }}>
            <Icon name="checkCircle" size="lg" />
            Find out more
          </a>
        </div>
      </section>

      {/* The search bar, overlapping the hero the way volunteer.gov does */}
      <div style={{ ...SHELL, marginTop: isMobile ? -44 : -52, position: 'relative', zIndex: 500 }}>
        <div className="card" style={{
          padding: isMobile ? 16 : '26px 34px', boxShadow: 'var(--shadow-lg)',
          maxWidth: 1080, margin: '0 auto',
        }}>
          <CitySearch size={isMobile ? 'sm' : 'lg'} placeholder="Search for your city" />
        </div>
      </div>

      {/* City numbers */}
      <div style={{ ...SHELL, paddingTop: 44 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 1, background: 'var(--border)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden',
        }}>
          {[
            [stats.open, 'spots open'],
            [stats.resolved, 'resolved'],
            [stats.volunteers, 'volunteers'],
            [stats.upcoming, 'events scheduled'],
          ].map(([n, label]) => (
            <div key={label} style={{ background: 'var(--surface)', padding: '22px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.025em' }}>
                {n}
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------- right fit */}
      <section style={{ ...SHELL, paddingTop: 72, paddingBottom: 72 }}>
        <SectionTitle
          title="Find the right fit"
          blurb={`The work in ${city.name} comes in all shapes and sizes. Pick the kind you care about and the map filters to it.`}
        />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(212px, 1fr))', gap: 16,
        }}>
          {Object.entries(PIN_TYPES).map(([key, meta]) => (
            <FitTile key={key} icon={meta.icon} label={meta.label} onClick={() => showOnMap(key)} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- map */}
      <section id="map" style={{ paddingTop: 16, paddingBottom: 72 }}>
        <div style={{ ...SHELL }}>
          <SectionTitle
            title={`The ${city.name} map`}
            blurb="Each pin is something a resident reported. Click one to see who is responsible for it, where the request stands, and whether there is a volunteer day scheduled."
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <FilterPills value={filter} onChange={v => { setFilter(v); setFocusSpotId(null) }} spots={spots} />
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

      {/* ------------------------------------------------------- photo band */}
      <section style={{ ...photoBand(BAND_IMAGE, 0.42) }}>
        <div style={{ ...SHELL, paddingTop: 72, paddingBottom: 72 }}>
          <div style={{
            background: 'rgba(255,255,255,.94)', borderRadius: 'var(--radius)',
            padding: isMobile ? '32px 22px' : '46px 40px', textAlign: 'center',
            maxWidth: 900, margin: '0 auto',
          }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800 }}>
              Something on your street needs work?
            </h2>
            <div className="rule" style={{
              width: 92, height: 1, background: 'var(--border-firm)', margin: '20px auto',
            }} />
            <p style={{ fontSize: 16.5, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 26 }}>
              Put it on the map and it goes to the organization that handles that kind of work.
              You only need an account to report a spot or sign up for an event.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#map" onClick={() => setPlacing(true)} style={{ textDecoration: 'none' }}>
                <Button size="lg">Report a spot</Button>
              </a>
              <a href="#events" style={{ textDecoration: 'none' }}>
                <Button size="lg" variant="secondary">See the events</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- events */}
      <section id="events" style={{ ...SHELL, paddingTop: 72, paddingBottom: 72 }}>
        <SectionTitle
          title={`Volunteer events in ${city.name}`}
          blurb="Run by local organizations, open to anyone. Each one lists what you would actually be doing and how many service hours it is worth."
        />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18,
        }}>
          {upcoming.slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} onOpen={setOpenEventId} />
          ))}
        </div>

        {upcoming.length > 6 && (
          <a href="/calendar" style={{ textDecoration: 'none' }}>
            <div style={{
              marginTop: 26, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
              padding: '18px 20px', textAlign: 'center', cursor: 'pointer',
              border: '1px solid var(--border-firm)', borderRadius: 'var(--radius)',
              fontSize: 15, fontWeight: 700, color: 'var(--text)', background: 'var(--surface)',
            }}>
              See all {upcoming.length} events
            </div>
          </a>
        )}
      </section>

      {/* ------------------------------------------------------------- how */}
      <section id="how" style={{
        background: 'var(--surface-alt)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ ...SHELL, paddingTop: 72, paddingBottom: 72 }}>
          <SectionTitle
            title="How it works"
            blurb="Four steps, from noticing a problem to holding the hours that prove you helped fix it."
          />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(238px, 1fr))', gap: 18,
          }}>
            {STEPS.map((step, i) => (
              <div key={step.title} className="card" style={{ padding: '26px 22px' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 'var(--radius)', marginBottom: 18,
                  background: 'var(--navy)', color: '#fff',
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
        </div>
      </section>

      {/* ---------------------------------------------------------- footer */}
      <footer style={{ background: 'var(--surface-alt)', color: 'var(--muted)' }}>
        <div style={{
          ...SHELL, paddingTop: 40, paddingBottom: 40,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo size={32} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Beautify My City</div>
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
