# Ata — Reunião de refinamento UX/UI

**Data:** 13/11/2026 · **Branch:** `feat/redesign-psicoflow` · **PR:** #1
**Participantes:** Writers (UX Writing), Design (UX/UI), Devs (Tech Lead), QA (funcional, acessibilidade, ética)
**Insumo central:** persona **Juliana, 30** — [`docs/PERSONA.md`](PERSONA.md)

> **Frase-guia da reunião:** *"Por fora está tudo bem, por dentro estou no meu limite."*
> O site precisa fazer a Juliana pensar **"isso fala de mim"** em menos de 10 segundos, no celular, vindo do Instagram.

---

## 1. Diagnóstico consolidado

| # | Problema | Quem apontou |
|---|---|---|
| D1 | **A dor central não aparece.** Nenhuma frase diz "não consigo desligar a mente". Hero e seção Ajuda repetem quase a mesma frase genérica ("não precisa… sozinha"). | Writers, Design |
| D2 | **As áreas falam a língua do diagnóstico, não a dela.** Ansiedade/Depressão/Pânico + sinais como "tremores", "falta de ar". Juliana se reconhece em *culpa ao descansar, autocobrança, cansaço que ninguém vê*. | Writers, Design |
| D3 | **A seção Ajuda pede esforço de formulário:** 4 painéis, 20 sinais, barra fixa. Não parece "post que me descreve". | Design |
| D4 | **Jornada e Terapia online se sobrepõem** (as duas respondem "como funciona"). O autoplay da Jornada é pesado e problemático para leitor de tela. | Design, QA |
| D5 | **A confiança chega tarde.** "Sobre mim" vem depois de duas seções de processo. Juliana é cética ("já fiz terapia e não vi evolução"). | Design, Writers |
| D6 | **O FAQ não responde às objeções reais:** terapia anterior que não funcionou, quanto tempo leva, "minha vida é boa, faz sentido?". | Writers |
| D7 | **CTAs inconsistentes:** "Agendar sessão" vai ao WhatsApp no hero e à seção #agendar no header (WCAG 3.2.4). O CTA do header some entre 1024 e 1279px. | QA, Design |
| D8 | **Conteúdo invisível antes do JS:** 23 elementos chegam com `opacity:0` no HTML. Em 4G lento ou no navegador do Instagram, as seções ficam em branco. | QA, Devs |
| D9 | **LGPD:** a barra da Ajuda envia sinais sensíveis (ex.: "relação abusiva") pela URL do WhatsApp sem prévia nem consentimento. | QA |
| D10 | **Não medimos nada:** sem analytics, sem UTM, sem saber qual seção converte. | Devs |
| D11 | **Navegador do Instagram:** falta `viewportFit: cover` (o botão flutuante pode colar na barra), e o `wa.me` com nova aba é instável no webview. | Devs |
| D12 | **SEO técnico:** sem `robots.txt` e sem `sitemap.xml`; palavras-chave clínicas em vez das dela; JSON-LD sem `FAQPage`/`sameAs`. | Devs |
| D13 | **Performance:** a página inteira hidrata no cliente (framer-motion completo em tudo); `@fortawesome/*` instalado e sem uso; parallax carregado também no celular. | Devs |
| D14 | **Acessibilidade:** a barra fixa cobre o foco (2.4.11), ordem de foco ≠ ordem visual na Ajuda, drawer sem `inert`, contraste de bordas < 3:1 no agendamento, animações em loop infinito. | QA |

---

## 2. Decisões

### Mensagem e tom (Writers)
- **Mensagem central:** *"Você dá conta de tudo. Mas não precisa dar conta sozinha — nem o tempo todo."* Um espaço para desacelerar a mente, com ferramentas práticas para o dia a dia.
- **Tom:** falar como ela pensa (1ª pessoa dela), frases curtas, acolher sem infantilizar, concreto e prático, **nunca prometer resultado**.
- **Usar:** mente acelerada, desligar, descansar sem culpa, cobrança, leveza, dar conta, prático, no dia a dia, no seu ritmo.
- **Evitar:** cura, superar, transformar sua vida, garantido, transtorno, paciente, alta, eficácia, tratamento.

