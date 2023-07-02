<script lang="ts">
  import { ValidationMessage } from '@felte/reporter-svelte';

  export let name: string;
  export let label: string;
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let minLength: number = 0;
  export let maxLength: number = 0;

  let opts: any = {};
  $: {
    opts = {};
    if (placeholder) opts.placeholder = placeholder;
    if (disabled) opts.disabled = disabled;
    if (required) opts.required = required;
    if (minLength) opts.minLength = minLength;
    if (maxLength) opts.maxLength = maxLength;
  }
</script>

<div>
  <label for={name}>{label}</label>
  <input id={name} {name} class="bg-gray-500" {...opts} />
  <ValidationMessage for={name} let:messages>
    {#if messages}
      <span>{messages}</span>
    {/if}
  </ValidationMessage>
</div>
