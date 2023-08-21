<script lang="ts">
  import { page } from '$app/stores';
  import { profileImageFallback } from '$lib/static-content';
    import type { ProfileTokenMetadata } from '$lib/web3/contracts/profile';

  export let id: bigint;
  export let metadata: ProfileTokenMetadata;

</script>

<div class="rounded-xl border-2 border-solid p-2">
  <p>id: {id}</p>
  <p><a href={`${$page.url.pathname}${id}/`}>Details</a></p>

      {#if metadata.image}
        <img
          src={metadata.image}
          alt={`image of ${metadata.name}`}
          on:error={() => (metadata.image = profileImageFallback)}
        />
      {/if}
      <p>{metadata.name}</p>
      {#if metadata.description}
        <p>{metadata.description}</p>
      {/if}
      {#if metadata.external_url}
        <p><a href={metadata.external_url} target="_blank">External Link</a></p>
      {/if}
</div>
