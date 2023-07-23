export function truncateAddress(
  addr: string,
  prefix = 5,
  suffix = 4,
  placeholder = '...'
): string {
  const minLength = prefix + suffix + placeholder.length;

  if (addr.length <= minLength) {
    return addr;
  }

  return addr.substring(0, prefix) + placeholder + addr.substring(addr.length - suffix);
}

export async function waitFor(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
