import { useEffect } from 'react'
import Icon from './Icon'

export default function Modal({ open, onClose, title, subtitle, width = 580, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(14, 27, 42, .55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          width: '100%', maxWidth: width,
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{
          padding: '20px 26px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18,
        }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
            {subtitle && (
              <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 5 }}>{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              width: 32, height: 32, borderRadius: 'var(--radius)', cursor: 'pointer',
              color: 'var(--muted)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        <div style={{ padding: '24px 26px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {footer && (
          <div style={{
            padding: '16px 26px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap',
            background: 'var(--surface-alt)',
            borderBottomLeftRadius: 'var(--radius-lg)',
            borderBottomRightRadius: 'var(--radius-lg)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
