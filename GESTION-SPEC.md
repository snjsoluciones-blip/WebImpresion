# SNJ Gestión — Especificación

App interna de gestión para los socios de SNJ Soluciones, embebida dentro de la web
existente (Next.js 16 / App Router / Tailwind 4, deploy en Vercel).

Origen de los datos: dos Google Sheets de los socios (seguimiento de proyectos con una
pestaña por proyecto + reparto entre socios, y un generador de presupuestos).

## Acceso

- Ruta `/gestion` dentro del sitio SNJ. **No se lista en el menú público** — se entra
  sabiendo la URL (`snjsoluciones.com.ar/gestion`).
- Login con email + contraseña (Supabase Auth). 3 cuentas: Titi, Nico, Juan.
- Todas las rutas `/gestion/*` protegidas por middleware: sin sesión → redirige al login.

## Roles y permisos

- Los 3 socios pueden **cargar y editar** todo (proyectos, gastos, ingresos, filamento,
  tareas, presupuestos).
- (Opcional a futuro: reservar "borrar proyecto" y "gestionar usuarios" al admin/Titi.)

## Secciones

### 1. Tablero
- Métricas: ganancia total, plata por cobrar, proyectos activos.
- Lista de proyectos: N°, nombre, cliente, estado, ganancia.
- Filtro por estado.

### 2. Proyecto (detalle)
- Datos: nombre, cliente, fecha de entrega, entregado (sí/no), fecha de pago, pagado (sí/no).
- **Gastos**: producto, precio, cantidad, quién lo pagó (Titi / Nico / Juan). Suma automática.
- **Ingresos**: producto, precio, cantidad. Suma automática.
- **Filamento**: pieza, color/colores, peso (registro).
- **Tareas** del proyecto: descripción, asignado a, hecha (sí/no).
- **Reparto automático** (ver fórmulas).

### 3. Cuentas entre socios (global)
- Sumando todos los proyectos: cuánto puso cada socio y cuánto le toca cobrar.
- Quién le debe a quién.

### 4. Presupuestos
- Cliente + ítems (pieza, cantidad, precio) → total automático.
- Exportar PDF y compartir por WhatsApp (link wa.me con el texto armado).
- Historial de presupuestos.

### 5. Tareas ("lo que hay que hacer")
- Vista global: cada socio ve sus tareas pendientes de todos los proyectos.

## Cálculos automáticos

```
gastos_totales   = Σ (precio × cantidad) de gastos
ingresos_totales = Σ (precio × cantidad) de ingresos
ganancia         = ingresos_totales − gastos_totales

Por socio i (Titi, Nico, Juan):
  gasto_i = Σ (precio × cantidad) de los gastos que pagó i
  cobra_i = gasto_i + ganancia / 3        # la ganancia se reparte SIEMPRE en 3 iguales

Estado del proyecto:
  En proceso  → no entregado
  Entregado   → entregado y no pagado
  Cobrado     → pagado

Globales:
  ganancia_total = Σ ganancia de todos los proyectos
  por_cobrar     = Σ ganancia individual pendiente (proyectos no cobrados)
```

Verificado contra la planilla real (Trofeos Nankang): ganancia $176.395 ÷ 3 = $58.798;
Nico puso $46.000 → cobra $104.798. ✔

## Modelo de datos (Supabase)

- `profiles` (id → auth.users, nombre, rol)
- `proyectos` (id, numero, nombre, cliente, entregado, fecha_entrega, pagado, fecha_pago,
  created_by, created_at)
- `gastos` (id, proyecto_id, producto, precio, cantidad, pagado_por)
- `ingresos` (id, proyecto_id, producto, precio, cantidad)
- `filamentos` (id, proyecto_id, pieza, color, peso)
- `tareas` (id, proyecto_id, descripcion, asignado_a, hecha)
- `presupuestos` (id, cliente, fecha, created_by, created_at)
- `presupuesto_items` (id, presupuesto_id, pieza, cantidad, precio)

Socios fijos (3): Titi, Nico, Juan → el reparto divide la ganancia en 3.

## Stack técnico

