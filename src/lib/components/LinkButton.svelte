<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  export let text: string;
  export let url: string;
  export let target: '_self' | '_blank' = '_self';
  let clazz: string = '';
  export { clazz as class };
</script>

<a
  class={twMerge('rounded-full bg-cyan-500 px-4 py-2 text-sm text-white shadow-sm', clazz)}
  href={url}
  {target}>{text}</a
>
