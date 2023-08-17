<script lang="ts">
  import type { ERC20 } from '@createz/contracts/types/ethers-contracts';

  export let account: string;
  export let token: ERC20;

  let balance: bigint;

  let counter = 0;

  $: {
    counter;
    (async () => {
      balance = await token.balanceOf(account);
    })();
  }

  const update = async () => {
    counter++;
  };
</script>

{#if balance !== undefined}
  <slot {balance} {update} />
{:else}
  loading ERC20 balance
{/if}

