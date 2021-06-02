export function isPromise(obj: any) {
  return typeof obj.then === 'function';
}
