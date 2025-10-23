<script>
  import { onMount } from "svelte";
  import CreateEvent from "../components/CreateEvent.svelte";
  import EventCard from "../components/EventCard.svelte";

  let events = [];
  let showCreate = false;
  let token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

  onMount(async () => {
    await loadEvents();
  });

  async function loadEvents() {
    const res = await fetch("http://localhost:3000/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) events = data.events || [];
  }

  function onCreated() {
    showCreate = false;
    loadEvents();
  }
</script>

<div class="page">
  <h1>🎫 Моите събития</h1>

  {#if showCreate}
    <CreateEvent on:created={onCreated} on:cancel={() => (showCreate = false)} />
  {:else}
    <button on:click={() => (showCreate = true)} class="create-btn">+ Създай събитие</button>

    {#if events.length === 0}
      <p class="empty">Нямаш събития все още.</p>
    {:else}
      <div class="events-grid">
        {#each events as event}
          <EventCard {event} />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
.page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.create-btn {
  background: #007bff;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.2rem;
}
.create-btn:hover {
  background: #0056b3;
}
.events-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
.empty {
  font-style: italic;
  color: #666;
}
</style>
