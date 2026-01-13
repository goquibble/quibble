import type { components } from '$lib/api';
import type { Nullable } from '$lib/types/shared';

type UserDetails = components['schemas']['UserDetails'];

type AuthState = {
  is_authenticated: boolean;
  user: Nullable<UserDetails>;
};

function create_auth_store() {
  const auth_store = $state<AuthState>({
    is_authenticated: false,
    user: null
  });

  return {
    get value() {
      return auth_store;
    },
    update(new_state: Partial<AuthState>) {
      // spreading doesnt work because it creates a new reference
      // which leads to infinite loop of effects
      // auth_state = { ...auth_state, ...new_state }
      Object.assign(auth_store, new_state);
    }
  };
}

// initialize store
export const auth_store = create_auth_store();
