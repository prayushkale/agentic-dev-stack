# Agentic Dev Stack: setup prompt

> Paste this whole file into your coding agent (Claude Code, Codex CLI, Cursor, OpenCode, Gemini CLI, Command Code, Pi, Copilot CLI…), or tell it:
> **"Read https://raw.githubusercontent.com/prayushkale/agentic-dev-stack/main/SETUP_PROMPT.md and follow it."**
> The agent will interview you, install one tool per layer, and verify everything. It stops after every step and asks before continuing.

---

## Your role

You are setting up a curated, **deduplicated** agentic-development stack on this machine, for every coding agent the user uses. Optimise for reliability, design quality and token efficiency. Do not maximise the number of tools: **one tool per layer; never stack two workflow harnesses.**

Ground rules (non-negotiable):

1. **Plan first, then confirm.** Do discovery and the interview, present the plan, and get approval before installing anything.
2. **One step at a time.** After each step, report what changed, how you verified it, and what's next, then wait for "continue".
3. **Back up first.** Copy every config file you will touch to `~/agent-setup-backup-<date>/` before changing it.
4. **Verify before trusting.** For each repo: confirm it exists, isn't archived, and was pushed to in roughly the last 60 days. Get the *current* install command from its README. This prompt may be out of date; the README wins.
5. **Read before running.** Clone into a scratch directory and read every hook, script and installer it adds. Report network endpoints, shell execution, telemetry defaults and anything that touches credentials. Never run an install script you haven't read.
6. **Secrets.** Never write API keys into files. Read them from environment variables. Never import a subscription or OAuth login token into a third-party proxy or router; it can violate the provider's terms and get the account flagged. If a tool needs that, tell the user and offer an alternative.
7. **Telemetry and accounts.** If a tool has telemetry on by default, or defaults to a hosted or paid service, say so and ask before proceeding (and give the opt-out).
8. **No duplicates.** Before installing a skill, check whether the agent already bundles one with the same purpose or name. Check plugin installs against shared-folder installs (the same skill loaded twice wastes context and confuses selection).
9. **Report honestly.** If a test fails, show the output. If you skipped something, say so. Distinguish "installed" from "verified working".

---

## Phase 0: Discovery (read-only)

Find out, and summarise in a table:

