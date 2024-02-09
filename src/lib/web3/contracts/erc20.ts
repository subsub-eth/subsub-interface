import { ERC20__factory, type ERC20 } from '@createz/contracts/types/ethers-contracts';
import { type Hash, AddressSchema, type Address } from './common';
import { z } from 'zod';
import type { Signer } from 'ethers';
import { log } from '$lib/logger';

const Erc20DataSchema = z.object({
  address: AddressSchema,
  name: z.string(),
  symbol: z.string(),
  decimals: z.number()
});

export type Erc20Data = z.infer<typeof Erc20DataSchema>;

export type Erc20Container = { address: Address; contract: ERC20 };
export function getErc20Contract(address: Address, signer: Signer): Erc20Container {
  log.debug('Created ERC20 contract for', address, signer);
  return { address: address, contract: ERC20__factory.connect(address, signer) };
}

export async function getErc20Data(contract: ERC20): Promise<Erc20Data> {
  log.debug('Retrieving ERC20 Data from contract', contract);
  const address = AddressSchema.parse(await contract.getAddress());

  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = Number(await contract.decimals());

  return {
    address: address,
    name: name,
    symbol: symbol,
    decimals: decimals
  };
}

export async function getBalance(contract: ERC20, owner: Address): Promise<bigint> {
  log.debug(`Retrieving balance of owner ${owner} on ERC20`, contract, owner);

  const balance = await contract.balanceOf(owner);

  log.debug(`Balance of owner ${owner}`, balance, contract, owner);

  return balance;
}

export async function getAllowance(
  contract: ERC20,
  owner: Address,
  spender: Address
): Promise<bigint> {
  log.debug(
    `Retrieving allowance of spender ${spender} for owner ${owner} on ERC20`,
    contract,
    owner,
    spender
  );

  const allowance = await contract.allowance(owner, spender);

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

export function approveFunc(token: ERC20, spender: string): ApproveFunc {
  return async (amount, events) => {
    if (amount > 0 && token) {
      const apprTx = await token.approve(spender, amount);
      events?.onApprovalTxSubmitted?.(apprTx.hash);
      await apprTx.wait();
      return [amount, apprTx.hash];
    } else {
      throw new Error('Approval of 0 amount or token not found');
    }
  };
}