- Next.js 16 App Router — grupo de rutas `app/gestion`.
- `@supabase/supabase-js` + `@supabase/ssr` para auth y datos.
- Tailwind 4 (ya en el proyecto).
- PDF de presupuestos: impresión del navegador o `jsPDF`. WhatsApp: link `wa.me`.
- Deploy: Vercel (mismo proyecto). Variables: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Plan de construcción (etapas)

1. **Armado local** ✅ hecho y verificado en el navegador (login, tablero, reparto,
   cuentas, presupuestos, tareas — todos los números coinciden con el Excel original).
2. **Nube + cuentas** — código listo (ver abajo), falta que el usuario cree la cuenta
   Supabase y los 3 logins (paso manual, ver guía).
3. **Migrar Excel + publicar** — falta conectar y hacer deploy en Vercel.

## Cómo quedó armado el modo dual (local / Supabase)

La app funciona **hoy mismo, sin ninguna cuenta**, guardando todo en el navegador
(`localStorage`). El código ya tiene un segundo "motor" listo para Supabase que se
activa solo, sin tocar una línea, apenas existan las variables de entorno
`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ver `.env.local.example`).

- `app/gestion/lib/store.tsx` / `auth.tsx` — contexto compartido (tipos, no implementación).
- `app/gestion/lib/store-local.tsx` / `auth-local.tsx` — motor actual (localStorage,
  contraseña compartida `snj2026`, solo para probar).
- `app/gestion/lib/store-supabase.tsx` / `auth-supabase.tsx` — motor real: guarda todo
  en una tabla `gestion_state` (una fila con los datos en JSON) con Supabase Realtime,
  para que los 3 vean los cambios de los demás al instante. Login con email + contraseña
  propia de cada uno vía Supabase Auth.
- `app/gestion/components/GestionShell.tsx` — decide automáticamente qué motor usar.
- `supabase/schema.sql` — crear la tabla, las políticas de seguridad (RLS) y habilitar
  Realtime. Se pega una sola vez en el SQL Editor de Supabase.

### Guía para conectar Supabase (esto lo tiene que hacer el usuario)

Por seguridad, crear cuentas y escribir contraseñas es algo que el asistente no hace
nunca, ni siquiera con autorización explícita — son pasos que tiene que hacer la
persona dueña de la cuenta. Son ~10 minutos:

1. Entrar a **supabase.com** → crear cuenta gratis (con el Google de SNJ o el que
   prefieran) → "New project". Elegir una contraseña de base de datos y guardarla.
2. Adentro del proyecto: **SQL Editor** → **New query** → pegar todo el contenido de
   `supabase/schema.sql` → **Run**.
3. **Authentication → Users → Add user** → crear 3 usuarios (Titi, Nico, Juan), cada
   uno con su email y una contraseña que ellos elijan. A cada uno, en
   **User metadata**, agregar: `{"socio": "Titi"}` (o "Nico"/"Juan" según corresponda) —
   así la app sabe quién entró.
4. **Project Settings → API** → copiar **Project URL** y **anon public key**.
5. Pasarme esas dos claves (son públicas y seguras para el navegador, no son secretas)
   para escribirlas en `.env.local`, o cargarlas directamente como variables de entorno
   del proyecto en Vercel (Settings → Environment Variables) para que el sitio en vivo
   también las tenga.

Ni bien estén esas dos claves, la app pasa sola del modo local al modo compartido —
no hace falta tocar código.

### Deploy a Vercel

El repo `WebImpresion` ya corre en Vercel. Publicar los cambios de `/gestion` es un
`git push` normal al branch conectado — Vercel lo despliega solo. Como esto afecta el
sitio en vivo de SNJ, se hace con confirmación explícita del usuario antes de cada push
a producción, no automáticamente.

## Fuentes originales (Google Sheets)

- Seguimiento + reparto: `1bRE8kR56h1TL38ibVFm3d6ewB_knHzLxq0YqC9kZxV0`
  (pestañas: Control General, Presupuestos, Plantilla v1–v4, y una por proyecto).
- Presupuestos: `1VRNbKkJZQtrbmbEYwAOEXm6MSrkLJDGM3Hj8p5-ZqXw`.
