import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useCity } from '../../hooks/useCity'

// "Search for your city" — the search bar the whole welcome page is built
// around. `size="lg"` is the one sitting over the hero; `size="sm"` is the
// compact copy that lives in the header.
export default function CitySearch({ size = 'lg', placeholder = 'Search for your city' }) {
  const { cities, setCity } = useCity()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef(null)

  const needle = q.trim().toLowerCase()
  const matches = needle
    ? cities.filter(c =>
        c.name.toLowerCase().includes(needle) || c.state.toLowerCase().includes(needle))
    : cities

  useEffect(() => { setActive(0) }, [needle])

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

  function go(city) {
    if (!city) return
    setCity(city.slug)
    setQ('')
    setOpen(false)
    navigate(`/city/${city.slug}`)
    window.scrollTo({ top: 0 })
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(i => Math.min(i + 1, matches.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(matches[active]) }
  }

  const big = size === 'lg'
  const h = big ? 62 : 40

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', height: h }}>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search for your city"
          style={{
            flex: 1, minWidth: 0, height: '100%',
            padding: big ? '0 20px' : '0 12px',
            fontSize: big ? 17 : 13.5,
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border-firm)',
            borderRight: 'none',
            borderRadius: 'var(--radius) 0 0 var(--radius)',
            outline: 'none',
          }}
        />
        <button
          onClick={() => (open && matches.length ? go(matches[active]) : setOpen(true))}
          aria-label="Search"
          style={{
            width: big ? 76 : 42, height: '100%', flexShrink: 0, cursor: 'pointer',
            background: 'var(--navy)', color: '#fff',
            border: '1px solid var(--navy)',
            borderRadius: '0 var(--radius) var(--radius) 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="search" size={big ? 'md' : 'sm'} />
        </button>
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
          zIndex: 900, overflow: 'hidden', textAlign: 'left',
        }}>
          <div style={{
            padding: '9px 14px', borderBottom: '1px solid var(--border)',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.07,
            textTransform: 'uppercase', color: 'var(--muted)',
          }}>
            {matches.length ? 'Cities on Beautify My City' : 'No match'}
          </div>

          {matches.length === 0 ? (
            <div style={{ padding: '16px 14px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              We are not in that city yet. Try Milpitas, Fremont, San José or Sunnyvale.
            </div>
          ) : matches.map((c, i) => (
            <button
              key={c.id}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 11, width: '100%',
                padding: '11px 14px', cursor: 'pointer', textAlign: 'left',
                background: i === active ? 'var(--navy-soft)' : 'transparent',
                border: 'none',
                borderBottom: i === matches.length - 1 ? 'none' : '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <Icon name="pin" size="sm" style={{ color: 'var(--muted-light)', flexShrink: 0 }} />
              <span style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
                  {c.state}
                </span>
              </span>
              <Icon name="arrowRight" size="sm" style={{ color: 'var(--muted-light)', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
