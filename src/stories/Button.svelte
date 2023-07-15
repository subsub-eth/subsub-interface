<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false;
  /**
   * Button contents
   */
  export let label: string = '';
  /**
   * Additional css classes
   */
  let clazz: string = '';
  export { clazz as class };

  const base = 'cursor-pointer rounded-lg py-2 px-6 border-1 inline-block';

  const primaryStyle = 'text-white bg-gradient-to-br from-primary-purple1 to-primary-purple4 border-primary-purple1';

  const secondaryStyle = 'text-primary-purple1 bg-primary-purple1/[0.15] border-primary-purple1';

  $: mode = primary ? primaryStyle : secondaryStyle;

</script>

<button
  type="button"
  class={twMerge(base, mode, clazz)}
  on:click
>
  {label}
</button>
