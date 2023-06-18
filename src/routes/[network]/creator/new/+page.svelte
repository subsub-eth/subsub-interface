<script lang="ts">
  import { Creator__factory } from '@createz/contracts/types/ethers-contracts/factories/Creator__factory';

  import { ethersSigner, matchEvents } from '$lib/web3/ethers';
  import { creatorContractAddr } from '$lib/chain-config';
  import { toast } from '@zerodevx/svelte-toast';
  import { currentAccount } from '$lib/web3/onboard';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const contractAddr = creatorContractAddr;

  $: creator = Creator__factory.connect(contractAddr, $ethersSigner);

  let tokenData = {
    name: '',
    description: '',
    image: '',
    externalUrl: ''
  };

  let formDisabled = false;

  const mint = async () => {
    formDisabled = true;
    try {
      const tx = await creator.mint(
        tokenData.name,
        tokenData.description,
        tokenData.image,
        tokenData.externalUrl
      );
      toast.push(`Transaction submitted: ${tx.hash}`, { pausable: true });

      const receipt = await tx.wait();

      const logs = receipt?.logs;
      const acc = $currentAccount;
      if (acc) {
        const res = await matchEvents(logs as [], creator, creator.filters.Minted(acc));
        if (res[0]) {
          const newTokenId = res[0].args.tokenId;
          toast.push(`New token ID: ${newTokenId}`, { pausable: true });
          goto($page.url.pathname + `../${newTokenId}`); // TODO fix this
        }
      }
    } catch (err) {
      toast.push('Transaction failed', {
        pausable: true,
        theme: {
          '--toastBackground': 'red',
          '--toastColor': 'white',
          '--toastBarBackground': 'fuchsia'
        }
      });
    } finally {
      formDisabled = false;
    }
  };
</script>

<h1>Create new Creator Token</h1>
<p>contract: <span>{contractAddr}</span></p>

<div>
  <p>
    Be aware: The more text you add to your profile the more you have to pay in gas to apply writing
    changes.
  </p>
  <form on:submit={mint}>
    <fieldset>
      <div>
        <label for="name">Name:</label>
        <input
          id="name"
          name="name"
          bind:value={tokenData.name}
          placeholder="Your name"
          disabled={formDisabled}
          required
          minlength="2"
        />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea
          id="description"
          name="description"
          bind:value={tokenData.description}
          disabled={formDisabled}
          placeholder="Some text for people to recognize you"
        />
      </div>
      <div>
        <label for="image">Image:</label>
        <input
          id="image"
          name="image"
          bind:value={tokenData.image}
          disabled={formDisabled}
          placeholder="https://example.com/my-image.png"
        />
      </div>
      <div>
        <label for="externalUrl">External URL:</label>
        <input
          id="externalUrl"
          name="externalUrl"
          bind:value={tokenData.externalUrl}
          disabled={formDisabled}
          placeholder="https://www.my-website.com"
        />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </fieldset>
  </form>
</div>
