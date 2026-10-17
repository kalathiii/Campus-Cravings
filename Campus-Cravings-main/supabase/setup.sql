create table if not exists public.canteen_menu (
    id boolean primary key default true check (id = true),
    items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
    updated_at timestamptz not null default now(),
    updated_by uuid references auth.users(id)
);

alter table public.canteen_menu enable row level security;

drop policy if exists "Menu is readable by everyone" on public.canteen_menu;
create policy "Menu is readable by everyone"
on public.canteen_menu
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert menu" on public.canteen_menu;
create policy "Admins can insert menu"
on public.canteen_menu
for insert
to authenticated
with check (
    (auth.jwt() ->> 'email') in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    )
);

drop policy if exists "Admins can update menu" on public.canteen_menu;
create policy "Admins can update menu"
on public.canteen_menu
for update
to authenticated
using (
    (auth.jwt() ->> 'email') in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    )
)
with check (
    (auth.jwt() ->> 'email') in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    )
);

grant select on public.canteen_menu to anon, authenticated;
grant insert, update on public.canteen_menu to authenticated;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Menu images are readable by everyone" on storage.objects;
create policy "Menu images are readable by everyone"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'menu-images');

drop policy if exists "Admins can upload menu images" on storage.objects;
create policy "Admins can upload menu images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'menu-images'
    and (auth.jwt() ->> 'email') in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    )
);

drop policy if exists "Admins can update menu images" on storage.objects;
create policy "Admins can update menu images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'menu-images'
    and (auth.jwt() ->> 'email') in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    )
)
with check (
    bucket_id = 'menu-images'
    and (auth.jwt() ->> 'email') in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    )
);

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'canteen_menu'
    ) then
        alter publication supabase_realtime add table public.canteen_menu;
    end if;
end;
$$;