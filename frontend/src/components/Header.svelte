<script>
  import { onMount } from "svelte";

  let username = "";
  let isLoggedIn = false;

  onMount(() => {
    const token = localStorage.getItem("token");
    if (token) {
      isLoggedIn = true;
      // можеш да декодираш token за да покажеш име, но засега го оставяме просто логнато състояние
    }
  });

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
</script>

{#if isLoggedIn}
<header class="header">
  <div class="logo">
    🎫 TicketPlanet
  </div>

  <nav class="nav">
    <a href="/events">Събития</a>
    <a href="/create-event">Създай събитие</a>
    <button on:click={logout}>Изход</button>
  </nav>
</header>
{/if}

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #20232a;
  color: white;
  padding: 0.75rem 1.5rem;
}
.logo {
  font-size: 1.2rem;
  font-weight: bold;
}
.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}
a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}
a:hover {
  text-decoration: underline;
}
button {
  background: #e63946;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #ff5252;
}
</style>
