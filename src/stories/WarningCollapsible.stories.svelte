<script lang="ts" module>
  import WarningCollapsible from '$lib/components/ui2/WarningCollapsible.svelte';
  import { createMessages } from './fixtures';

  export const meta = {
    title: 'WarningCollapsible',
    component: WarningCollapsible,
    tags: ['autodocs'],
    args: {
      messages: createMessages(1, 2, 3)
    },
    argTypes: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template >
  {#snippet children({ args })}
    <WarningCollapsible {...args} />
  {/snippet}
</Template>

<Story name="default" args={{}} />

<Story name="only warning" args={{ messages: createMessages(0, 1, 0) }} />
<Story name="no warnings" args={{ messages: createMessages(0, 0, 0) }} />
