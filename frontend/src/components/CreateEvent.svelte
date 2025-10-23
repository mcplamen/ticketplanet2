<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let title = "";
  let description = "";
  let date = "";
  let logoFile = null;
  let logoPath = "";
  let loading = false;
  let token = localStorage.getItem("token");

  async function uploadLogo() {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append("file", logoFile);

    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      logoPath = data.path;
    } else {
      alert("Грешка при качване на лого.");
    }
  }

  async function createEvent() {
    if (!title) {
      alert("Въведи заглавие на събитието");
      return;
    }

    loading = true;

    // Ако има лого, качи го първо
    if (logoFile && !logoPath) {
      await uploadLogo();
    }

    const res = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        date,
        logoPath,
      }),
    });

    const data = await res.json();
    loading = false;

    if (data.success) {
      alert("✅ Събитието е създадено успешно!");
      dispatch("created");
    } else {
      alert("❌ Грешка при създаване на събитие: " + (data.error || ""));
    }
  }
</script>

<div class="create-form">
  <h2>Създай ново събитие</h2>

  <label>Заглавие:</label>
  <input type="text" bind:value={title} placeholder="Име на събитието" />

  <label>Описание:</label>
  <textarea bind:value={description} placeholder="Кратко описание..."></textarea>

  <label>Дата:</label>
  <input type="date" bind:value={date} />

  <label>Лого:</label>
  <input type="file" accept="image/*" on:change={(e) => (logoFile = e.target.files[0])} />

  {#if logoPath}
    <img src={`http://localhost:3000${logoPath}`} alt="Logo preview" class="preview" />
  {/if}

  <div class="buttons">
    <button on:click={createEvent} disabled={loading}>
      {loading ? "Създаване..." : "✅ Създай"}
    </button>
    <button type="button" on:click={() => dispatch("cancel")}>❌ Отказ</button>
  </div>
</div>

<style>
.create-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input, textarea {
  padding: 0.4rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.preview {
  width: 120px;
  height: auto;
  margin-top: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
button {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:first-child {
  background: #28a745;
  color: white;
}
button:last-child {
  background: #ccc;
}
</style>
