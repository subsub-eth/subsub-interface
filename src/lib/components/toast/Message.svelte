<script lang="ts">
  interface Props {
    /** message strings to print */
    message: Array<string>;
  }

  let { message }: Props = $props();
</script>

{#each message as msg}
  {msg}<br />
{/each}
