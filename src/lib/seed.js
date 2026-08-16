import { MILPITAS } from './constants'

// Demo content for the app. Table and column names mirror the Supabase schema
// (cities / spots / votes / events / profiles) so this can be swapped for real
// queries later without reshaping the components.

export const ORGANIZATIONS = [
  {
    id: 'org-kmb',
    name: 'Keep Milpitas Beautiful',
    email: 'verify@keepmilpitasbeautiful.org',
    phone: '(408) 555-0142',
    focus: 'Litter pickup, park cleanups, illegal dumping',
    blurb: 'Volunteer-run nonprofit that runs weekend cleanups across Milpitas parks and trails. Signs off on service hours for students.',
    color: '#8A5417',
    contact_name: 'Renata Alvarez, Volunteer Coordinator',
  },
  {
    id: 'org-mural',
    name: 'Tri-City Mural Collective',
    email: 'hours@tricitymurals.org',
    phone: '(408) 555-0198',
    focus: 'Graffiti removal, community murals, public art',
    blurb: 'Artist collective covering Milpitas, Fremont and Newark. Pairs tagged walls with local artists and student volunteers to turn them into murals.',
    color: '#5B4A86',
    contact_name: 'Devon Park, Program Lead',
  },
  {
    id: 'org-bikewalk',
    name: 'Milpitas Bike & Walk Coalition',
    email: 'coordinator@milpitasbikewalk.org',
    phone: '(408) 555-0177',
    focus: 'Benches, shade, seating and street furniture',
    blurb: 'Advocacy group working with the city on safer, more comfortable streets. Builds and installs benches and shade structures with volunteer crews.',
    color: '#205C99',
    contact_name: 'Theo Nguyen, Field Organizer',
  },
  {
    id: 'org-green',
    name: 'Santa Clara Valley Green Corps',
    email: 'volunteer@scvgreencorps.org',
    phone: '(408) 555-0163',
    focus: 'Tree planting, native habitat, creek restoration',
    blurb: 'Regional conservation corps. Runs planting and habitat restoration days and verifies hours for the Congressional Award and school service requirements.',
    color: '#1F6E45',
    contact_name: 'Grace Whitfield, Crew Supervisor',
  },
  {
    id: 'org-pw',
    name: 'Milpitas Public Works',
    email: 'publicworks@milpitas.gov',
    phone: '(408) 555-0110',
    focus: 'Streets, sidewalks, lighting, storm debris',
    blurb: 'City department. Handles anything that needs equipment or a permit, and takes referrals from resident reports.',
    color: '#17222E',
    contact_name: 'Public Works Service Desk',
  },
]

export const PROFILES = [
  {
    id: 'u-maya', email: 'maya@demo.city', password: 'demo1234',
    display_name: 'Maya Chen', role: 'resident', city_id: MILPITAS.cityId,
    school: 'Milpitas High School', grade: '11th grade',
    bio: 'Working toward the Congressional Award Silver Certificate. Mostly park and creek cleanups.',
    created_at: '2026-02-02', avatar_color: '#5B4A86',
  },
  {
    id: 'u-jordan', email: 'jordan@demo.city', password: 'demo1234',
    display_name: 'Jordan Rivera', role: 'resident', city_id: MILPITAS.cityId,
    school: 'Milpitas High School', grade: '10th grade',
    bio: 'Just started volunteering this summer. Into bike infrastructure.',
    created_at: '2026-06-11', avatar_color: '#205C99',
  },
  {
    id: 'u-sam', email: 'sam@demo.city', password: 'demo1234',
    display_name: 'Sam Okafor', role: 'resident', city_id: MILPITAS.cityId,
    school: 'Calaveras Hills High School', grade: '12th grade',
    bio: 'Reports a lot of graffiti. Helped paint the Main St mural.',
    created_at: '2026-01-19', avatar_color: '#8A5417',
  },
  // Extra residents so the leaderboard has real competition.
  { id: 'u-priya', display_name: 'Priya Raman', role: 'resident', city_id: MILPITAS.cityId, avatar_color: '#1F6E45', created_at: '2026-03-08' },
  { id: 'u-diego', display_name: 'Diego Santos', role: 'resident', city_id: MILPITAS.cityId, avatar_color: '#8F3134', created_at: '2026-04-15' },
  { id: 'u-anna',  display_name: 'Anna Kowalski', role: 'resident', city_id: MILPITAS.cityId, avatar_color: '#205C99', created_at: '2026-05-20' },
]

