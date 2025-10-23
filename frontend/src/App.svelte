<script>
  import { wrap } from "svelte-spa-router/wrap";
  import Router from "svelte-spa-router";
  import Register from "./pages/Register.svelte";
  import Login from "./pages/Login.svelte";
  import Events from "./pages/Events.svelte";
  import CreateEvent from "./pages/CreateEvent.svelte";

  const routes = {
    "/": Login,
    "/register": Register,
    "/login": Login,
    "/events": Events,
    "/events/create": CreateEvent
  };
</script>

<Header />

<main class="p-6 font-sans">
  <Router {routes} />
</main>

