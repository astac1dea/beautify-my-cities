import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Wordmark from '../components/layout/Wordmark'
import { useAuth } from '../hooks/useAuth'
import { useCity } from '../hooks/useCity'

const DEMO_ACCOUNTS = [
  { email: 'maya@demo.city',   name: 'Maya Chen',     note: '44 verified hours, one short of the Silver Certificate' },
  { email: 'jordan@demo.city', name: 'Jordan Rivera', note: 'Newer volunteer with a few events booked' },
  { email: 'sam@demo.city',    name: 'Sam Okafor',    note: 'Reported the most upvoted pins in the city' },
]
const DEMO_PASSWORD = 'demo1234'

const inputStyle = {
  width: '100%', padding: '11px 13px', borderRadius: 'var(--radius)',
  border: '1px solid var(--border-firm)', background: 'var(--surface)',
  fontSize: 14, color: 'var(--text)',
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function AuthPage() {
  const { isAuthed, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { city } = useCity()
  const [mode, setMode] = useState(params.get('signup') ? 'signup' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', school: '', grade: '' })
  const [error, setError] = useState('')

  if (isAuthed) return <Navigate to="/city/milpitas" replace />

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e) {
    e.preventDefault()
    setError('')
    const result = mode === 'login'
      ? await signIn(form.email, form.password)
      : await signUp(form)
    if (result?.error) return setError(result.error)
    navigate(`/city/milpitas`, { replace: true })
  }

  async function loginAsDemo(email) {
    setError('')
    const result = await signIn(email, DEMO_PASSWORD)
    if (result?.error) return setError(result.error)
    navigate(`/city/milpitas`, { replace: true })
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    }}>
      {/* Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '52px 30px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: 13.5, fontWeight: 600, color: 'var(--muted)',
              textDecoration: 'none', marginBottom: 26,
            }}
          >
            <Icon name="chevronLeft" size="sm" />
            Back to home
          </Link>

          <div style={{ marginBottom: 38 }}>
            <Wordmark size={36} subtitle={`${city.name}, ${city.state}`} />
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>
            {mode === 'login' ? 'Log in' : 'Create your account'}
          </h1>
          <p style={{ fontSize: 14.5, color: 'var(--muted)', marginBottom: 30, lineHeight: 1.6 }}>
            {mode === 'login'
              ? 'You need an account to report spots, upvote and sign up for events. Browsing the map does not require one.'
              : `Open to anyone living in ${city.name}. It is free and takes a moment.`}
          </p>

          <form onSubmit={submit} style={{ display: 'grid', gap: 17 }}>
            {mode === 'signup' && (
              <Field label="Full name">
                <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Alex Nguyen" />
              </Field>
            )}

            <Field label="Email">
              <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
            </Field>

            <Field label="Password">
              <input
                style={inputStyle}
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
              />
            </Field>

            {mode === 'signup' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                <Field label="School (optional)">
                  <input style={inputStyle} value={form.school} onChange={e => set('school', e.target.value)} placeholder="Your school" />
                </Field>
                <Field label="Grade (optional)">
                  <input style={inputStyle} value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="11th grade" />
                </Field>
              </div>
            )}

            {error && (
              <div style={{
                fontSize: 13, color: 'var(--red)', background: 'var(--red-soft)',
                border: '1px solid #E4C7C8', borderRadius: 'var(--radius)', padding: '11px 13px',
              }}>{error}</div>
            )}

            <Button type="submit" size="lg" full>
              {mode === 'login' ? 'Log in' : 'Create account'}
            </Button>
          </form>

          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 22, textAlign: 'center' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'var(--link)', fontWeight: 600, fontSize: 14,
              }}
            >
              {mode === 'login' ? 'Create one' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* Demo accounts */}
      <div style={{
        background: 'var(--navy)', color: '#fff', padding: '52px 30px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.7)', marginBottom: 18 }}>
            Demo accounts
          </div>
          <h2 style={{ fontSize: 23, fontWeight: 800, marginBottom: 12 }}>
            Have a look around first
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.72)', lineHeight: 1.65, marginBottom: 26 }}>
            Each of these is loaded with real-looking pins, signups and service hours.
            Pick one to jump straight in.
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            {DEMO_ACCOUNTS.map(acct => (
              <button
                key={acct.email}
                onClick={() => loginAsDemo(acct.email)}
                style={{
                  display: 'flex', gap: 13, alignItems: 'center', textAlign: 'left',
                  padding: '15px 16px', borderRadius: 'var(--radius)', cursor: 'pointer',
                  background: 'rgba(255,255,255,.07)',
                  border: '1px solid rgba(255,255,255,.14)',
                  color: '#fff', width: '100%',
                }}
              >
                <span style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14,
                }}>{acct.name.charAt(0)}</span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{acct.name}</span>
                  <span style={{
                    display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,.58)',
                    marginTop: 2, lineHeight: 1.45,
                  }}>
                    {acct.note}
                  </span>
                </span>
                <Icon name="arrowRight" size="sm" style={{ color: 'rgba(255,255,255,.5)' }} />
              </button>
            ))}
          </div>

          <div style={{
            marginTop: 20, padding: '13px 15px', borderRadius: 'var(--radius)',
            background: 'rgba(255,255,255,.05)', fontSize: 12.5,
            color: 'rgba(255,255,255,.58)', lineHeight: 1.6,
          }}>
            You can also type them in by hand. The password for all three is{' '}
            <code style={{ color: '#fff', fontWeight: 700 }}>{DEMO_PASSWORD}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
