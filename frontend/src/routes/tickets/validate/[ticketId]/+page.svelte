<script>
  export let data;

  const ticket = data.ticket;
</script>

{#if ticket.valid}
  <h1>✅ Valid Ticket</h1>
  <p>Event: {ticket.event}</p>
  <p>Owner: {ticket.owner}</p>
{else}
  <h1>❌ Invalid Ticket</h1>
{/if}
