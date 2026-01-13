<script lang="ts">
  import { page } from '$app/state';

  const types = {
    '': {
      label: 'Account',
      disabled: false
    },
    profile: {
      label: 'Profile',
      disabled: false
    },
    privacy: {
      label: 'Privacy',
      disabled: true
    }
  };

  const { children } = $props();

  function check_is_active(key: string) {
    if (key === '') return page.url.pathname === '/settings';
    return page.url.pathname === `/settings/${key}`;
  }
</script>

<div class="flex h-max flex-1 flex-col gap-4 p-4">
  <div class="flex flex-col gap-2">
    <h2 class="text-info text-2xl font-semibold">Settings</h2>
    <div role="tablist" class="tabs tabs-box w-max">
      {#each Object.entries(types) as [key, item]}
        {@const active = check_is_active(key)}
        <a
          href={`/settings/${key}`}
          role="tab"
          class="tab font-medium"
          class:tab-active={active}
          class:tab-disabled={item.disabled}>{item.label}</a
        >
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-4">
    {@render children()}
  </div>
</div>
<div class="hidden w-80 lg:flex"></div>
