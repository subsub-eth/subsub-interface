<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';

  export let symbol: string;
</script>

<Avatar.Root class="mr-4 h-16 w-16">
  <Avatar.Image src="" alt={symbol} />
  <Avatar.Fallback>{symbol}</Avatar.Fallback>
</Avatar.Root>
