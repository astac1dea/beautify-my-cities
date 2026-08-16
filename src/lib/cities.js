// The cities the platform covers. Each one has its own map view, its own
// reported spots, and its own organizations responsible for each category.
export const CITIES = [
  {
    id: 'city-milpitas',
    name: 'Milpitas',
    state: 'California',
    short: 'Milpitas, CA',
    lat: 37.4323, lng: -121.8996, zoom: 13,
    // Which organization picks up each kind of report here.
    orgs: {
      trash:    'org-mil-clean',
      graffiti: 'org-tricity-art',
      mural:    'org-tricity-art',
      seating:  'org-mil-streets',
      fallback: 'org-mil-pw',
    },
  },
  {
    id: 'city-fremont',
    name: 'Fremont',
    state: 'California',
    short: 'Fremont, CA',
    lat: 37.5485, lng: -121.9886, zoom: 12,
    orgs: {
      trash:    'org-fre-clean',
      graffiti: 'org-tricity-art',
      mural:    'org-tricity-art',
      seating:  'org-fre-parks',
      fallback: 'org-fre-pw',
    },
  },
  {
    id: 'city-sanjose',
    name: 'San José',
    state: 'California',
    short: 'San José, CA',
    lat: 37.3382, lng: -121.8863, zoom: 12,
    orgs: {
      trash:    'org-sj-clean',
      graffiti: 'org-sj-art',
      mural:    'org-sj-art',
      seating:  'org-sj-parks',
      fallback: 'org-sj-pw',
    },
  },
  {
    id: 'city-sunnyvale',
    name: 'Sunnyvale',
    state: 'California',
    short: 'Sunnyvale, CA',
    lat: 37.3688, lng: -122.0363, zoom: 13,
    orgs: {
      trash:    'org-sun-clean',
      graffiti: 'org-sun-art',
      mural:    'org-sun-art',
      seating:  'org-sun-parks',
      fallback: 'org-sun-pw',
    },
  },
]

export const DEFAULT_CITY_ID = 'city-milpitas'

export function cityById(id) {
  return CITIES.find(c => c.id === id) || CITIES[0]
}

// Which organization handles a given category in a given city.
export function orgIdFor(cityId, type) {
  const city = cityById(cityId)
  return city.orgs[type] || city.orgs.fallback
}