### Nova arquitetura da página (Design + Writers, consenso)
| Ordem | Seção | Propósito |
|---|---|---|
| 1 | **Hero** | Espelho da dor. H1: **"Sua cabeça não para. Nem quando você pode parar."** Sub: *Terapia online para mulheres que dão conta de tudo — e estão cansadas de dar conta sozinhas.* CTA único **"Quero conversar"** (WhatsApp) + "Como funciona". Uma etiqueta só (CRP · TCC e ACT). |
| 2 | **"Parece que fala de você?"** | Substitui a Ajuda. **4 cartões em 1ª pessoa**, de toque único (sem painéis): *"Minha mente não desliga"*, *"Me cobro o tempo todo"*, *"Por fora tudo bem, por dentro no limite"*, *"Minha vida é boa… por que me sinto assim?"*. Resultado acolhedor (*"Você não está exagerando. Isso tem nome e tem caminho."*) + CTA com **prévia da mensagem e opt-in** para incluir o que marcou. As áreas clínicas viram uma linha discreta: *"Também acompanho: ansiedade, pânico, relacionamentos, luto."* |
| 3 | **Frase de virada** | Bloco de respiro: *"Sua vida é boa e mesmo assim pesa. Faz sentido."* — normaliza o conflito interno. |
| 4 | **Sobre a Fernanda** (sobe) | Foto, 3 linhas: *"Atendo mulheres que seguram muita coisa ao mesmo tempo. Na terapia, a gente desacelera junto e transforma entendimento em prática, no seu ritmo."* TCC e ACT explicados em 1 linha cada; formações recolhidas. |
| 5 | **Como funciona** (funde Jornada + Terapia online) | Título *"Um passo de cada vez"*. 4 passos **estáticos** (Primeira conversa · Encontros semanais · Acompanhamento · Encerramento), sem autoplay, + chips práticos (≈50 min · Google Meet · sigilo do consultório · de onde você estiver). |
| 6 | **Dúvidas** | 6 perguntas, objeções primeiro: *Já fiz terapia e não senti diferença…* · *Quanto tempo até perceber diferença?* (sem prometer prazo) · *Minha vida é boa. Faz sentido?* · Primeira sessão · Valor (Código de Ética) · Logística agrupada. Busca mantida. |
| 7 | **CTA final** | *"Que tal começar por uma conversa?"* — botão **direto** para o WhatsApp + link *"Prefere que eu escreva a mensagem por você?"* que abre o assistente de 3 passos (agora opcional), com motivos novos: Mente acelerada, Autocobrança, Cansaço. |
| 8 | **Rodapé** | CRP, CVV 188 / SAMU 192, **nota de privacidade** e orientação de emergência para quem está no exterior. |

**Menu:** Pra você · Como funciona · Sobre mim · Dúvidas · **[Quero conversar]** (o mesmo rótulo e o mesmo destino em todos os lugares).

### Direção visual (Design)
- Clima calmo e premium, **uma ideia por tela**, no máximo ~25 palavras visíveis por bloco; seções com 120–160px de respiro no desktop.
- **Motivo "mente acelerada → calma" no hero:** linhas finas em lavanda que se desenrolam em ondas lentas com o scroll (estado final estático com movimento reduzido).
- Tipografia: H1 56–64px (36px no celular), peso 650; frases de identificação em 22–24px; corpo 17px.
- Fotografia com luz natural e leve duotone lilás; menos cartões flutuando.
- **Sem autoplay**; loops limitados a 2–3 ciclos.

### Técnico (Devs)
- Animações de entrada só com deslocamento (sem esconder conteúdo no HTML) — resolve D8.
- `viewportFit: "cover"`; link do WhatsApp testado no navegador do Instagram (iOS/Android), avaliando `api.whatsapp.com/send` sem nova aba no celular.
- `robots.ts` + `sitemap.ts`; JSON-LD com `FAQPage` e `sameAs` (Instagram); OG e meta description na linguagem da persona; `twitter: summary_large_image`.
- Remover `@fortawesome/*`; `LazyMotion` + `m`; seções estáticas como server components; parallax só no desktop.
- **Analytics cookieless** (Vercel Analytics ou Plausible) com eventos `cta_whatsapp{section}`, funil do agendamento, uso do quiz e do FAQ — **nunca** enviando sintomas ou texto digitado. UTM no link da bio do Instagram.

