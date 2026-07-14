-- SNJ Gestión — esquema de Supabase
-- Ejecutar una sola vez en: proyecto Supabase → SQL Editor → New query → pegar y Run.

create table if not exists gestion_state (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table gestion_state enable row level security;

drop policy if exists "leer_autenticados" on gestion_state;
create policy "leer_autenticados" on gestion_state
  for select using (auth.role() = 'authenticated');

drop policy if exists "insertar_autenticados" on gestion_state;
create policy "insertar_autenticados" on gestion_state
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "actualizar_autenticados" on gestion_state;
create policy "actualizar_autenticados" on gestion_state
  for update using (auth.role() = 'authenticated');

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists gestion_state_updated_at on gestion_state;
create trigger gestion_state_updated_at
before update on gestion_state
for each row execute function set_updated_at();

-- Habilita que los cambios se vean en vivo en las otras pantallas conectadas.
alter publication supabase_realtime add table gestion_state;
