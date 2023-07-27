<script lang="ts">
    import { twMerge } from 'tailwind-merge';
  
    export let text: string;
    export let level: 1 | 2 | 3 | 4 | 5 | 6;

    const getHeadlineSize = (level: number) => {
        switch (level) {
            case 1: {
                return 'text-6xl';
            }
            case 2: {
                return 'text-5xl';
            }
            case 3: {
                return 'text-4xl';
            }
            case 4: {
                return 'text-3xl';
            }
            case 5: {
                return 'text-2xl';
            }
            case 6: {
                return 'text-xl';
            }
        }
    }

    const base = 'font-semibold leading-6';

    let styleModifier: string = '';

</script>

<svelte:element this={`h${level}`}  class={twMerge(base, getHeadlineSize(level))}>
{text}
</svelte:element>

  
  