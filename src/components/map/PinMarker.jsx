import { Marker, Popup } from 'react-leaflet'
import { PIN_TYPES, SPOT_STATUS } from '../../lib/constants'
import { createPinIcon } from '../../lib/maps'

export default function PinMarker({ spot, onOpen, highlighted }) {
  const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
  const status = SPOT_STATUS[spot.status] || SPOT_STATUS.reported

  // Visual style per status
  const isPending  = spot.status === 'pending'
  const isResolved = spot.status === 'resolved'
  const isRejected = spot.status === 'rejected'

  // Don't show rejected pins on the map at all
  if (isRejected) return null

  const chip = (color, bg, text) => (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px',
      borderRadius: 4, background: bg, color,
    }}>{text}</span>
  )

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={createPinIcon(spot.type, {
        muted: isResolved || isPending,
        opacity: isPending ? 0.5 : isResolved ? 0.65 : 1,
      })}
    >
      <Popup>
        <div style={{ minWidth: 208 }}>
          {isPending && (
            <div style={{
              fontSize: 11.5, fontWeight: 600, color: '#888780',
              background: '#F1EFE8', border: '1px solid #D3D1C7',
              borderRadius: 4, padding: '4px 8px', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              ⏳ Pending review — not yet public
            </div>
          )}
          <div style={{
            fontWeight: 700, fontSize: 14, marginBottom: 5, lineHeight: 1.35,
            opacity: isPending ? 0.7 : 1,
          }}>
            {spot.title}
          </div>
          {spot.address && (
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 6, lineHeight: 1.45 }}>
              {spot.address}
            </div>
          )}
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
            {spot.upvotes} upvotes · {spot.org?.name}
          </div>
          {!isPending && (
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
          )}
        </div>
      </Popup>
    </Marker>
  )
}
