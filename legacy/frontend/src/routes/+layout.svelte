<script lang="ts">
  import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
  import api from '$lib/api';
  import Modals from '$lib/components/modals/index.svelte';
  import Toaster from '$lib/components/ui/toast';
  import { TOKEN_REFRESH_INTERVAL } from '$lib/constants/auth';
  import { auth_store } from '$lib/stores/auth.svelte';
  import '../styles/app.css';
  import '../styles/nprogress.css';
  import '../styles/smiz.css';
  import { defineCustomElements } from '@coreproject-moe/icons/loader';
  import NProgress from 'nprogress';
  import { onMount, type Snippet } from 'svelte';

  // eslint-disable-next-line no-undef
  let { children, data }: { children: Snippet; data: App.Locals } = $props();

  NProgress.configure({
    // Full list: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: false
  });

  beforeNavigate(({ willUnload }) => {
    if (!willUnload) NProgress.start();
  });

  afterNavigate(() => NProgress.done());

  $effect(() => {
    auth_store.update({
      is_authenticated: !!data.user,
      user: data.user
    });
  });

  onMount(() => {
    defineCustomElements();
    // send token refresh request interval
    if (!auth_store.value.is_authenticated) return;

    const interval = setInterval(async () => {
      const { response } = await api.POST('/auth/token/refresh/', {
        // @ts-expect-error: works without params
        body: {}
      });
      if (!response.ok) {
        // refresh token expired or invalid
        await goto('/login?session-expired=true', { invalidateAll: true });
        clearInterval(interval);
      }
    }, TOKEN_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  });
</script>

<!-- render toasts -->
<!-- https://stackoverflow.com/questions/77099074/layering-toast-alerts-above-dialog-modal -->
<Toaster />
<!-- render available models -->
<Modals />

<!-- main ui layout -->
<main class="bg-base-300 flex min-h-dvh flex-col font-sans">
  {@render children()}
</main>
