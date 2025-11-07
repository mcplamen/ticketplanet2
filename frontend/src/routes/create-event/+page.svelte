<script>
  import { auth } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let title = "";
  let description = "";
  let date = "";
  let location = "";

  async function createEvent() {
    const token = $auth.token;

    const res = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // ✅ изпращаме JWT
      },
      body: JSON.stringify({ title, description, date, location })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Event created!");
      goto("/"); // или към списъка със събития
    } else {
      alert(data.message);
    }
  }
</script>

<h1>New Event</h1>

<form on:submit|preventDefault={createEvent}>
  <input type="text" placeholder="Title" bind:value={title} required />
  <textarea placeholder="Description" bind:value={description}></textarea>
  <input type="datetime-local" bind:value={date} required />
  <input type="text" placeholder="Location" bind:value={location} />

  <button type="submit">Create Event</button>
</form>
