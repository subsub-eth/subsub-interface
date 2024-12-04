<script lang="ts">
  import { page } from '$app/stores';
  import { urlFromTemplate } from '$lib/url';
  import { type Snippet } from 'svelte';

  interface Props {
    template: string;
    children?: Snippet<[{ path: string }]>;
  }

  let { template, children }: Props = $props();

  let replacedPath = $derived(urlFromTemplate(template, $page.params));
</script>

TODO REFACTOR
{@render children?.({ path: replacedPath })}
