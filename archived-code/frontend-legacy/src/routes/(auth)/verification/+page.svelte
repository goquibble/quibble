<script lang="ts">
  import { browser } from '$app/environment';
  import { cn } from '$lib/functions/classnames';
  import type { PageServerData } from './$types';
  import { onMount } from 'svelte';
  import { superForm } from 'sveltekit-superforms';

  const { data }: { data: PageServerData } = $props();

  let countdown = $state(30);
  let is_resend_disabled = $state(true);
  // eslint-disable-next-line no-undef
  let countdown_interval = $state<NodeJS.Timeout>();

  const { form, enhance, errors, delayed } = superForm(data.form, {
    resetForm: false
  });

  function handle_resend_click() {
    start_countdown();
  }

  function handle_go_back() {
    if (browser) window.history.back();
  }

  function start_countdown() {
    is_resend_disabled = true;
    countdown = 30;
    // clear interval (if any)
    clearInterval(countdown_interval);

    countdown_interval = setInterval(() => {
      if (countdown > 0) {
        countdown--;
      } else {
        is_resend_disabled = false;
        clearInterval(countdown_interval);
      }
    }, 1000);
  }

  onMount(() => {
    start_countdown();
    return () => clearInterval(countdown_interval);
  });
</script>

<form class="flex flex-col gap-2" method="POST" use:enhance>
  <fieldset class="fieldset">
    <label class="floating-label">
      <span class="bg-base-300! text-base duration-100!">Verification code*</span>
      <div class="input w-full bg-transparent" class:input-error={$errors.code}>
        <coreicons-shape-key class="size-4 shrink-0 opacity-50"></coreicons-shape-key>
        <input
          name="code"
          placeholder="Verification code*"
          aria-invalid={$errors.code ? 'true' : undefined}
          bind:value={$form.code}
        />
      </div>
    </label>
    {#if $errors.code}
      <span class="text-error flex items-center gap-2 text-xs">{$errors.code[0]}</span>
    {/if}
  </fieldset>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col">
      <div class="flex items-center gap-2 text-xs">
        Didn't get an e-mail?
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          disabled={is_resend_disabled}
          onclick={handle_resend_click}
          >{is_resend_disabled ? `Resend in ${countdown}s` : `Resend`}</button
        >
      </div>
      <span class="text-xs">NOTE: you also might need to check in spams.</span>
    </div>
    <div class="flex items-center gap-4">
      <button type="button" class="btn flex-1" aria-label="Back" onclick={handle_go_back}>
        <coreicons-shape-arrow variant="left" class="size-4"></coreicons-shape-arrow>
        Back
      </button>
      <button class={cn($delayed && 'btn-active pointer-events-none', 'btn btn-primary flex-1')}>
        Continue
        {#if $delayed}
          <span class="loading loading-spinner loading-xs"></span>
        {:else}
          <coreicons-shape-arrow variant="right" class="size-4"></coreicons-shape-arrow>
        {/if}
      </button>
    </div>
  </div>
</form>
