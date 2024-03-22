<script lang="ts" context="module">
  export const SUBSCRIPTION_CONTRACT_CTX = 'subscriptionContract';
  export const SUBSCRIPTION_DATA_CTX = 'subscriptionData';
  export const SUBSCRIPTION_WARNIGNS_CTX = 'subscriptionWarnings';
  export const ERC20_CONTRACT_CTX = 'erc20Contract';
  export const ERC20_DATA_CTX = 'erc20Data';
  export const ERC20_ALLOWANCE_CTX = 'erc20Allowance';
  export const ERC20_BALANCE_CTX = 'erc20Balance';
  export const TOKEN_PRICE_CTX = 'tokenPrice';
</script>

<script lang="ts">
  import type { LayoutData } from './$types';
  import { setContext } from 'svelte';
  import { subscriptionQueries } from '$lib/query/subscription-queries';

  export let data: LayoutData;

  const addr = data.subscriptionAddr;

  // move the creation code into a seperate module
  const q = subscriptionQueries(addr);

  setContext(SUBSCRIPTION_CONTRACT_CTX, q.subscriptionContract);
  setContext(SUBSCRIPTION_DATA_CTX, q.subscriptionData);
  setContext(SUBSCRIPTION_WARNIGNS_CTX, q.warnings);

  setContext(ERC20_CONTRACT_CTX, q.erc20Contract);
  setContext(ERC20_DATA_CTX, q.erc20Data);
  setContext(ERC20_ALLOWANCE_CTX, q.erc20Allowance);
  setContext(ERC20_BALANCE_CTX, q.erc20Balance);
  setContext(TOKEN_PRICE_CTX, q.tokenPrice);
</script>

<slot />
