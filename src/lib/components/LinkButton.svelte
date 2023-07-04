<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  export let text: string;
  export let url: string;
  export let newWindow: boolean = false
  let clazz: string = '';
  export { clazz as class };

  let opts: any;
  $: {
    opts = {};
    if (newWindow) opts.target = "_blank";
  }
</script>

<a
  class={twMerge('rounded-full bg-cyan-500 px-4 py-2 text-sm text-white shadow-sm', clazz)}
  href={url}
  {...opts}
  >{text}</a
>
