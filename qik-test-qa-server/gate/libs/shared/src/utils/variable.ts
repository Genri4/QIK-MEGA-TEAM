export function assert<T>(value: unknown, message: string = 'Variable is not defined or is null'): asserts value is T {
  if (value === null || value === undefined || value === '') {
    throw new Error(message);
  }
}
