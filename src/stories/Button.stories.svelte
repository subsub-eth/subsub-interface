<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ChevronRight } from 'lucide-svelte';
  import { Mail } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';

  const { Story } = defineMeta({
    title: 'Button',
    component: Button,
    tags: ['autodocs'],
  });
</script>

<Story name="Primary">
  <Button>Primary</Button>
</Story>

<Story name="Secondary">
  <Button variant="secondary">Secondary</Button>
</Story>

<Story name="Destructive">
  <Button variant="destructive">Destructive</Button>
</Story>

<Story name="Ghost">
  <Button variant="ghost">Ghost</Button>
</Story>

<Story name="Link">
  <Button variant="link">Link</Button>
</Story>

<Story name="With Icon">
  <Button>
    <Mail class="mr-2 h-4 w-4" />
    Login with Email
  </Button>
</Story>

<Story name="Icon">
  <Button size="icon">
    <ChevronRight className="h-4 w-4" />
  </Button>
</Story>

<Story name="Loading">
  <Button loading>
    Please wait
  </Button>
</Story>
