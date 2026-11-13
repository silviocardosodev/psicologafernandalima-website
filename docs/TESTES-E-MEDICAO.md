# Testes em aparelho e medição

Complementa a [ata](ATA-REUNIAO-UX.md) — Sprint 2, itens 8 e 10.

## 1. Links com UTM (para o Instagram @fernandalima.psi)

Use estes links no lugar do link "puro" do site. Assim o Vercel Analytics mostra de onde veio cada visita.

| Onde | Link |
|---|---|
| Bio do perfil | `https://www.psicologafernandalima.com.br/?utm_source=instagram&utm_medium=bio&utm_campaign=perfil` |
| Stories (link) | `https://www.psicologafernandalima.com.br/?utm_source=instagram&utm_medium=stories&utm_campaign=stories` |
| Post específico | `https://www.psicologafernandalima.com.br/?utm_source=instagram&utm_medium=post&utm_campaign=<tema-do-post>` |
| Mensagem direta / WhatsApp | `https://www.psicologafernandalima.com.br/?utm_source=whatsapp&utm_medium=mensagem` |

> Dica: troque `<tema-do-post>` por algo curto, sem acentos, ex.: `mente-acelerada`, `culpa-ao-descansar`.

## 2. O que é medido (Vercel Web Analytics — sem cookies)

| Evento | Quando dispara | Dados enviados |
|---|---|---|
| *(visita)* | Toda página vista | Página, origem/UTM, país, dispositivo |
| `cta_whatsapp` | Clique em qualquer botão de WhatsApp | `section` (hero, para-voce, sobre, agendar, header, floating…) |
| `identify_select` | Visitante marca frases no "Parece que fala de você?" | `count` (quantas, **não quais**) |
| `identify_optin` | Marca/desmarca "Incluir o que marquei" | `enabled` |
| `booking_open` / `booking_step` / `booking_submit` | Uso do assistente de mensagem | passo (1–4) |
| `faq_open` / `faq_search` / `faq_filter` | Uso das Dúvidas | id da pergunta, se a busca teve resultado, categoria |

**LGPD:** nenhum sintoma, frase marcada, nome, motivo ou texto digitado é enviado. Não há cookies, então não é preciso banner.

### Para ativar na Vercel
1. No projeto da Vercel → **Analytics** → *Enable* (e **Speed Insights** → *Enable*).
2. Visitas e Core Web Vitals funcionam no plano gratuito (Hobby).
3. **Eventos personalizados** (`cta_whatsapp` etc.) aparecem no painel apenas nos planos **Pro/Enterprise**. No Hobby o código não quebra — os eventos só não são exibidos.

## 3. Checklist de testes no aparelho (antes de publicar)

Abrir o **link de preview da Vercel** do PR no celular.

### iPhone — navegador do Instagram
- [ ] Mandar o link para si mesma por Direct e abrir **de dentro do Instagram**.
- [ ] A página aparece com texto legível em menos de ~3 s (sem seções em branco).
- [ ] O botão verde do WhatsApp não fica escondido atrás da barra inferior.
- [ ] Tocar em **"Quero conversar"** → abre o WhatsApp no número certo, com a mensagem preenchida.
- [ ] Voltar do WhatsApp → o site continua onde estava.
- [ ] No "Parece que fala de você?": marcar 2 frases, ligar "Incluir o que marquei" → a prévia muda → enviar → a mensagem no WhatsApp é **igual à prévia**.
- [ ] Assistente "Prefere que eu escreva a mensagem por você?" → completar os passos → enviar.

### Android — navegador do Instagram
- [ ] Repetir os mesmos itens acima.

### iPhone — VoiceOver (Ajustes → Acessibilidade → VoiceOver)
- [ ] Deslizar pela página: títulos e botões são lidos em ordem lógica.
- [ ] Abrir o menu: o VoiceOver **não** sai do menu para o fundo da página.
- [ ] Marcar uma frase no quiz: é anunciado como "selecionado".
- [ ] No assistente, deixar o período em branco e avançar: o erro é lido junto da pergunta.

### Movimento reduzido (Ajustes → Acessibilidade → Movimento → Reduzir movimento)
- [ ] Recarregar: nada pisca nem fica invisível; as linhas do topo aparecem já "calmas".

### Desktop
- [ ] Navegar só com **Tab**: o foco é sempre visível e nada fixo o cobre.
- [ ] Telas de 1024 a 1440 px: o botão "Quero conversar" aparece no menu.

Anote o que falhar (aparelho, navegador, passo) e envie para a equipe.
