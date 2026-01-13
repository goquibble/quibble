import { browser } from '$app/environment';

type LayoutType = 'card' | 'compact';

const DEFAULT_LAYOUT_TYPE: LayoutType = 'card';
const LAYOUT_TYPE_LS_KEY = 'layout_type_store';

function get_stored_layout_type(): LayoutType {
  if (!browser) return DEFAULT_LAYOUT_TYPE;

  const stored = localStorage.getItem(LAYOUT_TYPE_LS_KEY);
  return stored === 'card' || stored === 'compact' ? stored : DEFAULT_LAYOUT_TYPE;
}

function create_layout_type_store() {
  let layout_type = $state<LayoutType>(get_stored_layout_type());

  $effect.root(() => {
    $effect(() => {
      if (!browser) return;
      localStorage.setItem(LAYOUT_TYPE_LS_KEY, layout_type);
    });
  });

  return {
    get value() {
      return layout_type;
    },
    update(type: LayoutType) {
      layout_type = type;
    },
    reset() {
      this.update(DEFAULT_LAYOUT_TYPE);
    }
  };
}

// initialize store
export const layout_type_store = create_layout_type_store();
