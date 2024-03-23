export function addUnitIfNeeded(value: string | number | undefined): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return String(value);
}
