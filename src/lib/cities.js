// City IDs match Supabase cities table UUIDs
export const DEFAULT_CITY_ID = '00000001-0000-0000-0000-000000000001' // Milpitas
export const CITIES = [
  {
    id: '00000001-0000-0000-0000-000000000001',
    slug: 'milpitas',
    name: 'Milpitas',
    state: 'California',
    lat: 37.4323,
    lng: -121.8996,
    zoom: 14,
  },
  {
    id: '00000001-0000-0000-0000-000000000002',
    slug: 'fremont',
    name: 'Fremont',
    state: 'California',
    lat: 37.5485,
    lng: -121.9886,
    zoom: 13,
  },
  {
    id: '00000001-0000-0000-0000-000000000003',
    slug: 'san-jose',
    name: 'San José',
    state: 'California',
    lat: 37.3382,
    lng: -121.8863,
    zoom: 13,
  },
  {
    id: '00000001-0000-0000-0000-000000000004',
    slug: 'sunnyvale',
    name: 'Sunnyvale',
    state: 'California',
    lat: 37.3688,
    lng: -122.0363,
    zoom: 14,
  },
]

export function cityById(id) {
  return CITIES.find(c => c.id === id) || CITIES[0]
}

export function cityBySlug(slug) {
  return CITIES.find(c => c.slug === slug) || CITIES[0]
}

// Returns null — org routing is now handled by Supabase org_categories table
export function orgIdFor(cityId, type) {
  return null
}

export default CITIES
