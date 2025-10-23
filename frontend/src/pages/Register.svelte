<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let name = "";
  let email = "";
  let password = "";
  let message = "";

  const API_URL = "http://localhost:3000"; // backend URL

  async function register() {
    message = "";
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        message = "✅ Registration successful!";
        setTimeout(() => goto("/login"), 1000);
      } else {
        message = "❌ " + (data.message || "Error");
      }
    } catch (err) {
      message = "⚠️ Server error: " + err.message;
    }
  }
</script>

<div class="max-w-sm mx-auto mt-16 p-6 border rounded-lg shadow">
  <h2 class="text-xl font-semibold mb-4">Register</h2>
  <input class="border p-2 mb-2 w-full" placeholder="Name" bind:value={name} />
  <input class="border p-2 mb-2 w-full" placeholder="Email" bind:value={email} />
  <input class="border p-2 mb-2 w-full" type="password" placeholder="Password" bind:value={password} />
  <button class="bg-blue-600 text-white p-2 w-full rounded" on:click={register}>Register</button>
  <p class="mt-3 text-sm text-center text-gray-600">{message}</p>
</div>
