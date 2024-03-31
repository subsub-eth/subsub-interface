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

// hard coded lookup of common tokens
const knownTokens: Map<Address, TokenData> = new Map([
  ['0x0000000000000000000000000000000000000000', { icon: Icons.test, symbol: 'TEST' }],
  [a('0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'), { icon: Icons.test, symbol: 'TestUSD' }]
]);

// TODO add chain?
export default function findTokenIcon(address: Address): TokenIcon | null {
  const token = knownTokens.get(address);

  if (token) {
    return {
      address: address,
      icon: token.icon,
      symbol: token.symbol
    };
  }
  return null;
}
