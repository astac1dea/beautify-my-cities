import { Link, Navigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { AWARD_TIERS } from '../lib/constants'

const STEPS = [
  {
    emoji: '📍',
    title: 'Pin what needs work',
    body: 'Drop a pin on the spot: overflowing bins, a tagged wall, a bus stop with no shade. Your report goes straight to the organization that handles that kind of work.',
  },
  {
    emoji: '👍',
    title: 'Neighbours upvote it',
    body: 'Spots with the most support move up the list. Watch your pin climb the city ranking and see when an organization schedules a work day for it.',
  },
  {
    emoji: '🙋',
    title: 'Join a volunteer day',
    body: 'Every scheduled event tells you the date, the place and exactly what you would be doing. One tap to sign up, and it lands on your calendar.',
  },
  {
    emoji: '⏱️',
    title: 'Track your service hours',
    body: 'Hours are logged as a spreadsheet you can hand to anyone, with the email of the organization that can confirm you were there.',
  },
]

export default function WelcomePage() {
  const { isAuthed } = useAuth()
  if (isAuthed) return <Navigate to="/map" replace />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 32px', maxWidth: 1180, margin: '0 auto', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: 'var(--blue-mid)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🌿</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 900 }}>
            Beautify My City
          </div>
        </div>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">Log in</Button>
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: 1180, margin: '0 auto', padding: '56px 32px 64px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 48, alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 20,
            padding: '6px 13px', borderRadius: 50, background: 'var(--blue-light)',
            color: 'var(--blue)', fontSize: 12, fontWeight: 700,
          }}>
            📍 Now live in Milpitas, CA
          </div>

          <h1 style={{
            fontFamily: 'Fraunces, serif', fontSize: 'clamp(38px, 5.5vw, 60px)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: -1, marginBottom: 20,
          }}>
            See something<br />that needs fixing?<br />
            <span style={{ color: 'var(--blue)' }}>Put it on the map.</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 480, marginBottom: 32 }}>
            Beautify My City connects residents who notice the problems with the organizations
            that can fix them. Pin a spot, rally your neighbours, show up on the day, and walk
            away with verified service hours.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button size="lg">Get started</Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="secondary">Try a demo account</Button>
            </Link>
          </div>
        </div>

        {/* Illustrative map card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 18, padding: 24, boxShadow: '0 20px 50px rgba(15,23,41,0.09)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
            This week in Milpitas
          </div>
          {[
            { emoji: '🗑️', title: 'Park & Abel Intersection', meta: '142 upvotes · cleanup scheduled', color: '#EA580C', bg: '#FFF0E6' },
            { emoji: '🎨', title: 'Main St. Blank Wall', meta: '98 upvotes · mural finished', color: '#7C3AED', bg: '#F3EFFE' },
            { emoji: '🚫', title: 'Calaveras Underpass', meta: '77 upvotes · prep day booked', color: '#DC2626', bg: '#FEE2E2' },
            { emoji: '🪑', title: 'Civic Center Bus Stop', meta: '61 upvotes · under review', color: '#16A34A', bg: '#DCFCE7' },
          ].map(row => (
            <div key={row.title} style={{
              display: 'flex', gap: 12, alignItems: 'center', padding: '11px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: row.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0,
              }}>{row.emoji}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{row.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{row.meta}</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'var(--muted)', paddingTop: 14 }}>
            312 residents volunteering · 89 spots resolved
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 900, marginBottom: 12 }}>
            How it works
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 40, maxWidth: 560, lineHeight: 1.6 }}>
            Four steps, from noticing a problem to holding the hours that prove you helped fix it.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20,
          }}>
            {STEPS.map((step, i) => (
              <div key={step.title} style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '24px 22px',
              }}>
                <div style={{ fontSize: 26, marginBottom: 14 }}>{step.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', marginBottom: 6 }}>
                  STEP {i + 1}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Congressional Award */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{
          background: 'var(--sidebar)', borderRadius: 18, padding: '44px 40px', color: 'white',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-block', padding: '5px 12px', borderRadius: 50,
              background: 'rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 700, marginBottom: 18,
            }}>
              🏅 Congressional Award
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
              Your hours, ready to be verified
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
              The Congressional Award is the United States Congress&rsquo; award for young people, earned
              partly through voluntary public service. Every hour you log here is tied to the
              organization that supervised it, with their email attached, so when you submit your
              record they can confirm you were there.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {AWARD_TIERS.map(tier => (
              <div key={tier.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 16px', borderRadius: 9, background: 'rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <span style={{ fontWeight: 600 }}>{tier.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>{tier.hours} hrs</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px 80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 900, marginBottom: 14 }}>
          Start with one pin
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 26, lineHeight: 1.6 }}>
          It takes about a minute, and somebody who can actually fix it will see it.
        </p>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button size="lg">Create your account</Button>
        </Link>
      </section>

      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px 32px',
        fontSize: 12, color: 'var(--muted)', textAlign: 'center',
      }}>
        Beautify My City · A civic platform for Milpitas, CA
      </footer>
    </div>
  )
}
