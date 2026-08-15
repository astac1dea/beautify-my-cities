import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/layout/Topbar'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { useAppState } from '../hooks/useStore'
import { useHours } from '../hooks/useEvents'
import { mySpots, resetDemoData } from '../lib/store'
import { formatDate } from '../lib/format'

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 9,
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

function Card({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        padding: '15px 20px', borderBottom: '1px solid var(--border)',
        fontSize: 14, fontWeight: 800,
      }}>{title}</div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateProfile, signOut } = useAuth()
  const state = useAppState()
  const { totals } = useHours()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    display_name: user.display_name || '',
    school: user.school || '',
    grade: user.grade || '',
    bio: user.bio || '',
  })
  const [saved, setSaved] = useState(false)

  const pins = useMemo(() => mySpots(state), [state])
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }

  function save(e) {
    e.preventDefault()
    updateProfile(form)
    setSaved(true)
  }

  function logOut() {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <div>
      <Topbar
        title="Profile"
        subtitle={`Member since ${formatDate(user.created_at)}`}
        actions={<Button variant="secondary" onClick={logOut}>Log out</Button>}
      />

      <div className="split" style={{ padding: 32 }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <Card title="Your details">
            <form onSubmit={save} style={{ display: 'grid', gap: 16 }}>
              <Field label="Full name">
                <input style={inputStyle} value={form.display_name} onChange={e => set('display_name', e.target.value)} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="School">
                  <input style={inputStyle} value={form.school} onChange={e => set('school', e.target.value)} placeholder="Milpitas High School" />
                </Field>
                <Field label="Grade">
                  <input style={inputStyle} value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="11th grade" />
                </Field>
              </div>

              <Field label="About you">
                <textarea
                  style={{ ...inputStyle, minHeight: 84, resize: 'vertical' }}
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="What kind of volunteering are you into?"
                  maxLength={240}
                />
              </Field>

              <Field label="Email">
                <input style={{ ...inputStyle, color: 'var(--muted)' }} value={user.email || ''} disabled />
              </Field>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Button type="submit">Save changes</Button>
                {saved && <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>Saved</span>}
              </div>
            </form>
          </Card>

          <Card title="Demo data">
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
              Pins, signups and hours are stored in this browser. Resetting puts everything back
              to how the demo accounts started, which is handy before showing someone the app.
            </div>
            <Button variant="danger" onClick={resetDemoData}>Reset demo data</Button>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '26px 22px', textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
              background: user.avatar_color || 'var(--blue-mid)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800,
            }}>
              {user.display_name.charAt(0)}
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 19, fontWeight: 900 }}>
              {user.display_name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              {[user.grade, user.school].filter(Boolean).join(' · ') || 'Milpitas resident'}
            </div>
            {user.bio && (
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>
                {user.bio}
              </div>
            )}
          </div>

          <Card title="At a glance">
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['Verified service hours', totals.verified],
                ['Hours awaiting verification', totals.pending],
                ['Spots pinned', pins.length],
                ['Upvotes collected', pins.reduce((n, s) => n + s.upvotes, 0)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
