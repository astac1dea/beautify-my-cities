// Categories carry an icon name (see components/ui/Icon) rather than an emoji.
// Colours are deliberately desaturated so a map full of pins stays readable.
export const PIN_TYPES = {
  trash:    { label: 'Litter',   icon: 'trash', color: '#8A5417', bg: '#F7EEE1' },
  graffiti: { label: 'Graffiti', icon: 'spray', color: '#8F3134', bg: '#F6E7E7' },
  mural:    { label: 'Mural',    icon: 'brush', color: '#5B4A86', bg: '#EDEAF5' },
  seating:  { label: 'Seating',  icon: 'bench', color: '#1F6E45', bg: '#E3F0E8' },
}

export const MAP_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const MAP_ATTRIBUTION = '© OpenStreetMap contributors'

// A pin moves through these as the responsible org picks it up.
export const SPOT_STATUS = {
  reported:  { label: 'Request sent', color: '#5C6B7A', bg: '#EDF0F3', step: 0,
               blurb: 'Your report was sent to the organization that handles this.' },
  reviewing: { label: 'Under review', color: '#8A5417', bg: '#F7EEE1', step: 1,
               blurb: 'The organization has seen it and is checking the site.' },
  scheduled: { label: 'Event scheduled', color: '#14395E', bg: '#E8EEF4', step: 2,
               blurb: 'A volunteer event is on the calendar for this spot.' },
  resolved:  { label: 'Resolved', color: '#1F6E45', bg: '#E3F0E8', step: 3,
               blurb: 'Work is done. Thanks for reporting it.' },
}

export const STATUS_ORDER = ['reported', 'reviewing', 'scheduled', 'resolved']

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
  pending:  { label: 'Awaiting verification', color: '#8A5417', bg: '#F7EEE1' },
  verified: { label: 'Verified', color: '#1F6E45', bg: '#E3F0E8' },
}
