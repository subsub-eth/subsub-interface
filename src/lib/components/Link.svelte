<script lang="ts" module>
  export type Props = HTMLAnchorAttributes;
</script>

<script lang="ts">
  import { page } from '$app/state';

  import { URL_PARAMS_CONTEXT, urlFromTemplate } from '$lib/url';
  import { getContext, hasContext } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  let { href: rawHref, children, ...restProps }: Props = $props();

  let href = $derived(
    rawHref
      ? urlFromTemplate(
          rawHref,
          hasContext(URL_PARAMS_CONTEXT) ? getContext(URL_PARAMS_CONTEXT) : page.params
        )
      : undefined
  );
</script>

<a {href} {...restProps}>{@render children?.()}</a>
