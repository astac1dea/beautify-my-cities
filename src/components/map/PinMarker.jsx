import { Marker, Popup } from 'react-leaflet'
import { PIN_TYPES, SPOT_STATUS } from '../../lib/constants'
import { createPinIcon } from '../../lib/maps'

export default function PinMarker({ spot, onOpen }) {
  const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
  const status = SPOT_STATUS[spot.status] || SPOT_STATUS.reported

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={createPinIcon(spot.type, { muted: spot.status === 'resolved' })}
    >
      <Popup>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: 190 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>
            {type.emoji} {spot.title}
          </div>
          {spot.description && (
            <div style={{ fontSize: 12, color: '#6B7A9F', marginBottom: 7, lineHeight: 1.45 }}>
              {spot.description}
            </div>
          )}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: type.bg, color: type.color }}>
              {type.label}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#6B7A9F', marginBottom: 9 }}>
            👍 {spot.upvotes} votes · handled by {spot.org.name}
          </div>
          <button
            onClick={() => onOpen(spot.id)}
            style={{
              width: '100%', padding: '7px 12px', borderRadius: 7, cursor: 'pointer',
              background: '#1B4FD8', color: 'white', border: 'none',
              fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
            }}
          >
            View details & volunteer
          </button>
        </div>
      </Popup>
    </Marker>
  )
}
