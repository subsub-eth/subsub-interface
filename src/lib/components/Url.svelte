<script lang="ts">
  import { page } from '$app/stores';

  export let template: string;

  const isDynamic = (segment: string) =>
    segment.length > 2 && segment.startsWith('[') && segment.endsWith(']');

  $: replacedPath = template
    .split('/')
    .map((s) => {
      const params = $page?.params;
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
</script>

<slot path={replacedPath} />
