<script>
  import { onMount } from "svelte";

  let title = "";
  let description = "";
  let date = "";
  let logo = null;
  let logoPreview = null;
  let message = "";
  let loading = false;

  let token = "";

  onMount(() => {
    token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  });

  function handleLogoUpload(e) {
    logo = e.target.files[0];
    if (logo) {
      logoPreview = URL.createObjectURL(logo);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    message = "";
    loading = true;

    try {
      // 1️⃣ Първо качваме логото
      let logoPath = "";
      if (logo) {
        const formData = new FormData();
        formData.append("logo", logo);

        const uploadRes = await fetch("http://localhost:3000/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Грешка при качване на логото");
        }
        logoPath = uploadData.filePath;
      }

      // 2️⃣ След това създаваме събитието
      const res = await fetch("http://localhost:3000/events/create", {
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
      if (!res.ok) {
        throw new Error(data.error || "Грешка при създаване на събитието");
      }

      message = "✅ Събитието е създадено успешно!";
      setTimeout(() => {
        window.location.href = "/events";
      }, 1500);
    } catch (err) {
      message = `❌ ${err.message}`;
    } finally {
      loading = false;
    }
  }
</script>

<h1>Създай събитие</h1>

<form class="create-event" on:submit={handleSubmit}>
  <label>
    Заглавие:
    <input type="text" bind:value={title} required />
  </label>

  <label>
    Описание:
    <textarea bind:value={description}></textarea>
  </label>

  <label>
    Дата:
    <input type="date" bind:value={date} />
  </label>

  <label>
    Лого:
    <input type="file" accept="image/*" on:change={handleLogoUpload} />
  </label>

  {#if logoPreview}
    <div class="preview">
      <img src={logoPreview} alt="Преглед на логото" />
    </div>
  {/if}

  <button type="submit" disabled={loading}>
    {#if loading}
      ⏳ Създаване...
    {:else}
      ➕ Създай събитие
    {/if}
  </button>
</form>

{#if message}
  <p class="message">{message}</p>
{/if}

<style>
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.create-event {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: auto;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

input,
textarea {
  margin-top: 0.3rem;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  background: #007bff;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preview {
  text-align: center;
}

.preview img {
  max-width: 200px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.message {
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
}
</style>
