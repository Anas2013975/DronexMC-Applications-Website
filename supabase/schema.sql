create extension if not exists pgcrypto;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  ref_code text unique not null,
  discord_id text not null,
  discord_username text not null,
  discord_avatar text,
  minecraft_username text not null,
  category text not null check (category in ('administration','media','development')),
  form_language text not null default 'en' check (form_language in ('en','ar')),
  status text not null default 'Under Review' check (status in ('Under Review','Accepted','Rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (discord_id, category)
);

create table if not exists public.application_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  question_key text not null,
  question_label text not null,
  answer text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  author text not null,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.webhook_settings (
  category text primary key check (category in ('administration','media','development')),
  encrypted_url text,
  notify_status boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.applications enable row level security;
alter table public.application_answers enable row level security;
alter table public.admin_notes enable row level security;
alter table public.webhook_settings enable row level security;

-- All database access is server-side using the service-role key. Do not expose that key to the browser.
