<script lang="ts" module>
  const NewProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 chars'),
    description: z.string().optional(),
    imageUrl: ImageUrlSchema,
    externalUrl: ExternalUrlSchema
  });
</script>

<script lang="ts">
  import type { MintProfileEvents } from './action/profile-events';
  import type { MintFunc } from '$lib/web3/contracts/profile';
  import { log } from '$lib/logger';
  import { createMutation } from '@tanstack/svelte-query';
  import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import TextareaInput from '../form/TextareaInput.svelte';
  import Button from '../ui/button/button.svelte';
  import { z } from 'zod';
  import { ImageUrlSchema, ExternalUrlSchema } from '$lib/web3/contracts/common';

  interface Props extends MintProfileEvents {
    formId: string;
    mint: MintFunc;
  }

  let { formId, mint, onTxFailed, onMinted, onMintTxSubmitted }: Props = $props();

  const mintProfile = createMutation({
    mutationFn: async ([name, description, image, externalUrl, events]: Parameters<typeof mint>) =>
      mint(name, description, image, externalUrl, events),
    onError: (error) => onTxFailed?.(error),
    onSuccess: (profileId) => onMinted?.(profileId)
  });

  const form = superForm(defaults(zod(NewProfileSchema)), {
    id: formId,
    SPA: true,
    dataType: 'json',
    validators: zod(NewProfileSchema),
    onUpdate: async ({ form }) => {
      log.debug('On Update', form);
      if (!form.valid) {
        setError(form, 'invalid');
        return;
      }

      const val = form.data;
      try {
        const res = await $mintProfile.mutateAsync([
          val.name,
          val.description ?? '',
          val.imageUrl ?? '',
          val.externalUrl ?? '',
          {
            onMintTxSubmitted
          }
        ]);
        setMessage(form, 'success ' + res);
      } catch (err) {
        log.error('Profile mint failed', err);
        throw err;
      }
    }
  });

  const { form: formData, errors, enhance } = form;
</script>

<div>
  <p>
    Be aware: The more text you add to your profile the more you have to pay in gas to apply writing
    changes.
  </p>
  <form method="POST" use:enhance>
    <TextInput {form} bind:value={$formData.name} name="name" label="Name" required />
    <TextareaInput
      {form}
      bind:value={$formData.description}
      name="description"
      label="Description"
    />
    <TextInput {form} bind:value={$formData.imageUrl} name="imageUrl" label="Image" />
    <TextInput {form} bind:value={$formData.externalUrl} name="externalUrl" label="External URL" />
    <div>
      <Button type="submit" disabled={$mintProfile.isPending}>Create</Button>
    </div>
    <div>
      {#if $errors._errors}
        {#each $errors._errors as err}
          {err}
        {/each}
      {/if}
    </div>
  </form>
  <SuperDebug data={formData} />
</div>
