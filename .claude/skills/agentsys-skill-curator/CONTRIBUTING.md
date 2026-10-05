# Contributing to skill-curator

This plugin maintains the quality bar for skills across the entire agent-sh ecosystem.

## Before Submitting Changes

1. The `skills/skill-curator/SKILL.md` file **is** the product. Changes to guidance must be reflected there.
2. Run `agnix` on the skill file; it must pass cleanly.
3. Test that the skill activates correctly in at least two different agent runtimes (Claude Code + Cursor or Codex recommended).
4. Update the version in the skill frontmatter and in `package.json`.

## Style

- Keep the main skill reasonably concise. Use the router + reference pattern for deeper material.
- All examples should be realistic and tool-agnostic where possible.
- Guidance follows the Agent Skills spec and current best practice. Check version-specific claims against the source before changing them.

## Related Projects

- `system-prompt-curator`
- `agnix` (the validator)
- `enhance`
- `agentsys`

See the main `agentsys` repository for how plugins are published and discovered.
