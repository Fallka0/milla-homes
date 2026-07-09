alter table public.inquiries
  add column if not exists status text not null default 'new'
  check (status in ('new', 'contacted', 'closed'));

create index if not exists inquiries_status_idx on public.inquiries (status);
