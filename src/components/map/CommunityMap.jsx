import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { MAP_TILES, MAP_ATTRIBUTION, MILPITAS, PIN_TYPES } from '../../lib/constants'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createPinIcon(type) {
  const { color, emoji } = PIN_TYPES[type] || PIN_TYPES.trash
  return L.divIcon({
    className: '',
    html: `<div style="background:white;border:3px solid ${color};border-radius:50px;padding:4px 10px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${emoji}</div>`,
    iconAnchor: [20, 10],
  })
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
  return null
}

export default function CommunityMap({ spots = [], onMapClick, onPinClick }) {
  return (
    <MapContainer center={[MILPITAS.lat, MILPITAS.lng]} zoom={MILPITAS.zoom} style={{ width: '100%', height: '460px' }}>
      <TileLayer url={MAP_TILES} attribution={MAP_ATTRIBUTION} />
      <MapClickHandler onMapClick={onMapClick} />
      {spots.map(spot => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={createPinIcon(spot.type)} eventHandlers={{ click: () => onPinClick?.(spot) }}>
          <Popup>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: 160 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{PIN_TYPES[spot.type]?.emoji} {spot.title}</div>
              {spot.description && <div style={{ fontSize: 12, color: '#6B7A9F', marginBottom: 6 }}>{spot.description}</div>}
              <div style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 50, background: PIN_TYPES[spot.type]?.bg, color: PIN_TYPES[spot.type]?.color, display: 'inline-block' }}>{PIN_TYPES[spot.type]?.label}</div>
              <div style={{ fontSize: 11, color: '#6B7A9F', marginTop: 6 }}>👍 {spot.upvotes} votes</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}