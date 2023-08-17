<script lang="ts">
  import type { ERC20 } from '@createz/contracts/types/ethers-contracts';

  export let token: ERC20;

  const tokenName = token.name;
  const symbol = token.symbol;
  const decimals = token.decimals;

</script>

<slot {tokenName} {symbol} {decimals} />
