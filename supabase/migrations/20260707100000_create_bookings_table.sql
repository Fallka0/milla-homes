create extension if not exists btree_gist;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  type text not null check (type in ('rent', 'tour')),
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'declined', 'cancelled')
  ),
  client_name text not null,
  client_email text,
  client_phone text,
  start_date date not null,
  end_date date not null,
  tour_time text,
  notes text not null default '',
  source text not null default 'admin' check (source in ('admin', 'client')),
  locale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_date_order check (end_date >= start_date)
);

-- Rent ranges are check-in inclusive / check-out exclusive so same-day
-- turnover between two bookings is allowed.
alter table public.bookings
  add constraint bookings_no_confirmed_rent_overlap exclude using gist (
    property_id with =,
    daterange(start_date, end_date, '[)') with &&
  ) where (type = 'rent' and status = 'confirmed');

create index if not exists bookings_property_id_idx on public.bookings (property_id);
create index if not exists bookings_start_date_idx on public.bookings (start_date);
create index if not exists bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;
