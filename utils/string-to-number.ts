export function stringToNumber(value: string): number {
  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return 0;
  }
  return number;
}
