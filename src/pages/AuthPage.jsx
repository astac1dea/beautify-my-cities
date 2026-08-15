import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const DEMO_ACCOUNTS = [
  { email: 'maya@demo.city',   name: 'Maya Chen',     note: '47 service hours logged, chasing the Silver Certificate', color: '#7C3AED' },
  { email: 'jordan@demo.city', name: 'Jordan Rivera', note: 'Newer volunteer, two events coming up',                    color: '#1B4FD8' },
  { email: 'sam@demo.city',    name: 'Sam Okafor',    note: 'Reported the most upvoted pins in the city',               color: '#EA580C' },
]
const DEMO_PASSWORD = 'demo1234'

const inputStyle = {
  width: '100%', padding: '11px 13px', borderRadius: 9,
  border: '1px solid var(--border)', background: 'var(--surface)',
  fontSize: 13, fontFamily: 'inherit', color: 'var(--text)',
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

export default function AuthPage() {
  const { isAuthed, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', school: '', grade: '' })
  const [error, setError] = useState('')

  if (isAuthed) return <Navigate to="/map" replace />

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function submit(e) {
    e.preventDefault()
    const result = mode === 'login'
      ? signIn(form.email, form.password)
      : signUp(form)
    if (result.error) return setError(result.error)
    navigate('/map', { replace: true })
  }

  function loginAsDemo(email) {
    setError('')
    const result = signIn(email, DEMO_PASSWORD)
    if (result.error) return setError(result.error)
    navigate('/map', { replace: true })
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    }}>
      {/* Left: the form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 28px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 34 }}>
              <div style={{
                width: 34, height: 34, background: 'var(--blue-mid)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>🌿</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 900 }}>
                Beautify My City
              </div>
            </div>
          </Link>

          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 900, marginBottom: 8 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.55 }}>
            {mode === 'login'
              ? 'Log in to pin spots, join events and track your service hours.'
              : 'Residents of Milpitas can report spots and volunteer. It is free.'}
          </p>

          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            {mode === 'signup' && (
              <Field label="Full name">
                <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Alex Nguyen" />
              </Field>
            )}

            <Field label="Email">
              <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
            </Field>

            <Field label="Password">
              <input style={inputStyle} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'} />
            </Field>

            {mode === 'signup' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="School (optional)">
                  <input style={inputStyle} value={form.school} onChange={e => set('school', e.target.value)} placeholder="Milpitas High" />
                </Field>
                <Field label="Grade (optional)">
                  <input style={inputStyle} value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="11th grade" />
                </Field>
              </div>
            )}

            {error && (
              <div style={{
                fontSize: 12, color: '#DC2626', background: '#FEE2E2',
                border: '1px solid #FECACA', borderRadius: 9, padding: '10px 12px',
              }}>{error}</div>
            )}

            <Button type="submit" size="lg" full>
              {mode === 'login' ? 'Log in' : 'Create account'}
            </Button>
          </form>

          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 20, textAlign: 'center' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'var(--blue)', fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right: demo accounts */}
      <div style={{
        background: 'var(--sidebar)', color: 'white', padding: '48px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{
            display: 'inline-block', padding: '5px 12px', borderRadius: 50,
            background: 'rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 700, marginBottom: 18,
          }}>
            Demo accounts
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>
            Have a look around first
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 26 }}>
            Each of these is loaded with real-looking pins, signups and service hours.
            Pick one to jump straight in.
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            {DEMO_ACCOUNTS.map(acct => (
              <button
                key={acct.email}
                onClick={() => loginAsDemo(acct.email)}
                style={{
                  display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
                  padding: '14px 16px', borderRadius: 11, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontFamily: 'inherit', width: '100%',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: acct.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 800, fontSize: 14,
                }}>{acct.name.charAt(0)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{acct.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, lineHeight: 1.4 }}>
                    {acct.note}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{
            marginTop: 20, padding: '12px 14px', borderRadius: 9,
            background: 'rgba(255,255,255,0.04)', fontSize: 11,
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
          }}>
            You can also type them in by hand. Password for all three is{' '}
            <code style={{ color: 'white', fontWeight: 700 }}>{DEMO_PASSWORD}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
