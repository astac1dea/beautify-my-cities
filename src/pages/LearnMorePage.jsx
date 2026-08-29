import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import PublicFooter from '../components/layout/PublicFooter'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { useCity } from '../hooks/useCity'

const SHELL = { maxWidth: 1220, margin: '0 auto', padding: '0 var(--shell-pad, 28px)' }

// Same placeholder band as the welcome page. Drop /hero.jpg in /public and
// both pages pick it up.
const HERO_IMAGE = '/hero.jpg'

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

const WHAT_YOU_CAN_DO = [
  { icon: 'pinPlus', title: 'Pin a spot',
    body: 'Litter that needs clearing, a wall that could hold a mural, a corner nobody has looked at in years. Add it to the map and everyone can see it.' },
  { icon: 'thumbsUp', title: 'Back the ones that matter',
    body: 'Upvotes decide what rises to the top, so the spots the neighbourhood actually cares about are the ones organizations see first.' },
  { icon: 'users', title: 'Volunteer with a local organization',
    body: 'Signing up takes one tap. The organization running the work day handles the rest, and your hours are awarded once they confirm you were there.' },
]

export default function LearnMorePage() {
  const { city } = useCity()

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <PublicHeader />

      {/* ------------------------------------------------------------ hero */}
      <section style={{ ...photoBand(HERO_IMAGE), color: '#fff' }}>
        <div style={{ ...SHELL, paddingTop: 84, paddingBottom: 84 }}>
          <div className="eyebrow" style={{
            color: '#fff', marginBottom: 20, textTransform: 'none',
            fontSize: 15, letterSpacing: 0,
          }}>
            Learn more
          </div>
          <h1 style={{
            fontSize: 'clamp(30px, 4.4vw, 50px)', fontWeight: 800,
            lineHeight: 1.14, maxWidth: 860,
          }}>
            Why we built this
          </h1>
        </div>
      </section>

      {/* ----------------------------------------------------------- story */}
      <section style={{ ...SHELL, paddingTop: 72, paddingBottom: 72 }}>
        <div className="section-title">
          <h2>Our story</h2>
          <div className="rule" />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--text)', marginBottom: 22 }}>
            We were inspired by Milpitas Mayor Carmen Montano's efforts in beautifying the
            city. Through that initiative, we decided to create a website where residents can
            pin on areas that need work, for example a place with a lot of litter that needs
            clean up or a wall full of graffiti that could have a mural.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--text)' }}>
            With these pins, we can create a community of problem solving and fix issues
            quickly. If you want to volunteer, it is easy to sign up to volunteer with local
            organizations and be awarded volunteer hours.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------- what you can do */}
      <section style={{
        background: 'var(--surface-alt)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ ...SHELL, paddingTop: 72, paddingBottom: 72 }}>
          <div className="section-title">
            <h2>What you can do here</h2>
            <div className="rule" />
            <p>Three things, and none of them need an account until you want to take part.</p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18,
          }}>
            {WHAT_YOU_CAN_DO.map(item => (
              <div key={item.title} className="card" style={{ padding: '26px 22px' }}>
                <div style={{
                  width: 46, height: 46, marginBottom: 18,
                  background: 'var(--navy)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={item.icon} size="lg" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 9 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section style={{ ...SHELL, paddingTop: 72, paddingBottom: 72, textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800 }}>
          Have a look at {city.name}
        </h2>
        <div className="rule" style={{
          width: 92, height: 1, background: 'var(--border-firm)', margin: '20px auto',
        }} />
        <p style={{
          fontSize: 16.5, color: 'var(--muted)', lineHeight: 1.6,
          marginBottom: 26, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Every spot residents have reported so far is on the map, along with the volunteer
          days local organizations have scheduled.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button size="lg">See the map</Button>
          </Link>
          <Link to="/login?signup=1" style={{ textDecoration: 'none' }}>
            <Button size="lg" variant="secondary">Create an account</Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
