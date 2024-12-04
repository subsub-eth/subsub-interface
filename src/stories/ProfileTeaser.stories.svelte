<script lang="ts" module>
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

  export const meta = {
    title: 'ProfileTeaser',
    component: ProfileTeaser,
    tags: ['autodocs'],
    args: {
      profile: profileData
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template >
  {#snippet children({ args })}
    <ProfileTeaser {...args} />
  {/snippet}
</Template>

<Story name="Default" args={{}} />

<Story
  name="Image not found"
  args={{ profile: { ...profileData, image: 'https://localhost/nothing.jpg' } }}
/>

<Story name="Missing image" args={{ profile: { ...profileData, image: undefined } }} />

<Story name="No description" args={{ profile: { ...profileData, description: undefined } }} />
