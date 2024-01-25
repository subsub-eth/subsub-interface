<script lang="ts">
  import { chainEnvironment } from '$lib/chain-context';
  import { getContext } from 'svelte';
  import { log } from '$lib/logger';
  import { EXPLORER_URL } from '$lib/contexts';

  type CreateUrl = (explorerUrl: string) => string;

  /** Function to create a URL given a block explorer base URL */
  export let createUrl: CreateUrl;

  /** override explorerUrl getting the url from the context */
  export let explorerUrl: string | undefined = undefined;

  const handleCreateUrl = (createUrl: CreateUrl, explorerUrl: string | undefined) => {
    const explorer = explorerUrl ?? getContext(EXPLORER_URL);
    if (!explorer) {
      const msg = 'Explorer Url not defined';
      log.error(msg);
      throw new Error(msg);
    }
    return createUrl(explorer);
  };

  $: url = handleCreateUrl(createUrl, explorerUrl ?? $chainEnvironment?.chainData.explorerUrl);
</script>

<slot {url} />

