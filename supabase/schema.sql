-- ============================================================================
-- Painel do site (psicologafernandalima.com.br): visitas anônimas + contatos.
--
-- Rode este arquivo inteiro no SQL Editor do Supabase (projeto separado do
-- FL PsicoFlow). Pode rodar de novo sem quebrar nada.
--
-- Segurança: o RLS fica ligado e SEM políticas. Assim, a chave pública (anon)
-- não lê nem grava nada. Todo acesso passa pelas rotas do site, no servidor,
-- com a chave service_role (que nunca vai para o navegador).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Eventos de navegação (anônimos)
-- Nada de IP, nome, texto digitado ou opção marcada no teste/assistente.
-- session_id é aleatório, vive só na aba aberta e some quando ela fecha.
-- ---------------------------------------------------------------------------
create table if not exists public.site_events (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  session_id   uuid        not null,
  type         text        not null check (type in ('pageview', 'click', 'section_view', 'conversion')),
  path         text        not null check (char_length(path) <= 200),
  zone         text                 check (char_length(zone) <= 60),
  target       text                 check (char_length(target) <= 80),
  rx           real                 check (rx between 0 and 1),
  ry           real                 check (ry between 0 and 1),
  device       text        not null check (device in ('mobile', 'tablet', 'desktop')),
  referrer     text                 check (char_length(referrer) <= 120),
  utm_source   text                 check (char_length(utm_source) <= 60),
  utm_medium   text                 check (char_length(utm_medium) <= 60),
  utm_campaign text                 check (char_length(utm_campaign) <= 80)
);

create index if not exists site_events_created_idx on public.site_events (created_at desc);
create index if not exists site_events_heat_idx on public.site_events (path, device, created_at desc) where type = 'click';

alter table public.site_events enable row level security;

-- ---------------------------------------------------------------------------
-- Contatos ("Prefere que eu te chame?")
-- Só o necessário para a Fernanda retornar. Nunca motivo, sintoma ou queixa.
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text        not null check (char_length(name) between 1 and 60),
  whatsapp        text        not null check (whatsapp ~ '^[0-9]{10,15}$'),
  best_time       text                 check (best_time in ('Manhã', 'Tarde', 'Noite', 'Flexível')),
  consent_at      timestamptz not null,
  consent_version text        not null check (char_length(consent_version) <= 20),
  source_path     text                 check (char_length(source_path) <= 200),
  utm_source      text                 check (char_length(utm_source) <= 60),
  utm_campaign    text                 check (char_length(utm_campaign) <= 80),
  status          text        not null default 'novo' check (status in ('novo', 'contatado', 'arquivado')),
  status_at       timestamptz
);

