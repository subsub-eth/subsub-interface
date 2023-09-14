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


export function aflow<A extends ReadonlyArray<unknown>, B, C>(
  ab: (...a: A) => Promise<B>,
  bc: (b: B) => Promise<C>
): (...a: A) => Promise<C>;

export function aflow<A extends ReadonlyArray<unknown>, B, C, D>(
  ab: (...a: A) => Promise<B>,
  bc: (b: B) => Promise<C>,
  cd: (c: C) => Promise<D>
): (...a: A) => Promise<D>;

export function aflow<A extends ReadonlyArray<unknown>, B, C, D>(
  ab: (...a: A) => Promise<B>,
  bc: (b: B) => Promise<C>,
  cd?: (c: C) => Promise<D>
): (...a: A) => Promise<unknown> {
  return async (...x: A) => {
    const b = await ab(...x);
    const c = await bc(b);
    if (!cd) {
      return c;
    }
    return await cd(c);
  };
}