- **Agents installed:** check for `claude`, `codex`, `cursor-agent`, `opencode`, `gemini`, `cmd`/`commandcode`, `pi`, `copilot`, `droid`, `hermes`, `amp`, `goose`, `kilo` and others. Record versions.
- **For each agent:** global skills folder, MCP config location and CLI (`<agent> mcp add`?), whether it supports **plugins**, **hooks** (pre-tool, session-start), or an extension/mod API, and the global instructions file (CLAUDE.md, AGENTS.md, GEMINI.md…).
- **Existing setup:** installed skills (look for broken symlinks and duplicate names across folders), MCP servers, hooks, plugins, global instruction files. Check whether `~/.agents/skills` already exists; it's the cross-agent standard folder.
- **Runtimes:** node/npx (version), python3 (version, since many skill scripts need 3.11+), uv, cargo, docker, git, gh (and whether it's authenticated), brew.
- **Already present tools:** rtk, ccusage, agent-browser, serena, etc. Find out *which* agent a tool is actually wired into; don't assume.
- **Current usage baseline:** run `npx ccusage@latest daily` (covers Claude Code, Codex, OpenCode, Pi, Gemini and others) and `rtk gain` if rtk exists. Save the numbers for later comparison.

## Phase 1: Interview (ask, don't assume)

Ask, offering a recommended default for each:

1. **Workflow harness**, pick one:
   - `obra/superpowers` (recommended): brainstorm → plan → worktree → subagent TDD → review → finish.
   - `mattpocock/skills`: lighter, human-driven.
   - `garrytan/gstack`: solo-founder role skills.
   - `affaan-m/everything-claude-code` (ECC) core profile: heavy, all-in-one.
2. **Work types** (multi-select): web apps/dashboards, data/Python, Rust/systems, mobile, video/media, infra, other. This drives the design, data and security picks.
3. **Design ambition:** "functional" vs "distinctive, modern UI". The latter installs the full design layer.
4. **Token saving appetite:** minimal (measure only) / balanced (shell compression + on-demand terse mode + built-in model routing) / maximum.
5. **Memory:** built-in only (default) vs a memory plugin. Explain the cost: plugins like claude-mem summarise every tool call with an LLM.
6. **Shared vs separate setup:** one shared skills home for all agents (recommended) or per-agent copies.
7. **API keys they already have** (OpenRouter, Context7…). Only needed for optional pieces.

---

## Phase 2: The stack (one per layer)

Defaults are in **bold**. Alternatives are only for when the user prefers them.

| Layer | Default | Alternatives | Notes |
|---|---|---|---|
| Workflow harness | **obra/superpowers** | mattpocock/skills, gstack, ECC core, addyosmani/agent-skills | Exactly one. On Claude Code install it as a plugin (it has a session-start hook). Elsewhere, copy its `skills/` and port the hook (see Phase 3). |
| Planning add-ons | **mattpocock/skills**: `grill-me`, `handoff`, `triage`, `improve-codebase-architecture` + their deps `codebase-design`, `setup-matt-pocock-skills` | — | Skip his `tdd` and planning skills when superpowers is installed (they overlap). |
| Skill installer | **vercel-labs/skills** (`npx skills`) + `find-skills` | — | See the gotcha in Phase 3. |
| Design: taste | **anthropics/skills → frontend-design** | — | Steers away from template UI. |
| Design: critique | **pbakaus/impeccable** | — | `/impeccable critique`, audit, polish. |
| Design: system data | **nextlevelbuilder/ui-ux-pro-max-skill → ui-ux-pro-max only** | — | Local DB of styles, palettes and font pairings. Skip its `design`/`brand`/`slides` extras if the agent has a built-in design command. |
| Design: rules | **vercel-labs/agent-skills → web-design-guidelines, vercel-react-best-practices** | — | React rules only if they use React. |
| Design: reference | **VoltAgent/awesome-design-md** (per project, not installed) | — | Copy a real product's DESIGN.md into a repo; lint with `npx @google/design.md lint DESIGN.md`. |
| Browser verification | **vercel-labs/agent-browser** (CLI + skill) | Playwright MCP, browser-use | Prefer a CLI over an MCP (no schema tokens). Some agents bundle it already. |
| Live docs | **Context7 MCP** (`https://mcp.context7.com/mcp`) | Context7 CLI + skill mode | User scope in every agent. A key is optional and only raises rate limits. |
| Code navigation | **oraios/serena** (`uv tool install -p 3.13 serena-agent`) | graphify, claude-context | **Per project only.** Install it per the README (not from marketplaces); use the agent-specific `--context`. |
| Memory | **Built-in** (Claude auto-memory, agent `/memory`) + `/handoff` | thedotmack/claude-mem | If claude-mem: set `DO_NOT_TRACK=1`, choose the provider explicitly, and don't use the hosted default without consent. |
| Shell-output tokens | **rtk-ai/rtk** | — | Hook via `rtk init -g --hook-only` where supported; otherwise a pre-tool mod (Phase 3). |
| Model-output tokens | **caveman (core skill only)** | — | On demand (`/caveman`). The repo has grown into a platform; install just the `caveman` skill. |
| Model routing | **Built-in first**: Claude Code `opusplan` + an Explore override on Haiku; other agents' per-task model settings | musistudio/claude-code-router | Never route a subscription login through a proxy. A router is fine as a separate "cheap mode" launcher with an API key. |
| Usage monitoring | **ryoppippi/ccusage** (global install) | Claude-Code-Usage-Monitor, codeburn | `ccusage statusline` gives a free Claude Code status line. |
| Security | **trailofbits/skills → supply-chain-risk-auditor, differential-review**, plus `dimensional-analysis` for money or unit maths, `rust-review` for unsafe Rust | — | Pick 2–4 by work type; the repo has around 95 skills. |
| Spec-driven (optional) | Skip if superpowers is installed | Fission-AI/OpenSpec, github/spec-kit | OpenSpec is leaner for brownfield repos. |
| Parallel agents | **Built in** (worktrees, agent teams, superpowers subagents) | Conductor, claude-squad, cmux | Only add one if built-ins fall short. |

**Drop as duplicates or out of scope** unless the user insists:
- A second harness (ECC, gstack, BMAD, compound-engineering).
- Swarm orchestrators (ruflo) for solo work.
- Ponytail or other token tools that overlap rtk and caveman.
- mem0/Letta (these are for *building* agents).
- GitHub MCP when `gh` is authenticated.
- Huge uncurated skill bundles.
- Always-on personal agents (OpenClaw/Hermes). These are not coding add-ons and have had CVEs.

---

## Phase 3: Installation playbook

### Step 1: Shared skills home

- Make `~/.agents/skills/` the canonical folder. Agents that read it natively (Command Code, Codex, Cline and others) need nothing more. For agents that don't (e.g. Claude Code reads `~/.claude/skills/`), symlink each skill in.
- Clean up first: remove broken symlinks and resolve duplicate names (keep the newest real copy). Move real per-agent skills into the shared home.
- Create a short **`~/.agents/AGENTS.md`** (under about 30 lines; see `templates/AGENTS.md` in this repo). Wire it into each agent: CLAUDE.md can contain `@~/.agents/AGENTS.md`; others can symlink their global instructions file to it.

**Gotcha: `npx skills add` with a single `-a <agent>` *copies* into that agent's folder and skips the shared home.** Pass at least two agents so it stores one canonical copy in `~/.agents/skills` and symlinks it in, e.g.:

```bash
npx skills add <owner/repo> -g -y -a claude-code -a codex -s <skill>
```

(`codex`'s global skills folder *is* `~/.agents/skills`.) After every install, check where the files landed.

### Step 2: Harness

- **Claude Code:** `claude plugin marketplace add obra/superpowers-marketplace` then `claude plugin install superpowers@superpowers-marketplace --scope user`.
- **Agents with plugin or extension support:** use the official install from the superpowers README (Codex, Cursor, OpenCode, Gemini, Copilot CLI and others are supported).
- **Agents without native support:** copy `skills/` into that agent's *own* skills folder (not the shared one, if Claude Code also has the plugin, or Claude Code will load the skills twice). Then **port the session-start hook**: superpowers injects `skills/using-superpowers/SKILL.md` at session start. If the agent has a system-prompt hook (e.g. Command Code mods' `appendSystemPrompt`), read the file once at load and return it byte-stable, so it survives `/clear` and `/compact` and keeps prompt caching. See `examples/command-code/superpowers.ts`.
- Remove any existing planning skill that would compete (e.g. `planning-with-files`).

### Step 3: Design layer

Install the design picks into the shared home. Read the scripts first. Run each script once (e.g. `ui-ux-pro-max`'s `search.py`) to prove it works on the user's Python.

**Gotcha: plugin-only path variables.** Some skills reference `${CLAUDE_PLUGIN_ROOT}/…` or `{baseDir}`, which don't resolve when installed as a plain skill. Grep every installed `SKILL.md` for these. Replace them with `"$HOME/.agents/skills/<skill>/…"` (use `$HOME` inside double quotes; `~` doesn't expand there), and record the patch in the runbook.

### Step 4: MCP servers (keep few)

- Context7 at user scope in every agent. Test it with a real query (resolve "react" to a library ID).
- Serena per project only. Create a helper (`examples/serena-here`) that adds it for the current repo to every agent at local scope, with the right `--context` per agent (`claude-code` for Claude Code, `codex` for Codex, `ide` for generic agents). Test it in a scratch repo, then remove it.
- List every existing MCP server and its scope. Suggest moving rarely used global servers to project scope (agents that load all tool schemas eagerly pay for each one in every session).

### Step 5: Memory

Default to built-in memory. If the user wants a plugin, present the cost, telemetry and privacy trade-offs from your review first.

### Step 6: Tokens and routing

- **rtk:**
  - Claude Code: `rtk init -g --hook-only --auto-patch` (adds a `PreToolUse` Bash hook only). For other supported agents use `rtk init --agent <name>`.
  - Agents with a pre-tool mod API but no rtk support: write a thin mod that calls `rtk rewrite "<cmd>"` (exit 0 or 3 means use stdout, otherwise pass through) and fails open. See `examples/command-code/rtk.ts`.
  - Verify by checking that `rtk gain`'s command count increases after a real agent run.
- **caveman:** install the core skill only.
- **Routing:**
  - Claude Code: set `"model": "opusplan"`, and add `~/.claude/agents/Explore.md` with `model: haiku` and explicit read-only `tools`. This overrides only the built-in Explore. Don't use `CLAUDE_CODE_SUBAGENT_MODEL`; it would downgrade coding subagents too.
  - Other agents: inspect per-task model settings (compaction, titles and similar background tasks should go to a cheap model).
- After the hooks are wired, remove any "prefer rtk" style lines from AGENTS.md (they only cost context).

### Step 7: Monitoring and security

- `npm i -g ccusage`. For Claude Code, set the status line to `{"type":"command","command":"ccusage statusline -B emoji","padding":0}` and test it with sample JSON on stdin.
- Install the chosen Trail of Bits skills. **Gotchas:**
  - `supply-chain-risk-auditor` needs Python ≥3.11. Make its `uv run` calls use `--project "<skill>/scripts"` so uv picks the right interpreter.
  - `differential-review` delegates to a namespaced agent (`differential-review:adversarial-modeler`) that only exists in the Claude plugin install. Copy the agent's `.md` into the skill folder and change the text to "a general-purpose subagent briefed with adversarial-modeler.md".
- Offer to run the dependency audit on one of the user's real repos as a smoke test, and report the findings.

### Step 8: Verify in fresh sessions

For every agent:
- **Context budget:** measure startup context (`/context` in Claude Code; in agents where slash commands don't work headless, send a one-word prompt with JSON output and read the first request's input tokens). Target under about 15% of the window. Report the skill and MCP shares.
- **Harness behaviour:** in a scratch git repo, ask "add a small function that computes X. Start the work." It must invoke the brainstorming skill before writing files. **Gotcha:** headless modes often withhold interactive tools (e.g. "ask user question"), which makes brainstorming get skipped. Enable all tools for the test (e.g. `--tools-all`) before concluding it's broken.
- **Hooks and mods:** check that shell commands are rewritten through rtk and that the session-start injection is present.
- **MCP:** Context7 answers; Serena connects in a scratch repo.
- **Skills:** count them, confirm 0 skipped or duplicate, and no broken links.

---

## Phase 4: Deliverables

Write **`~/.agents/SETUP.md`**, a runbook kept up to date as you go, with:

1. **Manual to-dos:** restarts, optional keys (with exact commands that read env vars), audit findings to fix, optional context trims.
2. **Per-repo commands:** `serena-here`, DESIGN.md setup, persisting a ui-ux-pro-max design system, `/setup-matt-pocock-skills` before `/triage`.
3. **Where things live:** every file and hook you added, per agent.
4. **Installing new skills:** the two-agent `npx skills` command.
5. **Updating:** all update commands.
6. **Local patches to reapply after updates:** exact commands, plus the line "after updates, ask an agent to reapply these".
7. **Decisions:** what was skipped and why (so nobody re-litigates it).
8. **Verification results** and the usage baseline.
9. **Daily workflow:**
   - Describe the feature and let the harness lead (brainstorm → plan → TDD → review). Use `/grill-me` for fuzzy ideas.
   - UI: DESIGN.md or a design system → build → browser screenshots → `/impeccable critique` → fix.
   - Library questions go through Context7; big repos get `serena-here`.
   - Money or unit maths gets dimensional-analysis; risky diffs get differential-review; dependencies are audited monthly.
   - One task per session, `/handoff` before switching, `/compact` at about 60%, `/caveman` in long debug loops.
   - Check `ccusage weekly` against the baseline.
   - Add a tool only when it fixes a problem you hit this week.

Finish with a short summary table (layer → tool → per agent → verified?) and the manual to-do list.
