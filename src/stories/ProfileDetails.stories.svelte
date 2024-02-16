<script lang="ts" context="module">
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import { EXPLORER_URL } from '$lib/contexts';
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
    title: 'ProfileDetails',
    component: ProfileDetails,
    tags: ['autodocs'],
    args: {
      profile: profileData,
      tokenboundAccount: zeroAddress
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import { setContext } from 'svelte';

  setContext(EXPLORER_URL, 'https://example.com');
</script>

<Template let:args>
  <ProfileDetails {...args} />
</Template>

<Story name="Default" args={{}} />

<Story
  name="Image not found"
  args={{ profile: { ...profileData, image: 'https://localhost/nothing.jpg' } }}
/>

<Story name="Missing image" args={{ profile: { ...profileData, image: undefined } }} />

<Story name="No description" args={{ profile: { ...profileData, description: undefined } }} />

<Story name="No external url" args={{ profile: { ...profileData, external_url: undefined } }} />

<Story name="No tokenboundAccount" args={{ profile: profileData, tokenboundAccount: undefined }} />
