<script lang="ts" module>
  import { Button, type ButtonProps } from '$lib/components/ui/button';

  export interface Props extends ButtonProps {
    loading?: boolean;
  }
</script>

<script lang="ts">
  import { urlFromTemplate, URL_PARAMS_CONTEXT } from '$lib/url';
  import { page } from '$app/state';
  import { getContext, hasContext } from 'svelte';
  import { Loader2 } from 'lucide-svelte';

  let { href: rawHref, loading, disabled, children, ...restProps }: Props = $props();

  let href = $derived(
    rawHref
      ? urlFromTemplate(
          rawHref,
          hasContext(URL_PARAMS_CONTEXT) ? getContext(URL_PARAMS_CONTEXT) : page.params
        )
      : undefined
  );
</script>

<Button disabled={disabled || loading} {href} {...restProps}>
  {#if loading}
    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
  {/if}
  {@render children?.()}
</Button>
