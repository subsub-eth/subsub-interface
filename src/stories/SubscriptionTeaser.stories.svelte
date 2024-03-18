<script lang="ts" context="module">
  import { SubscriptionTeaser } from '$lib/components/subscription/token';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import type { SubscriptionData } from '$lib/web3/contracts/subscription';
  import { zeroAddress } from '$lib/web3/helpers';

  const subData: SubscriptionData = {
    tokenId: 10,
    address: zeroAddress,
    name: 'Sub #1',
    description: 'Something',
    image: undefined,
    externalUrl: undefined,
    deposited: 0,
    spent: 0,
    unspent: 9_000_000,
    withdrawable: 0,
    tips: 0,
    isActive: true,
    expiresAt: 0,
    multiplier: 100
  };

  const erc20: Erc20Data = {
    name: 'Some Token',
    symbol: 'testUSD',
    decimals: 6,
    address: zeroAddress
  };

  export const meta = {
    title: 'SubscriptionTeaser',
    component: SubscriptionTeaser,
    tags: ['autodocs'],
    args: {
      subscriptionData: subData,
      rate: 5_000_000_000_000,
      paymentToken: erc20
    },
    argTypes: {},
    parameters: {
      sveltekit_experimental: {
        stores: {
          page: {
            params: {
              network: 'mytest'
            }
          }
        }
      }
    }
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <SubscriptionTeaser {...args} />
</Template>

<Story name="Default" args={{}} />

<Story name="Is inactive" args={{ subscriptionData: { ...subData, isActive: false } }} />

<Story
  name="Large Numbers"
  args={{ rate: 50, subscriptionData: { ...subData, unspent: '9000000000000000000000000000000' } }}
/>

<Story
  name="Small Numbers"
  args={{
    rate: '5',
    subscriptionData: { ...subData, unspent: '9' },
    paymentToken: { ...erc20, decimals: 18 }
  }}
/>
