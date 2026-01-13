<script lang="ts">
  import { page } from '$app/state';
  import { cn } from '$lib/functions/classnames';
  import type { ProfileSettingsProps } from '$lib/schemas/settings';
  import type { Nullable } from '$lib/types/shared';

  const { form, errors }: ProfileSettingsProps = $props();
  let banner_data_url = $state<Nullable<string>>(null);

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
    $form['banner'] = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const data_url = e.target?.result;
      if (data_url && typeof data_url === 'string') banner_data_url = data_url;
    };
  }
</script>

<div class="flex flex-col">
  <h3 class="text-info font-medium">Banner</h3>
  <span class="text-base-content/75 text-sm"> Edit your banner or upload an image </span>
</div>
<input type="file" id="banner-input" hidden accept="image/*" onchange={handle_change} />
<label
  for="banner-input"
  class={cn(
    $errors.banner
      ? 'outline-error text-error'
      : 'outline-base-content/25 hover:outline-base-content/50',
    'rounded-box relative flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 bg-cover bg-center bg-no-repeat outline-2 -outline-offset-2 transition-[outline] duration-300 outline-dashed'
  )}
  style="background-image: url({banner_data_url || page.data.profile.banner});"
  ondrop={handle_drop}
>
  {#if !banner_data_url && !page.data.profile.banner}
    <coreicons-shape-upload variant="cloud" class="size-5"></coreicons-shape-upload>
    <span class="text-xs">Drag and drop or browse</span>
  {/if}
  <div
    data-tip={$errors.banner?.[0]}
    class={cn(
      $errors.banner && 'tooltip-error tooltip-open tooltip tooltip-left ',
      'absolute right-1 bottom-1'
    )}
  >
    <label
      for="banner-input"
      class="btn btn-sm btn-circle"
      class:btn-error={$errors.banner}
      aria-label="Update banner"
    >
      <coreicons-shape-upload variant="cloud" class="size-4"></coreicons-shape-upload>
    </label>
  </div>
</label>
