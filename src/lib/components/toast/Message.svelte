<script lang="ts">

  /** message strings to print */
  export let message: Array<string>;
  console.log(message)

</script>

{#each message as msg}
  {msg}<br />
{/each}
