import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { MAP_TILES, MAP_ATTRIBUTION, MILPITAS } from '../../lib/constants'
import PinMarker from './PinMarker'
import { configureLeafletIcons, createDraftIcon } from '../../lib/maps'
import 'leaflet/dist/leaflet.css'

configureLeafletIcons()

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
  return null
}

export default function CommunityMap({
  spots = [], onMapClick, onOpenSpot, draft, placing, height = 460,
}) {
  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={[MILPITAS.lat, MILPITAS.lng]}
        zoom={MILPITAS.zoom}
        style={{ width: '100%', height, cursor: placing ? 'crosshair' : undefined }}
      >
        <TileLayer url={MAP_TILES} attribution={MAP_ATTRIBUTION} />
        <MapClickHandler onMapClick={onMapClick} />
        {spots.map(spot => (
          <PinMarker key={spot.id} spot={spot} onOpen={onOpenSpot} />
        ))}
        {draft && <Marker position={[draft.lat, draft.lng]} icon={createDraftIcon()} />}
      </MapContainer>

      {placing && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 500, background: 'var(--sidebar)', color: 'white',
          padding: '9px 16px', borderRadius: 50, fontSize: 12, fontWeight: 700,
          boxShadow: '0 4px 16px rgba(15,23,41,0.3)', pointerEvents: 'none',
        }}>
          Click anywhere on the map to drop your pin
        </div>
      )}
    </div>
  )
}
