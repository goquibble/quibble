<script lang="ts">
  import { auth_store } from '$lib/stores/auth.svelte';
  import AuthModal from './auth/index.svelte';
</script>

{#if !auth_store.value.is_authenticated}
  <AuthModal />
{/if}
