<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PropertyBox from '$lib/components/ui/PropertyBox.svelte';

  const { Story } = defineMeta({
    title: 'PropertyBox',
    component: PropertyBox,
    tags: ['autodocs'],
    args: {
      title: 'My Property',
      value: '12345',
      subValue: 'per Month'
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
  });
</script>

<script lang="ts">
  import { PauseCircle } from 'lucide-svelte';
</script>

<Story name="Default">
  {#snippet children(args)}
    {/* @ts-expect-error partial type */ null}
    <PropertyBox {...args} TitleIcon={PauseCircle} />
  {/snippet}
</Story>
