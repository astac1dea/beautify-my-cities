import { useEffect, useRef } from 'react'
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

function RecenterOnCity({ lat, lng, zoom }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], zoom) }, [map, lat, lng, zoom])
  return null
}

// Flies to a specific spot when focusSpotId changes
function FlyToSpot({ spots, focusSpotId }) {
  const map = useMap()
  const prevId = useRef(null)
  useEffect(() => {
    if (!focusSpotId || focusSpotId === prevId.current) return
    const spot = spots.find(s => s.id === focusSpotId)
    if (spot) {
      map.flyTo([spot.lat, spot.lng], 15, { duration: 0.8 })
      prevId.current = focusSpotId
    }
  }, [map, spots, focusSpotId])
  return null
}

// Zooms to fit all visible spots when filter changes
function FitToSpots({ spots, filter }) {
  const map = useMap()
  const prevFilter = useRef('all')
  useEffect(() => {
    if (filter === prevFilter.current) return
    prevFilter.current = filter
    if (spots.length === 0) return
    if (filter === 'all') return
    const bounds = spots.map(s => [s.lat, s.lng])
    if (bounds.length === 1) {
      map.flyTo(bounds[0], 15, { duration: 0.6 })
    } else {
      map.flyToBounds(bounds, { padding: [60, 60], duration: 0.6 })
    }
  }, [map, spots, filter])
  return null
}

export default function CommunityMap({
  spots = [], onMapClick, onOpenSpot, draft, placing, height = 460,
  focusSpotId, filter = 'all',
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
        <FlyToSpot spots={spots} focusSpotId={focusSpotId} />
        <FitToSpots spots={spots} filter={filter} />
        {spots.map(spot => (
          <PinMarker
            key={spot.id}
            spot={spot}
            onOpen={onOpenSpot}
            highlighted={spot.id === focusSpotId}
          />
        ))}
        {draft && <Marker position={[draft.lat, draft.lng]} icon={createDraftIcon()} />}
      </MapContainer>

      {placing && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 500, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
          paddingTop: 14,
          gap: 12,
        }}>
          {/* Instruction banner */}
          <div style={{
            background: 'var(--navy)', color: '#fff',
            padding: '10px 18px', borderRadius: 'var(--radius)',
            fontSize: 13.5, fontWeight: 600,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex', alignItems: 'center', gap: 9,
          }}>
            <Icon name="pinPlus" size="sm" />
            Click anywhere on the map to place your pin
          </div>

          {/* Large plus button — alternative to clicking map */}
          <button
            onClick={e => {
              e.stopPropagation()
              const center = e.currentTarget.closest('[style*="position: relative"]')
              onMapClick?.({ lat: 37.4323, lng: -121.8996 })
            }}
            style={{
              pointerEvents: 'all',
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--navy)', color: '#fff', border: 'none',
              fontSize: 36, fontWeight: 300, lineHeight: 1,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#e8845a' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--navy)' }}
            title="Click to add pin at city center"
          >
            +
          </button>
          <div style={{
            fontSize: 12, color: '#fff', fontWeight: 500,
            background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: 20,
          }}>
            or click the map for exact location
          </div>
        </div>
      )}
    </div>
  )
}
