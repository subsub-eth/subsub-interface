<script context="module">
    import { Button } from '$lib/components/ui/button';
    import { ChevronRight } from "lucide-svelte";
    import { Loader2 } from "lucide-svelte";
    import { Mail } from "lucide-svelte";

    export const meta = {
        title: "Button",
        component: Button
    }
</script>

<script>
    import { Story, Template } from '@storybook/addon-svelte-csf';

    let count = 0;
    function handleClick() {
        count += 1;
    }
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
    <Button disabled>
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Please wait
  </Button>
</Story>