<script>
  import { onMount } from "svelte";

  let name = "";
  let email = "";
  let password = "";
  let mode = "login";
  let message = "";

  async function handleSubmit() {
    message = "Зарежда...";
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        message = "✅ Успешно влизане";
      } else {
        message = "❌ " + data.error;
      }
    } catch (err) {
      message = "⚠️ Грешка при свързване със сървъра";
    }
  }
</script>

<div class="p-4 max-w-sm mx-auto space-y-4">
  <h2 class="text-xl font-bold text-center">
    {mode === "login" ? "Вход" : "Регистрация"}
  </h2>

  {#if mode === "register"}
    <input placeholder="Име" bind:value={name} class="border p-2 w-full rounded" />
  {/if}

  <input placeholder="Имейл" bind:value={email} class="border p-2 w-full rounded" />
  <input type="password" placeholder="Парола" bind:value={password} class="border p-2 w-full rounded" />

  <button on:click={handleSubmit} class="bg-blue-500 text-white w-full p-2 rounded">
    {mode === "login" ? "Влез" : "Регистрирай се"}
  </button>

  <p class="text-center text-sm cursor-pointer text-gray-500" on:click={() => mode = mode === "login" ? "register" : "login"}>
    {mode === "login" ? "Нямаш акаунт? Регистрирай се" : "Имаш акаунт? Влез"}
  </p>

  {#if message}
    <p class="text-center text-sm text-gray-600">{message}</p>
  {/if}
</div>
