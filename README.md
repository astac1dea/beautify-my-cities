# Beautify Our Cities

A civic platform for your city. Residents pin spots that need work, neighbours
upvote them, local organizations schedule volunteer days, and volunteers walk
away with service hours they can get verified for the Congressional Award.

Four cities are set up so far - Milpitas, Fremont, San José and Sunnyvale, each
with its own map, its own reported spots and its own organizations. Pick yours
from the "Your city" selector in the header or the sidebar.

## Demo accounts

The login page has one-tap buttons for all three. Password for each is `demo1234`.

| Email | Who | Loaded with |
| --- | --- | --- |
| `maya@demo.city` | Maya Chen | 44 verified hours, 1 short of the Silver Certificate |
| `jordan@demo.city` | Jordan Rivera | Newer volunteer, a couple of events booked |
| `sam@demo.city` | Sam Okafor | Reported the most upvoted pins in the city |

Signing up creates a real (local) account too.

## What a resident can do

**Welcome page** → **Login** → the signed-in app:

- **Map** — every reported spot in the selected city, filterable by category.
  `Report a spot` drops a new pin anywhere on the map. Alongside the coordinates
  you write where it actually is in plain language — "sidewalk in front of 1200
  Main St". 
- **Pin details** — click any pin for the full picture: who reported it, its
  upvote count and city ranking, a status timeline (request sent → under review
  → event scheduled → resolved), the organization responsible with their contact
  email and phone, and the volunteer event for that spot including what you would
  actually be doing on the day. `Join this event` signs you up.
- **My Calendar** — a month grid plus a list of every event you joined, with
  time, date and location. 
- **My Dashboard** — verified service hours, Congressional Award progress against
  all six service levels, the hour log as a spreadsheet (downloadable as CSV)
  with the verifying organization's email on every row, your pins with their
  upvotes / city rank / status, and where you sit among residents.
- **Leaderboard** — every spot in the city ranked by upvotes then by volunteer
  count, so the #1 most popular spot is obvious, plus a resident ranking.
- **Profile** — your details, and a button to reset the demo data.

## Congressional Award

Service hours only count once the supervising organization confirms you were
there, so the hour log tracks `verified` and `pending` separately and only
verified hours advance the award progress. Every row carries the organization's
verification email, and the dashboard has per-organization buttons that open a
pre-filled email asking them to confirm your hours.

Service hour thresholds used: Bronze / Silver / Gold Certificate at 30 / 45 / 60
hours, and Bronze / Silver / Gold Medal at 100 / 200 / 400 hours.

## Cities

`src/lib/cities.js` defines each city: its map centre and zoom, and which
organization handles each category there. 

Switching city changes everything geographic — the map, the events list, the
leaderboards, the stats. It does not touch anything personal: your
service hours, your calendar and your own pins follow you across cities, because
hours you earned in one city still count.

## Data

Everything is in `localStorage` behind `src/lib/store.js`, seeded from
`src/lib/seed.js`. No backend is needed to run or demo the app.

The table and column names in the store deliberately mirror the Supabase schema
that already exists in this project (`cities`, `spots`, `events`, `profiles`,
`votes`), so swapping the store for real queries does not mean reshaping the
components. Those tables are currently empty, and several things this app needs
(`organizations`, `event_signups`, `volunteer_hours`, plus event time/location
columns) do not exist yet — see **`MIGRATION.sql`** for the SQL that adds them.

