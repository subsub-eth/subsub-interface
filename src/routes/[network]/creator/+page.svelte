<script lang="ts">
  import { Creator__factory } from '@createz/contracts/types/ethers-contracts/factories/Creator__factory';

  import { ethersProvider} from '$lib/web3/ethers';
  import { creatorContractAddr } from '$lib/contractCoordinates';
    import { primaryWallet } from '$lib/web3/onboard';

  $: creator = Creator__factory.connect(
    creatorContractAddr,
    $ethersProvider as any //ContractRunner
  );

$: currentAcc = $primaryWallet?.accounts[0];

</script>

<h1>Creator overview</h1>

currentAcc: {currentAcc?.address}

  {#await creator.ownerOf(1)}
    looking up
  {:then owner}
    owner: {owner}
  {:catch err}
    error
    {err}
  {/await}
