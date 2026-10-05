---
description: Curate or improve a SKILL.md file following ecosystem best practices
argument-hint: "[purpose or --improve path] [--category implementation|review|research|analysis|orchestration]"
allowed-tools: Read, Write, Bash(agnix:*)
---

# /skill-curator

Create a new `SKILL.md` or improve an existing one, following the guidance in `skills/skill-curator/SKILL.md` (load the `skill-curator` skill, or read that file from the plugin root).

`$ARGUMENTS` is the skill's purpose, or `--improve <path>` with an optional `--category`. With `--improve`, read the skill and its reference files first. Ask the user a question only when the purpose is too ambiguous to write a useful description; otherwise state your assumption and proceed.

Write the files only when the user asked for them to be written or confirms the location. Otherwise present them, since a skill file changes how the user's agent behaves in every future session.

## Output

Always output the final skill in a clean markdown code block, followed by:

- a short critique of the previous version, when improving;
- recommended `allowed-tools` and a token estimate;
- realistic trigger-test prompts, including near-misses that should not trigger it;
- the `agnix` result, when agnix is installed.
