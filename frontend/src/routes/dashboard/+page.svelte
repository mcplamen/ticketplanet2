<script>
  export let data;
  const events = data.events;

  async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const res = await fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.ok) {
      alert("Event deleted!");
      location.reload();
    }
  }
  
   async function downloadTicket(ticketId) {
    const token = localStorage.getItem("token");

    window.open(`http://localhost:3000/tickets/download/${ticketId}?token=${token}`, "_blank");
  }
</script>


{#each myTickets as ticket}
  <div class="ticket">
    <p>Event: {ticket.event.title}</p>
    <button on:click={() => downloadTicket(ticket.id)}>
      Download PDF Ticket
    </button>
  </div>
{/each}

<h1>🎟 My Events</h1>

{#if events.length === 0}
  <p>No events yet. <a href="/events/create">Create your first event</a></p>
{/if}

<div class="events">
  {#each events as event}
    <div class="card">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <small>{new Date(event.date).toLocaleString()}</small>

      <div class="actions">
        <a href={`/events/${event.id}/edit`}>✏ Edit</a>
        <button on:click={() => deleteEvent(event.id)}>🗑 Delete</button>
      </div>
    </div>
  {/each}
</div>

<style>
  .events {
    display: grid;
    gap: 16px;
  }

  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 6px;
  }

  .actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }

  button {
    background: red;
    color: white;
    border: none;
    cursor: pointer;
    padding: 6px 12px;
  }
</style>
