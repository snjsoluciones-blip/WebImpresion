-- SNJ Gestión — RE-CERRAR la base para que SOLO lea/escriba quien tiene sesión.
-- Correr una vez en: Supabase → SQL Editor → New query → pegar y Run.
-- Esto revierte el "acceso público" y deja el acceso solo para usuarios logueados.

alter table gestion_state enable row level security;

-- Borra TODAS las políticas actuales de la tabla (incluida cualquier "pública").
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'gestion_state'
  loop
    execute format('drop policy if exists %I on gestion_state', pol.policyname);
  end loop;
end $$;

-- Solo usuarios autenticados (logueados) pueden leer y escribir.
create policy "leer_autenticados" on gestion_state
  for select using (auth.role() = 'authenticated');

create policy "insertar_autenticados" on gestion_state
  for insert with check (auth.role() = 'authenticated');

create policy "actualizar_autenticados" on gestion_state
  for update using (auth.role() = 'authenticated');

-- (No creamos policy de DELETE: nadie puede borrar la fila principal desde el cliente.)
