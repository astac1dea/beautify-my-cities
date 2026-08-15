import L from 'leaflet'
import { PIN_TYPES } from './constants'

// Leaflet ships its marker images as relative asset URLs that break under a
// bundler, so point them at the CDN copies instead.
export function configureLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

export function createPinIcon(type, { muted = false } = {}) {
  const { color, emoji } = PIN_TYPES[type] || PIN_TYPES.trash
  return L.divIcon({
    className: '',
    html: `<div style="background:white;border:3px solid ${color};border-radius:50px;padding:4px 10px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);opacity:${muted ? 0.5 : 1}">${emoji}</div>`,
    iconAnchor: [20, 10],
  })
}

export function createDraftIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="background:#1B4FD8;color:white;border:3px solid white;border-radius:50px;padding:4px 12px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 3px 12px rgba(27,79,216,0.45);">New pin</div>`,
    iconAnchor: [30, 10],
  })
}
