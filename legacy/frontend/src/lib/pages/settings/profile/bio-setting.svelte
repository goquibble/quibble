<script lang="ts">
  import type { ProfileSettingsProps } from '$lib/schemas/settings';

  const { form }: ProfileSettingsProps = $props();
</script>

<div class="flex flex-col">
  <h3 class="text-info font-medium">Description/bio</h3>
  <span class="text-base-content/75 text-sm"> Give a brief description of yourself </span>
</div>
<label class="floating-label">
  <span class="bg-base-300! duration-100!">Bio</span>
  <textarea
    name="bio"
    class="textarea min-h-24 w-full bg-transparent leading-normal"
    placeholder="Bio"
    bind:value={$form.bio}
  ></textarea>
</label>
