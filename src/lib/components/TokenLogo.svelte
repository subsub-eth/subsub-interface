<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import findTokenIcon from '$lib/token-icons';
  import type { address } from '$lib/web3/contracts/common';

  export let address: address;
  export let fallbackSymbol: string;

  const icon = findTokenIcon(address);
</script>

<Avatar.Root class="mr-4 h-16 w-16">
  <Avatar.Image src={icon?.icon} alt={icon?.symbol} />
  <Avatar.Fallback>{fallbackSymbol}</Avatar.Fallback>
</Avatar.Root>
