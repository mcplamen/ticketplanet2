<script>
  export let event;
</script>

<div class="card">
  {#if event.logoPath}
    <img src={`http://localhost:3000${event.logoPath}`} alt="Event logo" class="logo" />
  {/if}
  <h3>{event.title}</h3>
  <p>{event.description}</p>
  {#if event.date}
    <p class="date">📅 {new Date(event.date).toLocaleDateString()}</p>
  {/if}
</div>

<style>
.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.logo {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.date {
  font-size: 0.9rem;
  color: #555;
}
</style>
