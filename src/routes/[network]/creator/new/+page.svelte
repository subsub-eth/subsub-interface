<script lang="ts">
  import { Creator__factory } from '@createz/contracts/types/ethers-contracts/factories/Creator__factory';

  import { ethersSigner, matchEvents } from '$lib/web3/ethers';
  import type { ContractRunner, Interface } from 'ethers';
  import { creatorContractAddr } from '$lib/chain-config';

  const contractAddr = creatorContractAddr;

  $: creator = Creator__factory.connect(
    contractAddr,
    $ethersSigner as any //ContractRunner
  );

  const mint = async () => {
    try {
      const tx = await creator.mint();
      console.log(tx);
      console.log('transaction hash', tx.hash);
      const ownerAddr = await $ethersSigner?.getAddress();
      const receipt = await tx.wait();
      console.log('transaction confirmed', receipt);
      console.log('logs', receipt?.logs);

      const logs = receipt?.logs;
      const filter = creator.filters.Minted("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", "10");
      console.log('filter', filter);
      console.log('topic filter', await filter.getTopicFilter());
      const mintedEvent = creator.interface.getEvent('Minted');
      console.log('mintedEvent', mintedEvent);
      console.log('topicHash', mintedEvent.topicHash);
      const res = await matchEvents(logs as [], creator, creator.filters.Minted());
      console.log('matched events', res);

      console.log('new creator token id', res[0].args.tokenId);

      // for (const l of logs ? logs : []) {
      //   const filter = creator.filters.Minted(ownerAddr);
      //   const log = creator.interface.parseLog(l as any);
      //   console.log('log', l, log);
      //   if (log?.topic === mintedEvent.topicHash) {
      //       console.log('new tokenId', log.args[1], log.args.tokenId)
      //     }
      // }

      // creator.on(creator.filters.Minted, (to, tokenId, event) => {
      //     console.log("event listener");
      //     if (to === ownerAddr) {
      //         console.log('new token Id', tokenId);
      //         console.log(event);
      //       }
      //
      //   })

      // console.log('new token:', result);
    } catch (err) {
      console.error('transaction failed', err);
    }
  };
</script>

<h1>Create new Creator Token</h1>
<p>contract: <span>{contractAddr}</span></p>

<button on:click={mint}>create</button>
