<script lang="ts">
  import { page } from '$app/state';
  import CardIcon from '$lib/components/icons/card.svelte';
  import CompactIcon from '$lib/components/icons/compact.svelte';
  import HotIcon from '$lib/components/icons/hot.svelte';
  import NewIcon from '$lib/components/icons/new.svelte';
  import RocketIcon from '$lib/components/icons/rocket.svelte';
  import TopIcon from '$lib/components/icons/top.svelte';
  import { cn } from '$lib/functions/classnames';
  import { layout_type_store } from '$lib/stores/layout-type.svelte';

  const mapping = {
    sort: {
      best: { icon: RocketIcon, href: '?sort=best' },
      hot: { icon: HotIcon, href: '?sort=hot' },
      new: { icon: NewIcon, href: '?sort=new' },
      top: { icon: TopIcon, href: '?sort=top' }
    },
    view: {
      card: {
        icon: CardIcon,
        onclick: () => layout_type_store.update('card')
      },
      compact: {
        icon: CompactIcon,
        onclick: () => layout_type_store.update('compact')
      }
    }
  };

  type SortType = keyof typeof mapping.sort;
  type ViewType = keyof typeof mapping.view;

  let active_view = $derived<ViewType>(layout_type_store.value);
  let active_sort = $derived.by<SortType>(() => {
    const sort_param = page.url.searchParams.get('sort');
    if (sort_param && Object.keys(mapping.sort).includes(sort_param)) return sort_param as SortType;
    return 'best';
  });

  // active view icon for rendering
  let ActiveViewIcon = $derived(mapping.view[active_view].icon);
</script>

<div class="flex items-start justify-between">
  <div class="flex gap-3">
    {#each Object.entries(mapping.sort) as [key, item]}
      {@const is_active = active_sort === key}
      {@const hide_on_mobile = key === 'top'}

      <div class={cn(hide_on_mobile ? 'hidden md:flex' : 'flex', 'flex-col items-center gap-1')}>
        <a href={item.href} aria-label={key} class="flex items-center gap-2">
          <item.icon class={cn(is_active && 'text-primary', 'size-4')} />
          <span class="text-sm font-medium capitalize">{key}</span>
        </a>
        {#if is_active}
          <div class="bg-primary h-0.5 w-5 rounded-full"></div>
        {/if}
      </div>
    {/each}
  </div>
  <div class="flex gap-3">
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="flex cursor-pointer items-center gap-2 select-none">
        <ActiveViewIcon class="stroke-primary" />
        <span class="text-sm font-medium capitalize">{active_view}</span>
        <coreicons-shape-chevron variant="down" class="size-4"></coreicons-shape-chevron>
      </div>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <ul tabindex="0" class="menu dropdown-content bg-base-100 rounded-box z-10 mt-2 gap-1 p-1.5">
        {#each Object.entries(mapping.view) as [key, item]}
          {@const is_active = active_view === key}
          <li>
            <button
              onclick={item.onclick}
              aria-label="{key} view"
              class="flex items-center gap-2 rounded-xl p-2"
            >
              <item.icon
                class={cn(is_active ? 'stroke-primary' : 'stroke-neutral-content', 'size-4')}
              />
              <span class="text-sm font-medium capitalize" class:text-primary={is_active}
                >{key}</span
              >
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
