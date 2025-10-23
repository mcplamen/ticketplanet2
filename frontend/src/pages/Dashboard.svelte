<script>
  import CreateEvent from "../components/CreateEvent.svelte";
  import { onMount } from "svelte";

  export let token;
  let events = [];

  async function loadEvents() {
    const res = await fetch("http://localhost:3000/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) events = data.events;
  }

  onMount(loadEvents);
</script>

<div>
  <h2 class="text-xl mb-4">🎉 Your Events</h2>
  <CreateEvent {token} on:eventCreated={loadEvents} />
  <ul>
    {#each events as e}
      <li class="border p-2 my-1">{e.title} — {e.date}</li>
    {/each}
  </ul>
</div>
