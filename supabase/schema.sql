create table if not exists pro_specialties (
  id text primary key,
  slug text unique not null,
  name text not null,
  short_description text not null,
  category_id text not null check (category_id in ('licensed','portfolio')),
  icon text not null,
  scope_note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists pro_professionals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_name text not null,
  profession text not null,
  city text not null,
  state text not null,
  languages text[] not null default '{}',
  bio text not null,
  avatar_url text,
  years_experience_value integer,
  years_experience_source text check (years_experience_source in ('self_reported','document_verified')),
  identity_verification text not null default 'pending' check (identity_verification in ('pending','verified','rejected')),
  license_verification text not null default 'not_required' check (license_verification in ('not_required','pending','verified','rejected')),
  availability_status text check (availability_status in ('available','limited','unavailable')),
  is_demo boolean not null default false,
  is_published boolean not null default false,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pro_professional_specialties (
  professional_id uuid not null references pro_professionals(id) on delete cascade,
  specialty_id text not null references pro_specialties(id) on delete cascade,
  primary key (professional_id, specialty_id)
);

create table if not exists pro_completed_jobs (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references pro_professionals(id) on delete cascade,
  completed_at timestamptz not null default now()
);

create table if not exists pro_reviews (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references pro_professionals(id) on delete cascade,
  origin text not null check (origin in ('verified_service','professional_reference','imported_external','unverified_comment')),
  completed_job_id uuid references pro_completed_jobs(id),
  body text,
  created_at timestamptz not null default now(),
  constraint verified_service_requires_job check (origin != 'verified_service' or completed_job_id is not null)
);

create or replace view pro_professional_stats as
select
  p.id as professional_id,
  count(distinct j.id) as completed_jobs,
  count(distinct r.id) filter (where r.origin = 'verified_service') as verified_service_reviews,
  count(distinct r.id) filter (where r.origin = 'professional_reference') as professional_references,
  count(distinct r.id) filter (where r.origin = 'imported_external') as imported_external_reviews,
  count(distinct r.id) filter (where r.origin = 'unverified_comment') as unverified_comments
from pro_professionals p
left join pro_completed_jobs j on j.professional_id = p.id
left join pro_reviews r on r.professional_id = p.id
group by p.id;

create table if not exists pro_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  specialty_interest text,
  message text,
  status text not null default 'pending' check (status in ('pending','reviewing','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists idx_pro_professionals_published on pro_professionals(is_published) where is_published = true;
create index if not exists idx_pro_prof_specialties_specialty on pro_professional_specialties(specialty_id);
create index if not exists idx_pro_reviews_professional on pro_reviews(professional_id);
create index if not exists idx_pro_completed_jobs_professional on pro_completed_jobs(professional_id);

alter table pro_specialties enable row level security;
alter table pro_professionals enable row level security;
alter table pro_professional_specialties enable row level security;
alter table pro_completed_jobs enable row level security;
alter table pro_reviews enable row level security;
alter table pro_applications enable row level security;

create policy "specialties_public_read" on pro_specialties for select using (true);
create policy "professionals_public_read_published" on pro_professionals for select using (is_published = true);
create policy "prof_specialties_public_read" on pro_professional_specialties for select using (true);
create policy "completed_jobs_public_read" on pro_completed_jobs for select using (true);
create policy "reviews_public_read_not_unverified" on pro_reviews for select using (origin != 'unverified_comment');
create policy "applications_public_insert" on pro_applications for insert with check (true);

insert into pro_specialties (id, slug, name, short_description, category_id, icon, scope_note) values
  ('law', 'derecho', 'Derecho', 'Empresas, migración, contratos y patrimonio.', 'licensed', 'scale', null),
  ('architecture', 'arquitectura', 'Arquitectura', 'Diseño residencial y comercial, permisos de construcción.', 'licensed', 'building', 'Cambios estructurales y permisos.'),
  ('interior-design', 'diseno-de-interiores', 'Diseño de Interiores', 'Distribución, mobiliario y estética de espacios.', 'portfolio', 'sofa', 'Distribución y estética — sin tocar estructura.'),
  ('graphic-design', 'diseno-grafico', 'Diseño Gráfico', 'Identidad de marca, logos y branding.', 'portfolio', 'pen-tool', null),
  ('accounting', 'contabilidad', 'Contabilidad', 'Estructura fiscal y contabilidad para pequeños negocios.', 'licensed', 'calculator', null),
  ('photography', 'fotografia', 'Fotografía', 'Fotografía comercial, de producto y retrato.', 'portfolio', 'camera', null),
  ('real-estate', 'bienes-raices', 'Bienes Raíces', 'Compra, venta y renta de propiedades.', 'licensed', 'key', 'DRE California — Agente o Broker, ambas califican.')
on conflict (id) do nothing;

insert into pro_professionals (slug, display_name, profession, city, state, languages, bio, years_experience_value, years_experience_source, identity_verification, license_verification, is_demo, is_published) values
  ('andres-villanueva', 'Andrés Villanueva', 'Abogado', 'San Diego', 'CA', array['Español','English'], 'Derecho corporativo y migración para pequeños negocios.', 10, 'self_reported', 'verified', 'verified', true, true),
  ('renata-sosa', 'Renata Sosa', 'Arquitecta', 'San Diego', 'CA', array['Español','English'], 'Diseño residencial y comercial, permisos de construcción.', 8, 'self_reported', 'verified', 'verified', true, true),
  ('emiliano-duarte', 'Emiliano Duarte', 'Fotógrafo', 'San Diego', 'CA', array['Español','English'], 'Fotografía de producto y retrato comercial.', 6, 'self_reported', 'verified', 'not_required', true, true),
  ('marisol-reyes', 'Marisol Reyes', 'Contadora', 'San Diego', 'CA', array['Español','English'], 'Contabilidad y estructura fiscal para pequeños negocios.', 12, 'self_reported', 'verified', 'verified', true, true),
  ('camila-ortiz', 'Camila Ortiz', 'Diseñadora de Interiores', 'San Diego', 'CA', array['Español','English'], 'Distribución y estética de espacios comerciales y residenciales.', 5, 'self_reported', 'verified', 'not_required', true, true)
on conflict (slug) do nothing;

insert into pro_professional_specialties (professional_id, specialty_id)
select p.id, s.specialty_id from pro_professionals p
join (values
  ('andres-villanueva', 'law'), ('renata-sosa', 'architecture'), ('emiliano-duarte', 'photography'),
  ('marisol-reyes', 'accounting'), ('camila-ortiz', 'interior-design')
) as s(slug, specialty_id) on s.slug = p.slug
on conflict do nothing;
