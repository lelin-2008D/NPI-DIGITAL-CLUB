create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.site_settings (
  id text primary key default 'default' check (id = 'default'),
  site_title text not null,
  meta_desc text not null,
  meta_keywords text not null,
  copyright text not null,
  theme jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_sections (
  id text primary key default 'default' check (id = 'default'),
  title text not null,
  subtitle text not null,
  description text not null,
  explore_btn text not null,
  canvas_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_sections (
  id text primary key default 'default' check (id = 'default'),
  badge text not null,
  title text not null,
  mission text not null,
  vision text not null,
  purpose text not null,
  history text not null,
  image_url text not null,
  image_asset_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_stats (
  id text primary key,
  label text not null,
  number_text text not null,
  suffix text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_sections (
  id text primary key default 'default' check (id = 'default'),
  badge text not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_cards (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  title text not null,
  description text not null,
  category text not null,
  year text not null,
  image_url text not null,
  image_asset_id uuid null,
  link_url text not null default '#',
  featured boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id text primary key,
  date_label text not null,
  title text not null,
  description text not null,
  location text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id text primary key,
  name text not null,
  role text not null,
  bio text not null,
  image_url text not null,
  image_asset_id uuid null,
  github_url text not null default '#',
  linkedin_url text not null default '#',
  facebook_url text null,
  email text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id text primary key,
  image_url text not null,
  image_asset_id uuid null,
  caption text not null,
  category text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  role text not null,
  review text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_sections (
  id text primary key default 'default' check (id = 'default'),
  text text not null,
  author text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_details (
  id text primary key default 'default' check (id = 'default'),
  email text not null,
  phone text not null,
  address text not null,
  lat numeric null,
  lng numeric null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null unique,
  public_url text not null,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  alt_text text null,
  created_by uuid null references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'story_sections_image_asset_id_fkey') then
    alter table public.story_sections
      add constraint story_sections_image_asset_id_fkey
      foreign key (image_asset_id) references public.media_assets(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'projects_image_asset_id_fkey') then
    alter table public.projects
      add constraint projects_image_asset_id_fkey
      foreign key (image_asset_id) references public.media_assets(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'team_members_image_asset_id_fkey') then
    alter table public.team_members
      add constraint team_members_image_asset_id_fkey
      foreign key (image_asset_id) references public.media_assets(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'gallery_items_image_asset_id_fkey') then
    alter table public.gallery_items
      add constraint gallery_items_image_asset_id_fkey
      foreign key (image_asset_id) references public.media_assets(id) on delete set null;
  end if;
end;
$$;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id text not null references public.timeline_events(id) on delete cascade,
  name text not null,
  email text not null,
  roll text not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'admin_profiles',
    'site_settings',
    'hero_sections',
    'story_sections',
    'story_stats',
    'service_sections',
    'service_cards',
    'projects',
    'timeline_events',
    'team_members',
    'gallery_items',
    'testimonials',
    'quote_sections',
    'contact_details'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.hero_sections enable row level security;
alter table public.story_sections enable row level security;
alter table public.story_stats enable row level security;
alter table public.service_sections enable row level security;
alter table public.service_cards enable row level security;
alter table public.projects enable row level security;
alter table public.timeline_events enable row level security;
alter table public.team_members enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.quote_sections enable row level security;
alter table public.contact_details enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.event_rsvps enable row level security;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
create policy "Admins can read admin profiles"
on public.admin_profiles for select
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
create policy "Admins can manage admin profiles"
on public.admin_profiles for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "Public can read hero" on public.hero_sections;
create policy "Public can read hero"
on public.hero_sections for select
using (true);

drop policy if exists "Public can read story" on public.story_sections;
create policy "Public can read story"
on public.story_sections for select
using (true);

drop policy if exists "Public can read services header" on public.service_sections;
create policy "Public can read services header"
on public.service_sections for select
using (true);

drop policy if exists "Public can read quote" on public.quote_sections;
create policy "Public can read quote"
on public.quote_sections for select
using (true);

drop policy if exists "Public can read contact" on public.contact_details;
create policy "Public can read contact"
on public.contact_details for select
using (true);

drop policy if exists "Public can read active story stats" on public.story_stats;
create policy "Public can read active story stats"
on public.story_stats for select
using (active = true);

drop policy if exists "Public can read active service cards" on public.service_cards;
create policy "Public can read active service cards"
on public.service_cards for select
using (active = true);

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
using (published = true);

drop policy if exists "Public can read published timeline events" on public.timeline_events;
create policy "Public can read published timeline events"
on public.timeline_events for select
using (published = true);

drop policy if exists "Public can read published team members" on public.team_members;
create policy "Public can read published team members"
on public.team_members for select
using (published = true);

drop policy if exists "Public can read published gallery items" on public.gallery_items;
create policy "Public can read published gallery items"
on public.gallery_items for select
using (published = true);

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials"
on public.testimonials for select
using (published = true);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_settings',
    'hero_sections',
    'story_sections',
    'story_stats',
    'service_sections',
    'service_cards',
    'projects',
    'timeline_events',
    'team_members',
    'gallery_items',
    'testimonials',
    'quote_sections',
    'contact_details',
    'media_assets',
    'contact_submissions',
    'event_rsvps'
  ]
  loop
    execute format('drop policy if exists "Admins can manage %I" on public.%I', table_name, table_name);
    execute format(
      'create policy "Admins can manage %I" on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      table_name,
      table_name
    );
  end loop;
end;
$$;

drop policy if exists "Anyone can create contact submissions" on public.contact_submissions;
create policy "Anyone can create contact submissions"
on public.contact_submissions for insert
with check (true);

drop policy if exists "Anyone can create event RSVPs" on public.event_rsvps;
create policy "Anyone can create event RSVPs"
on public.event_rsvps for insert
with check (
  exists (
    select 1
    from public.timeline_events
    where id = event_id
      and published = true
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site media" on storage.objects;
create policy "Public can read site media"
on storage.objects for select
using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
on storage.objects for insert
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
on storage.objects for update
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
on storage.objects for delete
using (bucket_id = 'site-media' and public.is_admin());
