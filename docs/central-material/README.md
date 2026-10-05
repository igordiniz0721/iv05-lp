# Central de Material — tudo instalado neste repositório

Tudo o que dá para instalar no Claude Code a partir de
[central-material.vercel.app](https://central-material.vercel.app/) (118 materiais) e de
[deploy-seven-iota-94.vercel.app/skills-repos](https://deploy-seven-iota-94.vercel.app/skills-repos)
(biblioteca CODA). O total é de **147 itens, com 1.250 skills, 530 comandos e 380 agentes**,
mais os servidores MCP e as ferramentas de linha de comando que eles usam.

## Como funciona

| Onde | O quê | Carrega |
|---|---|---|
| `.claude/skills/<plugin>/` | Cada repositório vira um plugin completo (`.claude-plugin/plugin.json`), com skills, comandos, agentes, hooks e MCP. Aparecem como `<plugin>:<skill>`. | Sozinho, no computador e na nuvem, depois que a pasta é marcada como confiável (`<nome>@skills-dir`). |
| `.claude/skills/<skill>/` | Skills avulsas: `prompt-master`, `council`, `graphify`, `find-skills`, `scrapling` etc. | Sozinho, como `/nome`. |
| `.claude/commands/skillsmith/` | SkillSmith, a meta-skill que cria outras skills. | Como comandos. |
| `.mcp.json` | Servidores MCP que não vêm dentro de nenhum plugin (os da raiz). | Aprovados automaticamente por `enableAllProjectMcpServers`. |
| `CLAUDE.md` | O arquivo de comportamento do Karpathy (andrej-karpathy-skills) mais a seção do gstack. | Em toda sessão. |
| `.claude/hooks/bootstrap-tools.sh` | Nas sessões na nuvem, roda `scripts/install-tools.sh` em segundo plano (log em `~/.cache/install-tools.log`). | No início de cada sessão na nuvem. |
| `scripts/install-tools.sh` | Instala as CLIs que as skills e os MCPs chamam: gstack, bun, uv, graphify, scrapling (com navegadores), yt-dlp, notebooklm, codebase-memory-mcp, strix e as dependências do claude-peers. `--extras` acrescenta codex, headroom, scrapegraphai e hermes. | Rode uma vez no seu computador. |

As cópias foram feitas a partir dos commits listados em `sources.lock.json`. Ficaram de fora
testes, imagens, vídeos, lockfiles e arquivos acima de 4 MB.

### Ajustes feitos em relação ao original

- **Nomes de plugin.** O Claude Code reserva nomes que começam com `claude-`/`anthropic-` para o marketplace oficial, então sete foram renomeados:
  `claude-code-setup → code-setup`, `anthropic-agent-skills → agent-skills`, `claude-ads → ads-audit`,
  `claude-code-settings → feiskyer-settings`, `claude-command-suite → command-suite`, `claude-mem → mem`,
  `claude-peers → peers`. Também `obsidian-mind` (que colidia com `obsidian` do kepano).
- **Templates do Command Suite.** Foram para `command-suite/skill-templates/`; dentro de `commands/` eles viravam comandos quebrados.
- **claude-peers.** O caminho do servidor agora usa `${CLAUDE_PLUGIN_ROOT}`.
- **Hooks desligados após revisão de segurança** (skills, agentes e MCP continuam ligados):
  - `ruflo-core`: antes e depois de cada Bash/Write/Edit, roda `npx ruflo@latest` (pacote sem versão fixa) passando **todas as variáveis de ambiente**, inclusive chaves de API, e pode travar até 30 s por chamada.
  - `ruflo-cost-tracker`: roda `npx @claude-flow/cli@latest` ao fim de cada resposta.
  - Para religar: renomeie `hooks/hooks.json.disabled` → `hooks/hooks.json`.
- **`headroom` fica instalado, mas desligado** (`defaultEnabled: false`). Ele é só hooks em volta da CLI `headroom`, um proxy que comprime o contexto. Sem essa CLI, cada comando Bash dá erro. Para ligar: rode `scripts/install-tools.sh --extras` e adicione
  `"enabledPlugins": {"headroom@skills-dir": true}` em `.claude/settings.json`.

## Antes de usar: hooks, telemetria e o que muda no comportamento

Revisão feita em todos os 15 plugins com hooks. Nada malicioso foi encontrado. O que você deve saber:

- **`ecc` (Everything Claude Code), perfil `standard`.**
  - O GateGuard nega a 1ª edição de cada arquivo, o 1º Bash da sessão e a 1ª tentativa de comando destrutivo até o Claude "apresentar os fatos". Bloqueia `git --no-verify` e edição de configs de linter.
  - Ele resume as conversas com `claude -p` (gasta a sua cota) e registra os comandos em `~/.claude/` e `~/.local/share/ecc-homunculus/`.
  - Desligar: `ECC_GATEGUARD=off`, `ECC_SKIP_LLM_SUMMARY=1`, ou `ECC_HOOK_PROFILE=minimal`.
- **`mem` (claude-mem).**
  - Grava todas as entradas e saídas de ferramentas em `~/.claude-mem/` sem remover segredos e sobe um worker local.
  - Na 1ª execução roda `bun install` dentro do plugin.
  - Telemetria anônima (PostHog, só metadados) vem ligada: `CLAUDE_MEM_TELEMETRY=0` ou `DO_NOT_TRACK=1` desliga.
- **`caveman`.** Liga por padrão o modo de respostas curtas ("caveman") em toda sessão. Para desligar: `CAVEMAN_DEFAULT_MODE=off`.
- **`superpowers`.** Injeta a regra de sempre consultar uma skill antes de responder.
- **`n8n-mcp-skills`.** Injeta cerca de 17 KB de guia de n8n em toda sessão.
- **`impeccable`.** Baixa um binário fixado com hash de `github.com/pbakaus/impeccable/releases` para `~/.impeccable/`.
- **`watermarks-remover`.** Depois de cada escrita, verifica marcas de proveniência de IA. No modo `clean` (`WATERMARKS_HOOK_MODE=clean`) reescreve os arquivos.
- **`codex`.** O review-gate vem desligado. Se você ligar em `/codex:setup`, as respostas passam pela OpenAI.
- **`openviking-memory`.** Só age se existir `~/.openviking/ov.conf`.
- **`last30days`.** No Mac, pode ler os cookies do X/Twitter do Chrome para buscar posts com o seu login. Fica restrito ao domínio e só roda quando a skill é chamada.
- **MCP remotos de terceiros que conectam sozinhos:** `ruflo-ai-team` (team.ruv.io) e `ruflo-x-gateway` (x.ruv.io).
- **Contexto.** São 1.250 skills. As descrições entram no contexto e o Claude Code passa a buscá-las sob demanda. Para esconder uma skill, use `/skills` ou `disable-model-invocation: true`.

## O que precisa de login ou chave

| Servidor / plugin | Como ativar |
|---|---|
| Conectores HTTP dos plugins da Anthropic (Slack, Notion, GitHub, Linear, Atlassian, HubSpot, Figma, Canva, Gmail, Stripe… ~170) | `/mcp` → escolher → login (OAuth) |
| `higgsfield`, `buzzy`, `glif`, `goodnotes`, `firecrawl` | `/mcp` → login na conta do serviço |
| `perplexity` | `PERPLEXITY_API_KEY` |
| `pal` (zen-mcp-server, agora PAL) | `GEMINI_API_KEY` / `OPENAI_API_KEY` / `OPENROUTER_API_KEY` |
| `n8n-mcp` | Funciona sem chave (documentação dos nós); para gerenciar workflows use `N8N_API_URL` + `N8N_API_KEY` |
| `notebooklm` | Login Google na 1ª chamada |
| `codex` | `npm i -g @openai/codex` e `/codex:setup` (conta OpenAI) |
| `chrome` (mcp-chrome) | Extensão do Chrome + `npm i -g mcp-chrome-bridge && mcp-chrome-bridge register` (só no seu computador) |
| `peers` (claude-peers) | `bun` (instalado por `install-tools.sh`) |
| `scrapling`, `codebase-memory-mcp`, `graphify`, `strix` | CLIs instaladas por `install-tools.sh` |
| `google-maps-scraper` | `docker compose up -d` do repo [Mahanaicoach/google-maps-scraper-kit](https://github.com/Mahanaicoach/google-maps-scraper-kit) |
| `voicestudio`, `wangp-agent`, `openviking` | O app correspondente rodando (veja abaixo) |
| Higgsfield skills, Seedance, Buzzy, DesignKit, Manus, Sandcastles | Conta (paga ou trial) no serviço |

## Apps e ferramentas independentes (não rodam dentro do Claude Code)

Eles estão no material, mas são servidores, apps de desktop ou modelos. Rode no seu computador ou servidor:

| Material | Comando |
|---|---|
| Hermes Agent (Nous Research) | `curl -fsSL https://hermes-agent.nousresearch.com/install.sh \| bash` (ou Cloudways Managed Hermes) |
| Strix CLI (pentest) | `curl -sSL https://strix.ai/install \| bash` ou `uv tool install strix-agent` |
| OpenWA (WhatsApp p/ agente) | `git clone https://github.com/rmyndharis/OpenWA.git && cd OpenWA && docker compose -f docker-compose.dev.yml up -d` |
| Google Maps scraper | `git clone https://github.com/Mahanaicoach/google-maps-scraper-kit && cd google-maps-scraper-kit && docker compose up -d` |
| Jarvis | `git clone https://github.com/adewaskar/jarvis.git && cd jarvis && npm install && npm start` |
| DeepSeek Harness | `npx @deepseek-ai/dsh web` |
| claude-code-router | `npm i -g @musistudio/claude-code-router` + `~/.claude-code-router/config.json` |
| OmniRoute | [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) |
| Headroom (proxy de tokens) | `pip install "headroom-ai[all]"` |
| ScrapeGraphAI | `pip install scrapegraphai && playwright install` |
| Agent-Reach CLI | ver `raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md` (a skill já está em `.claude/skills/agent-reach`) |
| Remotion | `npx create-video@latest`, `npx remotion studio`, `npx remotion render` |
| HyperFrames CLI (usado por `brag`/`hyperframes`) | `npx hyperframes` (Node 22+, FFmpeg) |
| LibreChat, n8n, n8n-workflows | [danny-avila/LibreChat](https://github.com/danny-avila/LibreChat), [n8n-io/n8n](https://github.com/n8n-io/n8n), [Zie619/n8n-workflows](https://github.com/Zie619/n8n-workflows) |
| VoiceStudio (clone de voz) | [debpalash/VoiceStudio](https://github.com/debpalash/VoiceStudio), depois `claude mcp add` no endereço que o app mostrar |
| Wan2GP / MiniMax H3, LTX-2.5 | [deepbeepmeep/Wan2GP](https://github.com/deepbeepmeep/Wan2GP), [Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5) (ComfyUI) |
| Colibri, MiroFish, OpenViking, Artemis, pizza-bot | [JustVugg/colibri](https://github.com/JustVugg/colibri), [666ghj/MiroFish](https://github.com/666ghj/MiroFish), [volcengine/OpenViking](https://github.com/volcengine/OpenViking), [google/artemis](https://github.com/google/artemis), [pizza-bot-app/pizza-bot](https://github.com/pizza-bot-app/pizza-bot) |
| screenshot-to-code, arXivisual | [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code), [rajshah6/arXivisual](https://github.com/rajshah6/arXivisual) |
| AutoHedge, Vibe-Trading, FinceptTerminal, Open-LLM-VTuber, Open-Higgsfield-AI, agentic-inbox, camofox-browser | repos em [repos-github](https://central-material.vercel.app/) — apps próprios |
| design-md-chrome | extensão do Chrome [bergside/design-md-chrome](https://github.com/bergside/design-md-chrome) |
| Kimi K3, DeepSeek V4, NVIDIA NIM, API grátis | trocar o provedor do Claude Code: `ANTHROPIC_BASE_URL` (`https://api.moonshot.ai/anthropic`, `https://api.deepseek.com/anthropic`) + `ANTHROPIC_AUTH_TOKEN`; lista de APIs grátis em [cheahjs/free-llm-api-resources](https://github.com/cheahjs/free-llm-api-resources) |

## Listas e cursos (só leitura)

- Listas: [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills),
  [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills),
  [BehiSecc/awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills),
  [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code),
  [VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design).
- Curso oficial: [anthropics/courses — claude-code](https://github.com/anthropics/courses/tree/master/claude-code).
- ECC em português: [affaan-m/ECC docs/pt-BR](https://github.com/affaan-m/ECC/blob/main/docs/pt-BR/README.md).
- Prompts de sistema vazados (Fable 5 / 5.1), citados no material: ficam só como link, sem cópia do conteúdo —
  [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks),
  [elder-plinius/CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S).
- O resto do material são cursos, promoções, créditos e prompts para colar (Harvard, Claude Corps, Max grátis,
  dynamic workflows, loop do enxame, dois modelos, calendário de 14 dias etc.) e não tem nada para instalar.

## Atualizar

Para trazer versões novas, repita a cópia a partir dos repositórios em `sources.lock.json`. Também dá para
instalar pelo marketplace oficial de cada um no seu computador (`/plugin marketplace add <owner/repo>`),
mas aí desative a cópia daqui para não duplicar.

## Tudo o que está instalado

### Anthropic (oficiais) (23)

| Item | Origem | Skills | Cmds | Agentes | Extras |
|---|---|---:|---:|---:|---|
| `agent-skills` | anthropics/skills | 19 |  | 3 |  |
| `apollo` | anthropics/knowledge-work-plugins/partner-built/apollo | 3 |  |  | MCP |
| `bio-research` | anthropics/knowledge-work-plugins/bio-research | 6 |  |  | MCP |
| `brand-voice` | anthropics/knowledge-work-plugins/partner-built/brand-voice | 3 | 3 | 5 | MCP |
| `common-room` | anthropics/knowledge-work-plugins/partner-built/common-room | 6 | 2 |  | MCP |
| `cowork-plugin-management` | anthropics/knowledge-work-plugins/cowork-plugin-management | 2 |  |  |  |
| `customer-support` | anthropics/knowledge-work-plugins/customer-support | 5 |  |  | MCP |
| `data` | anthropics/knowledge-work-plugins/data | 10 |  |  | MCP |
| `design` | anthropics/knowledge-work-plugins/design | 7 |  |  | MCP |
| `engineering` | anthropics/knowledge-work-plugins/engineering | 10 |  |  | MCP |
| `enterprise-search` | anthropics/knowledge-work-plugins/enterprise-search | 5 |  |  | MCP |
| `finance` | anthropics/knowledge-work-plugins/finance | 8 |  |  | MCP |
| `human-resources` | anthropics/knowledge-work-plugins/human-resources | 9 |  |  | MCP |
| `legal` | anthropics/knowledge-work-plugins/legal | 9 |  |  | MCP |
| `marketing` | anthropics/knowledge-work-plugins/marketing | 8 |  |  | MCP |
| `operations` | anthropics/knowledge-work-plugins/operations | 9 |  |  | MCP |
| `pdf-viewer` | anthropics/knowledge-work-plugins/pdf-viewer | 1 | 4 |  | MCP |
| `product-management` | anthropics/knowledge-work-plugins/product-management | 8 | 1 |  | MCP |
| `productivity` | anthropics/knowledge-work-plugins/productivity | 4 |  |  | MCP |
| `sales` | anthropics/knowledge-work-plugins/sales | 36 |  |  | MCP |
| `slack-by-salesforce` | anthropics/knowledge-work-plugins/partner-built/slack | 2 | 5 |  | MCP |
| `small-business` | anthropics/knowledge-work-plugins/small-business | 44 |  |  | MCP |
| `zoom-plugin` | anthropics/knowledge-work-plugins/partner-built/zoom-plugin | 57 |  |  | MCP |

### ruflo — 45 plugins (45)

| Item | Origem | Skills | Cmds | Agentes | Extras |
|---|---|---:|---:|---:|---|
| `ruflo-adr` | ruvnet/ruflo/plugins/ruflo-adr | 5 | 1 | 1 | hooks |
| `ruflo-agent` | ruvnet/ruflo/plugins/ruflo-agent | 4 | 2 | 9 | hooks |
| `ruflo-agentdb` | ruvnet/ruflo/plugins/ruflo-agentdb | 2 | 2 | 1 | hooks |
| `ruflo-agntcy` | ruvnet/ruflo/plugins/ruflo-agntcy | 1 |  |  | hooks |
| `ruflo-ai-team` | ruvnet/ruflo/plugins/ruflo-ai-team/directory | 6 | 4 | 4 | MCP |
| `ruflo-aidefence` | ruvnet/ruflo/plugins/ruflo-aidefence | 2 | 1 | 1 | hooks |
| `ruflo-arena` | ruvnet/ruflo/plugins/ruflo-arena |  | 1 |  | hooks |
| `ruflo-autopilot` | ruvnet/ruflo/plugins/ruflo-autopilot | 2 | 2 | 1 | hooks |
| `ruflo-bbs-federation` | ruvnet/ruflo/plugins/ruflo-bbs-federation | 1 |  |  | hooks |
| `ruflo-browser` | ruvnet/ruflo/plugins/ruflo-browser | 10 | 1 | 1 | hooks |
| `ruflo-business-pods` | ruvnet/ruflo/plugins/ruflo-business-pods | 1 |  |  | hooks |
| `ruflo-console` | ruvnet/ruflo/plugins/ruflo-console |  |  |  | hooks |
| `ruflo-core` | ruvnet/ruflo/plugins/ruflo-core | 5 | 2 | 4 | MCP |
| `ruflo-cost-tracker` | ruvnet/ruflo/plugins/ruflo-cost-tracker | 24 | 1 | 1 |  |
| `ruflo-daa` | ruvnet/ruflo/plugins/ruflo-daa | 2 | 1 | 1 | hooks |
| `ruflo-ddd` | ruvnet/ruflo/plugins/ruflo-ddd | 3 | 1 | 1 | hooks |
| `ruflo-deepseek-harness` | ruvnet/ruflo/plugins/ruflo-deepseek-harness | 2 | 1 | 1 | hooks |
| `ruflo-docs` | ruvnet/ruflo/plugins/ruflo-docs | 2 | 1 | 1 | hooks |
| `ruflo-federation` | ruvnet/ruflo/plugins/ruflo-federation | 3 | 1 | 1 | hooks |
| `ruflo-goals` | ruvnet/ruflo/plugins/ruflo-goals | 5 | 1 | 4 | hooks |
| `ruflo-graph-intelligence` | ruvnet/ruflo/plugins/ruflo-graph-intelligence |  |  |  | hooks |
| `ruflo-intelligence` | ruvnet/ruflo/plugins/ruflo-intelligence | 3 | 2 | 1 | hooks |
| `ruflo-iot-cognitum` | ruvnet/ruflo/plugins/ruflo-iot-cognitum | 5 | 1 | 4 | hooks |
| `ruflo-jujutsu` | ruvnet/ruflo/plugins/ruflo-jujutsu | 2 | 1 | 1 | hooks |
| `ruflo-knowledge-graph` | ruvnet/ruflo/plugins/ruflo-knowledge-graph | 2 | 1 | 1 | hooks |
| `ruflo-loop-workers` | ruvnet/ruflo/plugins/ruflo-loop-workers | 2 | 2 | 1 | hooks |
| `ruflo-market-data` | ruvnet/ruflo/plugins/ruflo-market-data | 2 | 1 | 1 | hooks |
| `ruflo-metaharness` | ruvnet/ruflo/plugins/ruflo-metaharness | 13 | 1 | 1 | hooks |
| `ruflo-migrations` | ruvnet/ruflo/plugins/ruflo-migrations | 2 | 1 | 1 | hooks |
| `ruflo-mods` | ruvnet/ruflo/plugins/ruflo-mods |  |  |  | hooks |
| `ruflo-music` | ruvnet/ruflo/plugins/ruflo-music | 7 | 1 | 2 | hooks |
| `ruflo-neural-trader` | ruvnet/ruflo/plugins/ruflo-neural-trader | 9 | 1 | 4 | hooks |
| `ruflo-observability` | ruvnet/ruflo/plugins/ruflo-observability | 2 | 1 | 1 | hooks |
| `ruflo-plugin-creator` | ruvnet/ruflo/plugins/ruflo-plugin-creator | 3 | 1 | 1 | hooks |
| `ruflo-rag-memory` | ruvnet/ruflo/plugins/ruflo-rag-memory | 2 | 2 | 1 | hooks |
| `ruflo-ruos` | ruvnet/ruflo/plugins/ruflo-ruos | 1 | 4 | 1 | hooks |
| `ruflo-ruvector` | ruvnet/ruflo/plugins/ruflo-ruvector | 4 | 1 | 1 | hooks |
| `ruflo-ruvllm` | ruvnet/ruflo/plugins/ruflo-ruvllm | 2 | 1 | 1 | hooks |
| `ruflo-rvf` | ruvnet/ruflo/plugins/ruflo-rvf | 2 | 1 | 1 | hooks |
| `ruflo-security-audit` | ruvnet/ruflo/plugins/ruflo-security-audit | 2 | 1 | 1 | hooks |
| `ruflo-sparc` | ruvnet/ruflo/plugins/ruflo-sparc | 3 | 1 | 1 | hooks |
| `ruflo-swarm` | ruvnet/ruflo/plugins/ruflo-swarm | 2 | 2 | 2 | hooks |
| `ruflo-testgen` | ruvnet/ruflo/plugins/ruflo-testgen | 3 | 1 | 1 | hooks |
| `ruflo-workflows` | ruvnet/ruflo/plugins/ruflo-workflows | 5 | 8 | 3 | hooks |
| `ruflo-x-gateway` | ruvnet/ruflo/plugins/ruflo-x-gateway/directory |  |  |  | MCP |

### AgentSys — 24 plugins (24)

| Item | Origem | Skills | Cmds | Agentes | Extras |
|---|---|---:|---:|---:|---|
| `agentsys-ada-spark` | agent-sh/ada-spark (via agent-sh/agentsys) | 1 |  |  |  |
| `agentsys-agnix` | agent-sh/agnix (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-audit-project` | agent-sh/audit-project (via agent-sh/agentsys) | 1 | 3 |  |  |
| `agentsys-banthis` | agent-sh/banthis (via agent-sh/agentsys) | 1 | 1 |  |  |
| `agentsys-can-i-help` | agent-sh/can-i-help (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-consult` | agent-sh/consult (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-debate` | agent-sh/debate (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-deslop` | agent-sh/deslop (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-drift-detect` | agent-sh/drift-detect (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-enhance` | agent-sh/enhance (via agent-sh/agentsys) | 9 | 1 | 8 |  |
| `agentsys-gate-and-ship` | agent-sh/gate-and-ship (via agent-sh/agentsys) |  | 1 |  |  |
| `agentsys-learn` | agent-sh/learn (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-mojo` | agent-sh/mojo (via agent-sh/agentsys) | 1 |  |  |  |
| `agentsys-next-task` | agent-sh/next-task (via agent-sh/agentsys) | 1 | 2 | 8 | hooks |
| `agentsys-onboard` | agent-sh/onboard (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-perf` | agent-sh/perf (via agent-sh/agentsys) | 8 | 1 | 6 |  |
| `agentsys-prepare-delivery` | agent-sh/prepare-delivery (via agent-sh/agentsys) | 4 | 1 | 3 |  |
| `agentsys-repo-intel` | agent-sh/repo-intel (via agent-sh/agentsys) | 1 | 1 | 3 |  |
| `agentsys-ship` | agent-sh/ship (via agent-sh/agentsys) | 1 | 5 | 1 |  |
| `agentsys-skill-curator` | agent-sh/skill-curator (via agent-sh/agentsys) | 1 | 1 |  |  |
| `agentsys-skillers` | agent-sh/skillers (via agent-sh/agentsys) | 2 | 1 | 2 | hooks |
| `agentsys-sync-docs` | agent-sh/sync-docs (via agent-sh/agentsys) | 1 | 1 | 1 |  |
| `agentsys-system-prompt-curator` | agent-sh/system-prompt-curator (via agent-sh/agentsys) | 1 | 1 |  |  |
| `agentsys-zig-lsp` | agent-sh/zig-lsp (via agent-sh/agentsys) |  |  |  |  |

### Comunidade — plugins e pacotes (43)

| Item | Origem | Skills | Cmds | Agentes | Extras |
|---|---|---:|---:|---:|---|
| `ads-audit` | AgriciDaniel/claude-ads | 34 |  | 25 |  |
| `andrej-karpathy-skills` | multica-ai/andrej-karpathy-skills | 1 |  |  |  |
| `apple-hig-skills` | raintree-technology/hig-doctor | 14 |  |  |  |
| `arena-skill` | Jakeschincariol/arena-skill | 1 |  |  |  |
| `brag` | latent-spaces/brag | 2 |  |  |  |
| `caveman` | JuliusBrussee/caveman | 22 | 9 | 3 | hooks |
| `claudex-loop` | chaseai-yt/claudex-loop | 6 |  |  |  |
| `code-setup` | anthropics__claude-plugins-official/plugins/claude-code-setup | 1 |  |  |  |
| `codex` | openai/codex-plugin-cc | 3 | 8 | 1 | hooks |
| `codex-skill` | feiskyer/claude-code-settings/plugins/codex-skill |  |  |  |  |
| `command-suite` | qdhenry/Claude-Command-Suite | 12 | 220 | 131 |  |
| `ecc` | affaan-m/ECC (= everything-claude-code) | 292 | 94 | 73 | hooks |
| `emil-kowalski` | emilkowalski/skills | 14 |  |  |  |
| `everything-claude-code` | WorldFlowAI/everything-claude-code | 11 | 15 | 9 | hooks |
| `feiskyer-settings` | feiskyer/claude-code-settings | 12 |  | 9 | MCP |
| `firecrawl` | firecrawl/firecrawl-mcp-server/plugins/claude/firecrawl-search | 3 |  |  | MCP |
| `google-maps-scraper` | Mahanaicoach/google-maps-scraper-kit | 1 | 4 |  |  |
| `google-skills` | google/skills | 150 |  |  |  |
| `headroom` | chopratejas/headroom/plugins/headroom-agent-hooks |  |  |  | hooks |
| `higgsfield` | higgsfield-ai/skills | 8 |  |  |  |
| `humanizer` | blader/humanizer | 1 |  |  |  |
| `hyperframes` | heygen-com/hyperframes | 21 |  | 3 |  |
| `impeccable` | pbakaus/impeccable/plugin | 1 |  | 4 | hooks |
| `last30days` | mvanhorn/last30days-skill | 1 |  |  |  |
| `marketing-skills` | coreyhaines31/marketingskills | 50 |  |  |  |
| `mem` | thedotmack/claude-mem/plugin | 22 |  |  | hooks, MCP |
| `n8n-mcp-skills` | czlonkowski/n8n-skills | 15 |  |  | hooks |
| `nanobanana-skill` | feiskyer/claude-code-settings/plugins/nanobanana-skill |  |  |  |  |
| `obsidian` | kepano/obsidian-skills | 6 |  |  |  |
| `obsidian-mind` | breferrari/obsidian-mind | 8 | 20 | 10 | MCP |
| `openviking` | volcengine/OpenViking/agent-plugins | 5 |  |  |  |
| `openviking-memory` | volcengine/OpenViking/examples/claude-code-memory-plugin | 4 | 1 |  | hooks, MCP |
| `peers` | louislva/claude-peers-mcp |  |  |  | MCP |
| `perplexity` | perplexityai/modelcontextprotocol |  |  |  |  |
| `strix` | usestrix/strix | 9 |  |  |  |
| `superpowers` | obra/superpowers | 15 |  |  | hooks |
| `task-observer` | rebelytics/one-skill-to-rule-them-all | 1 |  |  |  |
| `taste-skill` | Leonxlnx/taste-skill | 13 |  |  |  |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | 7 |  |  |  |
| `watch` | bradautomates/claude-video | 1 |  |  | hooks |
| `watermarks-remover` | guillaumemeyer/watermarks-remover | 2 |  |  | hooks |
| `wshobson-commands` | wshobson/commands |  | 57 |  |  |
| `youtube-transcribe-skill` | feiskyer/claude-code-settings/plugins/youtube-transcribe-skill |  |  |  |  |

### Skills avulsas e comandos (12)

| Item | Origem | Skills | Cmds | Agentes | Extras |
|---|---|---:|---:|---:|---|
| `agent-reach` | Panniantong__Agent-Reach/agent_reach/skill | 1 |  |  |  |
| `council` | central-material.vercel.app (council) | 1 |  |  |  |
| `design-motion-principles` | kylezantos__design-motion-principles/. | 1 |  |  |  |
| `find-skills` | vercel-labs__skills/skills/find-skills | 1 |  |  |  |
| `graphify` | Graphify-Labs/graphify (graphify install) | 1 |  |  |  |
| `karpathy-llm-wiki` | Astro-Han__karpathy-llm-wiki/. | 1 |  |  |  |
| `prompt-master` | nidhinjs__prompt-master/. | 1 |  |  |  |
| `scrapling` | D4Vinci__Scrapling/agent-skill/Scrapling-Skill | 1 |  |  |  |
| `skillsmith` | ChristopherKahler/skillsmith |  |  |  |  |
| `sol-advisor` | DannyMac180__sol-advisor/. | 1 |  |  |  |
| `voicestudio` | debpalash__VoiceStudio/skills/voicestudio | 1 |  |  |  |
| `wangp-agent` | deepbeepmeep__Wan2GP/wangp-agent | 1 |  |  |  |
