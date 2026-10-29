-- SNJ — Consultas que llegan desde la web pública (formulario de contacto).
-- Correr UNA sola vez en: Supabase → SQL Editor → New query → pegar todo → Run.
-- Es seguro correrlo de nuevo: no pisa nada.

-- 1) Tabla de consultas ------------------------------------------------------
create table if not exists consultas (
  id uuid primary key default gen_random_uuid(),
  creada timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  email text not null default '' check (char_length(email) <= 200),
  telefono text not null default '' check (char_length(telefono) <= 60),
  servicio text not null default '' check (char_length(servicio) <= 60),
  descripcion text not null default '' check (char_length(descripcion) <= 2000),
  medidas text not null default '' check (char_length(medidas) <= 200),
  material text not null default '' check (char_length(material) <= 60),
  cantidad text not null default '' check (char_length(cantidad) <= 40),
  archivo_path text not null default '' check (char_length(archivo_path) <= 300),
  archivo_nombre text not null default '' check (char_length(archivo_nombre) <= 200),
  estado text not null default 'nueva' check (estado in ('nueva', 'respondida', 'convertida', 'descartada')),
  nota text not null default '' check (char_length(nota) <= 2000)
);

alter table consultas enable row level security;

-- La web (visitantes sin sesión) SOLO puede crear consultas nuevas. No puede leer ni tocar nada.
drop policy if exists "web_crea_consultas" on consultas;
create policy "web_crea_consultas" on consultas
  for insert to anon, authenticated
  with check (estado = 'nueva');

-- Los socios con sesión pueden verlas, actualizarlas y borrarlas.
drop policy if exists "gestion_lee_consultas" on consultas;
create policy "gestion_lee_consultas" on consultas
  for select to authenticated using (true);

drop policy if exists "gestion_actualiza_consultas" on consultas;
create policy "gestion_actualiza_consultas" on consultas
  for update to authenticated using (true) with check (true);

drop policy if exists "gestion_borra_consultas" on consultas;
create policy "gestion_borra_consultas" on consultas
  for delete to authenticated using (true);

-- 2) Carpeta privada para los archivos STL / 3MF --------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('consultas', 'consultas', false, 26214400) -- 25 MB por archivo
on conflict (id) do update set public = false, file_size_limit = 26214400;

-- La web solo puede SUBIR archivos .stl o .3mf a esa carpeta.
drop policy if exists "web_sube_archivos" on storage.objects;
create policy "web_sube_archivos" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'consultas'
    and (lower(name) like '%.stl' or lower(name) like '%.3mf')
  );

-- Solo los socios con sesión pueden verlos, bajarlos y borrarlos.
drop policy if exists "gestion_ve_archivos" on storage.objects;
create policy "gestion_ve_archivos" on storage.objects
  for select to authenticated using (bucket_id = 'consultas');

drop policy if exists "gestion_borra_archivos" on storage.objects;
create policy "gestion_borra_archivos" on storage.objects
  for delete to authenticated using (bucket_id = 'consultas');
