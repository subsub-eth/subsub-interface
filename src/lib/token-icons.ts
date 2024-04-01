import { asChecksumAddress, type Address } from './web3/contracts/common';
import * as Icons from './token-icon-assets';

type TokenData = {
  icon: string;
  symbol: string;
};

export type TokenIcon = {
  address: Address;
} & TokenData;

const a = asChecksumAddress;

// TODO refactor
// hard coded lookup of common tokens
const knownTokens: Map<Address, TokenData> = new Map([
  ['0x0000000000000000000000000000000000000000', { icon: Icons.test, symbol: 'NULL' }],
  [a('0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'), { icon: Icons.test, symbol: 'TestUSD' }],
  [a('0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a1'), { icon: Icons.dai, symbol: 'INV1' }],
  [a('0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a2'), { icon: Icons.usdc, symbol: 'INV2' }],
  [a('0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a3'), { icon: Icons.usdt, symbol: 'INV3' }],
  [a('0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a4'), { icon: Icons.btc, symbol: 'INV4' }],
  [a('0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863a5'), { icon: Icons.eth, symbol: 'INV5' }],
]);

// TODO add chain?
export default function findTokenIcon(address: Address): TokenIcon | null {
  const token = knownTokens.get(a(address));

  if (token) {
    return {
      address: address,
      icon: token.icon,
      symbol: token.symbol
    };
  }
  return null;
}
