import BN from "bn.js";



/**
  * short hand for creating BN instances from number
*/
export const bn = (num: number | string) => new BN(num);

/**
  * zero
*/
export const zero = bn(0);

/**
  * max uint256 value
*/
export const maxUint = bn(2).pow(bn(256)).sub(bn(1));