// base_upvotes are the votes already on the pin before the signed-in user acts.
// The live count is base_upvotes + rows in `votes`.
export const SPOTS = [
  { id: 'sp-1',  city_id: MILPITAS.cityId, user_id: 'u-sam',   type: 'trash',    title: 'Park & Abel Intersection',     description: 'Bins overflow every weekend and it blows into the crosswalk.',        lat: 37.4350, lng: -121.9020, status: 'scheduled', base_upvotes: 142, created_at: '2026-06-02', org_id: 'org-kmb' },
  { id: 'sp-2',  city_id: MILPITAS.cityId, user_id: 'u-maya',  type: 'mural',    title: 'Main St. Blank Wall',          description: 'Big blank wall by the parking lot. Would be perfect for a mural.',     lat: 37.4280, lng: -121.8960, status: 'resolved',  base_upvotes: 98,  created_at: '2026-04-18', org_id: 'org-mural' },
  { id: 'sp-3',  city_id: MILPITAS.cityId, user_id: 'u-sam',   type: 'graffiti', title: 'Calaveras Underpass',          description: 'Tagged again last week. Gets worse every month.',                      lat: 37.4400, lng: -121.8900, status: 'scheduled', base_upvotes: 77,  created_at: '2026-05-09', org_id: 'org-mural' },
  { id: 'sp-4',  city_id: MILPITAS.cityId, user_id: 'u-priya', type: 'seating',  title: 'Civic Center Bus Stop',        description: 'No shade or bench. People stand in full sun waiting for the 66.',      lat: 37.4320, lng: -121.9050, status: 'reviewing', base_upvotes: 61,  created_at: '2026-06-24', org_id: 'org-bikewalk' },
  { id: 'sp-6',  city_id: MILPITAS.cityId, user_id: 'u-maya',  type: 'trash',    title: 'Coyote Creek Trail Access',    description: 'Bags of dumped trash right where the trail meets the road.',            lat: 37.4189, lng: -121.9124, status: 'resolved',  base_upvotes: 88,  created_at: '2026-05-28', org_id: 'org-kmb' },
  { id: 'sp-7',  city_id: MILPITAS.cityId, user_id: 'u-diego', type: 'graffiti', title: 'Great Mall Transit Underpass', description: 'Tags all along the walkway to the BART shuttle stop.',                  lat: 37.4155, lng: -121.8981, status: 'reviewing', base_upvotes: 73,  created_at: '2026-07-06', org_id: 'org-mural' },
  { id: 'sp-8',  city_id: MILPITAS.cityId, user_id: 'u-maya',  type: 'seating',  title: 'Cardoza Park Playground',      description: 'Two benches are cracked and the shade sail is torn.',                   lat: 37.4425, lng: -121.9075, status: 'reported',  base_upvotes: 44,  created_at: '2026-08-04', org_id: 'org-bikewalk' },
  { id: 'sp-10', city_id: MILPITAS.cityId, user_id: 'u-sam',   type: 'trash',    title: 'Higuera Adobe Park Slope',     description: 'Litter collects on the hillside behind the picnic tables.',             lat: 37.4356, lng: -121.8792, status: 'scheduled', base_upvotes: 39,  created_at: '2026-08-01', org_id: 'org-kmb' },
  { id: 'sp-11', city_id: MILPITAS.cityId, user_id: 'u-priya', type: 'mural',    title: 'Town Center Utility Boxes',    description: 'Four grey boxes on the corner. Other cities paint these.',              lat: 37.4310, lng: -121.8998, status: 'scheduled',  base_upvotes: 52,  created_at: '2026-08-09', org_id: 'org-mural' },
  { id: 'sp-12', city_id: MILPITAS.cityId, user_id: 'u-jordan',type: 'trash',    title: 'Sports Center Parking Lot',    description: 'Broken glass along the fence line by the far entrance.',                lat: 37.4396, lng: -121.9013, status: 'scheduled',  base_upvotes: 28,  created_at: '2026-08-12', org_id: 'org-kmb' },
]

