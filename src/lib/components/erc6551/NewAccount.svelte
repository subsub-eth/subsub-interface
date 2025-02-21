<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { log } from '$lib/logger';
  import { queryClient } from '$lib/query/config';
  import { erc6551Keys } from '$lib/query/keys';
  import type { Address } from '$lib/web3/contracts/common';
  import { createMutation } from '@tanstack/svelte-query';

  interface Props {
    create: () => Promise<Address>;
  }

  let { create }: Props = $props();

  // TODO invalidate account query
  const mutation = createMutation({
    mutationFn: create,

    onError: (error) => {
      log.error('Failed to create new ERC6551 account', error);
      // TODO
    },
    onSuccess: (addr) => {
      log.debug('invalidating erc6551 account query');
      // TODO Fixme move to page
      queryClient.invalidateQueries({ queryKey: erc6551Keys.account(addr) });
    }
  });
</script>

{#if $mutation.isError}
  error: {$mutation.error}
{/if}

<div>
  <p>please deploy new account because foo</p>

  <Button onclick={() => $mutation.mutate()} disabled={$mutation.isPending}
    >Deploy new Account</Button
  >
</div>
