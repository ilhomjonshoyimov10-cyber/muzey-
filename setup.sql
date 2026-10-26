-- Supabase > SQL Editor ga to'liq nusxalab, "Run" bosing.
create table museums (
  id text primary key,
  owner bigint not null,
  title text not null,
  items jsonb not null default '[]',
  created_at timestamptz default now()
);
alter table museums enable row level security;  -- siyosat yo'q = faqat server o'qiy oladi

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('muzey', 'muzey', true, 26214400,
        array['image/jpeg','image/png','image/webp','video/mp4','video/webm']);
