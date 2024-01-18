<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import findTokenIcon from '$lib/token-icons';
  import type { Address } from '$lib/web3/contracts/common';
  import { cn } from '$lib/utils';

  /** address of the token */
  export let address: Address;

  /** fallback symbol name to show */
  export let fallbackSymbol: string;

  /** show loading state indicator */
  // TODO
  export let isLoading: boolean = false;

  /**
   * Additional css classes
   */
  let clazz: string | undefined = undefined;
  export { clazz as class };

  const defaultClasses = 'h-16 w-16';
  const classes = cn(defaultClasses, clazz);

  const icon = findTokenIcon(address);
</script>

<Avatar.Root class={classes}>
  <Avatar.Image src={icon?.icon} alt={icon?.symbol} />
  <Avatar.Fallback>{fallbackSymbol}</Avatar.Fallback>
</Avatar.Root>
