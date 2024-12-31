<script lang="ts">
  import { run } from 'svelte/legacy';

  import { twMerge } from 'tailwind-merge';

  /**
   * Additional css classes
   */
  interface Props {
    /**
     * Link text
     */
    text: string;
    /**
     * Href url of the link
     */
    url: string;
    /**
     * If the link should open a new window
     */
    newWindow?: boolean;
    /**
     * Show link as a fake button
     */
    showAsButton?: boolean;
    /**
     * Is this a fake print button
     */
    primary?: boolean;
    class?: string;
  }

  let {
    text,
    url,
    newWindow = false,
    showAsButton = false,
    primary = false,
    class: clazz = ''
  }: Props = $props();

  let opts: { target?: string } = $state({});
  run(() => {
    if (newWindow) opts.target = '_blank';
  });

  let btnMode = $derived(primary ? 'btn--primary' : 'btn--secondary');

  let base = $derived(showAsButton ? `btn ${btnMode}` : 'link');
</script>

<a class={twMerge(base, clazz)} href={url} {...opts}>{text}</a>
