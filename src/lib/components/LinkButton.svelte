<script lang="ts">
  import { run } from 'svelte/legacy';

  import { twMerge } from 'tailwind-merge';

  interface Props {
    text: string;
    url: string;
    newWindow?: boolean;
    class?: string;
  }

  let { text, url, newWindow = false, class: clazz = '' }: Props = $props();

  let opts: { target?: string } = $state({});
  run(() => {
    if (newWindow) opts.target = '_blank';
  });
</script>

<a
  class={twMerge('rounded-full bg-cyan-500 px-4 py-2 text-sm text-white shadow-sm', clazz)}
  href={url}
  {...opts}>{text}</a
>
