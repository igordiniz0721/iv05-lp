# CLAUDE.md — skill-curator

Follow the Karpathy Guidelines (simplicity, surgical changes, clear success criteria) when editing this plugin.

This skill is the authoritative reference for writing SKILL.md files. Any guidance here must also be reflected in `skills/skill-curator/SKILL.md`.

## Key Constraints

- Keep the main skill file as the best single source of truth.
- Prefer cross-tool features and clearly gate any tool-specific behavior.
- Guidance matches current practice (agentskills.io spec and best practices): goal, constraints with reasons, done criteria, short trigger descriptions. No advice to add emphasis, chain-of-thought prompts or XML tags the model has to emit.
- Keep the core skill reasonably short; move deep examples into reference files if needed.

## Testing

Before considering changes complete:
- Run `agnix` on the skill (zero errors)
- Verify it activates on realistic prompts in Claude Code and at least one other tool (Cursor or Codex recommended)
