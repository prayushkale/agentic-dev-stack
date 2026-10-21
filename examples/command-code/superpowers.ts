// Port of the superpowers SessionStart hook (obra/superpowers hooks/session-start).
// Appends the using-superpowers skill to the system prompt so every session,
// including after /clear and /compact, starts with the skill-first workflow.
// The text is read once at load so the prompt stays byte-stable for caching.

import {readFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import type {ModApi} from '@commandcode/harness';

const SKILL_PATH = join(homedir(), '.commandcode/skills/using-superpowers/SKILL.md');

export default function (cmd: ModApi): void {
	let content: string;
	try {
		content = readFileSync(SKILL_PATH, 'utf8');
	} catch {
		return;
	}
	const prompt =
		'<EXTREMELY_IMPORTANT>\nYou have superpowers.\n\n' +
		"**Below is the full content of your 'using-superpowers' skill - your introduction to using skills. " +
		'For all other skills, load them with your skill tool:**\n\n' +
		content +
		'\n</EXTREMELY_IMPORTANT>';

	cmd.hooks({
		appendSystemPrompt: () => prompt,
	});
}
