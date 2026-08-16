// Demo content for the app. Table and column names mirror the Supabase schema
// (cities / spots / votes / events / profiles) so this can be swapped for real
// queries later without reshaping the components.

export const ORGANIZATIONS = [
  // --- regional, works across several cities ---
  {
    id: 'org-green', name: 'Santa Clara Valley Green Corps',
    email: 'volunteer@scvgreencorps.org', phone: '(408) 555-0163',
    focus: 'Tree planting, native habitat, creek restoration',
    blurb: 'Regional conservation corps covering the whole South Bay. Runs planting and habitat restoration days and verifies hours for the Congressional Award and school service requirements.',
    color: '#1F6E45', contact_name: 'Grace Whitfield, Crew Supervisor',
  },
  {
    id: 'org-tricity-art', name: 'Tri-City Mural Collective',
    email: 'hours@tricitymurals.org', phone: '(408) 555-0198',
    focus: 'Graffiti removal, community murals, public art',
    blurb: 'Artist collective covering Milpitas, Fremont and Newark. Pairs tagged walls with local artists and student volunteers to turn them into murals.',
    color: '#5B4A86', contact_name: 'Devon Park, Program Lead',
  },

  // --- Milpitas ---
  {
    id: 'org-mil-clean', name: 'Keep Milpitas Beautiful',
    email: 'verify@keepmilpitasbeautiful.org', phone: '(408) 555-0142',
    focus: 'Litter pickup, park cleanups, illegal dumping',
    blurb: 'Volunteer-run nonprofit that runs weekend cleanups across Milpitas parks and trails. Signs off on service hours for students.',
    color: '#8A5417', contact_name: 'Renata Alvarez, Volunteer Coordinator',
  },
  {
    id: 'org-mil-streets', name: 'Milpitas Bike & Walk Coalition',
    email: 'coordinator@milpitasbikewalk.org', phone: '(408) 555-0177',
    focus: 'Benches, shade, seating and street furniture',
    blurb: 'Advocacy group working with the city on safer, more comfortable streets. Builds and installs benches and shade structures with volunteer crews.',
    color: '#205C99', contact_name: 'Theo Nguyen, Field Organizer',
  },
  {
    id: 'org-mil-pw', name: 'Milpitas Public Works',
    email: 'publicworks@milpitas.gov', phone: '(408) 555-0110',
    focus: 'Streets, sidewalks, lighting, storm debris',
    blurb: 'City department. Handles anything that needs equipment or a permit, and takes referrals from resident reports.',
    color: '#17222E', contact_name: 'Public Works Service Desk',
  },

  // --- Fremont ---
  {
    id: 'org-fre-clean', name: 'Fremont Clean & Green',
    email: 'hours@fremontcleangreen.org', phone: '(510) 555-0121',
    focus: 'Litter pickup, creek cleanups, illegal dumping',
    blurb: 'Neighbourhood cleanup network running weekend sweeps across Fremont districts and the Alameda Creek trail. Verifies student service hours.',
    color: '#8A5417', contact_name: 'Marisol Reyes, Volunteer Lead',
  },
  {
    id: 'org-fre-parks', name: 'Fremont Parks Volunteers',
    email: 'verify@fremontparksvolunteers.org', phone: '(510) 555-0148',
    focus: 'Benches, shade structures, playgrounds, park furniture',
    blurb: 'Works with Fremont Recreation Services to repair and install park seating, shade and play equipment on volunteer build days.',
    color: '#205C99', contact_name: 'Ibrahim Osei, Build Coordinator',
  },
  {
    id: 'org-fre-pw', name: 'Fremont Public Works',
    email: 'publicworks@fremont.gov', phone: '(510) 555-0100',
    focus: 'Streets, sidewalks, lighting, storm debris',
    blurb: 'City department. Takes referrals from resident reports for anything needing equipment or a permit.',
    color: '#17222E', contact_name: 'Public Works Service Desk',
  },

  // --- San José ---
  {
    id: 'org-sj-clean', name: 'Beautify San José',
    email: 'servicehours@beautifysj.org', phone: '(408) 555-0190',
    focus: 'Litter pickup, creek cleanups, illegal dumping',
    blurb: 'City-backed volunteer program running neighbourhood cleanups across all ten council districts. Signs service hour forms for students.',
    color: '#8A5417', contact_name: 'Camille Duarte, Program Manager',
  },
  {
    id: 'org-sj-art', name: 'San José Walls',
    email: 'volunteer@sanjosewalls.org', phone: '(408) 555-0175',
    focus: 'Graffiti abatement, murals, utility box art',
    blurb: 'Mural programme that turns repeatedly tagged walls into commissioned public art, with volunteers on prep and paint days.',
    color: '#5B4A86', contact_name: 'Rafael Ibarra, Mural Director',
  },
  {
    id: 'org-sj-parks', name: 'San José Parks Foundation',
    email: 'hours@sjparksfoundation.org', phone: '(408) 555-0158',
    focus: 'Benches, shade, plazas and park amenities',
    blurb: 'Raises funds and organises volunteer build days for seating, shade and gathering spaces in San José parks and plazas.',
    color: '#205C99', contact_name: 'Nadia Farouk, Volunteer Manager',
  },
  {
    id: 'org-sj-pw', name: 'San José Public Works',
    email: 'publicworks@sanjoseca.gov', phone: '(408) 555-0102',
    focus: 'Streets, sidewalks, lighting, storm debris',
    blurb: 'City department. Handles reports that need heavy equipment, permits or traffic control.',
    color: '#17222E', contact_name: 'Public Works Service Desk',
  },

  // --- Sunnyvale ---
  {
    id: 'org-sun-clean', name: 'Sunnyvale Cleanup Crew',
    email: 'verify@sunnyvalecleanup.org', phone: '(408) 555-0133',
    focus: 'Litter pickup, park cleanups, illegal dumping',
    blurb: 'Small volunteer crew running monthly cleanups along Sunnyvale trails, creeks and business corridors. Confirms hours for students.',
    color: '#8A5417', contact_name: 'Hana Lindqvist, Crew Lead',
  },
  {
    id: 'org-sun-art', name: 'Sunnyvale Public Art Collective',
    email: 'hours@sunnyvalepublicart.org', phone: '(408) 555-0166',
    focus: 'Graffiti removal, murals, utility box art',
    blurb: 'Artist-run collective working with the city arts commission on murals and wrapping utility boxes, with volunteers on prep days.',
    color: '#5B4A86', contact_name: 'Toby Marchetti, Projects Lead',
  },
  {
    id: 'org-sun-parks', name: 'Sunnyvale Parks Volunteers',
    email: 'volunteer@sunnyvaleparks.org', phone: '(408) 555-0151',
    focus: 'Benches, shade, playgrounds, park furniture',
    blurb: 'Volunteer group that repairs and installs seating, shade sails and play equipment across Sunnyvale parks.',
    color: '#205C99', contact_name: 'Priyanka Shah, Build Coordinator',
  },
  {
    id: 'org-sun-pw', name: 'Sunnyvale Public Works',
    email: 'publicworks@sunnyvale.ca.gov', phone: '(408) 555-0104',
    focus: 'Streets, sidewalks, lighting, storm debris',
    blurb: 'City department. Takes referrals for anything needing equipment or a permit.',
    color: '#17222E', contact_name: 'Public Works Service Desk',
  },
]

