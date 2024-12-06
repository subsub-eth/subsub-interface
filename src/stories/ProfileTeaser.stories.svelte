<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ProfileTeaser from '$lib/components/profile/ProfileTeaser.svelte';
  import type { ProfileData } from '$lib/web3/contracts/profile';
  import { zeroAddress } from '$lib/web3/helpers';

  const profileData: ProfileData = {
    name: 'Johnny',
    description: 'A very cool guy',
    externalUrl: 'https://example.com/johnny',
    image: 'https://github.com/shadcn.png',
    address: zeroAddress,
    tokenId: 10,
    owner: zeroAddress
  };

  const { Story } = defineMeta({
    title: 'ProfileTeaser',
    component: ProfileTeaser,
    tags: ['autodocs'],
    args: {
      profile: profileData
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
  });
</script>

<Story name="Default" args={{}}>
  {#snippet children(args)}
    <ProfileTeaser {...args} />
  {/snippet}
</Story>

<Story
  name="Image not found"
  args={{ profile: { ...profileData, image: 'https://localhost/nothing.jpg' } }}
/>

<Story name="Missing image" args={{ profile: { ...profileData, image: undefined } }} />

<Story name="No description" args={{ profile: { ...profileData, description: undefined } }} />
