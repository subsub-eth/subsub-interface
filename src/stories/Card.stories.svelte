<script context="module">
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from '$lib/components/ui/button';
    import { ChevronRight, ClipboardCopy, ExternalLink } from "lucide-svelte";
    


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

<Story name="Profil Teaser">
    <Card.Root class="flex flex-row p-4">
        <Avatar.Root class="mr-4 h-16 w-16">
            <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
            <Avatar.Fallback>CN</Avatar.Fallback>
          </Avatar.Root>
          <div class="col-auto self-center space-y-1.5 justify-self-start">
            <Card.Title>metadata.name</Card.Title>
            <Card.Description>metadata.description</Card.Description>
        </div>
        <Button size="icon" class="ml-auto self-center justify-self-end">
            <ChevronRight className="h-4 w-4" />
          </Button>
      </Card.Root>
</Story>

<Story name="Profil Detail">
    <Card.Root class="p-4">
        <div class="flex flex-row gap-x-4">
            <div class="basis-1/4">
                <Avatar.Root class="mr-4 w-full max-w-[120px] h-auto">
                    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
                    <Avatar.Fallback>CN</Avatar.Fallback>
                  </Avatar.Root>
            </div>
              <div class="basis-3/4 self-center justify-self-start space-y-3">
                <div class="flex">
                    <Card.Title>metadata.name</Card.Title>
                <Button size="iconSm" variant="ghost" class="ml-auto self-center justify-self-end">
                    <ExternalLink className="h-4 w-4" />
                </Button>
                </div>
                <Card.Description>metadata.description: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Card.Description>
            </div>
        </div>
        <div class="mt-2">
            <div class="flex flex-row items-center gap-x-4">
                <div class="basis-1/4 text-sm font-medium">External Link:</div>
                <Button variant="link" class="basis-3/4 justify-start p-0 truncate">
                    <span class="truncate overflow-hidden">http://localhost:6006/?path=/story/card--profil-detail&globals=backgrounds.value:!hex(333333)</span>
                </Button>
            </div>
            <div class="flex flex-row items-center gap-x-4">
                <div class="basis-1/4 text-sm font-medium">Owner:</div>
                <p class="basis-3/4 text-sm font-medium flex flex-row justify-start">
                    <span>metadata.owner</span>
                    <Button size="iconSm" variant="ghost" class="ml-2 self-center">
                        <ClipboardCopy className="h-4 w-4" />
                    </Button>
                    <Button size="iconSm" variant="ghost" class="ml-2 self-center">
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </p>
            </div>
        </div>
      </Card.Root>
</Story>
