---
name: skill-curator
description: Use when the user wants to create, improve or review a SKILL.md file (Agent Skills format) for any agent tool, including tuning when a skill triggers.
version: 1.1.0
argument-hint: "[skill-purpose or --improve path/to/SKILL.md] [--category implementation|review|research|orchestration|analysis] [--minimal]"
---

# Skill Curator

Write or improve a `SKILL.md` so it triggers on the right requests and gives the agent what it would otherwise get wrong. Skills follow the Agent Skills format (agentskills.io), which Claude Code, Codex, OpenCode, Cursor, Gemini CLI, Kiro and others load.

## Arguments

`$ARGUMENTS` holds the purpose of a new skill, or `--improve <path>` to rework an existing one. `--category implementation|review|research|orchestration|analysis` names the kind of work the skill guides, which shapes its body (a review skill lists what to look for; an implementation skill gives procedures and gotchas). `--minimal` means the smallest skill that does the job, with no optional sections.

## What a skill is for

The agent reads every skill's `name` and `description` at startup and loads the body only when a task matches. So the description decides whether the skill is ever used, and the body competes for attention with everything else in context once it is. A good skill carries what only its author knows: project conventions, domain procedures, non-obvious edge cases, the exact tools or commands to use, and the reasons behind its constraints. It leaves out what a current model already does well, such as explaining what HTTP is, telling it to be thorough, or scripting steps it would plan on its own.

Ask of every line: would the agent get this wrong without it? If not, cut it. If you are unsure, test it.

## Frontmatter

Required by the spec:

- `name`: 1-64 characters, lowercase letters, digits and single hyphens, no leading or trailing hyphen, and it must match the skill's directory name.
- `description`: 1-1024 characters, saying what the skill does and when to use it.

Optional in the spec: `license`, `compatibility` (environment needs, up to 500 characters, rarely needed), `metadata` (string map), `allowed-tools` (space-separated pre-approved tools; experimental, support varies). Clients add their own fields, such as `argument-hint` or `disable-model-invocation` in Claude Code; use them when the target tool supports them and expect other tools to ignore them.

## The description

The description does routing, not teaching. Write it as an instruction about when to act ("Use when..."), phrased in terms of what the user is trying to do rather than how the skill works. Name the situations it covers, including the ones where the user does not name the domain, and state the boundary with neighboring skills when requests could be confused. One to three sentences is usually enough; a list of near-synonym trigger phrases costs tokens in every session and generalizes worse than naming the category of intent.

Skills tend to under-trigger, so a description may lean assertive about when it applies. Tune that against a trigger eval rather than by adding emphasis: see `references/trigger-evals.md`.

## The body

There is no required format. What works for current models:

- The goal and what done looks like, so the agent can plan its own route.
- Constraints with their reasons. A reason lets the agent handle the cases the rule did not foresee; a bare MUST or NEVER gets over-applied.
- Specificity matched to fragility. Where many approaches are fine, describe the outcome. Where exactly one sequence is safe (a migration, a release, a destructive command), give the exact commands and say not to vary them.
- A default, with an escape hatch, instead of a menu of equal options.
- Gotchas: concrete facts that defy reasonable assumptions ("the `users` table soft-deletes; filter on `deleted_at`").
- An output template when the output format matters to a reader or a parser.
- Scripts for deterministic work (parsing, validation, arithmetic). Code gives the same answer every time; prose asks the model to re-derive it.

Keep `SKILL.md` under about 500 lines and 5,000 tokens. Move detailed reference material into `references/` and say when to read each file ("read `references/api-errors.md` when the API returns a non-200"), one level deep. See `references/patterns.md` for worked guidance on these patterns and on what to remove from older skills.

## Cross-tool use

Keep the body usable where a tool is missing. If the skill relies on a subagent, a question tool or web search, say what to do without it (do the work in-session, ask in plain text, work from local docs and say what could not be checked). Refer to plugin files by paths relative to the skill or plugin root. Where a client-specific field or tool name is needed, keep it in the frontmatter or clearly marked.

## Improving an existing skill

Read it and its references, then look for:

- A description that is vague, enumerates phrases, or describes mechanics instead of intent.
- Dated prompting: all-caps MUST/NEVER/CRITICAL stacks, "think step by step", fixed step scripts for judgment work, repeated restatements, verification nudges after every step, long worked examples the model will copy, history of past incidents, hardcoded model names or dates.
- Arithmetic or parsing written as prose that should be a script.
- Claims about tools, versions or APIs that are no longer true. Check them.
- Content the agent already knows.

Keep real safety constraints (once, with the reason), command names, arguments and any output format something parses.

## Validate

Run `agnix <skill dir>` when agnix is installed and fix errors. Warnings about client-specific fields are expected when the skill targets one client. `skills-ref validate <skill dir>` from the Agent Skills project checks the frontmatter against the spec.

## Output

- The complete `SKILL.md` in one markdown code block, plus any reference files it points to.
- When improving: a short critique of the old version, naming what was removed and why.
- `allowed-tools` to declare, if any, and a token estimate for the body.
- Trigger-test prompts: several that should trigger it and a few near-misses that should not.

## Done

The skill passes the spec's frontmatter rules, its description says when to use it in a few sentences, its body carries only what the agent would otherwise miss, and the user has test prompts to check triggering.
