<script lang="ts">

  /** message strings to print */
  export let message: Array<string>;

</script>

{#each message as msg}
  {msg}<br />
{/each}
