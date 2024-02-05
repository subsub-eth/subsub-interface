<script lang="ts">
  import { page } from '$app/stores';
  import { urlFromTemplate } from '$lib/url';

  export let template: string;

  $: replacedPath = urlFromTemplate(template, $page.params);
</script>

<slot path={replacedPath} />
