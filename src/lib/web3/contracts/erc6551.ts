import { AddressSchema, type Address, asChecksumAddress } from './common';
import type { ReadableChainEnvironment } from '$lib/chain-context';
import { log } from '$lib/logger';
import { addressEquals, zero32Bytes } from '../helpers';
import type { ReadClient, ReadableContract, WritableContract, WriteClient } from '../viem';
import {
  getContract,
  toHex,
  type Abi,
  type ContractFunctionName,
  type ContractFunctionArgs,
  encodeFunctionData,
  type EncodeFunctionDataParameters,
  type Hash,
  parseEventLogs
} from 'viem';
import {
  ierc6551AccountAbi,
  ierc6551ExecutableAbi,
  ierc6551RegistryAbi
} from '../generated/createz';
import { getChainId } from '$lib/chain-config';

export type IERC6551Registry = ReadableContract;
export type WritableIERC6551Registry = WritableContract;

export type IERC6551Account = ReadableContract;

export type IERC6551Executable = WritableContract;

function registry(reg: IERC6551Registry) {
  return getContract({
    abi: ierc6551RegistryAbi,
    address: reg.address,
    client: reg.publicClient
  });
}

function writableRegistry(reg: WritableIERC6551Registry) {
  return getContract({
    abi: ierc6551RegistryAbi,
    address: reg.address,
    client: { public: reg.publicClient, wallet: reg.walletClient }
  });
}

function account(acc: IERC6551Account) {
  return getContract({
    abi: ierc6551AccountAbi,
    address: acc.address,
    client: acc.publicClient
  });
}

function executable(exec: IERC6551Executable) {
  return getContract({
    abi: ierc6551ExecutableAbi,
    address: exec.address,
    client: exec.walletClient
  });
}

async function findErc6551Account(
  reg: IERC6551Registry,
  implementation: Address,
  salt: Uint8Array,
  chainId: number,
  erc721Address: Address,
  tokenId: bigint
): Promise<Address | undefined> {
  // TODO replace with off-chain computation
  const r = registry(reg);
  const acc = await r.read.account([
    implementation,
    toHex(salt),
    BigInt(chainId),
    erc721Address,
    tokenId
  ]);

  return AddressSchema.parse(acc);
}

export async function findDefaultProfileErc6551Account(
  chainEnv: ReadableChainEnvironment,
  tokenId: bigint
): Promise<Address | undefined> {
  const { erc6551Registry, chainData } = chainEnv;
  const { contracts } = chainData;
  const { defaultErc6551Implementation, profile } = contracts;
  const acc = await findErc6551Account(
    erc6551Registry,
    defaultErc6551Implementation,
    new Uint8Array(32),
    getChainId(chainData),
    profile,
    tokenId
  );

  log.debug('Default ERC6551 Account for tokenId', chainEnv, tokenId, acc);

  return acc;
}

export type TokenBoundAccount = [IERC6551Account, IERC6551Executable | null];

export async function getErc6551Account(
  address: Address,
  publicClient: ReadClient,
  walletClient?: WriteClient
): Promise<TokenBoundAccount | null> {
  const acc = await tryGetErc6551Account(address, publicClient);

  if (!acc) {
    return null;
  }

  const exec = walletClient ? { address, publicClient, walletClient } : null;
  log.debug('Created ERC6551 contracts for address', address);

  return [acc, exec];
}

async function tryGetErc6551Account(
  address: Address,
  publicClient: ReadClient
): Promise<IERC6551Account | null> {
  const a = { address, publicClient: publicClient };
  const acc = account(a);

  try {
    await acc.read.state();
  } catch (error) {
    log.debug(
      'Could not call state() from account, there is no account deployed at address',
      address,
      error
    );
    return null;
  }

  return a;
}

export async function createErc6551Account(
  registry: WritableIERC6551Registry,
  accountImplementation: Address,
  chainId: number,
  contract: Address,
  tokenId: bigint,
  events?: {
    onTxSubmitted?: (hash: string) => void;
  }
): Promise<Address> {
  let tx;
  const r = writableRegistry(registry);
  try {
    tx = await r.write.createAccount([
      accountImplementation,
      toHex(zero32Bytes),
      BigInt(chainId),
      contract,
      tokenId
    ]);
  } catch (error) {
    log.error('Failed to create ERC6551 Account', error);
    throw error;
  }
  if (events?.onTxSubmitted) events.onTxSubmitted(tx);

  const { logs } = await registry.publicClient.waitForTransactionReceipt({ hash: tx });
  const [createdEvent] = parseEventLogs({
    abi: ierc6551RegistryAbi,
    logs,
    eventName: 'ERC6551AccountCreated',
    args: { tokenContract: contract, tokenId: tokenId }
  });

  if (!createdEvent) {
    throw new Error('Transaction Log not found, did the transaction revert?');
  }

  return asChecksumAddress(createdEvent.args.account);
}

export async function execute<
  abi extends Abi,
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>
>(
  exec: IERC6551Executable,
  target: Address,
  abi: abi,
  func: functionName,
  args: args,
  value: bigint = 0n
): Promise<Hash> {
  log.debug('ERC6551Execute:', account, target, func, args, value);

  const encoded = encodeFunctionData({
    abi: abi,
    functionName: func,
    args: args
  } as EncodeFunctionDataParameters);
  log.debug('ERC6551Execute: encoded', target, func, args, encoded);
  const ex = executable(exec);
  const tx = await ex.write.execute([target, value, encoded, 0]);
  return tx;
}

/**
 * determines if `addr` is a valid signer of `potentialTokenboundAcc`
 */
export async function isValidSigner(
  addr: Address,
  potentialTokenboundAcc: Address,
  client: ReadClient
): Promise<boolean> {
  log.debug('isValidSigner()', addr, potentialTokenboundAcc);
  // is actually the same address
  if (addressEquals(addr, potentialTokenboundAcc)) {
    log.debug('isValidSigner() addresses match', addr, potentialTokenboundAcc);
    return true;
  }

  // check if it is a tokenbound account

  const a = await tryGetErc6551Account(potentialTokenboundAcc, client);
  if (!a) {
    log.debug('isValidSigner() not an ERC6551 account', addr, potentialTokenboundAcc);
    return false;
  }

  const acc = account(a);

  const magicValue = '0x523e3260';

  try {
    const res = await acc.read.isValidSigner([addr, '0x00']);
    log.debug('isValidSigner() ERC6551 result', addr, potentialTokenboundAcc, res);
    return res === magicValue;
  } catch (error) {
    log.error('Failed to call isValidSigner', addr, potentialTokenboundAcc, error);
    throw error;
  }
}

export async function token(
  acc: IERC6551Account
): Promise<{ chainId: number; contractAddress: Address; tokenId: bigint }> {
  const a = account(acc);
  const [chainId, contractAddress, tokenId] = await a.read.token();

  log.debug('Token of account is located at', chainId, contractAddress, tokenId);
  return { chainId: Number(chainId), contractAddress, tokenId };
}
