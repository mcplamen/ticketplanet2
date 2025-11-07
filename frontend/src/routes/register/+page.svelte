<script>
  import { goto } from '$app/navigation';
  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function register() {
    error = '';
    loading = true;
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      loading = false;
      if (!res.ok) {
        error = data.message || data.error || 'Registration failed';
        return;
      }
      // success -> redirect to login
      goto('/login');
    } catch (err) {
      loading = false;
      error = 'Server error';
    }
  }
</script>

<h1>Регистрация</h1>
<form on:submit|preventDefault={register}>
  <input placeholder="Име" bind:value={name} />
  <input placeholder="Имейл" type="email" bind:value={email} required />
  <input placeholder="Парола" type="password" bind:value={password} required />
  <button type="submit" disabled={loading}>{loading ? "Изчакване..." : "Регистрация"}</button>
</form>

{#if error}
  <p style="color:red">{error}</p>
{/if}
