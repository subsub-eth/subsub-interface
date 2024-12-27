<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ProgressRadial from '$lib/components/ui/ProgressRadial.svelte';

  const { Story } = defineMeta({
    title: 'ProgressRadial',
    component: ProgressRadial,
    tags: ['autodocs'],
    args: {
      value: 55
    },
    argTypes: {
      // value: {
      //   control: {
      //     type: 'number',
      //     min: 0,
      //     max: 100
      //   },
      //   description: 'Value to show',
      //   type: {
      //     required: true,
      //     name: 'number'
      //   }
      // },
    }
  });
</script>

<Story name="Default">
  {#snippet children(args)}
    <ProgressRadial {...args}>{args.value}</ProgressRadial>
  {/snippet}
</Story>

<Story name="no text">
  {#snippet children(args)}
    <ProgressRadial {...args} />
  {/snippet}
</Story>
<Story name="half with text" args={{ value: 50 }}>
  {#snippet children(args)}
    <ProgressRadial {...args}>{args.value}</ProgressRadial>
  {/snippet}
</Story>

<Story name="empty with text" args={{ value: 0 }}>
  {#snippet children(args)}
    <ProgressRadial {...args}>{args.value}</ProgressRadial>
  {/snippet}
</Story>

<Story name="full with text" args={{ value: 100 }}>
  {#snippet children(args)}
    <ProgressRadial {...args}>{args.value}</ProgressRadial>
  {/snippet}
</Story>