export const EVENTS = [
  // --- Past events (these are what volunteer hours are logged against) ---
  { id: 'ev-01', spot_id: null,   org_id: 'org-pw',       title: 'Winter Storm Debris Clearing',      event_date: '2026-02-21', start_time: '08:00', end_time: '13:30', hours: 5.5, max_volunteers: 40, location: 'Milpitas Corporation Yard, 1265 N Milpitas Blvd',
    description: 'Citywide cleanup after the February storms. Clearing downed branches and debris from sidewalks, storm drains and park paths.',
    tasks: ['Drag branches to chipper staging areas', 'Clear leaves and debris off storm drain grates', 'Rake and bag material along sidewalks', 'Flag any damage too large to move for the city crew'] },
  { id: 'ev-02', spot_id: null,   org_id: 'org-kmb',      title: 'Great American Cleanup: Citywide',  event_date: '2026-03-14', start_time: '09:00', end_time: '15:00', hours: 6,   max_volunteers: 120, location: 'Milpitas City Hall lawn, 455 E Calaveras Blvd',
    description: 'The big annual one. Crews fan out to parks, trails and business corridors across the city.',
    tasks: ['Check in and pick up a route assignment', 'Litter pickup with grabbers along your route', 'Sort recyclables from landfill at the drop point', 'Log bag counts on the crew sheet'] },
  { id: 'ev-03', spot_id: null,   org_id: 'org-green',    title: 'Selwyn Park Playground Refresh',    event_date: '2026-04-04', start_time: '09:00', end_time: '14:00', hours: 5,   max_volunteers: 30, location: 'Selwyn Park, 1201 Selwyn Dr',
    description: 'Spreading new bark, weeding the beds around the play structure and planting drought-tolerant natives along the fence.',
    tasks: ['Spread and rake playground bark to depth', 'Pull weeds from planting beds', 'Plant native shrubs along the fence line', 'Water in and mulch new plantings'] },
  { id: 'ev-04', spot_id: 'sp-6', org_id: 'org-kmb',      title: 'Murphy Park Creek Cleanup',         event_date: '2026-04-25', start_time: '09:00', end_time: '14:00', hours: 5,   max_volunteers: 45, location: 'Murphy Park, 1901 Willow Way',
    description: 'Pulling trash out of the creek channel and the banks on either side before the summer dry-down.',
    tasks: ['Wade the shallow channel and bag trash', 'Haul bags up the bank to the collection point', 'Separate scrap metal and tires for special pickup', 'Record what you find on the pollution tally sheet'] },
  { id: 'ev-05', spot_id: 'sp-1', org_id: 'org-kmb',      title: 'Cardoza Park Spring Cleanup',       event_date: '2026-05-16', start_time: '09:00', end_time: '13:00', hours: 4,   max_volunteers: 50, location: 'Cardoza Park, 3800 Casa Grande Dr',
    description: 'Litter sweep of the park and the Park & Abel corner, plus emptying and scrubbing the overflow bins.',
    tasks: ['Litter sweep of lawns, playground and path edges', 'Empty and scrub out the trash enclosures', 'Report any bins that need replacing', 'Break down cardboard at the recycling station'] },
  { id: 'ev-06', spot_id: 'sp-3', org_id: 'org-mural',    title: 'Calaveras Underpass Mural Prep',    event_date: '2026-06-06', start_time: '08:30', end_time: '14:30', hours: 5,   max_volunteers: 25, location: 'Calaveras Blvd underpass, east side',
    description: 'Prepping the underpass walls so the artist team can start the mural. Pressure washing, priming and taping.',
    tasks: ['Pressure wash the wall surface', 'Roll on primer coat in sections', 'Tape and mask edges and fixtures', 'Set up and take down safety cones and barriers'] },
  { id: 'ev-07', spot_id: 'sp-6', org_id: 'org-kmb',      title: 'Coyote Creek Trail Trash Sweep',    event_date: '2026-06-20', start_time: '08:00', end_time: '11:30', hours: 3.5, max_volunteers: 35, location: 'Coyote Creek Trail, Ranch Dr trailhead',
    description: 'Early morning sweep of the trail and the access road where dumping keeps happening.',
    tasks: ['Bag litter along a 1.5 mile trail segment', 'Photograph and GPS-tag illegal dump sites', 'Move bagged trash to the trailhead pickup point', 'Note overgrown sightlines for the trail crew'] },
  { id: 'ev-08', spot_id: null,   org_id: 'org-green',    title: 'Great Mall Transit Plaza Planting', event_date: '2026-07-11', start_time: '08:00', end_time: '12:00', hours: 4,   max_volunteers: 30, location: 'Great Mall transit plaza, 447 Great Mall Dr',
    description: 'Putting shade trees and understory plants into the new plaza beds by the shuttle stop.',
    tasks: ['Dig planting holes to the marked depth', 'Set trees and backfill with amended soil', 'Install tree stakes and ties', 'Lay drip line and mulch each bed'] },
  { id: 'ev-09', spot_id: 'sp-2', org_id: 'org-mural',    title: 'Main Street Mural Paint Day',       event_date: '2026-07-25', start_time: '08:00', end_time: '14:00', hours: 6,   max_volunteers: 20, location: 'Main St at the municipal lot, Milpitas',
    description: 'The paint day itself. Volunteers block in the large color fields while the artists handle detail work.',
    tasks: ['Block in large color fields from the paint map', 'Keep brushes and rollers loaded and clean', 'Refill and label paint trays by color code', 'Clean up and seal paint at the end of the day'] },
  { id: 'ev-10', spot_id: null,   org_id: 'org-bikewalk', title: 'Sports Center Bench Build',         event_date: '2026-08-08', start_time: '09:00', end_time: '12:00', hours: 3,   max_volunteers: 15, location: 'Milpitas Sports Center, 1325 E Calaveras Blvd',
    description: 'Assembling and installing four replacement benches and a repaired shade sail.',
    tasks: ['Assemble bench frames from the kit', 'Sand and seal the wood slats', 'Bolt benches to the existing concrete pads', 'Help re-tension and mount the shade sail'] },

  // --- Upcoming events (open for signup) ---
  { id: 'ev-12', spot_id: 'sp-10', org_id: 'org-kmb',      title: 'Higuera Adobe Park Cleanup',         event_date: '2026-08-29', start_time: '08:30', end_time: '12:30', hours: 4, max_volunteers: 40, location: 'Higuera Adobe Park, 1650 Wessex Pl',
    description: 'Clearing the litter that collects on the hillside behind the picnic area, plus a general park sweep.',
    tasks: ['Litter pickup on the hillside slope', 'Sweep the picnic and playground areas', 'Clear debris from the historic adobe walkway', 'Sort and weigh collected material'] },
  { id: 'ev-13', spot_id: 'sp-11', org_id: 'org-mural',    title: 'Town Center Graffiti Removal',       event_date: '2026-09-12', start_time: '09:00', end_time: '13:00', hours: 4, max_volunteers: 22, location: 'Milpitas Town Center, 1350 S Park Victoria Dr',
    description: 'Removing tags from the transit underpass walkway and prepping the utility boxes for art wraps.',
    tasks: ['Apply graffiti remover and scrub tagged surfaces', 'Colour-match and roll paint over stubborn tags', 'Sand and clean the utility boxes', 'Measure boxes for the artist wrap templates'] },
  { id: 'ev-14', spot_id: null,    org_id: 'org-green',    title: 'Ed Levin Trailhead Restoration',     event_date: '2026-09-26', start_time: '08:00', end_time: '13:00', hours: 5, max_volunteers: 35, location: 'Ed R. Levin County Park, 3100 Calaveras Rd',
    description: 'Repairing trail erosion and pulling invasive thistle and mustard from the lower meadow.',
    tasks: ['Pull invasive thistle and mustard by the root', 'Shovel and tamp fill into eroded trail sections', 'Rebuild water bars along the slope', 'Haul cleared material to the green waste trailer'] },
  { id: 'ev-15', spot_id: 'sp-12', org_id: 'org-kmb',      title: 'Sports Center Lot Glass Sweep',      event_date: '2026-10-10', start_time: '09:00', end_time: '12:00', hours: 3, max_volunteers: 20, location: 'Milpitas Sports Center, far lot entrance',
    description: 'Clearing broken glass along the fence line and doing a full sweep of the parking lot edges.',
    tasks: ['Sweep and collect glass along the fence line', 'Rake debris out from under the hedge', 'Bag and label sharps for safe disposal', 'Check and report damaged fence sections'] },
  { id: 'ev-16', spot_id: 'sp-1',  org_id: 'org-kmb',      title: 'Park & Abel Bin Overhaul',           event_date: '2026-09-05', start_time: '08:30', end_time: '12:30', hours: 4, max_volunteers: 30, location: 'Park Victoria Dr at Abel St, Milpitas',
    description: 'Replacing the overflowing bins at the intersection and doing a litter sweep of the surrounding blocks.',
    tasks: ['Empty and remove the old bins', 'Position and secure the new larger bins', 'Litter sweep the crosswalk and verges', 'Post the new collection schedule signage'] },
  { id: 'ev-17', spot_id: 'sp-3',  org_id: 'org-mural',    title: 'Calaveras Underpass Mural Paint Day', event_date: '2026-09-19', start_time: '08:00', end_time: '14:00', hours: 6, max_volunteers: 24, location: 'Calaveras Blvd underpass, east side',
    description: 'The paint day the June prep session was building toward. Volunteers block in the design while the artists detail it.',
    tasks: ['Block in colour fields from the paint map', 'Keep rollers and brushes loaded', 'Mix and label paint by colour code', 'Clean up and seal paint at the end of the day'] },
]

