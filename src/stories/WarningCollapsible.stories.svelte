<script lang="ts" module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import WarningCollapsible from '$lib/components/ui2/WarningCollapsible.svelte';
  import { createMessages } from './fixtures';

  const { Story } = defineMeta({
    title: 'WarningCollapsible',
    component: WarningCollapsible,
    tags: ['autodocs'],
    args: {
      messages: createMessages(1, 2, 3)
    },
    argTypes: {}
  });
</script>

<script lang="ts">
  setTemplate(template);
</script>

{#snippet template(args)}
  <WarningCollapsible {...args} />
{/snippet}

<Story name="default" args={{}} />

<Story name="only warning" args={{ messages: createMessages(0, 1, 0) }} />
<Story name="no warnings" args={{ messages: createMessages(0, 0, 0) }} />
