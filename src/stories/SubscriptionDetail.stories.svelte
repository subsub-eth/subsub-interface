<script lang="ts" module>
  import { SubscriptionDetails } from '$lib/components/subscription/token/index';
  import { EXPLORER_URL } from '$lib/contexts';
  import type { ObservedQueryResult } from '$lib/query/config';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { Price } from '$lib/web3/contracts/oracle';
  import type { SubscriptionData } from '$lib/web3/contracts/subscription';
  import { zeroAddress } from '$lib/web3/helpers';

  const subData: SubscriptionData = {
    tokenId: 10,
    address: zeroAddress,
    name: 'Sub #1',
    description: 'Something',
    image: undefined,
    externalUrl: undefined,
    deposited: 10_000_000,
    spent: 1_000_000,
    unspent: 9_000_000,
    withdrawable: 5_000_000,
    tips: 20_000_000,
    isActive: true,
    expiresAt: Math.floor(Date.now() / 1000 + 20 * 60 * 60 * 24 /** day */ + 60 * 60),
    multiplier: 100
  };

  const erc20: Erc20Data = {
    name: 'Some Token',
    symbol: 'testUSD',
    decimals: 6,
    address: zeroAddress
  };

  const tokenPrice: Pick<ObservedQueryResult<Price | null>, 'isSuccess' | 'data'> = {
    isSuccess: true,
    data: { price: 99_000_000, decimals: 8 }
  };

  export const meta = {
    title: 'SubscriptionDetails',
    component: SubscriptionDetails,
    tags: ['autodocs'],
    args: {
      subscriptionData: subData,
      paymentToken: erc20,
      tokenPrice: tokenPrice,
      rate: 5_000_000_000_000,
      technicalsOpen: true
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import { setContext } from 'svelte';

  setContext(EXPLORER_URL, 'http://example.com');
</script>

<Template >
  {#snippet children({ args })}
    <SubscriptionDetails {...args} />
  {/snippet}
</Template>

<Story name="Default" args={{}} />

<Story name="with multiplier" args={{ subscriptionData: { ...subData, multiplier: 120 } }} />

<Story
  name="expired"
  args={{
    subscriptionData: {
      ...subData,
      isActive: false,
      unspent: 0,
      withdrawable: 0,
      expiresAt: Math.floor(Date.now() / 1000 - 1)
    }
  }}
/>

<Story
  name="almost expired"
  args={{
    subscriptionData: {
      ...subData,
      isActive: true,
      unspent: 50_000,
      withdrawable: 0,
      expiresAt: Math.floor(Date.now() / 1000 + 2 * 60)
    }
  }}
/>

<Story
  name="almost almost expired"
  args={{
    subscriptionData: {
      ...subData,
      isActive: true,
      unspent: 5,
      withdrawable: 0,
      expiresAt: Math.floor(Date.now() / 1000 + 4)
    }
  }}
/>

<Story name="technicals closed" args={{ technicalsOpen: false }} />

<Story name="pending price data" args={{ tokenPrice: { isPending: true } }} />

<Story name="error price data" args={{ tokenPrice: { isError: true } }} />
