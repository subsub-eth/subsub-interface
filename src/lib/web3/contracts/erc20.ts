import { type Hash, AddressSchema, type Address } from './common';
import { z } from 'zod';
import { log } from '$lib/logger';
import type { ReadClient, ReadableContract, WritableContract, WriteClient } from '../viem';
import { erc20Abi, getContract } from 'viem';

const Erc20TokenSchema = z.object({
  address: AddressSchema,
  name: z.string(),
  symbol: z.string()
});

export type Erc20Token = z.infer<typeof Erc20TokenSchema>;

export const Erc20DataSchema = Erc20TokenSchema.extend({
  decimals: z.number()
});

export type Erc20Data = z.infer<typeof Erc20DataSchema>;

export type Erc20 = ReadableContract;
export type WritableErc20 = WritableContract;

function erc20(token: Erc20) {
  return getContract({
    abi: erc20Abi,
    address: token.address,
    client: token.publicClient
  });
}

function writableErc20(token: WritableErc20) {
  return getContract({
    abi: erc20Abi,
    address: token.address,
    client: { public: token.publicClient, wallet: token.walletClient }
  });
}

export function getErc20Contract(address: Address, client: ReadClient): Erc20 {
  log.debug('Created ERC20 contract for', address, client);
  return { address: address, publicClient: client };
}

export function getWritableErc20Contract(
  address: Address,
  publicClient: ReadClient,
  walletClient: WriteClient
): WritableErc20 {
  log.debug('Created ERC20 contract for', address, publicClient, walletClient);
  return { address, publicClient, walletClient };
}

export async function getErc20Data(contract: Erc20): Promise<Erc20Data> {
  log.debug('Retrieving ERC20 Data from contract', contract);
  const c = erc20(contract);
  const address = AddressSchema.parse(c.address);

  const name = await c.read.name();
  const symbol = await c.read.symbol();
  const decimals = Number(await c.read.decimals());

  return {
    address: address,
    name: name,
    symbol: symbol,
    decimals: decimals
  };
}

export async function getBalance(contract: Erc20, owner: Address): Promise<bigint> {
  log.debug(`Retrieving balance of owner ${owner} on ERC20`, contract, owner);

  const c = erc20(contract);

  const balance = await c.read.balanceOf([owner]);

  log.debug(`Balance of owner ${owner}`, balance, contract, owner);

  return balance;
}

export async function getAllowance(
  contract: Erc20,
  owner: Address,
  spender: Address
): Promise<bigint> {
  log.debug(
    `Retrieving allowance of spender ${spender} for owner ${owner} on ERC20`,
    contract,
    owner,
    spender
  );
  const c = erc20(contract);

  const allowance = await c.read.allowance([owner, spender]);

  log.debug(
    `Allowance of spender ${spender} for owner ${owner}`,
    allowance,
    contract,
    owner,
    spender
  );

  return allowance;
}

export type ApproveFunc = (
  amount: bigint,
  events?: { onApprovalTxSubmitted?: (hash: Hash) => void }
) => Promise<[bigint, Hash]>;

export function approveFunc(token: WritableErc20, spender: Address): ApproveFunc {
  return async (amount, events) => {
    const c = writableErc20(token);
    if (amount > 0 && token) {
      const apprTx = await c.write.approve([spender, amount]);
      events?.onApprovalTxSubmitted?.(apprTx);
      await token.publicClient.waitForTransactionReceipt({ hash: apprTx });
      return [amount, apprTx];
    } else {
      throw new Error('Approval of 0 amount or token not found');
    }
  };
}
