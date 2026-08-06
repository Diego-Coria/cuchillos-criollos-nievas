-- Schema inicial para Cuchillos Criollos Nievas
-- Ejecutar en el SQL Editor de Supabase

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric null check (price is null or price >= 0),
  blade_length_cm numeric null,
  category text not null check (
    category in (
      'cuchillos-cintura',
      'verijeros',
      'facones',
      'accesorios',
      'personalizacion',
      'otros-trabajos'
    )
  ),
  line text null check (line in ('clasica', 'airon-solingen') or line is null),
  image_url text null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can manage products"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

insert into public.products (
  id, name, description, price, blade_length_cm, category, line, sort_order
) values
  ('chaja-26', 'El Chajá — 26 cm', 'Línea Clásica. Ideal para uso diario, asado y campo.', 299000, 26, 'cuchillos-cintura', 'clasica', 1),
  ('chaja-30', 'El Chajá — 30 cm', 'Línea Clásica. Ideal para uso diario, asado y campo.', 319000, 30, 'cuchillos-cintura', 'clasica', 2),
  ('airon-26', 'Airon Solingen — 26 cm', 'Línea Acero Airon Solingen. Más calidad y durabilidad.', 379000, 26, 'cuchillos-cintura', 'airon-solingen', 3),
  ('airon-30', 'Airon Solingen — 30 cm', 'Línea Acero Airon Solingen. Más calidad y durabilidad.', 399000, 30, 'cuchillos-cintura', 'airon-solingen', 4),
  ('verijero-15', 'Verijero Airon Solingen — 15 cm', 'Precisión y manejo. De lujo, ágil y funcional.', 219000, 15, 'verijeros', 'airon-solingen', 5),
  ('verijero-18', 'Verijero Airon Solingen — 18 cm', 'Precisión y manejo. De lujo, ágil y funcional.', 279000, 18, 'verijeros', 'airon-solingen', 6),
  ('facon-picasso', 'Facón “Picasso” — 30 cm', 'Presencia, tradición y respeto.', 489000, 30, 'facones', null, 7),
  ('facon-caronero', 'Facón “Caronero” — 50 cm', 'Presencia, tradición y respeto.', 529000, 50, 'facones', null, 8),
  ('chaira-25', 'Chaira personalizada — 25 cm', 'Accesorio artesanal para afilado.', 129000, 25, 'accesorios', null, 9),
  ('cabo-especial', 'Cabo especial (cuadrado u octogonal)', 'Personalización adicional al cuchillo.', 35000, null, 'personalizacion', null, 10)
on conflict (id) do nothing;
