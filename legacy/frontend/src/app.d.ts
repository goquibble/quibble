// See https://svelte.dev/docs/kit/types#app.d.ts
import type { components } from '$lib/api';
import type { Nullable } from '$lib/types/shared';

type UserDetails = components['schemas']['UserDetails'];
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: Nullable<UserDetails>;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
