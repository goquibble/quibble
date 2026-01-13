<script lang="ts">
  import Avatar from '$lib/components/ui/avatar.svelte';
  import type {
    CommunityCreateErrorsType,
    CommunityCreateFormType
  } from '$lib/schemas/community-create';
  import { untrack } from 'svelte';
  import { fileProxy } from 'sveltekit-superforms';

  type Props = {
    form: CommunityCreateFormType;
    errors: CommunityCreateErrorsType;
  };

  let { form, errors }: Props = $props();

  const avatar_file = fileProxy(form, 'avatar');
  const banner_file = fileProxy(form, 'banner');

  let avatar_data_uri = $state<string>();
  let banner_data_uri = $state<string>();

  $effect(() => {
    read_data_uri($form.avatar).then((data_uri) => {
      untrack(() => {
        avatar_data_uri = data_uri;
      });
    });
  });

  $effect(() => {
    read_data_uri($form.banner).then((data_uri) => {
      untrack(() => {
        banner_data_uri = data_uri;
      });
    });
  });

  async function read_data_uri(file?: File): Promise<string | undefined> {
    return new Promise((resolve) => {
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
    });
  }
</script>

<div class="grid grid-cols-2 gap-2">
  <fieldset class="fieldset">
    <legend class="fieldset-legend py-0.5">Avatar</legend>
    <input
      type="file"
      id="avatar"
      name="avatar"
      class="file-input file-input-sm bg-transparent"
      bind:files={$avatar_file}
    />
    <label for="avatar" class="fieldset-label leading-none" class:text-error={$errors.avatar}
      >{$errors.avatar ? $errors.avatar[0] : 'Max size 5MB'}</label
    >
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend py-0.5">Cover</legend>
    <input
      type="file"
      id="banner"
      name="banner"
      class="file-input file-input-sm bg-transparent"
      bind:files={$banner_file}
    />
    <label for="banner" class="fieldset-label leading-none" class:text-error={$errors.banner}
      >{$errors.banner ? $errors.banner[0] : 'Max size 5MB'}</label
    >
  </fieldset>
</div>
<div
  class="rounded-box bg-neutral relative mb-12 h-28 bg-cover bg-center p-4"
  style="background-image: url({banner_data_uri});"
>
  <div class="absolute -bottom-12 flex items-end gap-4">
    <Avatar src={avatar_data_uri} class="ring-base-300 size-20 ring-8" />
    <div class="flex flex-col">
      <span class="line-clamp-1 text-lg font-semibold">q/{$form.name || 'communityname'}</span>
      <div class="text-base-content/60 flex items-center gap-2">
        <span class="text-xs">1 member</span>
        <coreicons-shape-circle class="size-0.5" variant="filled"></coreicons-shape-circle>
        <span class="text-xs">1 online</span>
      </div>
    </div>
  </div>
</div>
