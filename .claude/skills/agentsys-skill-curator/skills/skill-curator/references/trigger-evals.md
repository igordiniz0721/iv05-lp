# Trigger evals

Read this when a skill fires on the wrong requests, misses the right ones, or its description is about to be rewritten.

The description is the only thing the agent sees before deciding to load a skill, so test it with prompts rather than by rereading it. Agents also skip skills for tasks they can do alone ("read this file"), so test with tasks where the skill's knowledge would actually help.

## Build the query set

About 20 realistic prompts, labeled:

```json
[
  {"query": "the nightly import job keeps retrying forever, can you look at worker.ts", "should_trigger": true},
  {"query": "rename this variable across the repo", "should_trigger": false}
]
```

- Should-trigger: vary phrasing (casual, typos, terse, long with file paths and backstory), and include prompts that describe the need without naming the domain. Those are where wording matters.
- Should-not-trigger: near-misses that share keywords but need something else. Unrelated prompts test nothing.

## Run it

Run each query about three times, since triggering is not deterministic, and count how often the skill loaded. In Claude Code, `claude -p "<query>" --output-format json` shows `Skill` tool calls; other clients have their own logs. A should-trigger query passes above a 0.5 trigger rate, a should-not-trigger query below it.

## Improve without overfitting

Split the set about 60/40 into train and validation, and keep the split fixed. Change the description only from train failures:

- Misses: the scope is too narrow; describe the broader intent the missed prompts share.
- False triggers: the scope is too broad; say what the skill does not cover and where that work belongs.
- Do not paste words from failed queries into the description. Name the category they belong to.
- If several rounds stall, try a structurally different description instead of another tweak.

Keep the version with the best validation pass rate, which is not always the last one. Watch the length: the spec caps descriptions at 1,024 characters, and Claude Code truncates the listing text at 1,536 characters including `when_to_use`.

Source: agentskills.io, "Optimizing skill descriptions".
