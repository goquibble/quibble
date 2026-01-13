<script lang="ts" module>
  const RENDER_TYPE = ['p-select', 'p-create'] as const;
  type RenderType = (typeof RENDER_TYPE)[number];

  export interface Data {
    type: RenderType;
    email?: string;
  }

  const ROUTE_TYPE_TITLES: Record<string, string> = {
    '/login': 'Sign in',
    '/register': 'Sign up',
    '/password': 'Password',
    '/verification': 'Verification'
  };
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID, PUBLIC_OAUTH_CALLBACK_URL } from '$env/static/public';
  import GoogleLogo from '$lib/components/icons/logos/google.svelte';
  import QuibbleLogo from '$lib/components/icons/logos/quibble.svelte';
  import { ProfileCreate, ProfileSelect } from '$lib/features/auth/components';
  import type { Nullable } from '$lib/types/shared';

  let { children } = $props();

  let render_type = $state<Nullable<RenderType>>(null);

  function handle_google_click() {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${PUBLIC_OAUTH_CALLBACK_URL}&prompt=consent&response_type=code&client_id=${PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&scope=openid%20email%20profile&access_type=offline`;
  }

  $effect(() => {
    const type_param = page.url.searchParams.get('type');
    if (type_param && RENDER_TYPE.includes(type_param as RenderType)) {
      render_type = type_param as RenderType;
    } else {
      render_type = null;
    }
  });
</script>

<div class="relative flex flex-1 items-center justify-center p-4">
  <div
    class="bg-base-100 absolute inset-0 [mask-image:url('/assets/svgs/standalone-auth-bg.svg')] [mask-size:cover]"
  ></div>
  <div class="relative flex flex-col gap-2">
    <div class="rounded-box bg-base-300 grid gap-5 p-8 md:w-[40rem] md:grid-cols-2">
      <div class="flex flex-col gap-2">
        <a href="/" class="w-max"><QuibbleLogo class="size-7" /></a>
        <h2 class="text-info text-3xl font-medium">{ROUTE_TYPE_TITLES[page.url.pathname]}</h2>
        <span class="flex flex-col text-sm">
          {#if render_type === 'p-select'}
            Who's quibbling? You can later switch b/w profiles from settings page.
          {:else if render_type === 'p-create'}
            Let's create a new one! You can later edit this from settings page.
          {:else if page.url.pathname === '/verification'}
            Verify your e-mail, enter the 6-digit code we sent to {page.url.searchParams.get(
              'email'
            )}.
          {:else}
            Join in, share your take, and make some waves!
          {/if}
        </span>
      </div>
      <div class="flex flex-col gap-2">
        {#if render_type === 'p-select'}
          <ProfileSelect />
        {:else if render_type === 'p-create'}
          <ProfileCreate />
        {:else}
          {@render children()}
          {#if page.url.pathname !== '/verification'}
            <div class="divider my-0 h-max text-xs font-bold uppercase before:h-px after:h-px">
              or
            </div>
            <div class="flex gap-2">
              <button
                class="btn flex-1"
                aria-label="Login with Google"
                onclick={handle_google_click}
              >
                <GoogleLogo class="size-5" />
                Google
              </button>
              <button class="btn flex-1" aria-label="Login with Github" disabled>
                <coreicons-logo-github class="size-5"></coreicons-logo-github>
                Github
              </button>
            </div>
          {/if}
        {/if}
      </div>
    </div>
    <div class="flex items-center justify-between px-2 text-xs">
      <span>English (United States)</span>
      <div class="flex items-center gap-2">
        <a href="/">Help</a>
        <a href="/">Privacy</a>
        <a href="/">Terms</a>
      </div>
    </div>
  </div>
</div>
