# Global agent rules (shared by all coding agents)

Source of truth: ~/.agents/AGENTS.md. Skills live in ~/.agents/skills. Install with `npx skills add <repo> -g -a <agent> -a codex -s <skill>` (two agents = one shared copy + symlinks).

## Workflow
- Non-trivial work: clarify requirements first (grill-me / brainstorming), write a plan, get approval, then build.
- Prefer TDD for logic; verify before claiming done (run tests, build, or open the page).
- Use a git worktree per feature when working in parallel.
- Keep changes minimal (YAGNI). No speculative abstractions.

## Tools
- Library or API questions: use Context7 for current docs instead of guessing.
- UI work: verify visually with agent-browser (screenshot, fix, repeat), then run an Impeccable critique.
- Code navigation: if the Serena MCP is connected, prefer its symbol tools over reading whole files. Enable per repo with `serena-here`.
- GitHub: use the `gh` CLI.

## Design
- Follow the project's DESIGN.md when present. Otherwise establish a design system first (ui-ux-pro-max) and avoid generic AI aesthetics (frontend-design).

<!-- Add your own stack-specific rules below (cloud CLI preferences, commit conventions, etc.). Keep this file under ~30 lines. -->
