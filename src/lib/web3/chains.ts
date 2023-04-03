export const allChains = [
  {
    id: 1,
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
  },
  {
    id: 137,
    token: 'MATIC',
    label: 'Matic Mainnet',
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
  },
  {
    id: 1337,
    token: 'ETH',
    label: 'localhost',
    rpcUrl: 'http://localhost:8545',
  },
];

export const chains = allChains;

export const getChain = function(id: number) {
  return allChains.find(c => c.id === id);
}
