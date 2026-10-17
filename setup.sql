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

create table if not exists public.canteen_orders (
    id uuid primary key default gen_random_uuid(),
    token text not null,
    student jsonb not null check (jsonb_typeof(student) = 'object'),
    items jsonb not null check (jsonb_typeof(items) = 'array'),
    total_amount numeric(10, 2) not null check (total_amount >= 0),
    pickup_slot text not null,
    payment_mode text not null,
    placed_label text not null,
    status_index smallint not null default 0 check (status_index between 0 and 4),
    claimed_by uuid references auth.users(id),
    claimed_by_name text,
    claimed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists canteen_orders_active_created_idx
    on public.canteen_orders (status_index, created_at desc);

alter table public.canteen_orders enable row level security;

drop policy if exists "Admins can view canteen orders" on public.canteen_orders;
create policy "Admins can view canteen orders"
on public.canteen_orders
for select
to authenticated
using (
    (auth.jwt() ->> 'email') in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    )
);

drop policy if exists "Admins can update canteen orders" on public.canteen_orders;
create policy "Admins can update canteen orders"
on public.canteen_orders
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

revoke all on public.canteen_orders from anon, authenticated;
grant select on public.canteen_orders to authenticated;

create or replace function public.place_canteen_order(p_order_data jsonb)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
    created_order_id uuid;
begin
    if jsonb_typeof(p_order_data -> 'student') is distinct from 'object'
       or jsonb_typeof(p_order_data -> 'items') is distinct from 'array'
       or jsonb_typeof(p_order_data -> 'total_amount') is distinct from 'number' then
        raise exception 'Order data is invalid.' using errcode = '22023';
    end if;

    if jsonb_array_length(p_order_data -> 'items') = 0
       or coalesce(p_order_data #>> '{student,name}', '') = ''
       or coalesce(p_order_data #>> '{student,registerId}', '') = ''
       or coalesce(p_order_data ->> 'token', '') = ''
       or coalesce(p_order_data ->> 'pickup_slot', '') = ''
       or coalesce(p_order_data ->> 'payment_mode', '') = ''
       or coalesce(p_order_data ->> 'placed_label', '') = '' then
        raise exception 'Order data is incomplete.' using errcode = '22023';
    end if;

    insert into public.canteen_orders (
        token,
        student,
        items,
        total_amount,
        pickup_slot,
        payment_mode,
        placed_label
    ) values (
        p_order_data ->> 'token',
        p_order_data -> 'student',
        p_order_data -> 'items',
        (p_order_data ->> 'total_amount')::numeric,
        p_order_data ->> 'pickup_slot',
        p_order_data ->> 'payment_mode',
        p_order_data ->> 'placed_label'
    )
    returning id into created_order_id;

    return created_order_id;
end;
$$;

create or replace function public.claim_canteen_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
begin
    if coalesce(auth.jwt() ->> 'email', '') not in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    ) then
        raise exception 'Admin access is required.' using errcode = '42501';
    end if;

    update public.canteen_orders
    set claimed_by = auth.uid(),
        claimed_by_name = split_part(auth.jwt() ->> 'email', '@', 1),
        claimed_at = now(),
        status_index = 1,
        updated_at = now()
    where id = p_order_id
      and status_index = 0
      and claimed_by is null;

    return found;
end;
$$;

create or replace function public.advance_canteen_order(
    p_order_id uuid,
    p_next_status smallint
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
begin
    if coalesce(auth.jwt() ->> 'email', '') not in (
        'admin1@campuscravings.invalid',
        'admin2@campuscravings.invalid',
        'admin3@campuscravings.invalid'
    ) then
        raise exception 'Admin access is required.' using errcode = '42501';
    end if;

    if p_next_status not between 2 and 4 then
        raise exception 'Order status transition is invalid.' using errcode = '22023';
    end if;

    update public.canteen_orders
    set status_index = p_next_status,
        updated_at = now()
    where id = p_order_id
      and claimed_by = auth.uid()
      and status_index = p_next_status - 1;

    return found;
end;
$$;

revoke all on function public.place_canteen_order(jsonb) from public;
grant execute on function public.place_canteen_order(jsonb) to anon, authenticated;
revoke all on function public.claim_canteen_order(uuid) from public, anon;
grant execute on function public.claim_canteen_order(uuid) to authenticated;
revoke all on function public.advance_canteen_order(uuid, smallint) from public, anon;
grant execute on function public.advance_canteen_order(uuid, smallint) to authenticated;

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'canteen_orders'
    ) then
        alter publication supabase_realtime add table public.canteen_orders;
    end if;
end;
$$;