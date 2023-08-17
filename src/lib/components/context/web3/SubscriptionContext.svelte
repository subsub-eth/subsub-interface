<script lang="ts">
    import type { Subscription } from "@createz/contracts/types/ethers-contracts";
    import type { Signer } from "ethers";


export let contract: [string, Signer] | Subscription;
export let id: bigint;



</script>

<slot />
