import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import { useCity } from '../../hooks/useCity'

// "Your city" selector. Switching rewrites the map, the events list and the
// leaderboards; personal things like your hours stay put.
export default function CityPicker({ dark = false, label = 'Your city' }) {
  const { city, cities, setCity } = useCity()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const fg = dark ? '#fff' : 'var(--text)'
  const sub = dark ? 'rgba(255,255,255,.5)' : 'var(--muted)'

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: dark ? '11px 13px' : '8px 12px',
          borderRadius: 0, cursor: 'pointer', textAlign: 'left',
          background: dark ? 'rgba(255,255,255,.07)' : 'var(--surface)',
          border: `1px solid ${dark ? 'rgba(255,255,255,.14)' : 'var(--border-firm)'}`,
          color: fg,
        }}
      >
        <Icon name="pin" size="sm" style={{ color: dark ? 'rgba(255,255,255,.6)' : 'var(--muted)' }} />
        <span style={{ minWidth: 0, flex: 1 }}>
          {label && (
            <span style={{
              display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.07,
              textTransform: 'uppercase', color: sub, marginBottom: 1,
            }}>
              {label}
            </span>
          )}
          <span style={{
            display: 'block', fontSize: 14, fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {city.name}
          </span>
        </span>
        <Icon
          name="chevronRight"
          size={14}
          style={{
            color: sub,
            transform: open ? 'rotate(-90deg)' : 'rotate(90deg)',
            transition: 'transform .15s ease',
          }}
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, minWidth: 210,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 0, boxShadow: 'var(--shadow-lg)',
          zIndex: 900, overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 14px', borderBottom: '1px solid var(--border)',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.07,
            textTransform: 'uppercase', color: 'var(--muted)',
          }}>
            Pick a city
          </div>
          {cities.map(c => {
            const active = c.id === city.id
            return (
              <button
                key={c.id}
                onClick={() => { setCity(c.id); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '11px 14px', cursor: 'pointer', textAlign: 'left',
                  background: active ? 'var(--navy-soft)' : 'transparent',
                  border: 'none', borderBottom: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: active ? 700 : 500 }}>
                    {c.name}
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
                    {c.state}
                  </span>
                </span>
                {active && <Icon name="check" size="sm" style={{ color: 'var(--navy)' }} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
