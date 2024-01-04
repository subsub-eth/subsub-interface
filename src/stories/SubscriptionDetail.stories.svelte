<script lang="ts" context="module">
  import SubscriptionDetails from '$lib/components/subscription/SubscriptionDetails.svelte';
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import { zeroAddress } from '$lib/web3/helpers';

  export const meta = {
    title: 'SubscriptionDetails',
    component: SubscriptionDetails,
    tags: ['autodocs'],
    args: {
      contractAddress: zeroAddress,
      tokenId: 12345,
      metadata: {},
      technicalsOpen: true,
      multiplier: 100
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <SubscriptionDetails {...args} />
</Template>

<Story name="Default" args={{}} />

<Story name="with multiplier" args={{multiplier: 120 }} />

<Story name="technicals closed" args={{ technicalsOpen: false}} />
