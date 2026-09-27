import L from 'leaflet'
import { PIN_TYPES } from './constants'

export function configureLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

const GLYPHS = {
  trash:    '<path d="M4.5 6.8h15"/><path d="M9.4 6.8V4.6h5.2v2.2"/><path d="M6.4 6.8 7.3 20a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.9-13.2"/><path d="M10.4 10.6v6.6M13.6 10.6v6.6"/>',
  spray:    '<rect x="7.6" y="8.4" width="7.4" height="13" rx="1.8"/><path d="M9.8 8.4V5.2a1.4 1.4 0 0 1 1.4-1.4h.6a1.4 1.4 0 0 1 1.4 1.4v3.2"/><path d="M7.6 12.6H15"/>',
  brush:    '<path d="M14.4 3.9 20 9.5l-8 8a3 3 0 0 1-1.6.9l-4.2.8.8-4.2a3 3 0 0 1 .9-1.6Z"/><path d="m12.6 5.7 5.6 5.6"/>',
  bench:    '<path d="M3.5 10.2h17"/><path d="M3.5 13.6h17"/><path d="M5.5 10.2V20M18.5 10.2V20"/><path d="M4.6 6.8h14.8l1 3.4H3.6Z"/>',
}

// Exported so WelcomePage leaderboard can use the same colors
export const MAP_PIN_COLORS = {
  trash:    { bg: '#059669', icon: '#fff' }, // emerald green
  graffiti: { bg: '#2563EB', icon: '#fff' }, // strong blue
  mural:    { bg: '#7C3AED', icon: '#fff' }, // rich purple
  seating:  { bg: '#D97706', icon: '#fff' }, // warm amber
}

function iconSvg(glyph, color = '#fff', px = 20) {
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${color}"
    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg>`
}

export function createPinIcon(type, { muted = false, active = false, upvotes = 0 } = {}) {
  const meta   = PIN_TYPES[type] || PIN_TYPES.trash
  const glyph  = GLYPHS[meta.icon] || GLYPHS.trash
  const colors = MAP_PIN_COLORS[type] || MAP_PIN_COLORS.trash

  const d      = active ? 52 : 44
  const tipH   = 14
  const totalH = d + tipH
  const iconPx = active ? 24 : 20
  const r      = d / 2
  const opacity = muted ? 0.4 : 1
  const fid    = `pf-${type}-${active ? 'a' : 'n'}`

  const ring = active ? `
    <div style="
      position:absolute;
      top:-13px; left:-13px;
      width:${d + 26}px; height:${d + 26}px;
      border-radius:50%;
      border:3px solid ${colors.bg};
      box-shadow:0 0 0 3px rgba(255,255,255,0.95), 0 0 14px ${colors.bg}99;
      pointer-events:none;
    "></div>` : ''

  const badge = upvotes > 0 ? `
    <div style="
      position:absolute; top:-12px; right:-12px;
      background:${colors.bg}; color:#fff;
      font-size:10px; font-weight:800;
      min-width:22px; height:22px; border-radius:11px;
      display:flex; align-items:center; justify-content:center;
      padding:0 5px; border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      font-family:sans-serif; line-height:1;
    ">${upvotes > 99 ? '99+' : upvotes}</div>` : ''

  const pin = `
    <svg width="${d}" height="${totalH}" viewBox="0 0 ${d} ${totalH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="${fid}" x="-60%" y="-40%" width="220%" height="220%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
      </defs>
      <!-- White halo -->
      <circle cx="${r}" cy="${r}" r="${r}" fill="white" filter="url(#${fid})"/>
      <!-- Color fill -->
      <circle cx="${r}" cy="${r}" r="${r - 3.5}" fill="${colors.bg}"/>
      <!-- Shine -->
      <circle cx="${r - d*0.13}" cy="${r - d*0.13}" r="${d * 0.13}" fill="rgba(255,255,255,0.22)"/>
      <!-- Tip white -->
      <polygon points="${r},${totalH} ${r-8},${d-3} ${r+8},${d-3}" fill="white"/>
      <!-- Tip color -->
      <polygon points="${r},${totalH-3} ${r-5.5},${d-2} ${r+5.5},${d-2}" fill="${colors.bg}"/>
    </svg>`

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${d}px;height:${totalH}px;opacity:${opacity};">
        ${ring}
        ${pin}
        <div style="
          position:absolute;
          top:${r - iconPx/2}px;
          left:${r - iconPx/2}px;
          pointer-events:none;
        ">${iconSvg(glyph, '#fff', iconPx)}</div>
        ${badge}
      </div>`,
    iconSize:   [d, totalH],
    iconAnchor: [r, totalH],
    popupAnchor:[0, -(totalH + 4)],
  })
}

export function createDraftIcon() {
  const d = 44, tipH = 14, totalH = d + tipH, r = d / 2
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${d}px;height:${totalH}px;">
        <svg width="${d}" height="${totalH}" viewBox="0 0 ${d} ${totalH}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="pf-draft" x="-60%" y="-40%" width="220%" height="220%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="rgba(0,0,0,0.4)"/>
            </filter>
          </defs>
          <circle cx="${r}" cy="${r}" r="${r}" fill="white" filter="url(#pf-draft)"/>
          <circle cx="${r}" cy="${r}" r="${r-3.5}" fill="#1d4e2f"/>
          <polygon points="${r},${totalH} ${r-8},${d-3} ${r+8},${d-3}" fill="white"/>
          <polygon points="${r},${totalH-3} ${r-5.5},${d-2} ${r+5.5},${d-2}" fill="#1d4e2f"/>
        </svg>
        <div style="position:absolute;top:${r-9}px;left:${r-9}px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"
            stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
      </div>`,
    iconSize:   [d, totalH],
    iconAnchor: [r, totalH],
  })
}
