# Agentic Dev Stack

**One prompt that sets up a curated, deduplicated agentic-development stack for any coding agent.** It works with Claude Code, Codex, Cursor, OpenCode, Gemini CLI, Command Code and Pi.

```text
Read https://raw.githubusercontent.com/prayushkale/agentic-dev-stack/main/SETUP_PROMPT.md and follow it.
```

Paste that into your agent. It inspects your machine, interviews you, installs one tool per layer, reads every hook before running it, verifies everything in fresh sessions, and leaves you a runbook.

---

## Why I made this

By October 2026 my "repos to try" list for agentic development had about 120 entries: superpowers, ECC, Matt Pocock's skills, gstack, claude-mem, rtk, caveman, Serena, Context7, a dozen design skills, routers, monitors, security packs. Most of them do the same job as another one on the list.

The most common mistake people report is **stacking tools that fight each other**, like two workflow harnesses that each want to own planning. So instead of installing everything, I set up **one tool per layer** across both agents I use (Claude Code and Command Code), tested each piece, and turned the process into a prompt anyone can run.

## The stack

| Layer | Pick | Why |
|---|---|---|
| Workflow harness | [obra/superpowers](https://github.com/obra/superpowers) | Brainstorm → plan → worktree → TDD → review. It makes the agent surface gaps *before* writing code. |
| Planning add-ons | [mattpocock/skills](https://github.com/mattpocock/skills): `grill-me`, `handoff`, `triage`, architecture review | Short skills that don't overlap the harness |
| Design | Anthropic `frontend-design` + [Impeccable](https://github.com/pbakaus/impeccable) + [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) + Vercel design rules + [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | Taste + critique + a real design system = no "AI slop" UI |
| Browser check | [agent-browser](https://github.com/vercel-labs/agent-browser) | The agent screenshots and fixes its own UI. It's a CLI, so there are no MCP schema tokens |
| Live docs | [Context7](https://github.com/upstash/context7) | Version-correct library docs, so no invented APIs |
| Code navigation | [Serena](https://github.com/oraios/serena), per repo | Symbol-level navigation instead of reading whole files |
| Tokens | [rtk](https://github.com/rtk-ai/rtk) + caveman (on demand) + built-in model routing | Compresses shell output going in and terse replies on demand. Opus plans, Sonnet builds, Haiku explores |
| Monitoring | [ccusage](https://github.com/ryoppippi/ccusage) | Cost per session, day and 5-hour block, plus a free status line |
| Security | [trailofbits/skills](https://github.com/trailofbits/skills): supply-chain audit, differential review, dimensional analysis | Catches vulnerable dependencies, risky diffs and unit or decimal bugs in money maths |
| Memory | Built-in + `/handoff` | Memory plugins summarise every tool call with an LLM; I measured the trade-off and skipped them |

Deliberately left out: second harnesses (ECC, gstack, BMAD), swarm orchestrators, overlapping token tools, GitHub MCP (the `gh` CLI is cheaper), and always-on personal agents. The prompt explains each decision so your agent doesn't relitigate it.

## What I learned setting it up

These are the parts no README tells you, and they're all baked into the prompt.

- **My existing setup was quietly broken.** I had 15 broken skill symlinks and 4 duplicate skills shadowing each other, and one skill was missing from both agents. Clean up before adding anything.
- **`npx skills add` with a single `-a agent` copies instead of sharing.** Pass two agents and you get one canonical copy in `~/.agents/skills` plus symlinks.
- **Plugin-only paths break when a skill is shared.** Several popular skills reference `${CLAUDE_PLUGIN_ROOT}` or `{baseDir}`, or a namespaced subagent that only exists in the plugin install. They look installed but fail at runtime.
- **"No telemetry" in the docs isn't always true.** One popular plugin's SECURITY.md says it collects no telemetry, while its code sends usage events by default. Read the code.
- **Some routers want your subscription login.** Mixing subscription and cheap models in one session meant importing an OAuth token into a third-party proxy. I used built-in routing instead (`opusplan` plus a Haiku Explore agent).
- **Hooks can be ported.** Agents without plugin support can often run a superpowers-style session hook or an rtk rewrite as a tiny mod. Examples are in [`examples/`](examples/).
- **Headless tests lie.** My "harness isn't working" test failed only because headless mode hides the ask-the-user tool that brainstorming needs. Enable all tools before concluding something is broken.
- **Measure context.** After everything was installed, Claude Code starts at about 16.5k tokens (2% of the window). Agents that load MCP schemas eagerly start higher, so keep global MCPs few.

## Quick start

1. Open your coding agent in any folder.
2. Paste: `Read https://raw.githubusercontent.com/prayushkale/agentic-dev-stack/main/SETUP_PROMPT.md and follow it.` (or paste the file itself).
3. Answer the interview: harness, work types, design ambition, token appetite.
4. Approve each step. It backs up your configs first and stops after every step.
5. Restart your agent and read `~/.agents/SETUP.md`, your personal runbook with manual to-dos, per-repo commands and update steps.

## Daily workflow

1. **Describe the feature and let the harness lead:** questions → plan you approve → TDD → review. Use `/grill-me` for fuzzy ideas.
2. **UI work:** DESIGN.md → build → agent-browser screenshots → `/impeccable critique` → fix.
3. **Big repo:** run `serena-here` once.
4. **Money or unit maths:** dimensional-analysis. Risky diffs: differential-review. Dependencies: a monthly supply-chain audit.
5. **Context hygiene:** one task per session, `/handoff` before switching, `/compact` around 60%, `/caveman` in long debug loops.
6. **Cost:** check `ccusage weekly` against your baseline.
7. **Add a tool only when it fixes a problem you hit this week.**

## Repo contents

- [`SETUP_PROMPT.md`](SETUP_PROMPT.md): the full agent-agnostic setup prompt.
- [`templates/AGENTS.md`](templates/AGENTS.md): a lean shared rules file for all agents.
- [`examples/command-code/`](examples/command-code/): mods porting the superpowers session hook and rtk rewriting to an agent without native plugin support.
- [`examples/serena-here`](examples/serena-here): enable Serena for the current repo in multiple agents with one command.

## Notes

- The ecosystem changes weekly. The prompt tells your agent to check each repo is active and to take install commands from its current README rather than from this file.
- Nothing here is affiliated with the tools listed; all credit goes to their authors.
- PRs welcome, especially per-agent quirks and hook ports for more agents.

MIT licensed.
