<script lang="ts">
  import { ERC20__factory, type ERC20 } from '@createz/contracts/types/ethers-contracts';
  import type { Signer } from 'ethers';

  export let address: string;
  export let ethersSigner: Signer;

  let token: ERC20;

  $: {
    token = ERC20__factory.connect(address, ethersSigner);
  }

</script>

{#if token }
  <slot {token} />
{:else}
  loading ERC20 token
{/if}
