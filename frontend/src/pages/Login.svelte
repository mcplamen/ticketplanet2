<script>
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let message = "";

  const API_URL = "http://localhost:3000";

  async function login() {
    message = "";
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        message = "✅ Login successful!";
        setTimeout(() => goto("/events"), 1000);
      } else {
        message = "❌ " + (data.message || "Invalid credentials");
      }
    } catch (err) {
      message = "⚠️ Server error: " + err.message;
    }
  }
</script>

<div class="max-w-sm mx-auto mt-16 p-6 border rounded-lg shadow">
  <h2 class="text-xl font-semibold mb-4">Login</h2>
  <input class="border p-2 mb-2 w-full" placeholder="Email" bind:value={email} />
  <input class="border p-2 mb-2 w-full" type="password" placeholder="Password" bind:value={password} />
  <button class="bg-green-600 text-white p-2 w-full rounded" on:click={login}>Login</button>
  <p class="mt-3 text-sm text-center text-gray-600">{message}</p>
</div>
