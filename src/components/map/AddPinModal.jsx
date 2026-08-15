import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { PIN_TYPES, TYPE_TO_ORG } from '../../lib/constants'
import { addSpot, orgById } from '../../lib/store'

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 9,
  border: '1px solid var(--border)', background: 'var(--surface)',
  fontSize: 13, fontFamily: 'inherit', color: 'var(--text)',
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{hint}</div>}
    </div>
  )
}

export default function AddPinModal({ coords, onClose, onCreated }) {
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
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center',
            padding: '14px 16px', background: 'var(--green-light)',
            border: '1px solid #BBF7D0', borderRadius: 12,
          }}>
            <div style={{ fontSize: 22 }}>✅</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              <strong>{created.title}</strong> is now on the Milpitas map, and the request went
              to <strong>{org.name}</strong>.
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            They review new reports and schedule a work day once a spot gets enough support.
            You can follow where it stands from your dashboard, and other residents can upvote it
            to move it up the list.
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Questions? <a href={`mailto:${org.email}`} style={{ color: 'var(--blue)', fontWeight: 600 }}>{org.email}</a>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open
      onClose={onClose}
      width={520}
      title="Pin a spot that needs work"
      subtitle={`Dropped at ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Send request</Button>
        </>
      }
    >
      <form onSubmit={submit} style={{ display: 'grid', gap: 18 }}>
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
                    padding: '8px 14px', borderRadius: 50, cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                    background: active ? meta.bg : 'var(--surface)',
                    color: active ? meta.color : 'var(--muted)',
                    border: `1px solid ${active ? meta.color : 'var(--border)'}`,
                  }}
                >
                  {meta.emoji} {meta.label}
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
            placeholder="e.g. Abel St & Curtis Ave corner"
            maxLength={70}
          />
        </Field>

        <Field label="What needs doing?">
          <textarea
            style={{ ...inputStyle, minHeight: 88, resize: 'vertical' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you saw and why it needs attention."
            maxLength={280}
          />
        </Field>

        <div style={{
          padding: '12px 14px', background: 'var(--bg)',
          border: '1px solid var(--border)', borderRadius: 10,
          display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>This request goes to</span>
          <Badge color={org.color} bg="#F4F6FC">{org.name}</Badge>
        </div>

        {error && (
          <div style={{
            fontSize: 12, color: '#DC2626', background: '#FEE2E2',
            border: '1px solid #FECACA', borderRadius: 9, padding: '9px 12px',
          }}>{error}</div>
        )}

        <button type="submit" style={{ display: 'none' }} aria-hidden />
      </form>
    </Modal>
  )
}