### Qualidade e ética (QA)
- Corrigir todos os P1 e P2 da lista de QA (D7, D8, D14).
- **Sinais sensíveis só vão para o WhatsApp com prévia e consentimento** (D9).
- **Definition of Done:** tsc/build limpos · HTML sem `opacity:0` em conteúdo · Lighthouse mobile A11y ≥ 95 e LCP ≤ 2,5s em 4G · axe sem violações sérias · 360–1440px sem scroll lateral e CTA visível em todos os tamanhos · nada fixo cobre o foco · sem autoplay · contraste não textual ≥ 3:1 · VoiceOver (iPhone) e teclado testados · todo CTA testado com wa.me real, inclusive no Instagram · checklist CFP/LGPD aprovado pela Fernanda · rótulos de CTA consistentes.

---

## 3. Roadmap

### Sprint 1 — Falar com a Juliana (alto impacto, esforço P/M)
1. Novos textos em todas as seções (hero, menu, cartões, jornada, sobre, FAQ, CTA, meta description).
2. Nova arquitetura: quiz "Parece que fala de você?", frase de virada, Sobre sobe, Jornada + Terapia online fundidas, CTA final direto + assistente opcional.
3. CTA único "Quero conversar" em todo o site; CTA do header visível em todos os tamanhos.
4. Correções P1/P2 de QA, incluindo conteúdo visível sem JS, `inert` no drawer, contraste e foco.
5. Prévia + opt-in dos sinais (LGPD); nota de privacidade; emergência no exterior.
6. Ganhos técnicos rápidos: `viewportFit`, robots/sitemap, JSON-LD/OG, remover fontawesome.

### Sprint 2 — Experiência e medição
7. Motivo visual "mente acelerada → calma" no hero.
8. Analytics cookieless + eventos + UTM (depende da escolha da ferramenta).
9. Performance: LazyMotion, server components, Lighthouse real no preview da Vercel.
10. Testes em aparelho: navegador do Instagram (iOS/Android) e VoiceOver.

### Sprint 3 — Crescimento ✅ entregue
11. Cartões de frase "salváveis" no formato do Instagram, com botão Compartilhar.
12. Landing pages por dor (`/mente-acelerada`, `/autocobranca`, `/ansiedade`) como destino de posts específicos.

> **Entregue:** 6 cartões (1080×1350, gerados no build) com Compartilhar (imagem → link → copiar) e Baixar, na home e nas páginas de tema; 3 páginas com sinais em 1ª pessoa, "por que acontece", 3 passos da terapia, mini "sobre", frases, 2 dúvidas, CTA e links entre temas; prévia de link (Open Graph) com o cartão do tema; sitemap, JSON-LD `WebPage` + `BreadcrumbList` + `FAQPage`; eventos `quote_share` e `quote_download`. A mensagem do WhatsApp continua neutra (não cita o tema), seguindo a regra de LGPD.

---

## 4. Pendências para a Fernanda / cliente
1. **@ do Instagram** da Fernanda (para `sameAs` e links).
2. **Botões de WhatsApp:** manter o verde da marca ou passar para roxo com o ícone do WhatsApp (Design recomenda roxo, para respeitar a paleta).
3. **Ferramenta de analytics:** Vercel Analytics (integrado ao deploy) ou Plausible (pago, independente).
4. **Orientação de emergência para quem está no exterior** (texto a validar).
5. **Normas do CFP para atendimento online:** confirmar se há cadastro ou menção obrigatória no site.
6. **Validar os novos textos** (tom e frases em 1ª pessoa) e a frase *"Pesquisas mostram resultados semelhantes ao presencial"* (ter uma fonte, ou suavizar).
