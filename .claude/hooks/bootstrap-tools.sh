#!/usr/bin/env bash
# SessionStart, cloud sessions only: install the CLIs the vendored skills and
# MCP servers need, in the background so the session starts immediately.
# Log: ~/.cache/install-tools.log. On your own machine run
# scripts/install-tools.sh once instead.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
mkdir -p "$HOME/.cache"
nohup bash "$CLAUDE_PROJECT_DIR/scripts/install-tools.sh" \
  >"$HOME/.cache/install-tools.log" 2>&1 </dev/null &
exit 0
