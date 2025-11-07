<script>
  import { auth } from "$lib/stores/auth.js";
  import { goto } from '$app/navigation';

  // Достъпваме store-овете правилно
  const { token, user } = auth;

  function logout() {
    auth.logout();
    goto('/');
  }
</script>

<header style="display:flex;justify-content:space-between;padding:12px">
  <div><a href="/">TicketPlanet</a></div>
  <nav>
    {#if $user}
      <span>Здравей, {$user.name || $user.email}</span>
      <button on:click={logout} style="margin-left:8px">Изход</button>
    {:else}
      <a href="/login" style="margin-right:8px">Вход</a>
      <a href="/register">Регистрация</a>
    {/if}
  </nav>
</header>

{#if $token}
  <a href="/dashboard">My Events</a>
{/if}

<slot />
