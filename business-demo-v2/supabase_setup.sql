-- ── Run this in your Supabase project → SQL Editor ────────────────────────────
-- Creates the demo_sites table for storing all generated demo URLs

create table if not exists demo_sites (
  id           uuid default gen_random_uuid() primary key,
  lead_id      text,                        -- links back to the local lead ID
  business_name text not null,
  phone        text default '',
  category     text default '',
  full_url     text not null,               -- the full hash-encoded URL
  short_url    text default '',             -- tinyurl or similar
  slug         text unique,                 -- your own internal slug (e.g. k3x9p)
  status       text default 'active'
               check (status in ('active', 'inactive', 'deleted')),
  created_at   timestamptz default now()
);

-- Index for fast status queries and bulk deletes
create index if not exists demo_sites_status_idx on demo_sites (status);
create index if not exists demo_sites_created_at_idx on demo_sites (created_at);

-- Enable Row Level Security (optional — remove if you want open access for now)
-- alter table demo_sites enable row level security;

-- Confirm
select 'demo_sites table created successfully' as result;
