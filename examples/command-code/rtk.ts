// Rewrites shell commands to their rtk equivalents for compact output (token savings).
// Thin delegate, like ~/.pi/agent/extensions/rtk.ts: all rules live in `rtk rewrite`.
//
// Exit code contract for `rtk rewrite`:
//   0 + stdout  Rewrite found
//   1           No rtk equivalent -> pass through unchanged
//   3 + stdout  Rewrite (advisory)
// Fails open: any error runs the original command. Disable with RTK_DISABLED=1.

import {execFile} from 'node:child_process';
import type {ModApi} from '@commandcode/harness';

const REWRITE_TIMEOUT_MS = 2_000;

function rewrite(command: string): Promise<string | null> {
	return new Promise(resolve => {
		execFile('rtk', ['rewrite', command], {timeout: REWRITE_TIMEOUT_MS}, (err, stdout) => {
			const code = err ? (typeof err.code === 'number' ? err.code : -1) : 0;
			if (code !== 0 && code !== 3) return resolve(null);
			resolve(stdout.trim() || null);
		});
	});
}

export default function (cmd: ModApi): void {
	cmd.hooks({
		beforeToolCall: async ({toolName, input}) => {
			if (toolName !== 'shell_command') return undefined;
			if (process.env.RTK_DISABLED === '1') return undefined;
			const command = typeof input.command === 'string' ? input.command : '';
			if (command.trim() === '' || command.startsWith('rtk ')) return undefined;
			try {
				const rewritten = await rewrite(command);
				if (!rewritten || rewritten === command) return undefined;
				return {input: {...input, command: rewritten}};
			} catch {
				return undefined;
			}
		},
	});
}
