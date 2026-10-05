# Changelog

## 1.1.0

- Rewrote the guidance for current models and the Agent Skills spec. The skill now teaches short intent-based trigger descriptions, bodies that carry only what the agent lacks, constraints with reasons, specificity matched to fragility, scripts for deterministic work, and progressive disclosure.
- Removed dated advice: mandatory `Skip unless:` gates on every pattern, a fixed section order ending in "Do NOT" lists, "at least one full trajectory" examples, and an unsourced claim that models ignore content past 250 lines.
- Corrected spec facts: descriptions may be up to 1,024 characters (the skill said 512), names are up to 64 characters and must match the directory (it said "3-8 words"), and `allowed-tools` is an experimental space-separated field.
- Added `references/trigger-evals.md` (how to test and tune triggering) and `references/patterns.md` (patterns that pay off, what to remove from older skills).
- The command no longer asks for a fixed number of clarifying questions, and writes files only when asked or confirmed.

## 1.0.1

- Added cross-version CI and stronger contract tests for packaging, manifests, skill routing, command behavior, docs, and agnix action wiring.

## 1.0.0

- Initial release of the generic `skill-curator` skill.
- Converted from the valkey-specific reviewer curator into a cross-tool skill design guide.
- Covers frontmatter standards, trigger phrase quality, router pattern, "Skip unless" gates, length budgets, and common failure modes.
- Works with Claude Code, Cursor, Codex, OpenCode, Kiro, and other Agent Skills compatible tools.
