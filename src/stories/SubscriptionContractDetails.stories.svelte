<script lang="ts" context="module">
  import SubscriptionContractDetails from '$lib/components/subscription/SubscriptionContractDetails.svelte';
  import type { SubscriptionContractMetadata } from '$lib/web3/contracts/subscription';
  import { contractDummy } from '$lib/static-content';
  import { zeroAddress } from '$lib/web3/helpers';

  const testMetadata: SubscriptionContractMetadata = {
    name: 'Tier 1 Sub to Jane',
    description: 'This awesome subscription gives you access to nothing',
    image: contractDummy,
    external_url: 'http://example.com',
    token: zeroAddress,
    rate: 100,
    lock: 100,
    epochSize: 3600,
    ownerContract: zeroAddress,
    ownerId: 1234,
    ownerAddress: zeroAddress,
    claimable: 30000,
    totalClaimed: 700000,
    paused: false
  };

  export const meta = {
    title: 'SubscriptionContractDetails',
    component: SubscriptionContractDetails,
    tags: ['autodocs'],
    args: {
      address: zeroAddress,
      metadata: testMetadata
    },
    argTypes: {
      // address: {
      //   control: 'text',
      //   description: 'Address of the subscription contract',
      //   type: {
      //     required: true,
      //     name: 'string'
      //   }
      // },
      // metadata: {
      //   control: 'object',
      //   description: 'Metadata object provided by Contract contractURI method',
      //   type: {
      //     required: true,
      //     name: 'object',
      //     value: {}
      //   }
      // }
    }
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <SubscriptionContractDetails {...args} />
</Template>

<Story name="with Owner" args={{ showOwner: true }} />

<Story name="paused" args={{ metadata: { ...testMetadata, paused: true } }} />
