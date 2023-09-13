import type { Hash } from "$lib/web3/contracts/common";

export type TxFailedEvents = {
  txFailed: unknown;
};

export type PauseEvents = {
  pauseTxSubmitted: Hash;
  paused: Hash;
}

export type UnpauseEvents = {
  unpauseTxSubmitted: Hash;
  unpaused: Hash;
}
