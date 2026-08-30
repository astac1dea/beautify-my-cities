-- Beautify Our Cities - row-level security for profiles.
--
-- Signing up failed with:
--   new row violates row-level security policy for table "profiles"
--
-- The auth user is created fine, then the client tries to insert the matching
-- profiles row and RLS rejects it, because the table has RLS enabled and no
-- policy that lets anyone insert. This adds the four policies the app needs.
--
-- Paste into the Supabase SQL editor. Safe to run more than once.

alter table profiles enable row level security;

-- Names and avatars are shown next to pins and on the leaderboard, so a
-- profile is public reference data. Nothing sensitive lives on this table;
-- hours are in volunteer_hours, which stays private to its owner.
drop policy if exists "profiles are readable by everyone" on profiles;
create policy "profiles are readable by everyone"
  on profiles for select using (true);

-- You may create exactly one profile, for yourself, and only as a resident.
-- Signing yourself up as an admin is not a thing.
drop policy if exists "residents create their own profile" on profiles;
create policy "residents create their own profile"
  on profiles for insert
  with check (auth.uid() = id and role = 'resident');

-- You may edit your own row. The role column is guarded by the trigger below,
-- not by this policy - a policy cannot see the old value cleanly.
drop policy if exists "residents update their own profile" on profiles;
create policy "residents update their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------- role escalation ----

-- Without this, "update your own profile" means "make yourself an admin",
-- which would hand every user the photo approval controls and the delete
-- button. Any attempt to change your own role is silently reverted.
--
-- auth.uid() is null when the statement comes from the SQL editor or a
-- service-role key, and that is deliberate: promoting a real admin by hand is
-- exactly the trusted path this leaves open.
create or replace function profiles_guard_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    if not exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
    ) then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role_trigger on profiles;
create trigger profiles_guard_role_trigger
  before update on profiles
  for each row execute function profiles_guard_role();

-- ------------------------------------------------------------- admin you ----

-- Sign up on the site first, then run this with the email you used. Signup
-- lowercases the address, so match it in lowercase.
--
--   update profiles set role = 'admin' where email = 'you@example.com';
--   select email, display_name, role from profiles where role = 'admin';
