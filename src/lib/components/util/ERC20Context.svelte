<script lang="ts">
  import { ERC20__factory, type ERC20 } from '@createz/contracts/types/ethers-contracts';
  import type { Signer } from 'ethers';

  export let address: string;
  export let ethersSigner: Signer;
  export let currentAccount: string;
  export let spender: string;

  let token: ERC20;
  let allowance: bigint;
  let balance: bigint;

  let counter = 0;

  $: {
    token = ERC20__factory.connect(address, ethersSigner);
  }

  $: {
    counter;
    (async () => {
      allowance = await token?.allowance(currentAccount, spender);
    })();
  }

  $: {
    counter;
    (async () => {
      balance = await token?.balanceOf(currentAccount);
    })();
  }

  const update = async () => {
    counter++;
  };
</script>

{#if token && allowance !== undefined && balance !== undefined}
  <slot {token} {allowance} {balance} {update} />
{:else}
  loading ERC20 data
{/if}
