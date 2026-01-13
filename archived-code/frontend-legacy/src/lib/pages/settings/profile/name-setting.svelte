<script lang="ts">
  import type { ProfileSettingsProps } from '$lib/schemas/settings';

  const { form }: ProfileSettingsProps = $props();
</script>

<div class="flex flex-col">
  <h3 class="text-info font-medium">Display name</h3>
  <span class="text-base-content/75 text-sm"
    >Changing your display name won't change your username</span
  >
</div>
<label class="floating-label">
  <span class="bg-base-300! duration-100!">Display name</span>
  <div class="input w-full bg-transparent">
    <coreicons-shape-user variant="normal" class="size-4 shrink-0 opacity-50"
    ></coreicons-shape-user>
    <input name="name" placeholder="Display name" bind:value={$form.name} />
  </div>
</label>
