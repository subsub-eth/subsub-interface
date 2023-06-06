import { filter, map, from, concatMap } from 'rxjs';
import {
  ethers,
  EventLog,
  Interface,
  Log,
  Result,
  type Provider,
  type Signer,
  type TopicFilter,
  BaseContract,
  LogDescription
} from 'ethers';
import {
  type TypedContractEvent,
  type TypedDeferredTopicFilter,
  type TypedLogDescription
} from '@createz/contracts/types/ethers-contracts/common';
import { wallets$ } from './onboard';
import { readonly, writable } from 'svelte/store';

export const ethersProvider$ = wallets$.pipe(
  map((wallets) => {
    const [primaryWallet] = wallets;
    return primaryWallet;
  }),
  filter((wallet) => !!wallet),
  map((wallet) => {
    return new ethers.BrowserProvider(wallet.provider);
  })
);

const ethersProviderStore = writable<null | Provider>(null);

ethersProvider$.subscribe((provider) => {
  console.debug(`Setting ethers provider`, provider);
  ethersProviderStore.set(provider);
});

export const ethersProvider = readonly(ethersProviderStore);

export const ethersSigner$ = wallets$.pipe(
  map((wallets) => {
    const [primaryWallet] = wallets;
    return primaryWallet;
  }),
  filter((wallet) => !!wallet),
  concatMap((wallet) => {
    return from(new ethers.BrowserProvider(wallet.provider).getSigner());
  })
);

const ethersSignerStore = writable<null | Signer>(null);

ethersSigner$.subscribe((signer) => {
  console.debug(`Setting ethers signer`, signer);
  ethersSignerStore.set(signer);
});

export const ethersSigner = readonly(ethersSignerStore);

function matchTopics(filter: TopicFilter, log: LogDescription): boolean {
  if (log.args.length < filter.length) {
    return false;
  }
  if (log.topic !== filter[0]) {
    return false;
  }
  // TODO actually filter for values
  return true;
}

export async function matchEvents<
  InputArray extends Array<any>,
  OutputArray extends Array<any>,
  OutputObject extends any
>(
  logs: (EventLog | Log)[],
  contract: BaseContract,
  filter: TypedDeferredTopicFilter<TypedContractEvent<InputArray, OutputArray, OutputObject>>
): Promise<Array<TypedLogDescription<TypedContractEvent<InputArray, OutputArray, OutputObject>>>> {
  const topticFilter = await filter.getTopicFilter();
  return logs
    .map((l) => contract.interface.parseLog(l as any))
    .flatMap((d) => (d ? [d] : []))
    .filter((d) => matchTopics(topticFilter, d!))
    .map(
      (d) =>
        d as unknown as TypedLogDescription<
          TypedContractEvent<InputArray, OutputArray, OutputObject>
        >
    );
}
