create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  brand text not null,
  price numeric not null check (price >= 0),
  tags text[],
  popularity integer not null default 0,
  image_url text
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'interaction_type') then
    create type interaction_type as enum ('view','cart','purchase','like');
  end if;
exception
  when duplicate_object then null;
end $$;

create table if not exists interactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  type interaction_type not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_interactions_user on interactions(user_id);
create index if not exists idx_interactions_product on interactions(product_id);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_brand on products(brand);
