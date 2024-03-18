export function truncateAddress(addr: string, prefix = 5, suffix = 4, placeholder = '...'): string {
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

export function rangeArray(start: number, stop: number, step: number = 1): Array<number> {
  return Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
}

export function prettyNumber(num: number): string {
  // if (num < 0) {
  //   throw new Error("prettyNumber: cannot handle negative values");
  // }
  let sign = "";
  if (num < 0) {
    num = Math.abs(num);
    sign = '-';
  }
  if (num == 0) {
    return '0';
  }

  if (num >= 1000) {
    return Math.round(num).toString();
  }

  let decimals = 2;
  let limit = 0.01;
  while (num < limit) {
    limit /= 100;
    decimals += 2;
  }
  // fix the rounding in toFixed
  return sign + Number(Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(
    decimals
  );
}

/**
 * converts a value represented in currentDecimals into a representation based on targetDecimals
 */
export function convertDecimals(
  value: bigint,
  currentDecimals: number,
  targetDecimals: number
): bigint {
  if (currentDecimals === targetDecimals) {
    return value;
  }

  if (currentDecimals > targetDecimals) {
    const diff = currentDecimals - targetDecimals;
    return value / BigInt(Math.pow(10, diff));
  }
  // currentDecimals < targetDecimals

  const diff = targetDecimals - currentDecimals;
  return value * BigInt(Math.pow(10, diff));
}
