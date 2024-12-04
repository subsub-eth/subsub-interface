import { page } from '$app/stores';
import { urlFromTemplate } from '$lib/url';
import { fromStore } from 'svelte/store';

export function url(template: string): string {
  return urlFromTemplate(template, fromStore(page).current.params);
}
