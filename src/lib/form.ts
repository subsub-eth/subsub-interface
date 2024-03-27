import { derived, type Readable, type Writable } from 'svelte/store';
import {
  type FormPath,
  type FormPathLeaves,
  type SuperForm,
  fieldProxy,
  type FormPathType
} from 'sveltekit-superforms';

export type FormPaths<T extends Record<string, unknown>, Type = any> =
  | FormPath<T, Type>
  | FormPathLeaves<T, Type>;

export function bigintProxy<T extends Record<string, unknown>, Path extends FormPaths<T>>(
  form: Writable<T> | SuperForm<T>,
  path: Path
  // options?: Prettify<Pick<DefaultOptions, 'empty' | 'initiallyEmptyIfZero' | 'taint'>>
): Writable<bigint> {
  const toValue = (val: unknown): bigint => {
    try {
      return BigInt(String(val));
    } catch (err) {
      return val as bigint; // lul
    }
  };
  const realProxy = fieldProxy(form, path);

  const proxy: Readable<bigint> = derived(realProxy, (value: unknown) => {
    return toValue(value);
  });

  return {
    subscribe: proxy.subscribe,
    set(val: bigint) {
      const newValue = toValue(val) as FormPathType<T, Path>;
      realProxy.set(newValue);
    },
    update(updater) {
      realProxy.update((f) => {
        return updater(toValue(f)) as FormPathType<T, Path>;
      });
    }
  };
}
