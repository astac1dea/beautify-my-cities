import { useEffect } from 'react'

export default function Modal({ open, onClose, title, subtitle, width = 560, children, footer }) {
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
        background: 'rgba(15,23,41,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          width: '100%', maxWidth: width,
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(15,23,41,0.22)',
        }}
      >
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 900, lineHeight: 1.25 }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
              fontSize: 15, color: 'var(--muted)', flexShrink: 0, lineHeight: 1,
            }}
          >×</button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {footer && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
