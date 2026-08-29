import { useMemo, useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import PublicFooter from '../components/layout/PublicFooter'
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
    backgroundColor: '#0E0E0E',
    backgroundImage: [
      `linear-gradient(rgba(12,12,12,${dim}), rgba(12,12,12,${dim}))`,
      `url("${src}")`,
      'repeating-linear-gradient(135deg, #131313 0 14px, #0C0C0C 14px 28px)',
    ].join(', '),
    backgroundSize: 'cover, cover, auto',
    backgroundPosition: 'center, center, center',
    backgroundRepeat: 'no-repeat, no-repeat, repeat',
  }
}

const STEPS = [
  { icon: 'pinPlus', title: 'Put it on the map',
    body: 'See something that needs attention? You can add it to the map with a pin, photo and description. Anyone can see what needs improvement.' },
  { icon: 'thumbsUp', title: 'Get your community behind it',
    body: 'Upvote pins that you think matter. Watch the leaderboard of pins and see issues get fixed.' },
  { icon: 'users', title: 'Join the action!',
    body: 'Join the volunteer effort - see the date, the place and exactly what you would be doing. One tap to sign up, and it lands on your calendar.' },
  { icon: 'clock', title: 'See the impact',
    body: 'Make your community more beautiful! Create an account and track your work and volunteer hours.' },
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
          <Badge color="var(--navy-deep)" bg="var(--navy-soft)">{event.hours} service hours</Badge>
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

  useEffect(() => { if (cityId) setCity(cityId) }, [cityId])

  // The public nav links here as /#map and friends, from this page or another.
  // Arriving from another page, the section is not laid out yet on the first
  // frame, and the map settling afterwards moves it again - so scroll once the
  // target exists, then correct once more when everything has stopped moving.
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    let cancelled = false
    const timers = []

    const scroll = behavior => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior })
      return !!el
    }

    const attempt = tries => {
      if (cancelled) return
      if (scroll('smooth')) {
        timers.push(setTimeout(() => { if (!cancelled) scroll('auto') }, 600))
      } else if (tries < 20) {
        timers.push(setTimeout(() => attempt(tries + 1), 50))
      }
    }

    timers.push(setTimeout(() => attempt(0), 60))
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [hash])

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
      <section style={{ ...photoBand(HERO_IMAGE), color: '#fff', position: 'relative' }}>
        <div style={{ ...SHELL, paddingTop: isMobile ? 64 : 108, paddingBottom: isMobile ? 96 : 132 }}>
          <div className="eyebrow" style={{
            color: '#fff', marginBottom: 20, textTransform: 'none',
            fontSize: 15, letterSpacing: 0,
          }}>
            Join us to make our cities more beautiful!
          </div>

          <h1 style={{
            fontSize: 'clamp(30px, 4.4vw, 50px)', fontWeight: 800,
            lineHeight: 1.14, maxWidth: 920, marginBottom: 18,
          }}>
            See what needs work in your city. Find a way to help. 
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.55,
            color: 'rgba(255,255,255,.85)', maxWidth: 760, marginBottom: 30,
          }}>
            Residents can report local issues directly onto the map, such as litter, grafitti
            and damaged public spaces. Local organizations can organize volunteer 
            efforts to address these issues, and volunteers can get hours signed off! 
          </p>

          <Link to="/learn-more" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            color: '#fff', fontSize: 17, fontWeight: 700, textDecoration: 'underline',
            textUnderlineOffset: 5,
          }}>
            <Icon name="checkCircle" size="lg" />
            Find out more
          </Link>
        </div>
      </section>

      {/* The search bar, overlapping the hero the way volunteer.gov does */}
      <div style={{ ...SHELL, marginTop: isMobile ? -26 : -30, position: 'relative', zIndex: 500 }}>
        <div className="card" style={{
          padding: isMobile ? 14 : '14px 16px', boxShadow: 'var(--shadow-lg)',
          borderRadius: 0,
          maxWidth: 1020, margin: '0 auto',
        }}>
          <CitySearch size={isMobile ? 'sm' : 'lg'} placeholder="Search for your city" />
        </div>
      </div>

      {/* ------------------------------------------------------------- map */}
      <section id="map" style={{ paddingTop: 72, paddingBottom: 72 }}>
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
                      width: 34, height: 34, borderRadius: 0, flexShrink: 0,
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
            background: 'rgba(255,255,255,.94)', borderRadius: 0,
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
              border: '1px solid var(--border-firm)', borderRadius: 0,
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

          <div style={{ textAlign: 'center', marginTop: -22, marginBottom: 34 }}>
            <Link to="/learn-more" style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              fontSize: 15.5, fontWeight: 700, color: 'var(--link)',
              textDecoration: 'underline', textUnderlineOffset: 4,
            }}>
              Learn more about why we built this
              <Icon name="arrowRight" size="sm" />
            </Link>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(238px, 1fr))', gap: 18,
          }}>
            {STEPS.map((step, i) => (
              <div key={step.title} className="card" style={{ padding: '26px 22px' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 0, marginBottom: 18,
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

      <PublicFooter />

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
