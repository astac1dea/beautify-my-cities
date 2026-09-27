import { useMemo, useState, useEffect, useRef } from 'react'
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
import { photoIsPublic } from '../lib/photos'
import { formatDateLong, formatTimeRange } from '../lib/format'
import { useCity } from '../hooks/useCity'
import { useIsMobile } from '../hooks/useMediaQuery'

const SHELL = { maxWidth: 1220, margin: '0 auto', padding: '0 var(--shell-pad, 28px)' }
const BAND_IMAGE = '/band.jpg'

const SLIDES = [
  { src: '/slides/slide1_mayor.jpg',        pos: 'center 30%',   caption: 'Mayor Carmen Montano painting the Library fence mural — Milpitas' },
  { src: '/slides/slide2_levin.jpg',        pos: 'center center', caption: 'Public volunteers painting at Ed R. Levin County Park — Milpitas' },
  { src: '/slides/slide3_bobcat.jpg',       pos: 'center center', caption: 'Completed bobcat mural at Ed R. Levin County Park — Milpitas' },
  { src: '/slides/slide4_cleanup_group.jpg',pos: 'center center', caption: 'Community cleanup with local NGOs CP Mentorship & SSK Foundation — Milpitas Public Library' },
  { src: '/slides/slide5_trashbags.jpg',    pos: 'center top',    caption: 'Community cleanup results — over 40 bags of trash collected at Milpitas Public Library' },
  { src: '/slides/slide6_ayu_vest.jpg',     pos: 'center 25%',   caption: 'Youth volunteer organizers — CP Mentorship & SSK Foundation cleanup event' },
  { src: '/slides/slide7_ayu_mural.jpg',    pos: 'center center', caption: 'Youth volunteers at the Library fence mural painting event — CP Mentorship' },
  { src: '/slides/slide8_flower.jpg',       pos: 'center center', caption: 'Completed purple flower mural at Ed R. Levin County Park — Milpitas' },
]

