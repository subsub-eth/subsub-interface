import type { Page } from '@sveltejs/kit';

const isDynamic = (segment: string) =>
  segment.length > 2 && segment.startsWith('[') && segment.endsWith(']');

export function urlFromTemplate(template: string, params: Record<string, string>) {
  return template
    .split('/')
    .map((s) => {
      if (params && isDynamic(s)) {
        const key = s.substring(1, s.length - 1);
        const value = params[key];
        if (value) {
          return value;
        }
      }
      return s;
    })
    .join('/');
}

export function url(template: string, page: Page): string {
  return urlFromTemplate(template, page.params);
}
