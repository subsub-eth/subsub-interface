export function truncateAddress(
  addr: string,
  prefix: number = 5,
  suffix: number = 4,
  placeholder: string = '...'
): string {
  const minLength = prefix + suffix + placeholder.length;

  if (addr.length <= minLength) {
    return addr;
  }

  return addr.substring(0, prefix) + placeholder + addr.substring(addr.length - suffix);
}
