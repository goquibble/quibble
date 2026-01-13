<script lang="ts">
  import Header from '$lib/components/header.svelte';
  import Sidebar from '$lib/components/sidebar.svelte';
  import { cn } from '$lib/functions/classnames';
  import { type Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let sidebar_show = $state(false);
  let sidebar_shown = $state(false);

  const toggle_show_sidebar = () => {
    if (sidebar_shown) return;
    sidebar_show = !sidebar_show;
  };
</script>

<!-- header section -->
<Header on_menu_click={toggle_show_sidebar} />

<!-- main body section -->
<section class="mt-[3.75rem] flex">
  <!-- sidebar for medium screens -->
  <div class="hidden w-72 md:flex">
    <Sidebar />
  </div>

  <!-- sidebar for small screens with transition -->
  <div
    class="fixed top-[3.75rem] left-0 z-50 flex h-[calc(100dvh-3.75rem)] w-72 transform transition-transform duration-300 md:hidden"
    class:-translate-x-72={!sidebar_show}
    ontransitionstart={() => (sidebar_shown = true)}
    ontransitionend={() => (sidebar_shown = false)}
  >
    <Sidebar />
  </div>

  <!-- background clicker to toggle show_sidebar state (small screens) -->
  <button
    onclick={toggle_show_sidebar}
    class={cn(
      sidebar_show ? 'opacity-100' : 'pointer-events-none opacity-0',
      'bg-base-300/55 fixed z-40 h-[calc(100dvh-3.75rem)] w-dvw transition-opacity duration-300 md:hidden'
    )}
    aria-label="toggle sidebar"
  ></button>

  <!-- render children content -->
  <div class="mx-auto flex flex-1 xl:max-w-6xl">
    {@render children()}
  </div>
</section>
