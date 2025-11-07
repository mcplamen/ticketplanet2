<script>
  import { auth } from "$lib/stores/auth";
  let title = "";
  let description = "";
  let date = "";
  let file;

  async function createEvent() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("logo", file);

    const res = await fetch("http://localhost:3000/events/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData
    });

    if (res.ok) {
      alert("Event created!");
      window.location.href = "/dashboard";
    }
  }
</script>

<h1>Create Event</h1>

<form on:submit|preventDefault={createEvent}>
  <input bind:value={title} placeholder="Title" required>
  <textarea bind:value={description} placeholder="Description"></textarea>
  <input type="datetime-local" bind:value={date} required>
  <input type="file" accept="image/*" on:change={(e) => file = e.target.files[0]}>

  <button>Create</button>
</form>
