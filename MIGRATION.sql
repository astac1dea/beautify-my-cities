-- Beautify My City - schema needed to move off the local demo store.
--
-- The app currently reads and writes through src/lib/store.js, which keeps
-- everything in localStorage. The Supabase project already has these tables:
--
--   cities    (id, name, state, lat, lng, created_at)
--   spots     (id, city_id, user_id, type, title, description, lat, lng,
--              status, upvotes, created_at, photo_url)
--   events    (id, spot_id, city_id, title, description, event_date,
--              max_volunteers, created_at)
--   profiles  (id, city_id, role, display_name, created_at)
--   votes     (id, spot_id, user_id, created_at)
--
-- What is missing is everything the volunteer-hours and organization features
-- need. Paste this into the Supabase SQL editor (Dashboard -> SQL Editor) to
-- add it. Nothing here drops or rewrites existing tables.

-- ---------------------------------------------------------------- orgs ----

create table if not exists organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,          -- the address that verifies hours
  phone         text,
  focus         text,                   -- short "what they handle" line
  blurb         text,
  contact_name  text,                   -- named supervising adult
  color         text default '#1B4FD8',
  city_id       uuid references cities(id) on delete cascade,
  created_at    timestamptz default now()
);

-- Which organization is responsible for each kind of pin.
create table if not exists org_categories (
  org_id  uuid references organizations(id) on delete cascade,
  type    text not null,                -- trash | graffiti | mural | seating | bike
  primary key (org_id, type)
);

-- ------------------------------------------------- extend spots/events ----

alter table spots  add column if not exists org_id uuid references organizations(id);

alter table events add column if not exists org_id         uuid references organizations(id);
alter table events add column if not exists start_time     time;
alter table events add column if not exists end_time       time;
alter table events add column if not exists location       text;
alter table events add column if not exists hours          numeric(4,1) default 0;
alter table events add column if not exists tasks          text[] default '{}';

-- ------------------------------------------------------------- signups ----

create table if not exists event_signups (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references events(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  unique (event_id, user_id)
);

-- --------------------------------------------------------------- hours ----

create table if not exists volunteer_hours (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  event_id      uuid references events(id) on delete cascade,
  org_id        uuid references organizations(id),
  date          date not null,
  hours         numeric(4,1) not null default 0,
  status        text not null default 'pending',   -- pending | verified
  verified_at   timestamptz,
  verified_by   text,                              -- who at the org signed off
  created_at    timestamptz default now(),
  unique (user_id, event_id),
  constraint volunteer_hours_status_check check (status in ('pending', 'verified'))
);

-- Only counts toward the Congressional Award once status = 'verified'.
create index if not exists volunteer_hours_user_idx on volunteer_hours (user_id, status);

-- ----------------------------------------------------- profile columns ----

alter table profiles add column if not exists email  text;
alter table profiles add column if not exists school text;
alter table profiles add column if not exists grade  text;
alter table profiles add column if not exists bio    text;
alter table profiles add column if not exists avatar_color text default '#3B6BF5';

-- ----------------------------------------------------------------- RLS ----

alter table organizations   enable row level security;
alter table org_categories  enable row level security;
alter table event_signups   enable row level security;
alter table volunteer_hours enable row level security;

-- Organizations and their categories are public reference data.
create policy "organizations are readable by everyone"
  on organizations for select using (true);
create policy "org categories are readable by everyone"
  on org_categories for select using (true);

-- You can see who else signed up, but only add or remove your own signup.
create policy "signups are readable by everyone"
  on event_signups for select using (true);
create policy "residents manage their own signups"
  on event_signups for insert with check (auth.uid() = user_id);
create policy "residents delete their own signups"
  on event_signups for delete using (auth.uid() = user_id);

-- Hours are private to the volunteer. Verification is deliberately NOT
-- something the volunteer can do to their own row - flipping status to
-- 'verified' has to happen from a trusted context (an org login or a
-- service-role function), otherwise the Congressional Award record is
-- worth nothing.
create policy "residents read their own hours"
  on volunteer_hours for select using (auth.uid() = user_id);
