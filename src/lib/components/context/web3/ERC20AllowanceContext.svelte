<script lang="ts">
  import type { ERC20 } from '@createz/contracts/types/ethers-contracts';

  export let account: string;
  export let spender: string;
  export let token: ERC20;

  let allowance: bigint;

  let counter = 0;

  $: {
    counter;
    (async () => {
      allowance = await token.allowance(account, spender);
    })();
  }

  const update = async () => {
    counter++;
  };
</script>

{#if allowance !== undefined }
  <slot {allowance} {update} />
{:else}
  loading ERC20 allowance
{/if}
