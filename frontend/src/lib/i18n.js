import en from './i18n/en.json';
import bg from './i18n/bg.json';
import { writable, derived } from 'svelte/store';

const translations = { en, bg };

export const locale = writable('en');

export const t = derived(locale, ($locale) => {
  const dict = translations[$locale] || translations['en'];
  return (key) => {
    const parts = key.split('.');
    let cur = dict;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else return key;
    }
    return cur;
  };
});

export function getT() {
  let val;
  const unsub = t.subscribe(v=> val = v);
  unsub();
  return val;
}

export function tt(key) {
  const fn = getT();
  return fn(key);
}
