import type { Chain } from '@web3-onboard/common';

import {
  currentChains,
  getChainDisplayName,
  getChainId,
  getChainRpcUrl,
  getChainToken
} from '../chain-config';

export const onBoardChains: Chain[] = currentChains.map(([, v]) => {
  return {
    id: '' + getChainId(v),
    token: getChainToken(v),
    label: getChainDisplayName(v),
    rpcUrl: getChainRpcUrl(v)
  };
});
