<script lang="ts" module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import { type Props } from '$lib/components/profile/ProfileDetails.svelte';
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

  const { Story } = defineMeta({
    title: 'ProfileDetails',
    component: ProfileDetails,
    tags: ['autodocs'],
    args: {
      profile: profileData,
      tokenboundAccount: zeroAddress
    },
    argTypes: {}
  });
</script>

<script lang="ts">
  import { setContext } from 'svelte';

  setContext(EXPLORER_URL, 'https://example.com');

  // @ts-expect-error load function might be undefined due to Partial
  setTemplate(template);
</script>

{#snippet template(args: Props)}
  <ProfileDetails {...args} />
{/snippet}

<Story name="Default" args={{}} />

<Story
  name="Image not found"
  args={{ profile: { ...profileData, image: 'https://localhost/nothing.jpg' } }}
/>

<Story name="Missing image" args={{ profile: { ...profileData, image: undefined } }} />

<Story name="No description" args={{ profile: { ...profileData, description: undefined } }} />

<Story name="No external url" args={{ profile: { ...profileData, externalUrl: undefined } }} />

<Story name="No tokenboundAccount" args={{ profile: profileData, tokenboundAccount: undefined }} />
