<script lang="ts" module>
  /**
   * Additional css classes
   */
  export interface Props {
    /** address of the token */
    address: Address;
    /** fallback symbol name to show */
    fallbackSymbol: string;
    // TODO
    isLoading?: boolean;
    class?: string | undefined;
  }
</script>

<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import findTokenIcon from '$lib/token-icons';
  import type { Address } from '$lib/web3/contracts/common';
  import { cn } from '$lib/utils';

  /** show loading state indicator */

  let { address, fallbackSymbol, class: clazz = undefined }: Props = $props();

  const defaultClasses = 'h-16 w-16';
  const classes = cn(defaultClasses, clazz);

  let icon = $derived(findTokenIcon(address));
</script>

<Avatar.Root class={classes}>
  <Avatar.Image src={icon?.icon} alt={icon?.symbol} />
  <Avatar.Fallback>{fallbackSymbol}</Avatar.Fallback>
</Avatar.Root>
