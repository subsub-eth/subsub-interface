<script lang="ts">
  import { matchEvents } from '$lib/web3/ethers';
  import { toast } from '@zerodevx/svelte-toast';
  import { currentAccount } from '$lib/web3/onboard';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { CREATOR_CONTRACT, requireContext } from '$lib/contexts';
  import type { Creator } from '@createz/contracts/types/ethers-contracts/Creator';
  import type { Readable } from 'svelte/store';
  import { CreatorMetadataSchema, type CreatorMetadata } from '$lib/web3/contracts/creator';

  const creator = requireContext<Readable<Creator>>(CREATOR_CONTRACT);

  let tokenData: CreatorMetadata = {
    name: '',
    description: '',
    image: '',
    external_url: ''
  };

  let formDisabled = false;

  const mint = async () => {
    formDisabled = true;
    try {
      const data = CreatorMetadataSchema.parse(tokenData);

      const tx = await $creator.mint(
        data.name,
        data.description ?? '',
        data.image ?? '',
        data.external_url ?? ''
      );
      toast.push(`Transaction submitted: ${tx.hash}`, { pausable: true });

      const receipt = await tx.wait();

      const logs = receipt?.logs;
      const acc = $currentAccount;
      if (acc) {
        const res = await matchEvents(logs as [], $creator, $creator.filters.Minted(acc));
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
      console.error('Transaction failed', err);
    } finally {
      formDisabled = false;
    }
  };
</script>

<h1>Create new Creator Token</h1>
<p>contract: <span>{#await $creator.getAddress() then addr}{addr}{/await}</span></p>

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
          bind:value={tokenData.external_url}
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
