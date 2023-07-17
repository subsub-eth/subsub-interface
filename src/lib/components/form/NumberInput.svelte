<script lang="ts">
  import { ValidationMessage } from '@felte/reporter-svelte';

  export let name: string;
  export let label: string;
  export let value: number | null = null;
  export let disabled = false;
  export let required = false;

  let opts: any = {};
  $: {
    opts = {};
    if (disabled) opts.disabled = disabled;
    if (required) opts.required = required;
    if (value !== null) opts.value = value;
  }
</script>

<div>
  <label for={name}>{label}</label>
  <input type="number" id={name} {name} class="bg-gray-500" {...opts} />
  <ValidationMessage for={name} let:messages>
    {#if messages}
      <span>{messages}</span>
    {/if}
  </ValidationMessage>
</div>