// Who signed up for what. Past-event rows also produce a volunteer hour log entry.
export const SIGNUPS = [
  // Maya - the heavy volunteer, chasing the Congressional Award
  ...['ev-01','ev-02','ev-03','ev-04','ev-05','ev-06','ev-07','ev-08','ev-09','ev-10','ev-13','ev-16']
      .map(e => ({ event_id: e, user_id: 'u-maya' })),
  // Jordan - newer, started in the summer
  ...['ev-07','ev-09','ev-10','ev-12','ev-17'].map(e => ({ event_id: e, user_id: 'u-jordan' })),
  // Sam
  ...['ev-02','ev-05','ev-06','ev-08','ev-09','ev-10','ev-12','ev-13','ev-14','ev-17'].map(e => ({ event_id: e, user_id: 'u-sam' })),
  // Background volunteers, so events show realistic headcounts
  ...['ev-02','ev-05','ev-09','ev-12','ev-16'].map(e => ({ event_id: e, user_id: 'u-priya' })),
  ...['ev-04','ev-07','ev-12','ev-14'].map(e => ({ event_id: e, user_id: 'u-diego' })),
  ...['ev-03','ev-08','ev-13','ev-15','ev-16','ev-17'].map(e => ({ event_id: e, user_id: 'u-anna' })),
]

// Hours the organization has (or has not yet) signed off on.
// Everything except the most recent event is already verified.
export const UNVERIFIED_EVENTS = ['ev-10']