function HeroSlideshow({ isMobile }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  function goTo(n) {
    setCurrent((n + SLIDES.length) % SLIDES.length)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4500)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4500)
    return () => clearInterval(timerRef.current)
  }, [])

  const slide = SLIDES[current]

  return (
    <section style={{
      position: 'relative',
      height: isMobile ? '60vh' : '100vh',
      maxHeight: isMobile ? 420 : 760,
      overflow: 'hidden',
      color: '#fff',
    }}>
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div key={s.src} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("${s.src}")`,
          backgroundSize: '65%',
          backgroundPosition: s.pos,
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1a1a1a',
          opacity: i === current ? 1 : 0,
          transition: 'opacity 1.4s ease',
        }} />
      ))}

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)',
      }} />

      {/* Hero text */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: isMobile ? '32px 24px 0' : '48px 80px 0',
        maxWidth: 740,
      }}>
        <div style={{
          fontSize: 12, color: '#ccc', display: 'flex', alignItems: 'center',
          gap: 10, marginBottom: 16, letterSpacing: '1.5px', textTransform: 'uppercase',
        }}>
          <span style={{ display: 'inline-block', width: 30, height: 1.5, background: 'white' }} />
          Join us to make our cities more beautiful!
        </div>

        <h1 style={{
          fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.6rem, 3.5vw, 3rem)',
          fontWeight: 800, lineHeight: 1.1, marginBottom: 16, color: '#fff',
        }}>
          See what needs work in your city. Find a way to help.
        </h1>

        <p style={{
          color: '#ddd', maxWidth: 460, lineHeight: 1.8,
          marginBottom: 24, fontSize: isMobile ? 13 : 15,
        }}>
          Residents can report local issues directly onto the map, such as litter, graffiti
          and damaged public spaces. Local organizations can organize volunteer efforts to
          address these issues, and volunteers can get hours signed off!
        </p>

        <Link to="/learn-more" style={{
          color: 'white', textDecoration: 'none', fontSize: 14,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ borderBottom: '1px solid rgba(255,255,255,0.6)', paddingBottom: 3 }}>
            Find out more
          </span>
          {' →'}
        </Link>
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute', top: 24, right: 32,
        color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500, letterSpacing: 1,
      }}>
        {current + 1} / {SLIDES.length}
      </div>

      {/* Bottom bar: dots + caption */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: isMobile ? '16px 24px' : '24px 80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 24 : 8, height: 8,
              borderRadius: i === current ? 4 : '50%',
              background: i === current ? 'white' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        {!isMobile && (
          <div style={{
            color: 'rgba(255,255,255,0.5)', fontSize: 12,
            fontStyle: 'italic', maxWidth: 420, textAlign: 'right',
          }}>
            {slide.caption}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div key={current} style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 2, background: '#2d6a4f',
        animation: 'slideProgress 4.5s linear forwards',
      }} />

      <style>{`
        @keyframes slideProgress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}

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
  { icon: 'pinPlus', title: 'Pin a spot', color: '#059669', bg: '#e3f0e8',
    body: 'See litter, graffiti, or a wall that could hold a mural? Add it to the map with a photo and description. Anyone in the community can see what needs attention.' },
  { icon: 'thumbsUp', title: 'Upvote what matters', color: '#2563EB', bg: '#dbeafe',
    body: 'The community votes on which spots matter most. Top pins rise to the leaderboard so organizations tackle the issues residents actually care about.' },
  { icon: 'users', title: 'Volunteer for a day', color: '#7C3AED', bg: '#ede9fe',
    body: 'Sign up for a volunteer event in one tap. See the date, location and exactly what you will be doing. It lands on your calendar automatically.' },
  { icon: 'clock', title: 'Track your hours', color: '#D97706', bg: '#fef3c7',
    body: 'Once you show up, the organizing group signs off your hours. Your dashboard shows every event joined and every hour contributed to your community.' },
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
  const photo = photoIsPublic(event.spot) ? event.spot.photo_url : null

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {photo && (
        <img src={photo} alt={event.spot.title} style={{
          width: '100%', height: 170, objectFit: 'cover',
          display: 'block', background: 'var(--surface-alt)',
        }} />
      )}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{event.org?.name || 'Local organization'}</div>
        <h3 style={{ fontSize: 17.5, fontWeight: 800, marginTop: 6, lineHeight: 1.35 }}>{event.title}</h3>
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
      <button onClick={() => onOpen(event.id)} style={{
        marginTop: 'auto', width: '100%', padding: '14px 16px', cursor: 'pointer',
        background: 'var(--surface-alt)', border: 'none',
        borderTop: '1px solid var(--border)',
        fontSize: 14, fontWeight: 700, color: 'var(--text)',
      }}>
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
      <HeroSlideshow isMobile={isMobile} />

      {/* Search bar overlapping the hero */}
      <div style={{ ...SHELL, marginTop: isMobile ? -26 : -30, position: 'relative', zIndex: 500 }}>
        <div className="card" style={{
          padding: isMobile ? 14 : '14px 16px', boxShadow: 'var(--shadow-lg)',
          borderRadius: 0, maxWidth: 1020, margin: '0 auto',
        }}>
          <CitySearch size={isMobile ? 'sm' : 'lg'} placeholder="Search for your city" />
        </div>
      </div>


      {/* ── compact impact stats ── */}
      <section style={{ background: '#1d4e2f', padding: isMobile ? '36px 24px' : '44px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 0,
          }}>
            {[
              { icon: '🗑️', number: '85+', desc: 'Bags of trash collected' },
              { icon: '👥', number: '200+', desc: 'Community volunteers' },
              { icon: '🎨', number: '8', desc: 'Murals & art projects' },
              { icon: '📍', number: '5', desc: 'Locations beautified' },
            ].map((stat, i, arr) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: isMobile ? '16px 8px' : '20px 16px',
                borderRight: i < arr.length - 1 && !isMobile ? '1px solid rgba(255,255,255,0.15)' : 'none',
                borderBottom: isMobile && i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontSize: isMobile ? '1.8rem' : 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 6 }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : '1fr 340px',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          borderLeft: isMobile ? 'none' : '1px solid var(--border)',
          marginLeft: isMobile ? 0 : 28,
          background: 'var(--surface)',
        }}>
          <div style={{
            overflow: 'hidden', minWidth: 0,
            borderRight: isMobile ? 'none' : '1px solid var(--border)',
            borderBottom: isMobile ? '1px solid var(--border)' : 'none',
          }}>
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
              spots={visible} placing={placing} draft={draft}
              onMapClick={handleMapClick}
              onOpenSpot={id => { setOpenSpotId(id); setFocusSpotId(id) }}
              height={isMobile ? 380 : 580}
              focusSpotId={focusSpotId} filter={filter}
            />
          </div>

          <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 628 }}>
            <div style={{
              padding: '15px 18px', borderBottom: '1px solid var(--border)',
              fontSize: 14.5, fontWeight: 700, flexShrink: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Most upvoted right now</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>Click to locate on map</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {topSpots.map((spot, i) => {
                const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
                const focused = spot.id === focusSpotId
                return (
                  <button key={spot.id} onClick={() => { setFocusSpotId(spot.id); setOpenSpotId(spot.id) }} style={{
                    display: 'flex', gap: 12, alignItems: 'center', width: '100%',
                    textAlign: 'left', padding: '13px 18px', cursor: 'pointer',
                    background: focused ? 'var(--navy-soft)' : 'none', border: 'none',
                    borderBottom: i === topSpots.length - 1 ? 'none' : '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}>
                    <span style={{ width: 22, fontSize: 13, fontWeight: 700, color: focused ? 'var(--navy)' : 'var(--muted-light)', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ width: 34, height: 34, borderRadius: 0, flexShrink: 0, background: type.bg, color: type.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={type.icon} size="sm" />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: focused ? 'var(--navy)' : 'inherit' }}>{spot.title}</span>
                      <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{type.label}</span>
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
            <div className="rule" style={{ width: 92, height: 1, background: 'var(--border-firm)', margin: '20px auto' }} />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
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
      <section id="how" style={{ background: 'var(--surface-alt)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...SHELL, paddingTop: 72, paddingBottom: 72 }}>
          <SectionTitle
            title="How it works"
            blurb="Four steps, from noticing a problem to holding the hours that prove you helped fix it."
          />
          <div style={{ textAlign: 'center', marginTop: -22, marginBottom: 34 }}>
            <Link to="/learn-more" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 15.5, fontWeight: 700, color: 'var(--link)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Learn more about why we built this
              <Icon name="arrowRight" size="sm" />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={step.title} style={{
                position: 'relative',
                padding: isMobile ? '28px 0' : '0 24px',
                borderRight: !isMobile && i < STEPS.length - 1 ? '1px dashed var(--border)' : 'none',
                borderBottom: isMobile && i < STEPS.length - 1 ? '1px dashed var(--border)' : 'none',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.bg, color: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, marginBottom: 14 }}>{i + 1}</div>
                <div style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 16, background: step.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={step.icon} size="lg" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{step.body}</p>
                {!isMobile && i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', right: -10, top: 52, zIndex: 1, background: 'var(--surface-alt)', color: 'var(--muted)', fontSize: 18, fontWeight: 700 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />

      {draft && <AddPinModal coords={draft} onClose={() => setDraft(null)} onCreated={(spot, openIt) => { if (openIt) setOpenSpotId(spot.id) }} />}
      {openSpotId && <PinPopup spotId={openSpotId} onClose={() => setOpenSpotId(null)} />}
      {openEventId && <EventModal eventId={openEventId} onClose={() => setOpenEventId(null)} />}
    </div>
  )
}
