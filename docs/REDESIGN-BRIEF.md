# Redesign — Brief de Produto

Branch: `feat/redesign-psicoflow`
Objetivo: site institucional premium para a Psicóloga Fernanda Lima (CRP 06/192404), com a identidade visual do FL PsicoFlow (cores, fontes, espaçamentos), UX interativa e conversão para agendamento via WhatsApp.

## Público
Mulheres a partir de 18 anos, Brasil e exterior, que buscam terapia online (TCC / ACT). Tom: acolhedor, claro, sem jargão, sem promessas de cura.

## Restrições éticas (CFP)
- Não divulgar valores (explicar no FAQ).
- Não usar depoimentos de pacientes (Código de Ética, art. 20) — seção de depoimentos de produção NÃO é replicada.
- Não prometer resultados; sintomas são apenas sinais, não diagnóstico.
- Rodapé com aviso de emergência (CVV 188 / SAMU 192).

## Arquitetura da página (one-page, âncoras)
1. **Header** — sticky com glass, destaque da seção ativa, barra de progresso de leitura, drawer mobile acessível.
2. **Hero** (`#inicio`) — headline, subtítulo, CTA WhatsApp + secundário, chips de confiança (CRP, online Brasil/exterior, TCC & ACT), foto com cartões flutuantes.
3. **Identificação** (`#para-voce`) — "Você se reconhece?": cartões selecionáveis; resposta personalizada conforme quantidade marcada + CTA.
4. **Áreas de atuação** (`#atuacao`) — abas: Ansiedade, Relacionamentos, Depressão, Pânico. Pergunta-gancho, sinais, texto, observação ética.
5. **Jornada terapêutica** (`#jornada`) — 4 etapas interativas (stepper/timeline).
6. **Sobre mim** (`#sobre`) — foto, bio, formações em badges, "acompanho mulheres que buscam".
7. **Terapia online** (`#terapia-online`) — vantagens (Sigilo, Eficácia, Conforto) + detalhes práticos (≈50 min, semanal, Google Meet, PIX/transferência).
8. **FAQ** (`#duvidas`) — acordeão com busca.
9. **Agendar** (`#agendar`) — mini-formulário em 3 passos (nome opcional, motivo, período preferido) que monta a mensagem e abre o WhatsApp. Nada é armazenado.
10. **Footer** — CRP, navegação, contato, aviso de emergência.
Extras: botão flutuante de WhatsApp, voltar ao topo, `prefers-reduced-motion` respeitado, SEO (metadata, Open Graph, JSON-LD `Psychologist`).

## Contato
WhatsApp: +55 11 99455-8021
Mensagem padrão: "Olá Fernanda! Cheguei aqui por meio do seu site, estou interessada em iniciar o processo de terapia!"

## Critérios de aceite (QA)
- `npm run build` sem erros de tipo/lint.
- Responsivo 360px → 1440px sem scroll horizontal.
- Navegação por teclado completa, foco visível, contrastes AA, `aria-*` corretos em abas, acordeão e drawer.
- Todos os CTAs levam ao WhatsApp correto.
- Animações desativadas com `prefers-reduced-motion`.
