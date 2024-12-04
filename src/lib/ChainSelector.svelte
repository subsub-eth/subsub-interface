<script lang="ts">
  import { currentChains, getChain } from '$lib/chain-config';
  import { currentChainId } from './web3/onboard';

  let currentChain = $derived(getChain($currentChainId ? $currentChainId : 0)?.[1].displayName);
  let dropdownVisibility = $state('hidden');

  const onOpen = () => {
    dropdownVisibility = 'block';
  };
</script>

<button
  class="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  type="button"
  onclick={onOpen}>{currentChain ? currentChain : '???'}</button
>
<!-- Dropdown menu -->
<div
  class="z-10 {dropdownVisibility} w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
>
  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
    {#each currentChains as [chain, data]}
      <li>
        <a
          href="#"
          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >{data.displayName}</a
        >
      </li>
    {/each}
  </ul>
</div>
