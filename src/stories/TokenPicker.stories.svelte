<script lang="ts" context="module">
  import { zeroAddress } from '$lib/web3/helpers';
  import TokenPicker, { type KnownToken } from '$lib/components/TokenPicker.svelte';

  let token = zeroAddress;
  let tokenSymbol = 'TEST';

  let tempToken: Address;
  let tempTokenSymbol: string;

  const loadByAddress = async (addr: Address): Promise<Erc20Data> => {
    await waitFor(1000);
    return {
      symbol: 'KEK',
      address: addr,
      name: 'KEK KEK',
      decimals: 10
    };
  };

  const knownTokens: Array<KnownToken> = [];
  for (let i = 0; i < 100; i++) {
    knownTokens.push({
      name: 'Test Token ' + i,
      symbol: tokenSymbol + i,
      address: ('0x' + `${i}`.padStart(40, '0')) as Address
    });
  }

  export const meta = {
    title: 'TokenPicker',
    component: TokenPicker,
    tags: ['autodocs'],
    args: {
      knownTokens: knownTokens,
      loadByAddress: loadByAddress
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import type { Address } from '$lib/web3/contracts/common';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
    import { waitFor } from '$lib/helpers';
</script>

<Template let:args>
  <QueryClientContext>
    <TokenPicker bind:token bind:tokenSymbol {...args} />
  </QueryClientContext>
</Template>

<Story name="empty">
  <QueryClientContext>
    <TokenPicker
      bind:token={tempToken}
      bind:tokenSymbol={tempTokenSymbol}
      {knownTokens}
      {loadByAddress}
    />
  </QueryClientContext>
</Story>

<Story name="prefilled" args={{ token: token, tokenSymbol: tokenSymbol }} />
