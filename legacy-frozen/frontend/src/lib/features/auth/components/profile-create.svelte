<script lang="ts">
  import { goto } from '$app/navigation';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { toasts_store } from '$lib/components/ui/toast';
  import { cn } from '$lib/functions/classnames';
  import { ProfileCreateSchema } from '$lib/schemas/auth';
  import { untrack } from 'svelte';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';

  type ImageInputType = 'avatar' | 'cover';

  let avatar_data_url = $state<string>(),
    cover_data_url = $state<string>();

  const { form, enhance, errors, delayed, message } = superForm(
    defaults(zod(ProfileCreateSchema)),
    {
      resetForm: false,
      async onResult({ result }) {
        if (result.type === 'success') await goto('?type=p-select');
      }
    }
  );

  async function handle_file_on_change(e: Event, type: ImageInputType) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    $form[type] = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const data_url = e.target?.result;
      if (!data_url) return;

      if (type === 'avatar') avatar_data_url = String(data_url);
      if (type === 'cover') cover_data_url = String(data_url);
    };
  }

  $effect(() => {
    const _message = $message;
    if (_message) untrack(() => toasts_store.error(_message));
  });
</script>

<form
  class="flex flex-col gap-2"
  method="POST"
  action="?/create"
  enctype="multipart/form-data"
  use:enhance
>
  <div class="grid grid-cols-2 gap-2">
    <fieldset class="fieldset">
      <legend class="fieldset-legend py-0.5">Avatar</legend>
      <input
        type="file"
        id="avatar"
        name="avatar"
        class="file-input file-input-sm bg-transparent"
        onchange={(e) => handle_file_on_change(e, 'avatar')}
      />
      <label for="avatar" class="fieldset-label leading-none" class:text-error={$errors.avatar}
        >{$errors.avatar ? $errors.avatar[0] : 'Max size 5MB'}</label
      >
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend py-0.5">Cover</legend>
      <input
        type="file"
        id="cover"
        name="cover"
        class="file-input file-input-sm bg-transparent"
        onchange={(e) => handle_file_on_change(e, 'cover')}
      />
      <label for="cover" class="fieldset-label leading-none" class:text-error={$errors.cover}
        >{$errors.cover ? $errors.cover[0] : 'Max size 5MB'}</label
      >
    </fieldset>
  </div>
  <fieldset class="fieldset">
    <label class="floating-label">
      <span class="bg-base-300! text-base duration-100!">Username*</span>
      <div class="input w-full bg-transparent" class:input-error={$errors.username}>
        <coreicons-shape-user variant="normal" class="size-4 shrink-0 opacity-50"
        ></coreicons-shape-user>
        <input
          name="username"
          placeholder="Username*"
          aria-invalid={$errors.username ? 'true' : undefined}
          bind:value={$form.username}
          onkeydown={(e) => e.key === ' ' && e.preventDefault()}
        />
      </div>
    </label>
    {#if $errors.username}
      <span class="fieldset-label text-error">{$errors.username[0]}</span>
    {/if}
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend py-0.5">Preview (small)</legend>
    <div
      class="rounded-field bg-base-100 relative mb-5 h-14 bg-cover bg-center"
      style="background-image: url({cover_data_url});"
    >
      <div class="absolute inset-0 -bottom-5 flex h-max items-end gap-2 self-end px-4">
        <Avatar src={avatar_data_url} class="ring-base-300 size-10 ring-6" />
        <h3 class="text-sm leading-none font-medium">u/{$form.username || 'username'}</h3>
      </div>
    </div>
  </fieldset>
  <div class="flex items-center gap-4">
    <button
      type="button"
      class="btn flex-1"
      aria-label="Back"
      onclick={() => goto('?type=p-select')}
    >
      <coreicons-shape-arrow variant="left" class="size-4"></coreicons-shape-arrow>
      Back
    </button>
    <button
      class={cn($delayed && 'btn-active pointer-events-none', 'btn btn-primary flex-1')}
      aria-label="Create"
    >
      Create
      {#if $delayed}
        <span class="loading loading-spinner loading-xs"></span>
      {:else}
        <coreicons-shape-arrow variant="right" class="size-4"></coreicons-shape-arrow>
      {/if}
    </button>
  </div>
</form>
