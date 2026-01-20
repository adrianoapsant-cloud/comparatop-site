-- Energy Profiles Table
-- Stores SKU-specific energy consumption data (kWh/month)
-- Independent from product catalog - can add data without registering products

create table if not exists public.energy_profiles (
  sku text primary key,
  category_slug text null,
  kwh_month numeric not null,
  source text not null default 'manual',
  notes text null,
  updated_at timestamptz not null default now()
);

-- Index for category-based queries
create index if not exists energy_profiles_category_slug_idx
  on public.energy_profiles (category_slug);

-- Comment for documentation
comment on table public.energy_profiles is 'SKU-specific energy consumption profiles for Real vs Estimated calculations';
comment on column public.energy_profiles.source is 'Data source: manual, inmetro, fabricante, medicao, estimado';
