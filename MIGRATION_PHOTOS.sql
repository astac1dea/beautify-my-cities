-- Beautify Our Cities - photos on pin reports, and pins linked to events.
--
-- Paste this into the Supabase SQL editor (Dashboard -> SQL Editor). It is
-- safe to run more than once. Nothing here drops or rewrites existing data.

-- ------------------------------------------------------- photo approval ----

-- spots.photo_url already exists. What it was missing is a review state: a
-- resident's photo is not shown to anyone until an admin has looked at it.
alter table spots add column if not exists photo_status text default 'pending';

alter table spots drop constraint if exists spots_photo_status_check;
alter table spots add  constraint spots_photo_status_check
  check (photo_status in ('pending', 'approved', 'rejected'));

-- Who approved it and when, so a rejection is not a mystery later.
alter table spots add column if not exists photo_reviewed_at timestamptz;
alter table spots add column if not exists photo_reviewed_by uuid references auth.users(id);

-- Rows that predate this column and carry no photo should not sit in the
-- moderation queue forever.
update spots set photo_status = 'approved'
  where photo_url is null and photo_status = 'pending';

create index if not exists spots_photo_review_idx
  on spots (photo_status) where photo_url is not null;

-- ------------------------------------------------------- storage bucket ----

-- Public read, because an approved photo is shown on the pin and on the
-- volunteer event built from it. The approval gate lives in the spots row,
-- not in the bucket: an unapproved file is uploaded but never linked to in
-- the UI. Keep the bucket name in sync with SPOT_PHOTO_BUCKET in
-- src/lib/supabase-store.js.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'spot-photos', 'spot-photos', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "spot photos are readable by everyone" on storage.objects;
create policy "spot photos are readable by everyone"
  on storage.objects for select
  using (bucket_id = 'spot-photos');

-- Anyone reporting a spot can upload one, signed in or not. The 10MB and
-- mime-type limits above are what keep this honest.
drop policy if exists "anyone can upload a spot photo" on storage.objects;
create policy "anyone can upload a spot photo"
  on storage.objects for insert
  with check (bucket_id = 'spot-photos');

-- Replacing or removing a file is an admin job.
drop policy if exists "admins manage spot photos" on storage.objects;
create policy "admins manage spot photos"
  on storage.objects for delete
  using (
    bucket_id = 'spot-photos'
    and exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ------------------------------------------------------ events <-> pins ----

-- events.spot_id already exists in the schema but nothing was writing it, so
-- every pin reported "no event scheduled here yet". Make the link explicit.
alter table events add column if not exists spot_id uuid references spots(id) on delete set null;

create index if not exists events_spot_idx on events (spot_id);
