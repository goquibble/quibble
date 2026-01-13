<script lang="ts">
  import { page } from '$app/state';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { cn } from '$lib/functions/classnames';
  import type { ProfileSettingsProps } from '$lib/schemas/settings';
  import type { Nullable } from '$lib/types/shared';

  const { form, errors }: ProfileSettingsProps = $props();
  let avatar_data_url = $state<Nullable<string>>(null);

  function handle_change(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) handle_file(file);
  }

  function handle_drop(e: DragEvent) {
    e.preventDefault();

    if (e.dataTransfer && e.dataTransfer.items) {
      // use DataTransferList interface to access file(s)
      console.log('using DataTransferList interface...');
      [...e.dataTransfer.items].forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) handle_file(file);
        }
      });
    }
  }

  function handle_file(file: File) {
    $form['avatar'] = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const data_url = e.target?.result;
      if (data_url && typeof data_url === 'string') avatar_data_url = data_url;
    };
  }
</script>

<div class="flex flex-col">
  <h3 class="text-info font-medium">Avatar</h3>
  <span class="text-base-content/75 text-sm"> Edit your avatar or upload an image </span>
</div>
<div class="flex gap-4">
  <Avatar src={avatar_data_url || page.data.profile.avatar} class="size-20" />
  <input hidden type="file" id="avatar-input" accept="image/*" onchange={handle_change} />
  <label
    for="avatar-input"
    class={cn(
      $errors.avatar
        ? 'border-error text-error'
        : 'border-base-content/25 hover:border-base-content/50',
      'rounded-box flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed duration-300'
    )}
    ondrop={handle_drop}
  >
    <coreicons-shape-upload variant="cloud" class="size-5"></coreicons-shape-upload>
    <span class="text-xs">{$errors.avatar ? $errors.avatar[0] : 'Drag and drop or browse'}</span>
  </label>
</div>
