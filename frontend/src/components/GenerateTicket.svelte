<script>
  let name = "";
  let email = "";
  let phone = "";
  let eventId = "";
  let saveUrl = "";
  let message = "";

  async function generateTicket() {
    message = "⏳ Създаване на билет...";
    const token = localStorage.getItem("token");

    if (!token) {
      message = "⚠️ Влез в системата";
      return;
    }

    try {
      const res = await fetch("/api/tickets/generate-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, phone, eventId }),
      });

      const data = await res.json();
      if (data.success) {
        saveUrl = data.saveUrl;
        message = "✅ Билетът е създаден успешно!";
      } else {
        message = "❌ " + data.error;
      }
    } catch (err) {
      message = "⚠️ Грешка при връзка със сървъра";
    }
  }
</script>

<div class="p-4 max-w-sm mx-auto space-y-4">
  <h2 class="text-xl font-bold text-center">Генериране на билет</h2>

  <input placeholder="Име" bind:value={name} class="border p-2 w-full rounded" />
  <input placeholder="Имейл" bind:value={email} class="border p-2 w-full rounded" />
  <input placeholder="Телефон" bind:value={phone} class="border p-2 w-full rounded" />
  <input placeholder="Event ID (по избор)" bind:value={eventId} class="border p-2 w-full rounded" />

  <button on:click={generateTicket} class="bg-purple-600 text-white w-full p-2 rounded">
    Създай билет
  </button>

  {#if message}
    <p class="text-center text-sm text-gray-600">{message}</p>
  {/if}

  {#if saveUrl}
    <a href={saveUrl} target="_blank" class="text-blue-600 underline text-center block mt-2">
      Виж билета в Google Wallet
    </a>
  {/if}
</div>
