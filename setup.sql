create table if not exists public.canteen_menu (
    id boolean primary key default true check (id = true),
    items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
    updated_at timestamptz not null default now(),
    updated_by uuid references auth.users(id)
);

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

alter table public.canteen_menu enable row level security;

create table if not exists public.student_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    register_no text not null unique,
    full_name text not null,
    gender text not null check (gender in ('Female', 'Male', 'Non-binary', 'Prefer not to say')),
    date_of_birth date not null,
    phone text not null unique,
    email text not null unique,
    department text not null,
    year smallint not null check (year between 1 and 4),
    avatar_path text,
    created_at timestamptz not null default now()
);

alter table public.student_profiles enable row level security;

drop policy if exists "Students can read their profile" on public.student_profiles;
create policy "Students can read their profile"
on public.student_profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Students can update their profile" on public.student_profiles;
create policy "Students can update their profile"
on public.student_profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

grant select on public.student_profiles to authenticated;
revoke update on public.student_profiles from authenticated;
grant update (full_name, department, avatar_path) on public.student_profiles to authenticated;

create or replace function public.create_student_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
begin
    if new.raw_user_meta_data ->> 'account_type' is distinct from 'student' then
        return new;
    end if;

    if new.email_confirmed_at is null then
        return new;
    end if;

    if nullif(trim(new.raw_user_meta_data ->> 'register_no'), '') is null
       or nullif(trim(new.raw_user_meta_data ->> 'full_name'), '') is null
       or nullif(trim(new.raw_user_meta_data ->> 'gender'), '') is null
       or nullif(trim(new.raw_user_meta_data ->> 'department'), '') is null
             or new.raw_user_meta_data ->> 'gender' not in ('Female', 'Male', 'Non-binary', 'Prefer not to say')
             or nullif(trim(new.raw_user_meta_data ->> 'phone'), '') is null
       or new.email is null
       or (new.raw_user_meta_data ->> 'date_of_birth')::date > current_date
       or (new.raw_user_meta_data ->> 'year')::smallint not between 1 and 4 then
        raise exception 'Student profile details are incomplete or invalid.' using errcode = '22023';
    end if;

    insert into public.student_profiles (
        id,
        register_no,
        full_name,
        gender,
        date_of_birth,
        phone,
        email,
        department,
        year
    ) values (
        new.id,
        upper(trim(new.raw_user_meta_data ->> 'register_no')),
        trim(new.raw_user_meta_data ->> 'full_name'),
        new.raw_user_meta_data ->> 'gender',
        (new.raw_user_meta_data ->> 'date_of_birth')::date,
        trim(new.raw_user_meta_data ->> 'phone'),
        lower(trim(new.email)),
        trim(new.raw_user_meta_data ->> 'department'),
        (new.raw_user_meta_data ->> 'year')::smallint
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

drop trigger if exists create_student_profile_after_signup on auth.users;
drop trigger if exists create_student_profile_after_contact_verification on auth.users;
drop trigger if exists create_student_profile_after_email_confirmation on auth.users;
create trigger create_student_profile_after_signup
after insert on auth.users
for each row execute function public.create_student_profile_for_auth_user();
create trigger create_student_profile_after_email_confirmation
after update of email_confirmed_at on auth.users
for each row execute function public.create_student_profile_for_auth_user();

revoke all on function public.create_student_profile_for_auth_user() from public, anon, authenticated;

insert into storage.buckets (id, name, public)
values ('student-avatars', 'student-avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Student avatars are readable by everyone" on storage.objects;
create policy "Student avatars are readable by everyone"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'student-avatars');

drop policy if exists "Students can upload their own avatar" on storage.objects;
create policy "Students can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'student-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Students can update their own avatar" on storage.objects;
create policy "Students can update their own avatar"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'student-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
    bucket_id = 'student-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
);

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
    student_user_id uuid references auth.users(id),
    tracking_key text not null default gen_random_uuid()::text,
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

alter table public.canteen_orders add column if not exists student_user_id uuid references auth.users(id);
alter table public.canteen_orders add column if not exists tracking_key text;
alter table public.canteen_orders alter column tracking_key drop default;
alter table public.canteen_orders alter column tracking_key type text using tracking_key::text;
update public.canteen_orders set tracking_key = gen_random_uuid()::text where tracking_key is null;
alter table public.canteen_orders alter column tracking_key set default gen_random_uuid()::text;
alter table public.canteen_orders alter column tracking_key set not null;

