export function stopPropagation<T>(func: (this: T, e: Event) => void) {
  return function (this: T, e: Event) {
    e.stopPropagation();
    func.call(this, e);
  };
}
