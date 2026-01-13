import { generate_id } from '$lib/functions/generate-id';

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

interface ToastOptions {
  duration?: number;
  inside_modal?: boolean;
}

interface Toast extends ToastOptions {
  id: string;
  type: string;
  message: string;
  timer: NodeJS.Timeout;
}

function create_toasts_store() {
  let toasts = $state<Toast[]>([]);

  function send(message: string, type: ToastType = 'default', options?: ToastOptions) {
    // const exists = toasts.find((t) => t.message === message);
    // if (exists !== undefined) return exists.id;

    const new_toast: Toast = {
      ...options,
      type,
      message,
      inside_modal: options?.inside_modal ?? false,
      id: generate_id(),
      timer: setTimeout(() => {
        dismiss(new_toast.id);
      }, options?.duration ?? 3000)
    };

    toasts.push(new_toast);
    return new_toast.id;
  }

  function dismiss(id: string) {
    const toast = toasts.find((t) => t.id === id);
    if (toast === undefined) return;

    clearTimeout(toast.timer);
    toasts = toasts.filter((t) => t.id !== id);
  }

  return {
    get value() {
      return toasts;
    },
    send,
    dismiss,
    info: (msg: string, options?: ToastOptions) => send(msg, 'info', options),
    success: (msg: string, options?: ToastOptions) => send(msg, 'success', options),
    warning: (msg: string, options?: ToastOptions) => send(msg, 'warning', options),
    error: (msg: string, options?: ToastOptions) => send(msg, 'error', options)
  };
}

// initialize store
export const toasts_store = create_toasts_store();
