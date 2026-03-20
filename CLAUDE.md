# gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills:
- `/office-hours` — brainstorm ideas (YC office hours style)
- `/plan-ceo-review` — strategy review, scope expansion
- `/plan-eng-review` — architecture review, lock in execution plan
- `/plan-design-review` — designer's eye plan review
- `/design-consultation` — create a full design system + DESIGN.md
- `/review` — pre-landing PR code review
- `/ship` — ship workflow: tests, changelog, PR
- `/browse` — headless browser for testing and dogfooding
- `/qa` — QA test and fix bugs iteratively
- `/qa-only` — QA report only, no fixes
- `/design-review` — visual design audit and polish
- `/setup-browser-cookies` — import cookies from real browser
- `/retro` — weekly engineering retrospective
- `/investigate` — systematic debugging with root cause analysis
- `/document-release` — post-ship documentation update
- `/codex` — adversarial code review / second opinion
- `/careful` — safety guardrails for destructive commands
- `/freeze` — restrict edits to a specific directory
- `/guard` — full safety mode (careful + freeze)
- `/unfreeze` — remove freeze restrictions
- `/gstack-upgrade` — upgrade gstack to latest version

## Setup

Teammates need gstack installed locally:

```bash
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```
