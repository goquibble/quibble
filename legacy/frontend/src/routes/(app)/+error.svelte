<script lang="ts">
  import { page } from '$app/state';
  import Error from '$lib/components/error.svelte';
</script>

<svelte:head>
  <title>Not Found</title>
</svelte:head>

<Error message={page.error?.message} />
