<script>
  import { locale } from '$lib/i18n.js';
  import { onMount } from 'svelte';
  let cur = 'en';
  const opts = ['en','bg'];
  const names = { en: 'EN', bg: 'BG' };
  const unsubscribe = locale.subscribe(v => cur = v);
  onMount(()=>{
    const saved = localStorage.getItem('locale');
    if (saved && opts.includes(saved)) locale.set(saved);
  });
  function change(l){
    locale.set(l);
    localStorage.setItem('locale', l);
  }
</script>

<div>
  {#each opts as o}
    <button on:click={()=>change(o)} disabled={o===cur} style="margin-left:6px">
      {names[o]}
    </button>
  {/each}
</div>
