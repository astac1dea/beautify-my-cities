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

// Icon glyphs, duplicated as raw markup because Leaflet takes an HTML string
// rather than a React node. Kept in sync with components/ui/Icon.
const GLYPHS = {
  trash: '<path d="M4.5 6.8h15"/><path d="M9.4 6.8V4.6h5.2v2.2"/><path d="M6.4 6.8 7.3 20a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.9-13.2"/><path d="M10.4 10.6v6.6M13.6 10.6v6.6"/>',
  spray: '<rect x="7.6" y="8.4" width="7.4" height="13" rx="1.8"/><path d="M9.8 8.4V5.2a1.4 1.4 0 0 1 1.4-1.4h.6a1.4 1.4 0 0 1 1.4 1.4v3.2"/><path d="M7.6 12.6H15"/>',
  brush: '<path d="M14.4 3.9 20 9.5l-8 8a3 3 0 0 1-1.6.9l-4.2.8.8-4.2a3 3 0 0 1 .9-1.6Z"/><path d="m12.6 5.7 5.6 5.6"/>',
  bench: '<path d="M3.5 10.2h17"/><path d="M3.5 13.6h17"/><path d="M5.5 10.2V20M18.5 10.2V20"/><path d="M4.6 6.8h14.8l1 3.4H3.6Z"/>',
}

function svg(glyph, color, px = 15) {
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${color}"
    stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg>`
}

// A round map marker with a small pointer, styled per category.
export function createPinIcon(type, { muted = false, active = false } = {}) {
  const meta = PIN_TYPES[type] || PIN_TYPES.trash
  const glyph = GLYPHS[meta.icon] || GLYPHS.trash
  const size = active ? 36 : 32

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;opacity:${muted ? 0.55 : 1};">
        <div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:#fff;border:2px solid ${meta.color};
          box-shadow:0 2px 6px rgba(23,34,46,.28);
          display:flex;align-items:center;justify-content:center;">
          ${svg(glyph, meta.color, active ? 17 : 15)}
        </div>
        <div style="
          position:absolute;left:50%;bottom:-5px;transform:translateX(-50%) rotate(45deg);
          width:8px;height:8px;background:#fff;
          border-right:2px solid ${meta.color};border-bottom:2px solid ${meta.color};"></div>
      </div>`,
    iconSize: [size, size + 5],
    iconAnchor: [size / 2, size + 5],
    popupAnchor: [0, -(size + 2)],
  })
}

export function createDraftIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:34px;height:34px;">
        <div style="
          width:34px;height:34px;border-radius:50%;
          background:#1A1A1A;border:2px solid #fff;
          box-shadow:0 3px 10px rgba(20,57,94,.45);
          display:flex;align-items:center;justify-content:center;">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff"
            stroke-width="2.1" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <div style="
          position:absolute;left:50%;bottom:-5px;transform:translateX(-50%) rotate(45deg);
          width:8px;height:8px;background:#1A1A1A;"></div>
      </div>`,
    iconSize: [34, 39],
    iconAnchor: [17, 39],
  })
}
