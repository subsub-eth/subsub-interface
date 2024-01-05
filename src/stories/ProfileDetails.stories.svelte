<script lang="ts" context="module">
  import ProfileDetails from '$lib/components/profile/ProfileDetails.svelte';
  import type { ProfileTokenMetadata } from '$lib/web3/contracts/profile';

  const metadata: ProfileTokenMetadata = {
    name: 'Johnny',
    description: 'A very cool guy',
    external_url: 'https://example.com/johnny',
    image: 'https://github.com/shadcn.png'
  };

  export const meta = {
    title: 'ProfileDetails',
    component: ProfileDetails,
    tags: ['autodocs'],
    args: {
      id: 12345,
      metadata: metadata
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <ProfileDetails {...args} />
</Template>

<Story name="Default" args={{}} />

<Story
  name="Image not found"
  args={{ metadata: { ...metadata, image: 'https://localhost/nothing.jpg' } }}
/>

<Story name="Missing image" args={{ metadata: { ...metadata, image: undefined } }} />

<Story name="No description" args={{ metadata: { ...metadata, description: undefined } }} />

<Story name="No external url" args={{ metadata: { ...metadata, external_url: undefined } }} />
