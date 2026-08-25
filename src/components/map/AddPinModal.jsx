import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { PIN_TYPES } from '../../lib/constants'
import { useSpots } from '../../hooks/useSpots'
import { useCity } from '../../hooks/useCity'

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

function AddressAutocomplete({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    onChange(val)
    clearTimeout(debounceRef.current)
    if (val.length < 3) { setSuggestions([]); setOpen(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val + ' Milpitas California')}&format=json&limit=5&countrycodes=us`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setSuggestions(data.map(d => ({
          label: d.display_name.replace(', United States', '').replace(', USA', ''),
          short: d.display_name.split(',').slice(0, 2).join(',').trim(),
        })))
        setOpen(data.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  function pick(s) {
    onChange(s.short)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          style={{ ...inputStyle, paddingRight: loading ? 36 : 12 }}
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="1200 Main St or bin behind Milpitas Library"
          maxLength={110}
          autoComplete="off"
        />
        {loading && (
          <div style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: 12, color: 'var(--muted)',
          }}>...</div>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
          background: '#fff', border: '1px solid var(--border-firm)',
          borderRadius: 'var(--radius)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginTop: 2, overflow: 'hidden',
        }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(s)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 12px', background: 'none', border: 'none',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', fontSize: 13, color: 'var(--text)',
                lineHeight: 1.4,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ fontWeight: 600 }}>{s.short}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PhotoUpload({ photo, onPhoto }) {
  const inputRef = useRef()

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = ev => onPhoto({ file, preview: ev.target.result })
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    handleFile({ target: { files: [file] } })
  }

  if (photo) {
    return (
      <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <img
          src={photo.preview}
          alt="Preview"
          style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
        />
        <button
          type="button"
          onClick={() => onPhoto(null)}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff',
            borderRadius: '50%', width: 28, height: 28, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}
        >
          x
        </button>
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.55)', color: '#fff',
          fontSize: 11.5, padding: '3px 8px', borderRadius: 4,
        }}>
          {photo.file.name}
        </div>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      style={{
        border: '1.5px dashed var(--border-firm)',
        borderRadius: 'var(--radius)',
        padding: '28px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        background: 'var(--surface)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <div style={{ marginBottom: 8 }}>
        <Icon name="camera" size="lg" style={{ color: 'var(--muted-light)' }} />
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>
        Add a photo
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted-light)' }}>
        Drag and drop or click to upload · JPG, PNG, WEBP · Max 10MB
      </div>
    </div>
  )
}

export default function AddPinModal({ coords, onClose, onCreated }) {
  const { city } = useCity()
  const { addSpot } = useSpots()
  const [type, setType] = useState('trash')
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const [org, setOrg] = useState(null)

  // Fetch org from Supabase based on city + type
  useEffect(() => {
    if (!city?.id) return
    supabase
      .from('org_categories')
      .select('organizations(*)')
      .eq('city_id', city.id)
      .eq('type', type)
      .single()
      .then(({ data }) => {
        setOrg(data?.organizations || null)
      })
  }, [city?.id, type])

  async function geocodeAddress(addr) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr + ' Milpitas California')}&format=json&limit=1&countrycodes=us`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      }
    } catch {}
    return null
  }

  async function submit(e) {
    e.preventDefault()
    if (!title.trim()) return setError('Give the spot a short name so people can find it.')
    if (!address.trim()) return setError('Add the street or landmark so the crew can find it.')
    if (!description.trim()) return setError('Describe what needs doing here.')
    setError('')
    setSubmitting(true)
    try {
      // Use clicked coords if precise, otherwise geocode from address
      let lat = coords?.lat
      let lng = coords?.lng
      const isCityCenter = Math.abs(lat - 37.4323) < 0.001 && Math.abs(lng - (-121.8996)) < 0.001
      if (!lat || !lng || isCityCenter) {
        const geocoded = await geocodeAddress(address)
        if (geocoded) { lat = geocoded.lat; lng = geocoded.lng }
      }
      const spot = await addSpot({
        type, title, address, description,
        lat, lng,
        photo: photo?.preview || null,
      })
      setCreated(spot)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
          }}>
            <Icon name="checkCircle" size="lg" style={{ marginTop: 1, color: 'var(--green)' }} />
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
              <strong>{created.title}</strong> is on the {city.name} map, and the request
              went to <strong>{org?.name || 'our local partners'}</strong>.
            </div>
          </div>
          {created.photo && (
            <img
              src={created.photo}
              alt="Submitted"
              style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius)' }}
            />
          )}
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
            They review new reports and schedule a work day once a spot gets enough support.
            Other residents can upvote it to move it up the list.
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="mail" size="sm" />
            <a href={`mailto:${org?.email || 'hello@beautifymycities.org'}`} style={{ fontWeight: 600 }}>
              {org?.email || 'hello@beautifymycities.org'}
            </a>
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
      subtitle={`Pin placed in ${city.name} — location set from address`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={submitting}>{submitting ? 'Sending...' : 'Send request'}</Button>
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
                    transition: 'all 0.13s',
                  }}
                >
                  <Icon name={meta.icon} size={15} />
                  {meta.label}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Name this spot" hint="Short and recognisable, like a cross street or a park.">
          <input
            style={inputStyle}
            value={title}
            onChange={e => { setTitle(e.target.value); setError('') }}
            placeholder="Abel St and Curtis Ave corner"
            maxLength={70}
          />
        </Field>

        <Field
          label="Street address or landmark"
          hint="e.g. 1200 Main St or bin behind Milpitas Library — helps the crew find it on the day."
        >
          <AddressAutocomplete
            value={address}
            onChange={v => { setAddress(v); setError('') }}
          />
        </Field>

        <Field label="What needs doing?">
          <textarea
            style={{ ...inputStyle, minHeight: 88, resize: 'vertical' }}
            value={description}
            onChange={e => { setDescription(e.target.value); setError('') }}
            placeholder="Describe what you saw and why it needs attention."
            maxLength={280}
          />
        </Field>

        <Field label="Photo (optional)" hint="A photo helps the crew understand what to expect.">
          <PhotoUpload photo={photo} onPhoto={setPhoto} />
        </Field>

        <div style={{
          padding: '13px 15px', background: 'var(--surface-alt)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 4 }}>This request goes to</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{org?.name || 'Local organization'}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{org?.focus || 'We\'ll route this to the right team'}</div>
        </div>

        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          padding: '11px 13px', background: 'var(--surface-alt)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          fontSize: 12.5, color: 'var(--muted)',
        }}>
          <Icon name="info" size="sm" style={{ marginTop: 1, flexShrink: 0 }} />
          <span>
            Reporting as a guest.{' '}
            <a href="/login?signup=1" style={{ color: 'var(--link)', fontWeight: 600 }}>
              Create a free account
            </a>{' '}
            to track your reports and get updates when resolved.
          </span>
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
