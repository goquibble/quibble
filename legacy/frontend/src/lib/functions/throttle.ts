export function throttle<T extends (...args: never[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let prev_time = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - prev_time >= limit) {
      prev_time = now;
      fn(...args);
    }
  };
}
