import { filter, map, from, concatMap, distinctUntilChanged } from 'rxjs';
import {
  ethers,
  EventLog,
  Log,
  type Provider,
  type Signer,
  type TopicFilter,
  BaseContract,
  LogDescription,
  ContractTransactionResponse,
  TransactionReceipt
} from 'ethers';
import {
  type TypedContractEvent,
  type TypedDeferredTopicFilter,
  type TypedLogDescription
} from '@createz/contracts/types/ethers-contracts/common';
import { primaryWallet$ } from './onboard';
import { readonly, writable } from 'svelte/store';

export const ethersProvider$ = primaryWallet$.pipe(
  filter((wallet) => !!wallet),
  distinctUntilChanged(),
  map((wallet) => {
    console.log('creating ethers provider', wallet);
    return new ethers.BrowserProvider(wallet!.provider);
  })
);

const ethersProviderStore = writable<null | Provider>(null);

ethersProvider$.subscribe((provider) => {
  console.debug(`Setting ethers provider`, provider);
  ethersProviderStore.set(provider);
});

export const ethersProvider = readonly(ethersProviderStore);

export const ethersSigner$ = primaryWallet$.pipe(
  filter((wallet) => !!wallet),
  concatMap((wallet) => {
    return from(new ethers.BrowserProvider(wallet!.provider).getSigner());
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
  OutputObject
>(
  logs: (EventLog | Log)[],
  contract: BaseContract,
  filter: TypedDeferredTopicFilter<TypedContractEvent<InputArray, OutputArray, OutputObject>>,
  filterAddress: string | undefined = undefined
): Promise<Array<TypedLogDescription<TypedContractEvent<InputArray, OutputArray, OutputObject>>>> {
  const address = filterAddress ?? (await contract.getAddress());
  const topticFilter = await filter.getTopicFilter();
  return logs
    .filter((l) => l.address === address)
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

export async function getReceipt(
  response: ContractTransactionResponse
): Promise<TransactionReceipt> {
  const receipt = await (await (await response.wait())?.getTransaction())?.wait();
  if (!receipt) {
    throw new Error('Transaction was not mined');
  }
  return receipt;
}

export async function findLogs<
  InputArray extends Array<any>,
  OutputArray extends Array<any>,
  OutputObject
>(
  response: ContractTransactionResponse,
  contract: BaseContract,
  filter: TypedDeferredTopicFilter<TypedContractEvent<InputArray, OutputArray, OutputObject>>,
  filterAddress: string | undefined = undefined
): Promise<Array<TypedLogDescription<TypedContractEvent<InputArray, OutputArray, OutputObject>>>> {
  const receipt = await getReceipt(response);

  const logs = receipt.logs;

  const res = await matchEvents(logs as [], contract, filter, filterAddress);

  return res;
}

export async function findLog<
  InputArray extends Array<any>,
  OutputArray extends Array<any>,
  OutputObject
>(
  response: ContractTransactionResponse,
  contract: BaseContract,
  filter: TypedDeferredTopicFilter<TypedContractEvent<InputArray, OutputArray, OutputObject>>,
  filterAddress: string | undefined = undefined
): Promise<TypedLogDescription<TypedContractEvent<InputArray, OutputArray, OutputObject>> | null> {
  const logs = await findLogs(response, contract, filter, filterAddress);
  return logs.length > 0 ? logs[0] : null;
}