create table if not exists public.canteen_order_private (
    order_id uuid primary key references public.canteen_orders(id) on delete cascade,
    student_user_id uuid not null references auth.users(id) on delete cascade,
    pickup_pin_hash text not null,
    created_at timestamptz not null default now()
);

alter table public.canteen_order_private enable row level security;
revoke all on public.canteen_order_private from public, anon, authenticated;

do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'canteen_orders'
          and column_name = 'pickup_pin_hash'
    ) then
        execute $migration$
            insert into public.canteen_order_private (order_id, student_user_id, pickup_pin_hash)
            select id, student_user_id, pickup_pin_hash
            from public.canteen_orders
            where pickup_pin_hash is not null
              and student_user_id is not null
            on conflict (order_id) do nothing
        $migration$;
        alter table public.canteen_orders drop column pickup_pin_hash;
    end if;
end;
$$;

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

drop function if exists public.place_canteen_order(jsonb);

create function public.place_canteen_order(p_order_data jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, extensions, public, pg_temp
as $$
declare
    created_order_id uuid;
    created_pickup_pin text;
    random_pin_bytes bytea;
    student_snapshot jsonb;
begin
    select jsonb_build_object(
        'name', full_name,
        'registerId', register_no,
        'dept', department
    )
    into student_snapshot
        from public.student_profiles as profile
        join auth.users as auth_user on auth_user.id = profile.id
        where profile.id = auth.uid()
                    and auth_user.email_confirmed_at is not null;

    if auth.uid() is null or student_snapshot is null then
        raise exception 'A verified student account is required.' using errcode = '42501';
    end if;

    random_pin_bytes := gen_random_bytes(4);
    created_pickup_pin := lpad((
        (
            get_byte(random_pin_bytes, 0)::bigint * 16777216
            + get_byte(random_pin_bytes, 1)::bigint * 65536
            + get_byte(random_pin_bytes, 2)::bigint * 256
            + get_byte(random_pin_bytes, 3)::bigint
        ) % 1000000
    )::text, 6, '0');

    if jsonb_typeof(p_order_data -> 'student') is distinct from 'object'
       or jsonb_typeof(p_order_data -> 'items') is distinct from 'array'
       or jsonb_typeof(p_order_data -> 'total_amount') is distinct from 'number' then
        raise exception 'Order data is invalid.' using errcode = '22023';
    end if;

    if jsonb_array_length(p_order_data -> 'items') = 0
       or coalesce(p_order_data #>> '{student,name}', '') = ''
       or coalesce(p_order_data #>> '{student,registerId}', '') = ''
       or coalesce(p_order_data ->> 'token', '') = ''
         or coalesce(p_order_data ->> 'tracking_key', '') = ''
       or coalesce(p_order_data ->> 'pickup_slot', '') = ''
       or coalesce(p_order_data ->> 'payment_mode', '') = ''
       or coalesce(p_order_data ->> 'placed_label', '') = '' then
        raise exception 'Order data is incomplete.' using errcode = '22023';
    end if;

    insert into public.canteen_orders (
        student_user_id,
        token,
        tracking_key,
        student,
        items,
        total_amount,
        pickup_slot,
        payment_mode,
        placed_label
    ) values (
        auth.uid(),
        p_order_data ->> 'token',
        p_order_data ->> 'tracking_key',
        student_snapshot,
        p_order_data -> 'items',
        (p_order_data ->> 'total_amount')::numeric,
        p_order_data ->> 'pickup_slot',
        p_order_data ->> 'payment_mode',
        p_order_data ->> 'placed_label'
    )
    returning id into created_order_id;

    insert into public.canteen_order_private (order_id, student_user_id, pickup_pin_hash)
    values (
        created_order_id,
        auth.uid(),
        crypt(created_pickup_pin, gen_salt('bf'))
    );

    return jsonb_build_object('id', created_order_id, 'pickup_pin', created_pickup_pin);
end;
$$;

drop function if exists public.get_canteen_order_status(uuid, uuid);

create or replace function public.get_canteen_order_status(
    p_order_id uuid,
    p_tracking_key text
)
returns jsonb
language sql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
    select to_jsonb(order_row) - 'tracking_key'
    from public.canteen_orders as order_row
    where order_row.id = p_order_id
      and order_row.tracking_key = p_tracking_key
      and order_row.student_user_id = auth.uid()
      and exists (
          select 1
          from auth.users as auth_user
          where auth_user.id = auth.uid()
                        and auth_user.email_confirmed_at is not null
      );
$$;

create or replace function public.get_student_canteen_orders()
returns jsonb
language sql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
    select coalesce(
        jsonb_agg(
            (to_jsonb(order_row) - 'tracking_key')
                || jsonb_build_object(
                    'has_pickup_pin', exists (
                        select 1
                        from public.canteen_order_private as private_order
                        where private_order.order_id = order_row.id
                    )
                )
            order by order_row.created_at desc
        ),
        '[]'::jsonb
    )
    from public.canteen_orders as order_row
    where order_row.student_user_id = auth.uid()
      and exists (
          select 1
          from auth.users as auth_user
          where auth_user.id = auth.uid()
                        and auth_user.email_confirmed_at is not null
      );
$$;

create or replace function public.rotate_canteen_order_pickup_pin(p_order_id uuid)
returns text
language plpgsql
security definer
set search_path = pg_catalog, extensions, public, pg_temp
as $$
declare
    random_pin_bytes bytea;
    new_pickup_pin text;
begin
    if auth.uid() is null then
        raise exception 'Student sign-in is required.' using errcode = '42501';
    end if;

    perform 1
    from public.canteen_orders as order_row
    join auth.users as auth_user on auth_user.id = order_row.student_user_id
    where order_row.id = p_order_id
      and order_row.student_user_id = auth.uid()
      and order_row.status_index < 4
      and auth_user.email_confirmed_at is not null
    for update of order_row;

    if not found then
        raise exception 'Active student order was not found.' using errcode = '42501';
    end if;

    random_pin_bytes := gen_random_bytes(4);
    new_pickup_pin := lpad((
        (
            get_byte(random_pin_bytes, 0)::bigint * 16777216
            + get_byte(random_pin_bytes, 1)::bigint * 65536
            + get_byte(random_pin_bytes, 2)::bigint * 256
            + get_byte(random_pin_bytes, 3)::bigint
        ) % 1000000
    )::text, 6, '0');

    update public.canteen_orders
    set updated_at = now()
    where id = p_order_id;

    insert into public.canteen_order_private (order_id, student_user_id, pickup_pin_hash)
    values (p_order_id, auth.uid(), crypt(new_pickup_pin, gen_salt('bf')))
    on conflict (order_id) do update
    set pickup_pin_hash = excluded.pickup_pin_hash;

    return new_pickup_pin;
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

drop function if exists public.advance_canteen_order(uuid, smallint);
drop function if exists public.advance_canteen_order(uuid, smallint, text);

create function public.advance_canteen_order(
    p_order_id uuid,
    p_next_status smallint,
    p_pickup_pin text
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, extensions, public, pg_temp
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
      and status_index = p_next_status - 1
      and (
          p_next_status <> 4
          or not exists (
              select 1
              from public.canteen_order_private as private_order
              where private_order.order_id = p_order_id
          )
          or (
              p_pickup_pin is not null
              and exists (
                  select 1
                  from public.canteen_order_private as private_order
                  where private_order.order_id = p_order_id
                    and crypt(p_pickup_pin, private_order.pickup_pin_hash) = private_order.pickup_pin_hash
              )
          )
      );

    return found;
end;
$$;

revoke all on function public.place_canteen_order(jsonb) from public, anon;
grant execute on function public.place_canteen_order(jsonb) to authenticated;
revoke all on function public.get_canteen_order_status(uuid, text) from public, anon;
grant execute on function public.get_canteen_order_status(uuid, text) to authenticated;
revoke all on function public.get_student_canteen_orders() from public, anon;
grant execute on function public.get_student_canteen_orders() to authenticated;
revoke all on function public.rotate_canteen_order_pickup_pin(uuid) from public, anon;
grant execute on function public.rotate_canteen_order_pickup_pin(uuid) to authenticated;
revoke all on function public.claim_canteen_order(uuid) from public, anon;
grant execute on function public.claim_canteen_order(uuid) to authenticated;
revoke all on function public.advance_canteen_order(uuid, smallint, text) from public, anon;
grant execute on function public.advance_canteen_order(uuid, smallint, text) to authenticated;

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