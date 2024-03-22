import type { WarningMessage } from '$lib/web3/contracts/subscription-analytics';

export function createMessages(
  errors: number,
  warnings: number,
  paused: number
): Array<WarningMessage> {
  const msgs: Array<WarningMessage> = [];

  for (let i = 0; i < errors; i++) {
    msgs.push({ type: 'error', title: `error ${i}`, text: `Some horrible error ${i}` });
  }
  for (let i = 0; i < warnings; i++) {
    msgs.push({ type: 'warning', title: `warning ${i}`, text: `Some horrible warning ${i}` });
  }
  for (let i = 0; i < paused; i++) {
    msgs.push({ type: 'paused', title: `paused ${i}`, text: `Some horrible paused ${i}` });
  }

  return msgs;
}
