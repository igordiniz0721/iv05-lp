# Patterns and cleanup

Read this when writing a skill body, or when improving a skill written for older models.

## Patterns that pay off

- **Gotchas.** The highest-value lines in many skills: facts the agent would get wrong by assumption. "The staging DB is read-only; migrations run from CI only." Collect them from real sessions and review comments.
- **Defaults.** "Use pdfplumber; for scanned PDFs use pdf2image with pytesseract" beats a list of five libraries.
- **Exact commands for fragile steps.** "Run exactly `scripts/migrate.py --verify --backup`" where improvising is dangerous. Everywhere else, outcomes and constraints.
- **Scripts in `scripts/`.** Validation, parsing, counting, formatting and anything with a formula. Document inputs, outputs and exit codes, and have the skill say when to run each one.
- **Output templates.** When a human or a parser reads the output, show its shape once, labeled as a template.
- **Conditional references.** "Read `references/errors.md` when the API returns a non-200." Keep each reference focused, one level deep.
- **Review skills.** List what to look for and the evidence that makes a finding real, so the skill does not fire noise on every diff. A concrete gate per check ("only when the diff touches `retry` logic") works better than a general instruction to be careful.

## What to remove from older skills

These were written for weaker models and now make current ones worse:

- Stacks of MUST, NEVER, CRITICAL, IMPORTANT and threats. Current models follow instructions closely, so shouting makes them rigid and over-apply the rule. State the one or two real constraints plainly with the reason.
- "Think step by step", scratchpad tags, "plan before acting". Current models plan and reason natively; the prose adds nothing or causes over-planning.
- Numbered step scripts for judgment work. The model's own plan is usually better. Keep numbered steps only where order is load-bearing.
- A check or "verify" instruction after every step, and progress-report cadences.
- Long worked examples. Models copy their length, tone and structure. Keep a short example only where the format itself matters.
- Restating the same rule in several sections. Say it once, where it applies.
- Incident history, PR numbers, dates and "now/no longer" phrasing. State the current rule.
- Hardcoded model names, version numbers and API claims with no way to check them. They rot; verify or remove.
- Instructions to emulate code: "compute this score", "parse this JSON with this regex". Put it in a script.
- Anything the agent already knows.

## Keep

- Context only the author has: audience, environment, conventions, the quality bar.
- Real safety constraints, each once with its reason.
- Command names, arguments and output formats that other tools or people depend on.

Sources: agentskills.io specification and "Best practices for skill creators".
