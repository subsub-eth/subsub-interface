<script lang="ts" context="module">
  import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';
  import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
  import { contractDummy } from '$lib/static-content';
  import { zeroAddress } from '$lib/web3/helpers';

  export const meta = {
    title: 'SubscriptionTeaser',
    component: SubscriptionTeaser,
    tags: ['autodocs'],
    args: {
      contractAddress: zeroAddress,
      tokenId: 12345,
      metadata: {}
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <SubscriptionTeaser {...args} />
</Template>

<Story name="Default" args={{}} />
