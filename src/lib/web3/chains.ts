import type { Chain } from '@web3-onboard/common';

import { currentChains } from '../chain-config';

export const onBoardChains: Chain[] = currentChains.map(([, v]) => {
  return {
    id: '' + v.chainId,
    token: v.token,
    label: v.displayName,
    rpcUrl: v.rpcUrl
  };
});
