<script>
  import { onMount } from "svelte";
  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import CreateEvent from "./components/CreateEvent.svelte";

  let token = localStorage.getItem("token");
  let currentPage = token ? "dashboard" : "login";

  function navigate(page) {
    currentPage = page;
  }

  function handleLoginSuccess(jwt) {
    token = jwt;
    localStorage.setItem("token", jwt);
    currentPage = "dashboard";
  }

  function logout() {
    token = null;
    localStorage.removeItem("token");
    currentPage = "login";
  }
</script>

<nav class="p-4 flex justify-between bg-gray-800 text-white">
  <h1 class="text-lg font-bold">🎟️ TicketPlanet</h1>
  {#if token}
    <button on:click={logout}>Logout</button>
  {/if}
</nav>

<main class="p-4">
  {#if currentPage === "login"}
    <Login on:loginSuccess={(e) => handleLoginSuccess(e.detail)} on:goRegister={() => navigate("register")} />
  {:else if currentPage === "register"}
    <Register on:goLogin={() => navigate("login")} />
  {:else if currentPage === "dashboard"}
    <Dashboard {token} />
  {/if}

  <CreateEvent />

</main>
