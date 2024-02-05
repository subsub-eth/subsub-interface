<script lang="ts">
  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import { MetadataSchema, type Metadata } from '$lib/web3/contracts/common';
  import { createEventDispatcher } from 'svelte';
  import type { MintProfileEvents } from './action/profile-events';
  import type { MintFunc } from '$lib/web3/contracts/profile';
  import { log } from '$lib/logger';
  import { createMutation } from '@tanstack/svelte-query';

  export let mint: MintFunc;

  const dispatch = createEventDispatcher<MintProfileEvents>();

  const mintProfile = createMutation({
    mutationFn: async ([name, description, image, externalUrl, events]: Parameters<typeof mint>) =>
      mint(name, description, image, externalUrl, events),
    onError: (error) => dispatch('txFailed', error),
    onSuccess: (profileId) => dispatch('minted', profileId)
  });

  const { form } = createForm<Metadata>({
    async onSubmit(values) {
      try {
        return await $mintProfile.mutateAsync([
          values.name,
          values.description ?? '',
          values.image ?? '',
          values.external_url ?? '',
          {
            onMintTxSubmitted: (hash) => dispatch('mintTxSubmitted', hash)
          }
        ]);
      } catch (err) {
        log.error('Profile mint failed', err);
        throw err;
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
          disabled={$mintProfile.isPending}
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
          disabled={$mintProfile.isPending}
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
          disabled={$mintProfile.isPending}
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
          disabled={$mintProfile.isPending}
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
        <button type="submit" disabled={$mintProfile.isPending}>create</button>
      </div>
    </fieldset>
  </form>
</div>