export const PROFILES = [
  {
    id: 'u-maya', email: 'maya@demo.city', password: 'demo1234',
    display_name: 'Maya Chen', role: 'resident', city_id: 'city-milpitas',
    school: 'Milpitas High School', grade: '11th grade',
    bio: 'Working toward the Congressional Award Silver Certificate. Mostly park and creek cleanups.',
    created_at: '2026-02-02', avatar_color: '#5B4A86',
  },
  {
    id: 'u-jordan', email: 'jordan@demo.city', password: 'demo1234',
    display_name: 'Jordan Rivera', role: 'resident', city_id: 'city-milpitas',
    school: 'Milpitas High School', grade: '10th grade',
    bio: 'Just started volunteering this summer.',
    created_at: '2026-06-11', avatar_color: '#205C99',
  },
  {
    id: 'u-sam', email: 'sam@demo.city', password: 'demo1234',
    display_name: 'Sam Okafor', role: 'resident', city_id: 'city-milpitas',
    school: 'Calaveras Hills High School', grade: '12th grade',
    bio: 'Reports a lot of graffiti. Helped paint the Main St mural.',
    created_at: '2026-01-19', avatar_color: '#8A5417',
  },
  // Extra residents so each city's leaderboard has real competition.
  { id: 'u-priya', display_name: 'Priya Raman',    role: 'resident', city_id: 'city-milpitas',  avatar_color: '#1F6E45', created_at: '2026-03-08' },
  { id: 'u-diego', display_name: 'Diego Santos',   role: 'resident', city_id: 'city-milpitas',  avatar_color: '#8F3134', created_at: '2026-04-15' },
  { id: 'u-anna',  display_name: 'Anna Kowalski',  role: 'resident', city_id: 'city-milpitas',  avatar_color: '#205C99', created_at: '2026-05-20' },
  { id: 'u-luis',  display_name: 'Luis Barrera',   role: 'resident', city_id: 'city-fremont',   avatar_color: '#8A5417', created_at: '2026-03-22' },
  { id: 'u-wen',   display_name: 'Wen Zhao',       role: 'resident', city_id: 'city-fremont',   avatar_color: '#5B4A86', created_at: '2026-05-02' },
  { id: 'u-tasha', display_name: 'Tasha Brooks',   role: 'resident', city_id: 'city-sanjose',   avatar_color: '#1F6E45', created_at: '2026-02-14' },
  { id: 'u-omar',  display_name: 'Omar Haddad',    role: 'resident', city_id: 'city-sanjose',   avatar_color: '#205C99', created_at: '2026-04-30' },
  { id: 'u-elle',  display_name: 'Elle Novak',     role: 'resident', city_id: 'city-sunnyvale', avatar_color: '#8F3134', created_at: '2026-03-30' },
  { id: 'u-kenji', display_name: 'Kenji Watanabe', role: 'resident', city_id: 'city-sunnyvale', avatar_color: '#5B4A86', created_at: '2026-06-05' },
]

