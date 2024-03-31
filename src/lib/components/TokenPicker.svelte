<script lang="ts" context="module">
  export type KnownToken = { name: string; symbol: string; address: Address };
</script>

<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { AddressSchema, type Address } from '$lib/web3/contracts/common';
  import { ChevronDown, Loader2 } from 'lucide-svelte';
  import { Input } from './ui/input';
  import { truncateAddress } from '$lib/helpers';
  import TokenLogo from './TokenLogo.svelte';
  import { derived, writable } from 'svelte/store';
  import type { Erc20Data } from '$lib/web3/contracts/erc20';
  import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
  import { isAddress } from 'ethers';
  import { addressEquals } from '$lib/web3/helpers';
  import { log } from '$lib/logger';
  import { tokenSearch } from '$lib/query/keys';

  /** address of the selected token */
  export let token: Address | undefined;
  /** symbol of the selected token if any */
  export let tokenSymbol: string | undefined;
  /** load function to search token on a specific address */
  export let loadByAddress: (address: Address) => Promise<Erc20Data>;
  /** list of known tokens to display for quick pick */
  export let knownTokens: Array<KnownToken>;

  let open: boolean = false;
  let searchString = writable('');

  const searchQuery = createQuery<Array<KnownToken>>(
    derived(searchString, (searchString) => ({
      queryKey: tokenSearch(searchString),
      queryFn: async () => {
        const ss = searchString.trim().toLowerCase();
        if (isAddress(ss)) {
          // search exact match in known list
          const result = knownTokens.find((t) => addressEquals(t.address, ss));
          if (result) {
            return [result];
          }

          // search for token on chain
          log.debug('loading token from address', ss);
          return [await loadByAddress(AddressSchema.parse(ss))];
        }

        // filter known tokens by search string
        const result = knownTokens.filter((t) => {
          if (ss === '') {
            return true;
          }
          const contains = (s: string) => s.trim().toLowerCase().includes(ss);
          return contains(t.symbol) || contains(t.name) || contains(t.address);
        });
        return result;
      },
      staleTime: 3 * 60 * 1000,
      placeholderData: keepPreviousData
    }))
  );

  const selectToken = (address: Address, symbol: string) => {
    token = address;
    tokenSymbol = symbol;
    open = false;
  };
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <div class="flex gap-2 text-lg font-semibold text-foreground">
      {#if !token}
        <span>Select Token</span>
      {:else}
        <span>{tokenSymbol}</span>
      {/if}
      <ChevronDown />
    </div>
  </Dialog.Trigger>
  <Dialog.Content class="text-foreground">
    <Dialog.Header class="text-left">
      <Dialog.Title>Select a token</Dialog.Title>
      <Dialog.Description
        >Only ERC20 tokens are supported. Other types of tokens might make your subscription plan
        unusable.</Dialog.Description
      >
    </Dialog.Header>
    <div class="flex flex-col gap-4">
      <div class="pb-4">
        <Input
          class="font-semibold"
          placeholder="Search by name or address"
          bind:value={$searchString}
        />
      </div>
      <h3 class="flex gap-2">
        {#if !$searchString}
          Popular Tokens
        {:else}
          Search Results
          {#if $searchQuery.isPending || $searchQuery.isFetching}
            <Loader2 class="mr-2 h-4 w-4 animate-spin self-center" />
          {/if}
        {/if}
      </h3>
      <div class="h-[50vh] overflow-auto">
        {#if $searchQuery.isError}
          Failed to load tokens
        {/if}
        {#if $searchQuery.isSuccess}
          {#if $searchQuery.data.length === 0}
            No results
          {/if}
          <ul class="">
            {#each $searchQuery.data as t}
              <li>
                <button
                  class="my-2 flex w-full cursor-pointer gap-4 p-2 hover:bg-secondary"
                  on:click={() => selectToken(t.address, t.symbol)}
                >
                  <TokenLogo
                    address={t.address}
                    fallbackSymbol={t.symbol}
                    class="size-10 self-center"
                  />
                  <div class="flex flex-col text-left">
                    <div>{t.name}</div>
                    <div class="text-sm text-muted-foreground">
                      {t.symbol}
                      <span class="text-xs">({truncateAddress(t.address)})</span>
                    </div>
                    <div></div>
                  </div>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
    <Dialog.Footer></Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
