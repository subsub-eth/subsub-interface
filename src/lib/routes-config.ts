import { chainNames } from './chain-config';

export const networks = chainNames.map((name) => ({ network: name }));
