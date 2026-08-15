export const PIN_TYPES = {
  trash:    { label: 'Trash',    emoji: '🗑️', color: '#EA580C', bg: '#FFF0E6' },
  graffiti: { label: 'Graffiti', emoji: '🚫', color: '#DC2626', bg: '#FEE2E2' },
  mural:    { label: 'Mural',    emoji: '🎨', color: '#7C3AED', bg: '#F3EFFE' },
  seating:  { label: 'Seating',  emoji: '🪑', color: '#16A34A', bg: '#DCFCE7' },
  bike:     { label: 'Bike',     emoji: '🚲', color: '#1B4FD8', bg: '#E8EFFE' },
}

export const MILPITAS = {
  lat: 37.4323, lng: -121.8996, zoom: 13,
  cityId: '79786f15-df18-4cc8-b5d9-bfcdaae63023',
}

export const MAP_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const MAP_ATTRIBUTION = '© OpenStreetMap contributors'

// A pin moves through these as the responsible org picks it up.
export const SPOT_STATUS = {
  reported:  { label: 'Request sent', color: '#6B7A9F', bg: '#EEF1F8', step: 0,
               blurb: 'Your report was sent to the organization that handles this.' },
  reviewing: { label: 'Under review', color: '#EA580C', bg: '#FFF0E6', step: 1,
               blurb: 'The organization has seen it and is checking the site.' },
  scheduled: { label: 'Event scheduled', color: '#1B4FD8', bg: '#E8EFFE', step: 2,
               blurb: 'A volunteer event is on the calendar for this spot.' },
  resolved:  { label: 'Resolved', color: '#16A34A', bg: '#DCFCE7', step: 3,
               blurb: 'Work is done. Thanks for reporting it.' },
}

export const STATUS_ORDER = ['reported', 'reviewing', 'scheduled', 'resolved']

// Which organization takes responsibility for each kind of pin.
export const TYPE_TO_ORG = {
  trash:    'org-kmb',
  graffiti: 'org-mural',
  mural:    'org-mural',
  seating:  'org-bikewalk',
  bike:     'org-bikewalk',
}

// Service hours needed for each Congressional Award level.
export const AWARD_TIERS = [
  { id: 'bronze-cert',  label: 'Bronze Certificate', hours: 30 },
  { id: 'silver-cert',  label: 'Silver Certificate', hours: 45 },
  { id: 'gold-cert',    label: 'Gold Certificate',   hours: 60 },
  { id: 'bronze-medal', label: 'Bronze Medal',       hours: 100 },
  { id: 'silver-medal', label: 'Silver Medal',       hours: 200 },
  { id: 'gold-medal',   label: 'Gold Medal',         hours: 400 },
]

export const HOUR_STATUS = {
  pending:  { label: 'Awaiting verification', color: '#EA580C', bg: '#FFF0E6' },
  verified: { label: 'Verified', color: '#16A34A', bg: '#DCFCE7' },
}
