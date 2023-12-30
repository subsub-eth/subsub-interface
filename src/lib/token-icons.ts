import type { address } from './web3/contracts/common';
import * as Icons from './token-icon-assets';

type TokenData = {
  icon: string;
  symbol: string;
};

export type TokenIcon = {
  address: address;
} & TokenData;

// hard coded lookup of common tokens
const knownTokens: Map<address, TokenData> = new Map([
  ['0x0000000000000000000000000000000000000000', { icon: Icons.test, symbol: 'TEST' }]
]);

// TODO add chain?
export default function findTokenIcon(address: address): TokenIcon | null {
  const token = knownTokens.get(address);
  console.log('finding stuff', address, token);

  if (token) {
    return {
      address: address,
      icon: token.icon,
      symbol: token.symbol
    };
  }
  return null;
}