// `address` is the plain-language location a resident types when reporting:
// "sidewalk in front of ...", a cross street, a park entrance.
// base_upvotes are the votes already on the pin before the signed-in user acts;
// the live count is base_upvotes + rows in `votes`.
export const SPOTS = [
  // ------------------------------------------------------------- Milpitas --
  { id: 'sp-1',  city_id: 'city-milpitas', user_id: 'u-sam',    type: 'trash',    title: 'Park & Abel Intersection',     address: 'NE corner of N Park Victoria Dr and Abel St',            description: 'Bins overflow every weekend and it blows into the crosswalk.',    lat: 37.4350, lng: -121.9020, status: 'scheduled', base_upvotes: 142, created_at: '2026-06-02' },
  { id: 'sp-2',  city_id: 'city-milpitas', user_id: 'u-maya',   type: 'mural',    title: 'Main St. Blank Wall',          address: 'East wall of 76 S Main St, facing the municipal lot',     description: 'Big blank wall by the parking lot. Would be perfect for a mural.', lat: 37.4280, lng: -121.8960, status: 'resolved',  base_upvotes: 98,  created_at: '2026-04-18' },
  { id: 'sp-3',  city_id: 'city-milpitas', user_id: 'u-sam',    type: 'graffiti', title: 'Calaveras Underpass',          address: 'Pedestrian walkway under E Calaveras Blvd at Abel St',    description: 'Tagged again last week. Gets worse every month.',                  lat: 37.4400, lng: -121.8900, status: 'scheduled', base_upvotes: 77,  created_at: '2026-05-09' },
  { id: 'sp-4',  city_id: 'city-milpitas', user_id: 'u-priya',  type: 'seating',  title: 'Civic Center Bus Stop',        address: 'Bus stop on N Milpitas Blvd outside City Hall',           description: 'No shade or bench. People stand in full sun waiting for the 66.',  lat: 37.4320, lng: -121.9050, status: 'reviewing', base_upvotes: 61,  created_at: '2026-06-24' },
  { id: 'sp-6',  city_id: 'city-milpitas', user_id: 'u-maya',   type: 'trash',    title: 'Coyote Creek Trail Access',    address: 'Trailhead off Ranch Dr, 200 ft east of the parking area', description: 'Bags of dumped trash right where the trail meets the road.',       lat: 37.4189, lng: -121.9124, status: 'resolved',  base_upvotes: 88,  created_at: '2026-05-28' },
  { id: 'sp-7',  city_id: 'city-milpitas', user_id: 'u-diego',  type: 'graffiti', title: 'Great Mall Transit Underpass', address: 'Walkway between Great Mall Dr and the BART shuttle stop', description: 'Tags all along the walkway to the shuttle stop.',                  lat: 37.4155, lng: -121.8981, status: 'reviewing', base_upvotes: 73,  created_at: '2026-07-06' },
  { id: 'sp-8',  city_id: 'city-milpitas', user_id: 'u-maya',   type: 'seating',  title: 'Cardoza Park Playground',      address: 'Playground on the Casa Grande Dr side of Cardoza Park',   description: 'Two benches are cracked and the shade sail is torn.',              lat: 37.4425, lng: -121.9075, status: 'reported',  base_upvotes: 44,  created_at: '2026-08-04' },
  { id: 'sp-10', city_id: 'city-milpitas', user_id: 'u-sam',    type: 'trash',    title: 'Higuera Adobe Park Slope',     address: 'Hillside behind the picnic tables, Wessex Pl entrance',   description: 'Litter collects on the hillside behind the picnic tables.',        lat: 37.4356, lng: -121.8792, status: 'scheduled', base_upvotes: 39,  created_at: '2026-08-01' },
  { id: 'sp-11', city_id: 'city-milpitas', user_id: 'u-priya',  type: 'mural',    title: 'Town Center Utility Boxes',    address: 'Four boxes at S Park Victoria Dr and Calaveras Blvd',     description: 'Four grey boxes on the corner. Other cities paint these.',         lat: 37.4310, lng: -121.8998, status: 'scheduled', base_upvotes: 52,  created_at: '2026-08-09' },
  { id: 'sp-12', city_id: 'city-milpitas', user_id: 'u-jordan', type: 'trash',    title: 'Sports Center Parking Lot',    address: 'Fence line at the far entrance, 1325 E Calaveras Blvd',   description: 'Broken glass along the fence line by the far entrance.',           lat: 37.4396, lng: -121.9013, status: 'scheduled', base_upvotes: 28,  created_at: '2026-08-12' },

  // -------------------------------------------------------------- Fremont --
  { id: 'sp-f1', city_id: 'city-fremont', user_id: 'u-luis', type: 'trash',    title: 'Alameda Creek Trail Gate',  address: 'Sidewalk in front of the trail gate on Isherwood Way',   description: 'Dumped furniture and bags right at the trail entrance.',      lat: 37.5810, lng: -122.0230, status: 'scheduled', base_upvotes: 116, created_at: '2026-06-14' },
  { id: 'sp-f2', city_id: 'city-fremont', user_id: 'u-wen',  type: 'graffiti', title: 'Centerville Depot Wall',    address: 'Trackside wall behind the depot, 37260 Fremont Blvd',    description: 'Whole trackside wall was tagged over one weekend.',           lat: 37.5591, lng: -122.0027, status: 'scheduled', base_upvotes: 94,  created_at: '2026-07-02' },
  { id: 'sp-f3', city_id: 'city-fremont', user_id: 'u-luis', type: 'seating',  title: 'Irvington Plaza Benches',   address: 'Plaza in front of 41000 Fremont Blvd',                   description: 'Only two benches for the whole plaza and both are broken.',   lat: 37.5195, lng: -121.9640, status: 'scheduled', base_upvotes: 71,  created_at: '2026-06-30' },
  { id: 'sp-f4', city_id: 'city-fremont', user_id: 'u-wen',  type: 'mural',    title: 'Niles Underpass Wall',      address: 'Retaining wall under the Niles Canyon Rd bridge',        description: 'Long grey retaining wall that could carry a mural.',           lat: 37.5766, lng: -121.9789, status: 'reported',  base_upvotes: 58,  created_at: '2026-07-28' },
  { id: 'sp-f5', city_id: 'city-fremont', user_id: 'u-sam',  type: 'trash',    title: 'Lake Elizabeth Shore Path', address: 'Shore path 300 ft north of the boathouse, Central Park', description: 'Litter builds up along the shoreline every weekend.',          lat: 37.5478, lng: -121.9760, status: 'resolved',  base_upvotes: 83,  created_at: '2026-05-11' },
  { id: 'sp-f6', city_id: 'city-fremont', user_id: 'u-luis', type: 'seating',  title: 'Warm Springs BART Plaza',   address: 'Sidewalk in front of the south entrance on Warm Springs Blvd', description: 'No shade anywhere on the plaza. Brutal in summer.',      lat: 37.5023, lng: -121.9392, status: 'reported',  base_upvotes: 47,  created_at: '2026-08-06' },

  // ------------------------------------------------------------ San José --
  { id: 'sp-s1', city_id: 'city-sanjose', user_id: 'u-tasha', type: 'graffiti', title: 'Guadalupe River Trail Wall', address: 'Sidewalk in front of the trail underpass at W Santa Clara St', description: 'Tagged end to end along the underpass walkway.',        lat: 37.3320, lng: -121.9000, status: 'scheduled', base_upvotes: 168, created_at: '2026-05-20' },
  { id: 'sp-s2', city_id: 'city-sanjose', user_id: 'u-omar',  type: 'trash',    title: 'Coyote Creek at Story Rd',   address: 'Creek bank below the Story Rd bridge, east side',              description: 'Large dump site on the creek bank under the bridge.',   lat: 37.3348, lng: -121.8580, status: 'scheduled', base_upvotes: 131, created_at: '2026-06-18' },
  { id: 'sp-s3', city_id: 'city-sanjose', user_id: 'u-tasha', type: 'seating',  title: 'St James Park Benches',      address: 'North side of St James Park, facing N 2nd St',                 description: 'Half the benches are broken and there is no shade left.', lat: 37.3390, lng: -121.8930, status: 'scheduled', base_upvotes: 105, created_at: '2026-07-08' },
  { id: 'sp-s4', city_id: 'city-sanjose', user_id: 'u-omar',  type: 'mural',    title: 'SoFA District Blank Wall',   address: 'South wall of 380 S 1st St, facing the parking lot',           description: 'Big blank wall in the arts district, begging for a mural.', lat: 37.3298, lng: -121.8853, status: 'reported', base_upvotes: 89, created_at: '2026-08-02' },
  { id: 'sp-s5', city_id: 'city-sanjose', user_id: 'u-tasha', type: 'trash',    title: 'Roosevelt Park Playground',  address: 'Playground area off E Santa Clara St, Roosevelt Park',         description: 'Broken glass around the play structure most mornings.', lat: 37.3475, lng: -121.8778, status: 'resolved',  base_upvotes: 76,  created_at: '2026-04-26' },
  { id: 'sp-s6', city_id: 'city-sanjose', user_id: 'u-omar',  type: 'graffiti', title: 'Japantown Utility Boxes',    address: 'Corner of N 5th St and Jackson St, four boxes',                description: 'Every box on the corner is tagged.',                    lat: 37.3487, lng: -121.8940, status: 'reported',  base_upvotes: 54,  created_at: '2026-08-10' },

  // ----------------------------------------------------------- Sunnyvale --
  { id: 'sp-v1', city_id: 'city-sunnyvale', user_id: 'u-elle',  type: 'trash',    title: 'Sunnyvale Caltrain Underpass', address: 'Sidewalk in front of the underpass on S Murphy Ave', description: 'Rubbish piles up under the tracks and never gets cleared.', lat: 37.3782, lng: -122.0308, status: 'scheduled', base_upvotes: 97, created_at: '2026-06-09' },
  { id: 'sp-v2', city_id: 'city-sunnyvale', user_id: 'u-kenji', type: 'seating',  title: 'Las Palmas Park Picnic Area',  address: 'Picnic area near the Danforth Dr entrance',          description: 'Tables are splitting and two benches have collapsed.',      lat: 37.3536, lng: -122.0209, status: 'scheduled', base_upvotes: 68, created_at: '2026-07-16' },
  { id: 'sp-v3', city_id: 'city-sunnyvale', user_id: 'u-elle',  type: 'mural',    title: 'Murphy Ave Side Wall',         address: 'Side wall of 150 S Murphy Ave, facing the alley',    description: 'Long blank side wall on the main pedestrian street.',       lat: 37.3770, lng: -122.0296, status: 'scheduled', base_upvotes: 62, created_at: '2026-07-21' },
  { id: 'sp-v4', city_id: 'city-sunnyvale', user_id: 'u-kenji', type: 'graffiti', title: 'Baylands Park Restrooms',      address: 'Restroom block by the main lot, 999 E Caribbean Dr', description: 'Restroom block gets tagged every few weeks.',                lat: 37.4155, lng: -122.0179, status: 'reported',  base_upvotes: 41, created_at: '2026-08-07' },
  { id: 'sp-v5', city_id: 'city-sunnyvale', user_id: 'u-elle',  type: 'trash',    title: 'Stevens Creek Trail Access',   address: 'Trail entrance off Dale Ave, behind the school lot', description: 'Dumping keeps happening at the trail entrance.',             lat: 37.3703, lng: -122.0637, status: 'resolved',  base_upvotes: 55, created_at: '2026-05-04' },
]

