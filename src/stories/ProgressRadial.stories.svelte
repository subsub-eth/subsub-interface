<script lang="ts" module>
  import ProgressRadial from '$lib/components/ui/ProgressRadial.svelte';

  export const meta = {
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
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template >
  {#snippet children({ args })}
    <ProgressRadial {...args}>{args.value}</ProgressRadial>
  {/snippet}
</Template>

<Story name="no text" >
  {#snippet children({ args })}
    <ProgressRadial {...args} />
  {/snippet}
</Story>
<Story name="half with text" args={{ value: 50 }} />
<Story name="empty with text" args={{ value: 0 }} />
<Story name="full with text" args={{ value: 100 }} />
