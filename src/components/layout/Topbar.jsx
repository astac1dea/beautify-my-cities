export default function Topbar({ title, onAddPin }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>
        {title}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button style={{
          background: 'var(--surface)', color: 'var(--text)',
          padding: '10px 16px', borderRadius: 8, fontSize: 13,
          fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer',
        }}>
          📤 Share Map
        </button>
        <button
          onClick={onAddPin}
          style={{
            background: 'var(--blue)', color: 'white',
            padding: '10px 20px', borderRadius: 8, fontSize: 13,
            fontWeight: 700, border: 'none', cursor: 'pointer',
          }}>
          + Pin a Spot
        </button>
      </div>
    </div>
  )
}