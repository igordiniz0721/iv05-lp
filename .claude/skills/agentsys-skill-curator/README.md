# skill-curator

Production-grade guidance for writing, reviewing, and maintaining high-quality `SKILL.md` files across the entire agent ecosystem.

This plugin provides the canonical reference for creating skills that activate reliably in Claude Code, Cursor, Codex, OpenCode, Kiro, Gemini CLI, and other tools that support the Agent Skills standard.

## What it does

- Teaches current skill design: short trigger descriptions tested with trigger evals, bodies that carry only what the agent would otherwise get wrong, constraints with reasons, progressive disclosure into `references/`, scripts for deterministic work
- Helps you write new skills from scratch
- Reviews and improves existing skills with specific, actionable feedback
- Ensures compatibility with `agnix` linting and the broader agentsys ecosystem

## Installation

```bash
agentsys install skill-curator
```

Or clone this repository and link it into your skills directory.

## Usage

```bash
/skill-curator "create a skill for reviewing background job implementations"
```

```bash
/skill-curator --improve path/to/existing/SKILL.md --category review
```

## Philosophy

Good skills are:
- **Triggerable**: the description says when to use the skill, and a trigger eval confirms it
- **Lean**: they carry what the agent lacks and leave out what it knows
- **Explained**: constraints come with reasons, so the agent handles cases the rule did not foresee
- **Cross-tool**: they follow the Agent Skills spec and say what to do when a tool is missing
- **Maintainable**: they pass `agnix` and avoid version pins and prompting tricks that rot with the next model

## Related Plugins

- `system-prompt-curator`: system prompts and agent identity
- `enhance`: improving existing plugins, agents and prompts
- `agnix`: the linter that validates your skills

## Contributing

See `CONTRIBUTING.md` and the skill itself for the expected structure and quality bar.

## License

MIT
