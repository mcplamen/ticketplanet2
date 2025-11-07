import { writable } from 'svelte/store';

function createAuthStore() {
  const token = writable(null);
  const user = writable(null);

  return {
    token,
    user,
    login: (t, u) => {
      token.set(t);
      user.set(u);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
      }
    },
    logout: () => {
      token.set(null);
      user.set(null);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  };
}

export const auth = createAuthStore();
