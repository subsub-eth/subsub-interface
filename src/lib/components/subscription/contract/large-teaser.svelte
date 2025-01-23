<script lang="ts" module>
  export type Props = BaseProps;
</script>

<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { type BaseProps, baseValues } from './base';
  import Link from '$lib/components/Link.svelte';
  import { truncateAddress } from '$lib/helpers';
  import type { Address } from '$lib/web3/contracts/common';
  import { ownerName } from '$lib/web3/contracts/profile';

  let { contractData, paymentTokenData, owner }: Props = $props();

  let { rate, activeSubs } = $derived(baseValues({ contractData }));

  let truncateOwnerAddress = (addr: Address) => truncateAddress(addr, 7);
</script>

<Card.Root>
  <Card.Content class="p-0">
    <div class="">
      <div>
        <Link href={`/[network]/s/${contractData.address}}`}>
          {#if contractData.image}
            <img
              class="max-h-[50vh] w-full rounded-lg object-cover object-center"
              src={contractData.image}
              alt={contractData.name}
            />
          {/if}
        </Link>
      </div>
      <div class="flex justify-between gap-4 p-2">
        <div class="flex flex-col">
          <h5 class="font-bold">{contractData.name}</h5>
          <h6>
            {#if !owner || owner.isPending}
              {truncateOwnerAddress(contractData.owner)}
            {:else}
              {ownerName(owner.data, truncateOwnerAddress)}
            {/if}
          </h6>
        </div>

        <div>
          <p><span class="font-semibold">{rate}</span> {paymentTokenData.symbol} / mon</p>
          <p><span class="font-semibold">{activeSubs}</span> subs</p>
        </div>
      </div>
    </div>
  </Card.Content>
</Card.Root>
