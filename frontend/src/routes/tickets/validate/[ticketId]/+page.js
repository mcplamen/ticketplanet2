export async function load({ fetch, params }) {
  const res = await fetch(`http://localhost:3000/tickets/validate/${params.ticketId}`);
  const ticket = await res.json();

  return { ticket };
}
