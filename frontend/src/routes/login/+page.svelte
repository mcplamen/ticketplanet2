<script>
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function login() {
    error = '';
    loading = true;
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      loading = false;

      if (!res.ok) {
        error = data.message || data.error || 'Login failed';
        return;
      }

      if (data.token) {
        auth.login(data.token, data.user);
        goto('/events');
      } else {
        error = 'No token received';
      }
    } catch (err) {
      loading = false;
      error = 'Server error';
    }
  }
</script>

<h1>Вход</h1>
<form on:submit|preventDefault={login}>
  <input placeholder="Имейл" type="email" bind:value={email} required />
  <input placeholder="Парола" type="password" bind:value={password} required />
  <button type="submit" disabled={loading}>{loading ? "Изчакване..." : "Вход"}</button>
</form>

{#if error}
  <p style="color:red">{error}</p>
{/if}
