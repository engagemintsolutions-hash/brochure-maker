-- Brochure Maker: Supabase schema
-- Run this in the Supabase SQL Editor to set up the database

create table if not exists brochures (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for listing brochures sorted by updated_at
create index if not exists idx_brochures_updated_at on brochures (updated_at desc);

-- Row Level Security (enable when auth is added)
-- alter table brochures enable row level security;
-- create policy "Users can manage their own brochures" on brochures
--   using (auth.uid() = (data->>'userId')::uuid);
