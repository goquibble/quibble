export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, t: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>): ReturnType<T> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), t);
    }) as ReturnType<T>;
  };
}
