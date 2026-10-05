#!/usr/bin/env bash
# Installs the command-line tools that the vendored skills, plugins and MCP
# servers in this repo call (see docs/central-material/README.md).
# Idempotent and best-effort: each step is skipped when already present and a
# failing step never stops the others.
#
#   scripts/install-tools.sh           # tools used by skills/MCP servers
#   scripts/install-tools.sh --extras  # also heavier optional tools
set -u

export PATH="$HOME/.local/bin:$HOME/.bun/bin:$PATH"
EXTRAS=0
[ "${1:-}" = "--extras" ] && EXTRAS=1

log() { printf '[install-tools] %s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }
step() {
  local name="$1"; shift
  log "→ $name"
  "$@" || log "✗ $name failed (continuing)"
}

# Runtimes ────────────────────────────────────────────────────────────────
have bun || step "bun" bash -c 'curl -fsSL https://bun.sh/install | bash'
have uv || step "uv" bash -c 'curl -LsSf https://astral.sh/uv/install.sh | sh'
export PATH="$HOME/.local/bin:$HOME/.bun/bin:$PATH"

# gstack (Garry Tan) — lives in ~/.claude/skills/gstack by design ──────────
if [ ! -d "$HOME/.claude/skills/gstack/bin" ]; then
  step "gstack" bash -c '
    git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git "$HOME/.claude/skills/gstack" &&
    cd "$HOME/.claude/skills/gstack" && ./setup --host claude --no-prefix --no-team </dev/null'
fi

# Python CLIs (isolated with uv tool) ─────────────────────────────────────
uv_tool() { have "$1" || step "$2" uv tool install "$2"; }
uv_tool graphify graphifyy                 # graphify skill
uv_tool scrapling "scrapling[fetchers]"    # scrapling skill + MCP server
uv_tool yt-dlp yt-dlp                      # watch (claude-video) skill
uv_tool notebooklm notebooklm-py           # máquina de pesquisa NotebookLM
if have scrapling && [ ! -f "$HOME/.cache/.scrapling-browsers" ]; then
  step "scrapling browsers" bash -c 'scrapling install && touch "$HOME/.cache/.scrapling-browsers"'
fi

# Native MCP servers / agents ─────────────────────────────────────────────
have codebase-memory-mcp || step "codebase-memory-mcp" bash -c \
  'curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash'
have strix || step "strix" bash -c 'curl -sSL https://strix.ai/install | bash'
have strix || step "strix (pip)" uv tool install strix-agent

# claude-peers MCP dependencies
PEERS="$(cd "$(dirname "$0")/.." && pwd)/.claude/skills/peers"
if [ -f "$PEERS/package.json" ] && [ ! -d "$PEERS/node_modules" ] && have bun; then
  step "claude-peers deps" bash -c "cd '$PEERS' && bun install --silent"
fi

# Optional, heavier tools ─────────────────────────────────────────────────
if [ "$EXTRAS" = 1 ]; then
  have codex || step "codex CLI" npm install -g @openai/codex
  have headroom || step "headroom" uv tool install "headroom-ai[all]"
  step "scrapegraphai" uv pip install --system scrapegraphai
  have hermes || step "hermes agent" bash -c 'curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash'
fi

log "done"