export const EVENTS = [
  // ============================ Milpitas ============================
  // --- past (these are what volunteer hours are logged against) ---
  { id: 'ev-01', city_id: 'city-milpitas', spot_id: null,   org_id: 'org-mil-pw',      title: 'Winter Storm Debris Clearing',      event_date: '2026-02-21', start_time: '08:00', end_time: '13:30', hours: 5.5, max_volunteers: 40, location: 'Milpitas Corporation Yard, 1265 N Milpitas Blvd',
    description: 'Citywide cleanup after the February storms. Clearing downed branches and debris from sidewalks, storm drains and park paths.',
    tasks: ['Drag branches to chipper staging areas', 'Clear leaves and debris off storm drain grates', 'Rake and bag material along sidewalks', 'Flag any damage too large to move for the city crew'] },
  { id: 'ev-02', city_id: 'city-milpitas', spot_id: null,   org_id: 'org-mil-clean',   title: 'Great American Cleanup: Citywide',  event_date: '2026-03-14', start_time: '09:00', end_time: '15:00', hours: 6,   max_volunteers: 120, location: 'Milpitas City Hall lawn, 455 E Calaveras Blvd',
    description: 'The big annual one. Crews fan out to parks, trails and business corridors across the city.',
    tasks: ['Check in and pick up a route assignment', 'Litter pickup with grabbers along your route', 'Sort recyclables from landfill at the drop point', 'Log bag counts on the crew sheet'] },
  { id: 'ev-03', city_id: 'city-milpitas', spot_id: null,   org_id: 'org-green',       title: 'Selwyn Park Playground Refresh',    event_date: '2026-04-04', start_time: '09:00', end_time: '14:00', hours: 5,   max_volunteers: 30, location: 'Selwyn Park, 1201 Selwyn Dr',
    description: 'Spreading new bark, weeding the beds around the play structure and planting drought-tolerant natives along the fence.',
    tasks: ['Spread and rake playground bark to depth', 'Pull weeds from planting beds', 'Plant native shrubs along the fence line', 'Water in and mulch new plantings'] },
  { id: 'ev-04', city_id: 'city-milpitas', spot_id: 'sp-6', org_id: 'org-mil-clean',   title: 'Murphy Park Creek Cleanup',         event_date: '2026-04-25', start_time: '09:00', end_time: '14:00', hours: 5,   max_volunteers: 45, location: 'Murphy Park, 1901 Willow Way',
    description: 'Pulling trash out of the creek channel and the banks on either side before the summer dry-down.',
    tasks: ['Wade the shallow channel and bag trash', 'Haul bags up the bank to the collection point', 'Separate scrap metal and tires for special pickup', 'Record what you find on the pollution tally sheet'] },
  { id: 'ev-05', city_id: 'city-milpitas', spot_id: 'sp-1', org_id: 'org-mil-clean',   title: 'Cardoza Park Spring Cleanup',       event_date: '2026-05-16', start_time: '09:00', end_time: '13:00', hours: 4,   max_volunteers: 50, location: 'Cardoza Park, 3800 Casa Grande Dr',
    description: 'Litter sweep of the park and the Park & Abel corner, plus emptying and scrubbing the overflow bins.',
    tasks: ['Litter sweep of lawns, playground and path edges', 'Empty and scrub out the trash enclosures', 'Report any bins that need replacing', 'Break down cardboard at the recycling station'] },
  { id: 'ev-06', city_id: 'city-milpitas', spot_id: 'sp-3', org_id: 'org-tricity-art', title: 'Calaveras Underpass Mural Prep',    event_date: '2026-06-06', start_time: '08:30', end_time: '14:30', hours: 5,   max_volunteers: 25, location: 'Calaveras Blvd underpass, east side',
    description: 'Prepping the underpass walls so the artist team can start the mural. Pressure washing, priming and taping.',
    tasks: ['Pressure wash the wall surface', 'Roll on primer coat in sections', 'Tape and mask edges and fixtures', 'Set up and take down safety cones and barriers'] },
  { id: 'ev-07', city_id: 'city-milpitas', spot_id: 'sp-6', org_id: 'org-mil-clean',   title: 'Coyote Creek Trail Trash Sweep',    event_date: '2026-06-20', start_time: '08:00', end_time: '11:30', hours: 3.5, max_volunteers: 35, location: 'Coyote Creek Trail, Ranch Dr trailhead',
    description: 'Early morning sweep of the trail and the access road where dumping keeps happening.',
    tasks: ['Bag litter along a 1.5 mile trail segment', 'Photograph and GPS-tag illegal dump sites', 'Move bagged trash to the trailhead pickup point', 'Note overgrown sightlines for the trail crew'] },
  { id: 'ev-08', city_id: 'city-milpitas', spot_id: null,   org_id: 'org-green',       title: 'Great Mall Transit Plaza Planting', event_date: '2026-07-11', start_time: '08:00', end_time: '12:00', hours: 4,   max_volunteers: 30, location: 'Great Mall transit plaza, 447 Great Mall Dr',
    description: 'Putting shade trees and understory plants into the new plaza beds by the shuttle stop.',
    tasks: ['Dig planting holes to the marked depth', 'Set trees and backfill with amended soil', 'Install tree stakes and ties', 'Lay drip line and mulch each bed'] },
  { id: 'ev-09', city_id: 'city-milpitas', spot_id: 'sp-2', org_id: 'org-tricity-art', title: 'Main Street Mural Paint Day',       event_date: '2026-07-25', start_time: '08:00', end_time: '14:00', hours: 6,   max_volunteers: 20, location: 'Main St at the municipal lot, Milpitas',
    description: 'The paint day itself. Volunteers block in the large color fields while the artists handle detail work.',
    tasks: ['Block in large color fields from the paint map', 'Keep brushes and rollers loaded and clean', 'Refill and label paint trays by color code', 'Clean up and seal paint at the end of the day'] },
  { id: 'ev-10', city_id: 'city-milpitas', spot_id: null,   org_id: 'org-mil-streets', title: 'Sports Center Bench Build',         event_date: '2026-08-08', start_time: '09:00', end_time: '12:00', hours: 3,   max_volunteers: 15, location: 'Milpitas Sports Center, 1325 E Calaveras Blvd',
    description: 'Assembling and installing four replacement benches and a repaired shade sail.',
    tasks: ['Assemble bench frames from the kit', 'Sand and seal the wood slats', 'Bolt benches to the existing concrete pads', 'Help re-tension and mount the shade sail'] },
  // --- upcoming ---
  { id: 'ev-12', city_id: 'city-milpitas', spot_id: 'sp-10', org_id: 'org-mil-clean',   title: 'Higuera Adobe Park Cleanup',         event_date: '2026-08-29', start_time: '08:30', end_time: '12:30', hours: 4, max_volunteers: 40, location: 'Higuera Adobe Park, 1650 Wessex Pl',
    description: 'Clearing the litter that collects on the hillside behind the picnic area, plus a general park sweep.',
    tasks: ['Litter pickup on the hillside slope', 'Sweep the picnic and playground areas', 'Clear debris from the historic adobe walkway', 'Sort and weigh collected material'] },
  { id: 'ev-16', city_id: 'city-milpitas', spot_id: 'sp-1',  org_id: 'org-mil-clean',   title: 'Park & Abel Bin Overhaul',           event_date: '2026-09-05', start_time: '08:30', end_time: '12:30', hours: 4, max_volunteers: 30, location: 'Park Victoria Dr at Abel St, Milpitas',
    description: 'Replacing the overflowing bins at the intersection and doing a litter sweep of the surrounding blocks.',
    tasks: ['Empty and remove the old bins', 'Position and secure the new larger bins', 'Litter sweep the crosswalk and verges', 'Post the new collection schedule signage'] },
  { id: 'ev-13', city_id: 'city-milpitas', spot_id: 'sp-11', org_id: 'org-tricity-art', title: 'Town Center Utility Box Prep',       event_date: '2026-09-12', start_time: '09:00', end_time: '13:00', hours: 4, max_volunteers: 22, location: 'Milpitas Town Center, 1350 S Park Victoria Dr',
    description: 'Sanding and priming the utility boxes on the corner so the artist wraps can go on.',
    tasks: ['Scrub and degrease each box', 'Sand down rough and rusted patches', 'Roll on primer coat', 'Measure boxes for the artist wrap templates'] },
  { id: 'ev-17', city_id: 'city-milpitas', spot_id: 'sp-3',  org_id: 'org-tricity-art', title: 'Calaveras Underpass Mural Paint Day', event_date: '2026-09-19', start_time: '08:00', end_time: '14:00', hours: 6, max_volunteers: 24, location: 'Calaveras Blvd underpass, east side',
    description: 'The paint day the June prep session was building toward. Volunteers block in the design while the artists detail it.',
    tasks: ['Block in colour fields from the paint map', 'Keep rollers and brushes loaded', 'Mix and label paint by colour code', 'Clean up and seal paint at the end of the day'] },
  { id: 'ev-14', city_id: 'city-milpitas', spot_id: null,    org_id: 'org-green',       title: 'Ed Levin Trailhead Restoration',     event_date: '2026-09-26', start_time: '08:00', end_time: '13:00', hours: 5, max_volunteers: 35, location: 'Ed R. Levin County Park, 3100 Calaveras Rd',
    description: 'Repairing trail erosion and pulling invasive thistle and mustard from the lower meadow.',
    tasks: ['Pull invasive thistle and mustard by the root', 'Shovel and tamp fill into eroded trail sections', 'Rebuild water bars along the slope', 'Haul cleared material to the green waste trailer'] },
  { id: 'ev-15', city_id: 'city-milpitas', spot_id: 'sp-12', org_id: 'org-mil-clean',   title: 'Sports Center Lot Glass Sweep',      event_date: '2026-10-10', start_time: '09:00', end_time: '12:00', hours: 3, max_volunteers: 20, location: 'Milpitas Sports Center, far lot entrance',
    description: 'Clearing broken glass along the fence line and doing a full sweep of the parking lot edges.',
    tasks: ['Sweep and collect glass along the fence line', 'Rake debris out from under the hedge', 'Bag and label sharps for safe disposal', 'Check and report damaged fence sections'] },

  // ============================ Fremont =============================
  { id: 'ev-f1', city_id: 'city-fremont', spot_id: 'sp-f5', org_id: 'org-fre-clean',   title: 'Lake Elizabeth Shore Cleanup',  event_date: '2026-06-13', start_time: '08:30', end_time: '12:30', hours: 4, max_volunteers: 50, location: 'Central Park boathouse, 40000 Paseo Padre Pkwy',
    description: 'Working the shoreline path and the picnic lawns around Lake Elizabeth after the busy spring weekends.',
    tasks: ['Litter pickup along the shore path', 'Fish floating debris out of the shallows with nets', 'Empty and reline the lakeside bins', 'Weigh and log what the crew collects'] },
  { id: 'ev-f2', city_id: 'city-fremont', spot_id: 'sp-f1', org_id: 'org-fre-clean',   title: 'Alameda Creek Trail Sweep',     event_date: '2026-09-06', start_time: '08:00', end_time: '12:00', hours: 4, max_volunteers: 45, location: 'Isherwood Way staging area, Fremont',
    description: 'Clearing the dumping that keeps appearing at the trail gate, then sweeping the first two miles of trail.',
    tasks: ['Break down and load dumped furniture', 'Bag litter along the trail segment', 'Photograph and tag dump sites for the city', 'Move collected material to the roll-off bin'] },
  { id: 'ev-f3', city_id: 'city-fremont', spot_id: 'sp-f3', org_id: 'org-fre-parks',   title: 'Irvington Plaza Bench Build',   event_date: '2026-09-20', start_time: '09:00', end_time: '13:00', hours: 4, max_volunteers: 20, location: 'Irvington Plaza, 41000 Fremont Blvd',
    description: 'Replacing the two broken plaza benches and adding four more, plus sanding and sealing the planter edges.',
    tasks: ['Remove and dispose of the broken benches', 'Assemble the new bench frames', 'Bolt benches down and check they sit level', 'Sand and seal the planter edging'] },
  { id: 'ev-f4', city_id: 'city-fremont', spot_id: 'sp-f2', org_id: 'org-tricity-art', title: 'Centerville Depot Wall Prep',   event_date: '2026-10-03', start_time: '08:30', end_time: '13:30', hours: 5, max_volunteers: 25, location: 'Centerville Depot, 37260 Fremont Blvd',
    description: 'Pressure washing and priming the trackside wall ahead of the mural commission.',
    tasks: ['Pressure wash the full wall surface', 'Prime in sections with rollers', 'Mask fixtures and edges', 'Set out and collect safety barriers'] },

  // =========================== San José =============================
  { id: 'ev-s1', city_id: 'city-sanjose', spot_id: 'sp-s5', org_id: 'org-sj-clean', title: 'Roosevelt Park Playground Sweep', event_date: '2026-05-30', start_time: '08:00', end_time: '11:00', hours: 3,   max_volunteers: 35, location: 'Roosevelt Park, 901 E Santa Clara St',
    description: 'Early sweep of the playground and surrounding lawns, with a focus on glass around the play structure.',
    tasks: ['Sweep and collect glass around the play structure', 'Litter pickup across the lawns', 'Bag and label sharps for safe disposal', 'Check play equipment for damage and report it'] },
  { id: 'ev-s2', city_id: 'city-sanjose', spot_id: 'sp-s1', org_id: 'org-sj-art',   title: 'Guadalupe Trail Mural Prep',      event_date: '2026-09-13', start_time: '08:00', end_time: '14:00', hours: 6,   max_volunteers: 30, location: 'W Santa Clara St trail underpass, San José',
    description: 'Removing tags and priming the underpass walls before the commissioned mural goes up.',
    tasks: ['Apply graffiti remover and scrub the walls', 'Roll primer over the prepared sections', 'Tape and mask lighting and fixtures', 'Set up and take down the work zone'] },
  { id: 'ev-s3', city_id: 'city-sanjose', spot_id: 'sp-s3', org_id: 'org-sj-parks', title: 'St James Park Bench Restoration', event_date: '2026-09-27', start_time: '09:00', end_time: '13:30', hours: 4.5, max_volunteers: 28, location: 'St James Park, N 2nd St side',
    description: 'Restoring the heritage benches on the north side of the park and re-hanging two shade sails.',
    tasks: ['Strip and sand the bench slats', 'Re-oil and seal the timber', 'Tighten and replace corroded fixings', 'Help re-tension the shade sails'] },
  { id: 'ev-s4', city_id: 'city-sanjose', spot_id: 'sp-s2', org_id: 'org-sj-clean', title: 'Coyote Creek Bank Cleanup',       event_date: '2026-10-17', start_time: '08:00', end_time: '13:00', hours: 5,   max_volunteers: 60, location: 'Story Rd bridge, east bank staging area',
    description: 'Large-scale clearance of the dump site on the creek bank, working alongside the city crew.',
    tasks: ['Haul bagged material up the bank to the staging area', 'Separate metal, tyres and green waste', 'Bag loose litter along the bank', 'Log the site condition for the follow-up survey'] },

  // ========================== Sunnyvale =============================
  { id: 'ev-v1', city_id: 'city-sunnyvale', spot_id: 'sp-v5', org_id: 'org-sun-clean', title: 'Stevens Creek Trail Cleanup',   event_date: '2026-06-27', start_time: '08:30', end_time: '11:30', hours: 3,   max_volunteers: 30, location: 'Dale Ave trail entrance, Sunnyvale',
    description: 'Clearing the dumping at the trail entrance and sweeping the first mile of path.',
    tasks: ['Load dumped material into the trailer', 'Bag litter along the trail', 'Cut back overgrowth blocking the path', 'Log dump sites for the city follow-up'] },
  { id: 'ev-v2', city_id: 'city-sunnyvale', spot_id: 'sp-v1', org_id: 'org-sun-clean', title: 'Murphy Ave Underpass Cleanup',  event_date: '2026-09-05', start_time: '08:00', end_time: '11:30', hours: 3.5, max_volunteers: 25, location: 'S Murphy Ave underpass, Sunnyvale',
    description: 'Full clearance and scrub-down of the underpass, plus the approaches on both sides.',
    tasks: ['Clear and bag accumulated rubbish', 'Pressure wash the walkway surface', 'Scrub down the tiled walls', 'Report any lighting that has failed'] },
  { id: 'ev-v3', city_id: 'city-sunnyvale', spot_id: 'sp-v3', org_id: 'org-sun-art',   title: 'Murphy Ave Mural Paint Day',    event_date: '2026-09-26', start_time: '08:30', end_time: '14:30', hours: 6,   max_volunteers: 22, location: '150 S Murphy Ave, alley side',
    description: 'Blocking in the mural design on the Murphy Ave side wall alongside the commissioned artists.',
    tasks: ['Block in colour fields from the paint map', 'Keep rollers and brushes loaded', 'Mix and label paint by code', 'Clean up and seal paint at the end of the day'] },
  { id: 'ev-v4', city_id: 'city-sunnyvale', spot_id: 'sp-v2', org_id: 'org-sun-parks', title: 'Las Palmas Picnic Area Repair', event_date: '2026-10-11', start_time: '09:00', end_time: '13:00', hours: 4,   max_volunteers: 18, location: 'Las Palmas Park, Danforth Dr entrance',
    description: 'Rebuilding the collapsed benches and re-decking two picnic tables in the main picnic area.',
    tasks: ['Strip damaged boards off the tables', 'Cut and fit replacement decking', 'Sand and seal all new timber', 'Rebuild and anchor the two benches'] },
]

