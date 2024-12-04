<script lang="ts" module>
  import { zeroAddress } from '$lib/web3/helpers';
  import TokenPicker from '$lib/components/TokenPicker.svelte';

  let token = zeroAddress;
  let tokenSymbol = 'TEST';

  const tokenByAddress = async (addr: Address): Promise<Erc20Data> => {
    await waitFor(1000);
    return {
      symbol: 'KEK',
      address: addr,
      name: 'KEK KEK',
      decimals: 10
    };
  };

  const knownTokens: Array<Erc20Token> = [];
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
      tokenByAddress: tokenByAddress
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import type { Address } from '$lib/web3/contracts/common';
  import QueryClientContext from '$lib/components/context/QueryClientContext.svelte';
  import type { Erc20Data, Erc20Token } from '$lib/web3/contracts/erc20';
  import { waitFor } from '$lib/helpers';
</script>

<Template >
  {#snippet children({ args })}
    <QueryClientContext>
      <TokenPicker {...args} />
    </QueryClientContext>
  {/snippet}
</Template>

<Story name="empty">
  <QueryClientContext>
    <TokenPicker {knownTokens} tokenByAddress={tokenByAddress} />
  </QueryClientContext>
</Story>

<Story name="Prefilled" args={{ token: token }} />

<Story name="Prefilled with Symbol" args={{ token: token, tokenSymbol: 'ELSE' }} />

<Story name="disabled" args={{ token: token, disabled: true }} />
