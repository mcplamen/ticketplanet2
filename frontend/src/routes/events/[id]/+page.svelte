<script>
  import { auth } from "../../lib/stores/auth";
  export let data;

  $: isOwner = $auth?.user?.id === data.event.ownerId;
</script>

{#if isOwner}
  <button on:click={editEvent}>Edit</button>
  <button on:click={deleteEvent}>Delete</button>
{/if}