// Who signed up for what. Past-event rows also produce a volunteer hour log entry.
export const SIGNUPS = [
  // Maya - the heavy volunteer, chasing the Congressional Award
  ...['ev-01','ev-02','ev-03','ev-04','ev-05','ev-06','ev-07','ev-08','ev-09','ev-10','ev-13','ev-16']
      .map(e => ({ event_id: e, user_id: 'u-maya' })),
  // Jordan - newer, started in the summer
  ...['ev-07','ev-09','ev-10','ev-12','ev-17'].map(e => ({ event_id: e, user_id: 'u-jordan' })),
  // Sam - also volunteers over in Fremont
  ...['ev-02','ev-05','ev-06','ev-08','ev-09','ev-10','ev-12','ev-13','ev-14','ev-17','ev-f1','ev-f2']
      .map(e => ({ event_id: e, user_id: 'u-sam' })),
  // Background volunteers, so events show realistic headcounts
  ...['ev-02','ev-05','ev-09','ev-12','ev-16'].map(e => ({ event_id: e, user_id: 'u-priya' })),
  ...['ev-04','ev-07','ev-12','ev-14'].map(e => ({ event_id: e, user_id: 'u-diego' })),
  ...['ev-03','ev-08','ev-13','ev-15','ev-16','ev-17'].map(e => ({ event_id: e, user_id: 'u-anna' })),
  ...['ev-f1','ev-f2','ev-f3','ev-f4'].map(e => ({ event_id: e, user_id: 'u-luis' })),
  ...['ev-f1','ev-f3','ev-f4'].map(e => ({ event_id: e, user_id: 'u-wen' })),
  ...['ev-s1','ev-s2','ev-s3','ev-s4'].map(e => ({ event_id: e, user_id: 'u-tasha' })),
  ...['ev-s1','ev-s2','ev-s4'].map(e => ({ event_id: e, user_id: 'u-omar' })),
  ...['ev-v1','ev-v2','ev-v3'].map(e => ({ event_id: e, user_id: 'u-elle' })),
  ...['ev-v1','ev-v3','ev-v4'].map(e => ({ event_id: e, user_id: 'u-kenji' })),
]

// Hours the organization has not signed off on yet. Everything else that has
// already happened is verified.
export const UNVERIFIED_EVENTS = ['ev-10']
