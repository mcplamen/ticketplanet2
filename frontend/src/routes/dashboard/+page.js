import { auth } from "$lib/stores/auth";

export async function load({ fetch }) {
  const token = $auth.token; // вземаме токена

  if (!token) {
    return {
      status: 302,
      redirect: "/login"
    };
  }

  const res = await fetch("http://localhost:3000/events/mine", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const events = await res.json();

  return { events };
}
