<script lang="ts">
  import { matchEvents } from '$lib/web3/ethers';
  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import { MetadataSchema, type Metadata } from '$lib/web3/contracts/common';
  import type { EventDispatcher } from 'svelte';
  import type { MintEvents } from '$lib/components/profile/action/profile-events';
  import toast from '$lib/toast';

  export let mint: (
    name: string,
    description: string,
    image: string,
    externalUrl: string,
    dispatch: EventDispatcher<MintEvents>
  ) => Promise<string>;

  let formDisabled = false;

  // TODO refactor to dispatch events for redirecting, toasts, etc.
  // TODO redirect bug?
  const { form } = createForm<Metadata>({
    async onSubmit(values) {
      formDisabled = true;
      try {
        const tx = await profile.mint(
          values.name,
          values.description ?? '',
          values.image ?? '',
          values.external_url ?? ''
        );
        toast.info(`Transaction submitted: ${tx.hash}`);

        const receipt = await tx.wait();

        const logs = receipt?.logs;
        if (currentAccount) {
          const res = await matchEvents(
            logs as [],
            profile,
            profile.filters.Minted(currentAccount)
          );
          if (res[0]) {
            const newTokenId = res[0].args.tokenId;
            toast.info(`New token ID: ${newTokenId}`);
            onSuccess(newTokenId);
          }
        }
      } catch (err) {
        toast.error('Transaction failed');
        console.error('Transaction failed', err);
      } finally {
        formDisabled = false;
      }
    },
    extend: [validator({ schema: MetadataSchema }), reporter]
  });
</script>

<div>
  <p>
    Be aware: The more text you add to your profile the more you have to pay in gas to apply writing
    changes.
  </p>
  <form use:form>
    <fieldset>
      <div>
        <label for="name">Name:</label>
        <input
          id="name"
          name="name"
          placeholder="Your name"
          disabled={formDisabled}
          required
          minlength="2"
          class="bg-gray-500"
        />
        <ValidationMessage for="name" let:messages>
          {#if messages}
            <span>{messages}</span>
          {/if}
        </ValidationMessage>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea
          id="description"
          name="description"
          disabled={formDisabled}
          placeholder="Some text for people to recognize you"
          class="bg-gray-500"
        />
        <ValidationMessage for="description" let:messages>
          {#if messages}
            <span>{messages}</span>
          {/if}
        </ValidationMessage>
      </div>
      <div>
        <label for="image">Image:</label>
        <input
          id="image"
          name="image"
          disabled={formDisabled}
          placeholder="https://example.com/my-image.png"
          class="bg-gray-500"
        />
        <ValidationMessage for="image" let:messages>
          {#if messages}
            <span>{messages}</span>
          {/if}
        </ValidationMessage>
      </div>
      <div>
        <label for="external_url">External URL:</label>
        <input
          id="external_url"
          name="external_url"
          disabled={formDisabled}
          placeholder="https://www.my-website.com"
          class="bg-gray-500"
        />
        <ValidationMessage for="external_url" let:messages>
          {#if messages}
            <span>{messages}</span>
          {/if}
        </ValidationMessage>
      </div>
      <div>
        <button type="submit" disabled={formDisabled}>create</button>
      </div>
    </fieldset>
  </form>
</div>
