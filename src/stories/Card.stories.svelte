<script context="module">
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from '$lib/components/ui/button';
    import { ChevronRight } from "lucide-svelte";


    export const meta = {
        title: "Card",
        component: Card
    }
</script>

<script>
    import { Story, Template } from '@storybook/addon-svelte-csf';

    let count = 0;
    function handleClick() {
        count += 1;
    }
</script>

<Story name="Default">
    <Card.Root class="flex flex-row p-4">
        <Avatar.Root class="mr-4 h-16 w-16">
            <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
            <Avatar.Fallback>CN</Avatar.Fallback>
          </Avatar.Root>
          <div class="col-auto self-center justify-self-start">
            <Card.Title>metadata.name</Card.Title>
            <Card.Description>metadata.description</Card.Description>
        </div>
        <Button size="icon" class="ml-auto self-center justify-self-end">
            <ChevronRight className="h-4 w-4" />
          </Button>
      </Card.Root>
</Story>