create index if not exists leads_created_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Ninguém além do servidor (service_role) mexe nas tabelas.
revoke all on public.site_events, public.leads from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Resumo do painel: tudo agregado no banco (o Supabase limita 1000 linhas por
-- consulta, então nada de baixar eventos crus para somar no servidor).
-- ---------------------------------------------------------------------------
create or replace function public.admin_site_stats(p_since timestamptz)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with ev as (
    select * from site_events where created_at >= p_since
  ),
  sessions as (
    select session_id,
           min(created_at) as started,
           (array_agg(device order by created_at))[1] as device,
           (array_agg(referrer order by created_at) filter (where type = 'pageview'))[1] as referrer,
           (array_agg(utm_source order by created_at) filter (where type = 'pageview'))[1] as utm_source
    from ev
    group by session_id
  ),
  wa as (
    select distinct session_id from ev where type = 'click' and target = 'whatsapp'
  ),
  funnel_home as (
    select
      count(distinct session_id) filter (where type = 'pageview' and path = '/')                                 as visitou,
      count(distinct session_id) filter (where type = 'section_view' and path = '/' and zone = 'sobre')          as sobre,
      count(distinct session_id) filter (where type = 'section_view' and path = '/' and zone = 'como-funciona')  as como_funciona,
      count(distinct session_id) filter (where type = 'section_view' and path = '/' and zone = 'agendar')        as agendar,
      count(distinct session_id) filter (where path = '/' and ((type = 'click' and target = 'whatsapp') or type = 'conversion')) as contato
    from ev
  )
  select jsonb_build_object(
    'visits',         (select count(*) from sessions),
    'pageviews',      (select count(*) from ev where type = 'pageview'),
    'whatsappClicks', (select count(*) from ev where type = 'click' and target = 'whatsapp'),
    'whatsappVisits', (select count(*) from wa),
    'leads',          (select count(*) from leads where created_at >= p_since),
    'leadsNew',       (select count(*) from leads where status = 'novo'),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('day', day, 'visits', visits) order by day)
      from (
        select to_char(date_trunc('day', started at time zone 'America/Sao_Paulo'), 'YYYY-MM-DD') as day, count(*) as visits
        from sessions group by 1
      ) d
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(jsonb_build_object('label', device, 'count', n) order by n desc)
      from (select device, count(*) as n from sessions group by device) d
    ), '[]'::jsonb),
    'pages', coalesce((
      select jsonb_agg(jsonb_build_object('label', path, 'count', n) order by n desc)
      from (select path, count(*) as n from ev where type = 'pageview' group by path order by n desc limit 10) p
    ), '[]'::jsonb),
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object('label', src, 'count', n) order by n desc)
      from (
        select coalesce(nullif(utm_source, ''), nullif(referrer, ''), 'direto') as src, count(*) as n
        from sessions group by 1 order by n desc limit 10
      ) s
    ), '[]'::jsonb),
    'targets', coalesce((
      select jsonb_agg(jsonb_build_object('label', target, 'zone', zone, 'count', n) order by n desc)
      from (
        select target, zone, count(*) as n from ev
        where type = 'click' and target is not null
        group by target, zone order by n desc limit 12
      ) t
    ), '[]'::jsonb),
    'funnel', (select to_jsonb(f) from funnel_home f)
  );
$$;

-- Pontos do mapa de calor de uma página: cliques agrupados (2 casas = grade de 1%).
create or replace function public.admin_heatmap(p_path text, p_device text, p_since timestamptz)
returns table (zone text, rx real, ry real, n bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select zone, round(rx::numeric, 3)::real, round(ry::numeric, 3)::real, count(*)
  from site_events
  where type = 'click'
    and path = p_path
    and device = p_device
    and created_at >= p_since
    and rx is not null and ry is not null
  group by 1, 2, 3
  order by 4 desc
  limit 20000;
$$;

-- Elementos mais clicados numa página (lista ao lado do mapa).
create or replace function public.admin_page_targets(p_path text, p_device text, p_since timestamptz)
returns table (target text, zone text, n bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(target, '(área sem link)'), zone, count(*)
  from site_events
  where type = 'click' and path = p_path and device = p_device and created_at >= p_since
  group by 1, 2
  order by 3 desc
  limit 15;
$$;

revoke all on function public.admin_site_stats(timestamptz) from public, anon, authenticated;
revoke all on function public.admin_heatmap(text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_page_targets(text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.admin_site_stats(timestamptz) to service_role;
grant execute on function public.admin_heatmap(text, text, timestamptz) to service_role;
grant execute on function public.admin_page_targets(text, text, timestamptz) to service_role;

-- ---------------------------------------------------------------------------
-- Retenção (LGPD: guardar só pelo tempo necessário)
-- Eventos: 13 meses. Contatos arquivados: 6 meses depois de arquivar.
-- Para rodar sozinho todo dia, ative a extensão pg_cron (Database → Extensions)
-- e descomente o bloco "cron.schedule" abaixo.
-- ---------------------------------------------------------------------------
create or replace function public.purge_old_site_data()
returns void
language sql
security invoker
set search_path = public
as $$
  delete from site_events where created_at < now() - interval '13 months';
  delete from leads where status = 'arquivado' and coalesce(status_at, created_at) < now() - interval '6 months';
$$;

revoke all on function public.purge_old_site_data() from public, anon, authenticated;
grant execute on function public.purge_old_site_data() to service_role;

-- select cron.schedule('purge-site-data', '15 3 * * *', $$select public.purge_old_site_data()$$);
