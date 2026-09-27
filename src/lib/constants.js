export const PIN_TYPES = {
  trash:    { label: 'Litter',   icon: 'trash', color: '#8A5417', bg: '#F7EEE1' },
  graffiti: { label: 'Graffiti', icon: 'spray', color: '#8F3134', bg: '#F6E7E7' },
  mural:    { label: 'Mural',    icon: 'brush', color: '#5B4A86', bg: '#EDEAF5' },
  seating:  { label: 'Seating',  icon: 'bench', color: '#1F6E45', bg: '#E3F0E8' },
}

// OpenStreetMap Humanitarian — cleaner, softer colors than default OSM
export const MAP_TILES = 'https://tile-a.openstreetmap.fr/hot/{z}/{x}/{y}.png'
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://hot.openstreetmap.org/">HOT</a>'

export const SPOT_STATUS = {
  pending:   { label: 'Pending review', color: '#888780', bg: '#F1EFE8', step: 0,
               blurb: 'This spot is awaiting review by our team before it appears publicly.' },
  reported:  { label: 'Request sent',   color: '#5C6B7A', bg: '#EDF0F3', step: 1,
               blurb: 'Your report was sent to the organization that handles this.' },
  reviewing: { label: 'Under review',   color: '#8A5417', bg: '#F7EEE1', step: 2,
               blurb: 'The organization has seen it and is checking the site.' },
  scheduled: { label: 'Event scheduled',color: '#1A1A1A', bg: '#F2F2F2', step: 3,
               blurb: 'A volunteer event is on the calendar for this spot.' },
  resolved:  { label: 'Resolved',       color: '#1F6E45', bg: '#E3F0E8', step: 4,
               blurb: 'Work is done. Thanks for reporting it.' },
  rejected:  { label: 'Not accepted',   color: '#8F3134', bg: '#F6E7E7', step: -1,
               blurb: 'This report was reviewed and could not be accepted. Contact us if you think this is wrong.' },
}

export const STATUS_ORDER = ['reported', 'reviewing', 'scheduled', 'resolved']

export const HOUR_STATUS = {
  pending:  { label: 'Awaiting verification', color: '#8A5417', bg: '#F7EEE1' },
  verified: { label: 'Verified',              color: '#1F6E45', bg: '#E3F0E8' },
}
