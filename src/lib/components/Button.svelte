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
   * Button disabled or not
  */
  export let isDisabled: boolean = false;
  /**
   * Additional css classes
   */
  let clazz: string = '';
  export { clazz as class };

  const base = 'btn';

  $: mode = primary ? 'btn--primary' : 'btn--secondary';

</script>

<button
  type="button"
  class={twMerge(base, mode, clazz)}
  disabled={isDisabled}
  on:click
>
  {label}
</button>
