import { Marker, Popup } from 'react-leaflet'
import { PIN_TYPES, SPOT_STATUS } from '../../lib/constants'
import { createPinIcon } from '../../lib/maps'

export default function PinMarker({ spot, onOpen }) {
  const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
  const status = SPOT_STATUS[spot.status] || SPOT_STATUS.reported

  const chip = (color, bg, text) => (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px',
      borderRadius: 4, background: bg, color,
    }}>{text}</span>
  )

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={createPinIcon(spot.type, { muted: spot.status === 'resolved' })}
    >
      <Popup>
        <div style={{ minWidth: 208 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5, lineHeight: 1.35 }}>
            {spot.title}
          </div>
          {spot.description && (
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 9, lineHeight: 1.5 }}>
              {spot.description}
            </div>
          )}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 9 }}>
            {chip(type.color, type.bg, type.label)}
            {chip(status.color, status.bg, status.label)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 11 }}>
            {spot.upvotes} upvotes · {spot.org.name}
          </div>
          <button
            onClick={() => onOpen(spot.id)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 'var(--radius)',
              cursor: 'pointer', background: 'var(--navy)', color: '#fff',
              border: 'none', fontSize: 13, fontWeight: 600,
            }}
          >
            View details
          </button>
        </div>
      </Popup>
    </Marker>
  )
}
