import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { MAP_TILES, MAP_ATTRIBUTION } from '../../lib/constants'
import { useCity } from '../../hooks/useCity'
import PinMarker from './PinMarker'
import { configureLeafletIcons, createDraftIcon } from '../../lib/maps'
import Icon from '../ui/Icon'
import 'leaflet/dist/leaflet.css'

configureLeafletIcons()

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
  return null
}

// MapContainer only reads `center` once, so re-centre imperatively when the
// selected city changes.
function RecenterOnCity({ lat, lng, zoom }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], zoom) }, [map, lat, lng, zoom])
  return null
}

export default function CommunityMap({
  spots = [], onMapClick, onOpenSpot, draft, placing, height = 460,
}) {
  const { city } = useCity()
  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        key={city.id}
        center={[city.lat, city.lng]}
        zoom={city.zoom}
        style={{ width: '100%', height, cursor: placing ? 'crosshair' : undefined }}
        scrollWheelZoom={false}
      >
        <TileLayer url={MAP_TILES} attribution={MAP_ATTRIBUTION} />
        <RecenterOnCity lat={city.lat} lng={city.lng} zoom={city.zoom} />
        <MapClickHandler onMapClick={onMapClick} />
        {spots.map(spot => (
          <PinMarker key={spot.id} spot={spot} onOpen={onOpenSpot} />
        ))}
        {draft && <Marker position={[draft.lat, draft.lng]} icon={createDraftIcon()} />}
      </MapContainer>

      {placing && (
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          zIndex: 500, background: 'var(--navy)', color: '#fff',
          padding: '10px 18px', borderRadius: 'var(--radius)', fontSize: 13.5, fontWeight: 600,
          boxShadow: 'var(--shadow-lg)', pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: 9,
        }}>
          <Icon name="pinPlus" size="sm" />
          Click anywhere on the map to place your pin
        </div>
      )}
    </div>
  )
}
