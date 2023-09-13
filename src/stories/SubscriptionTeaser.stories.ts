import type { Meta, StoryObj } from '@storybook/svelte';

import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';
import type { SubscriptionTokenMetadata } from '$lib/web3/contracts/subscription';
import { ZeroAddress } from 'ethers';
import { contractDummy } from '$lib/static-content';

const testMetadata: SubscriptionTokenMetadata = {
  name: 'Subscription #100',
  description: 'Some awesome description',
  image: contractDummy,
  external_url: 'http://example.com',
  attributes: []
}

const meta = {
    title: 'Atoms/SubscriptionTeaser',
    component: SubscriptionTeaser,
    tags: ['autodocs'],
    args: {
      contractAddress: ZeroAddress,
      tokenId: 10,
      metadata: testMetadata
    },
    argTypes: {
      contractAddress: {
        control: 'text',
        description: 'Address of the contract this token belongs to',
        type: {
          required: true,
          name: 'string'
        }
      },
      tokenId: {
        control: 'number',
        description: 'Id of the token',
        type: {
          required: true,
          name: 'number'
        }
      },
      metadata: {
        control: 'object',
        description: 'Metadata object provided by Contract tokenURI method',
        type: {
          required: true,
          name: 'object',
          value: {}
        }
      },
    }

} satisfies Meta<SubscriptionTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
    args: {
    },
}
