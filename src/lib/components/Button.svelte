<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import Loading from './Loading.svelte';

  // TODO when loading do not show as disabled, but still unclickable

  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false;
  /**
   * Button contents
   */
  export let label: string = '';
  /**
   * link target
   */
  export let href: string = '';
  /**
   * button input type
   */
  export let type: string = 'button';
  /**
   * Button disabled or not
   */
  export let isDisabled: boolean = false;
  /**
   * isLoading
   */
  export let isLoading: boolean = false;
  /**
   * Additional css classes
   */
  let clazz: string = '';
  export { clazz as class };

  const base = 'btn';

  let props = {};
  let classes = '';

  $: mode = primary ? 'btn--primary' : 'btn--secondary';

  $: {
    const p: any = {};
    let c = '';
    if (href) {
      c = isDisabled || isLoading ? 'pointer-events-none opacity-60' : '';
    } else {
      p.disabled = isDisabled || isLoading;
    }
    props = p;
    classes = c;
  }
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  type={href ? undefined : type}
  {href}
  class={twMerge(base, mode, classes, clazz)}
  {...props}
  on:click
  role={href ? 'button' : undefined}
>
  {#if isLoading}
    <Loading size="small" class="mr-2" />
  {/if}
  {label}
</svelte:element>
