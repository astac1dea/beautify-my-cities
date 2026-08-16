import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { PIN_TYPES, TYPE_TO_ORG } from '../../lib/constants'
import { addSpot, orgById } from '../../lib/store'
import { useAuth } from '../../hooks/useAuth'

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius)',
  border: '1px solid var(--border-firm)', background: 'var(--surface)',
  fontSize: 14, color: 'var(--text)',
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 7 }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>{hint}</div>}
    </div>
  )
}

export default function AddPinModal({ coords, onClose, onCreated }) {
  const { isAuthed } = useAuth()
  const [type, setType] = useState('trash')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)

  const org = orgById(TYPE_TO_ORG[type])

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return setError('Give the spot a short name so people can find it.')
    if (!description.trim()) return setError('Describe what needs doing here.')
    setError('')
    setCreated(addSpot({ type, title, description, lat: coords.lat, lng: coords.lng }))
  }

  // Anyone can browse, but reporting a spot needs an account.
  if (!isAuthed) {
    return (
      <Modal
        open
        onClose={onClose}
        width={460}
        title="Create an account to report a spot"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>Not now</Button>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button>Create account</Button>
            </Link>
          </>
        }
      >
        <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
          Reports go to a real organization, so we ask for an account to keep track of who
          filed what and to send you updates as the request moves along. It takes a moment,
          and you can browse everything else without one.
        </div>
      </Modal>
    )
  }

  // After submitting we swap the form for a confirmation that names the
  // organization the request went to.
  if (created) {
    return (
      <Modal
        open
        onClose={() => { onCreated?.(created); onClose() }}
        width={480}
        title="Request sent"
        footer={
          <>
            <Button variant="secondary" onClick={() => { onCreated?.(created); onClose() }}>Done</Button>
            <Button onClick={() => { onClose(); onCreated?.(created, true) }}>View the pin</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{
            display: 'flex', gap: 13, alignItems: 'flex-start',
            padding: '15px 17px', background: 'var(--green-soft)',
            border: '1px solid #C8E0D2', borderRadius: 'var(--radius)',
            color: 'var(--green)',
          }}>
            <Icon name="checkCircle" size="lg" style={{ marginTop: 1 }} />
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
              <strong>{created.title}</strong> is on the Milpitas map, and the request went
              to <strong>{org.name}</strong>.
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
            They review new reports and schedule a work day once a spot gets enough support.
            You can follow where it stands from your dashboard, and other residents can upvote
            it to move it up the list.
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="mail" size="sm" />
            <a href={`mailto:${org.email}`} style={{ fontWeight: 600 }}>{org.email}</a>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open
      onClose={onClose}
      width={540}
      title="Report a spot that needs work"
      subtitle={`Pin placed at ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Send request</Button>
        </>
      }
    >
      <form onSubmit={submit} style={{ display: 'grid', gap: 20 }}>
        <Field label="What kind of spot is it?">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(PIN_TYPES).map(([key, meta]) => {
              const active = key === type
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  style={{
                    padding: '8px 14px', borderRadius: 'var(--radius)', cursor: 'pointer',
                    fontSize: 13.5, fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: active ? meta.bg : 'var(--surface)',
                    color: active ? meta.color : 'var(--muted)',
                    border: `1px solid ${active ? meta.color : 'var(--border-firm)'}`,
                  }}
                >
                  <Icon name={meta.icon} size={15} />
                  {meta.label}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Name this spot" hint="Something a neighbour would recognise, like a cross street or a park.">
          <input
            style={inputStyle}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Abel St and Curtis Ave corner"
            maxLength={70}
          />
        </Field>

        <Field label="What needs doing?">
          <textarea
            style={{ ...inputStyle, minHeight: 92, resize: 'vertical' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you saw and why it needs attention."
            maxLength={280}
          />
        </Field>

        <div style={{
          padding: '13px 15px', background: 'var(--surface-alt)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 4 }}>
            This request goes to
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{org.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{org.focus}</div>
        </div>

        {error && (
          <div style={{
            fontSize: 13, color: 'var(--red)', background: 'var(--red-soft)',
            border: '1px solid #E4C7C8', borderRadius: 'var(--radius)', padding: '10px 13px',
          }}>{error}</div>
        )}

        <button type="submit" style={{ display: 'none' }} aria-hidden />
      </form>
    </Modal>
  )
}
