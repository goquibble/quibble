import { SvelteMap } from 'svelte/reactivity';

const modals = ['auth'] as const;
type Modals = (typeof modals)[number];

function create_modals_store() {
  const modals_store = $state(new SvelteMap<Modals, boolean>(modals.map((item) => [item, false])));

  return {
    get value() {
      return modals_store;
    },
    open(modal: Modals) {
      modals_store.keys().forEach((key) => modals_store.set(key, false));
      modals_store.set(modal, true);
    },
    close(modal: Modals) {
      modals_store.set(modal, false);
    }
  };
}

// initialize store
export const modals_store = create_modals_store();
