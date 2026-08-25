import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Logo } from '../components/layout/Wordmark'
import { CITIES } from '../lib/cities'
import { useCityStats } from '../hooks/useCityStats'
import Icon from '../components/ui/Icon'
import { useIsMobile } from '../hooks/useMediaQuery'

const CITY_SHORT = {
  'milpitas':  'MIL',
  'fremont':   'FRE',
  'san-jose':  'SJ',
  'sunnyvale': 'SUN',
}

const CORAL      = '#e8845a'
const CORAL_SOFT = 'rgba(232,132,90,0.14)'
const CORAL_BDR  = 'rgba(232,132,90,0.3)'
const NAVY       = '#1a3352'

function CityCard({ c, selected, onSelect }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={() => onSelect(c.slug)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        padding: '11px 12px', borderRadius: 9,
        boxSizing: 'border-box', minWidth: 0,
        background: selected ? '#fff' : hov ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
        border: selected ? '1.5px solid #fff' : '1.5px solid rgba(255,255,255,0.13)',
        transition: 'all 0.13s',
      }}
    >
      <span style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: selected ? 'rgba(26,51,82,0.1)' : 'rgba(255,255,255,0.12)',
        color: selected ? NAVY : 'rgba(255,255,255,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9.5, fontWeight: 700, letterSpacing: '0.02em',
      }}>
        {CITY_SHORT[c.slug] || c.name[0]}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: selected ? NAVY : '#fff', flex: 1 }}>
        {c.name}
      </span>
      {selected && <span style={{ color: CORAL, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</span>}
    </button>
  )
}

function StepNum({ n }) {
  return (
    <span style={{
      width: 19, height: 19, borderRadius: '50%', flexShrink: 0,
      background: CORAL, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9.5, fontWeight: 700,
    }}>{n}</span>
  )
}

function ActionCard({ icon, title, desc, onClick, primary }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11,
        padding: '11px 13px', borderRadius: 9,
        background: hov ? 'rgba(255,255,255,0.97)' : '#fff',
        border: primary
          ? `2px solid ${CORAL}`
          : hov ? '1.5px solid #bcc8d8' : '1.5px solid #dde4ed',
        transition: 'all 0.13s', width: '100%', textAlign: 'left',
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        background: primary ? CORAL_SOFT : 'rgba(26,51,82,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size="md" style={{ color: primary ? CORAL : NAVY }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{title}</span>
          {primary && (
            <span style={{
              fontSize: 9.5, fontWeight: 700, color: CORAL,
              background: CORAL_SOFT, border: `1px solid ${CORAL_BDR}`,
              borderRadius: 4, padding: '1px 5px',
            }}>Most popular</span>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: '#6b7c93', lineHeight: 1.45 }}>{desc}</div>
      </div>
      <Icon name="arrowRight" size="sm" style={{ color: primary ? CORAL : '#9aafcc', flexShrink: 0 }} />
    </button>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [selectedCityId, setSelectedCityId] = useState('milpitas')
  const stats = useCityStats()

  function go(section) {
    navigate(`/city/${selectedCityId}${section ? '#' + section : ''}`)
  }

  return (
    <div style={{
      minHeight: '100vh', background: NAVY,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* Header */}
      <header style={{
        padding: isMobile ? '12px 16px' : '13px 32px',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1 }}>
          <Logo size={27} background="rgba(255,255,255,0.12)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Beautify My City</span>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.85)', borderRadius: 7,
              padding: '6px 15px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>Log in</button>
          </Link>
          <Link to="/login?signup=1" style={{ textDecoration: 'none' }}>
            <button style={{
              background: CORAL, border: 'none', color: '#fff', borderRadius: 7,
              padding: '6px 15px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>Create account</button>
          </Link>
        </div>
      </header>

      {/* Two-column main */}
      <main style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : '1fr 1fr',
        minHeight: 0,
      }}>

        {/* LEFT — headline + stats */}
        <div style={{
          padding: isMobile ? '32px 16px' : '0 40px 0 32px',
          borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
          borderBottom: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          minWidth: 0,
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: CORAL_SOFT, border: `1px solid ${CORAL_BDR}`,
            borderRadius: 20, padding: '4px 13px',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
            color: '#f4a882', marginBottom: 22, alignSelf: 'flex-start',
          }}>
            MILPITAS · FREMONT · SAN JOSÉ · SUNNYVALE
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(28px, 3.2vw, 46px)', fontWeight: 800,
            color: '#fff', lineHeight: 1.1, marginBottom: 16,
          }}>
            Your neighborhood.<br />Your city.<br />Your move.
          </h1>

          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.58)',
            lineHeight: 1.7, maxWidth: 380, marginBottom: 36,
          }}>
            See what spots need attention, join a volunteer cleanup day,
            or pin a problem only you know about. Free to browse — account
            only needed to report.
          </p>

          {/* Live stats */}
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {[
              [stats.open,      'spots open'],
              [stats.resolved,  'resolved'],
              [stats.volunteers,'volunteers'],
              [stats.upcoming,  'events'],
            ].map(([n, label], i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
                {i > 0 && (
                  <div style={{
                    width: 1, background: 'rgba(255,255,255,0.12)',
                    margin: '0 18px', alignSelf: 'stretch',
                  }} />
                )}
                <div>
                  <div style={{
                    fontSize: 26, fontWeight: 800, color: '#fff',
                    lineHeight: 1, letterSpacing: '-0.02em',
                  }}>{n}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.42)', marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — step cards */}
        <div style={{
          padding: isMobile ? '28px 16px 36px' : '0 32px 0 28px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: 12,
        }}>

          {/* Step 1 */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 13, padding: '18px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              <StepNum n={1} /> Select your city
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 7,
            }}>
              {CITIES.map(c => (
                <CityCard
                  key={c.slug} c={c}
                  selected={selectedCityId === c.slug}
                  onSelect={setSelectedCityId}
                />
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.26)', marginTop: 9 }}>
              More cities coming soon — we're growing.
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 13, padding: '18px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              <StepNum n={2} /> What would you like to do?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <ActionCard
                icon="map" primary
                title="See what needs fixing near me"
                desc="Browse reported spots on the map."
                onClick={() => go('map')}
              />
              <ActionCard
                icon="calendar"
                title="Find a volunteer event"
                desc="Join a cleanup or mural day near you."
                onClick={() => go('events')}
              />
              <ActionCard
                icon="pinPlus"
                title="Report a spot"
                desc="Pin a problem only you know about."
                onClick={() => go('map')}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '16px' : '13px 32px', textAlign: 'center', flexShrink: 0,
        fontSize: 11.5, color: 'rgba(255,255,255,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        Built by Annie Yu &amp; Olivia Xia · Milpitas Youth Advisory Commissioners ·{' '}
        <span style={{ color: 'rgba(255,255,255,0.38)' }}>beautifymycities.org</span>
      </footer>

    </div>
  )
}
