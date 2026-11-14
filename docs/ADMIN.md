# Painel do site (/admin)

O painel mostra, para a Fernanda:

- **Visão geral:** visitas por dia, de onde as pessoas vieram, páginas mais vistas, o que mais clicam, aparelho e o caminho até o contato (abriu a página → Sobre mim → Como funciona → Agendar → WhatsApp ou formulário).
- **Mapa de calor:** a página de verdade, no tamanho de celular, tablet ou computador, com as manchas dos cliques por cima.
- **Contatos:** quem preencheu “Prefere que eu te chame?”. Dá para chamar no WhatsApp com uma mensagem pronta, marcar como chamado, arquivar, apagar e exportar em CSV.

Endereço: `https://www.psicologafernandalima.com.br/admin`. Só entra quem tem login **e** está na lista `ADMIN_EMAILS`.

## Privacidade (LGPD e CFP)

| O quê | Registrado? |
|---|---|
| Página aberta, seções vistas, cliques (posição + nome do botão/link) | Sim, anônimo |
| Tipo de aparelho, origem (Instagram, Google, UTM) | Sim |
| Cookies, IP, impressão digital do navegador | **Nunca** |
| Cartões de “Parece que fala de você?”, assistente de mensagem | **Nunca** (área `data-private`, nem é contada) |
| Formulário de contato | Nome, WhatsApp, período (opcional), data do consentimento |
| Motivo da procura, sintomas | **Nunca** (o formulário não pergunta) |

- O código de sessão é aleatório, vive só na aba (`sessionStorage`) e some quando ela fecha.
- Quem usa “Não rastrear” ou Controle Global de Privacidade não é contado.
- O painel e a prévia do mapa de calor não contam como visita.
- Retenção: eventos por 13 meses; contatos arquivados são apagados 6 meses depois (ver “Limpeza automática”).
- A página `/privacidade` explica tudo isso ao visitante e tem um link para pedir a exclusão pelo WhatsApp.

## Configurar (uns 15 minutos)

### 1. Criar o projeto Supabase

1. Em [supabase.com](https://supabase.com), crie um projeto **novo**, separado do FL PsicoFlow. Região: **South America (São Paulo)**.
2. Guarde a senha do banco num gerenciador de senhas.

### 2. Criar as tabelas

1. Abra **SQL Editor → New query**.
2. Cole todo o conteúdo de [`supabase/schema.sql`](../supabase/schema.sql) e clique em **Run**. Pode rodar de novo sem problema.

O RLS fica ligado e sem políticas: a chave pública não lê nem grava nada. Só o servidor do site acessa, com a chave `service_role`.

### 3. Criar o login da Fernanda

1. **Authentication → Users → Add user → Create new user**.
2. Use o e-mail dela e uma senha forte, e marque “Auto Confirm User”.
3. Em **Authentication → Sign In / Providers**, desligue **“Allow new users to sign up”**. Assim ninguém cria conta sozinho.

### 4. Variáveis na Vercel

Em **Vercel → projeto → Settings → Environment Variables** (Production e Preview):

| Variável | Onde achar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | mesma tela, chave `anon` / publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | mesma tela, chave `service_role` / secret (**nunca** com `NEXT_PUBLIC_`) |
| `ADMIN_EMAILS` | e-mail(s) com acesso, separados por vírgula |

Depois, faça um novo deploy (Deployments → ⋯ → Redeploy). As variáveis `NEXT_PUBLIC_` entram no build.

### 5. Limpeza automática (recomendado)

1. **Database → Extensions**: ative `pg_cron`.
2. No SQL Editor, rode:

```sql
select cron.schedule('purge-site-data', '15 3 * * *', $$select public.purge_old_site_data()$$);
```

## Ver o painel no seu computador sem banco

No `.env.local` (não vai para o GitHub):

```
ADMIN_DEMO=1
```

Rode `npm run dev` e abra `http://localhost:3000/admin`. Aparecem dados de exemplo e não pede login. Em produção esse modo é ignorado.

## Como funciona por dentro

- `src/lib/tracker.ts`: coleta no navegador e envia em lotes para `/api/track`.
- `src/lib/heatZones.ts`: cada clique é salvo relativo à seção em que caiu, então o mapa acerta o lugar mesmo com larguras de tela diferentes.
- `src/app/api/track` e `src/app/api/leads`: validam e gravam com a chave de servidor. Robôs são descartados, com limite de envios por minuto. O formulário tem um campo-armadilha contra spam.
- `src/app/admin/*`: as páginas do painel. `src/middleware.ts` renova o login só em `/admin` (o site público não grava cookie).
- `supabase/schema.sql`: tabelas e funções de resumo. Os totais são calculados no banco.
