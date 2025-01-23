import { z } from 'zod';
import { type Hash as ViemHash, isAddress, getAddress as getChecksumAddress } from 'viem';

type RemoveUnderscoreFirstLetter<S extends string> = S extends `${infer FirstLetter}${infer U}`
  ? `${FirstLetter extends '_' ? U : `${FirstLetter}${U}`}`
  : S;

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${RemoveUnderscoreFirstLetter<
      Lowercase<T>
    >}${CamelToSnakeCase<U>}`
  : S;

export type KeyOfType<T, V> = keyof {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in keyof T as T[P] extends V ? CamelToSnakeCase<P & string> : never]: any;
};

export type Hash = ViemHash;

export type OnTxSubmitted = (hash: Hash) => void;

export const BigNumberishSchema = z.union([z.string(), z.number(), z.bigint()]);

export type BigNumberish = z.infer<typeof BigNumberishSchema>;

export const AddressSchema = z.custom<`0x${string}`>((val) => {
  return typeof val === 'string' && isAddress(val);
}, 'Invalid address');

export type Address = z.infer<typeof AddressSchema>;
export type address = Address;

export type EnsName = string;

export const asChecksumAddress = (addr: string) => AddressSchema.parse(getChecksumAddress(addr));

export const AttributeSchema = z.object({
  trait_type: z.string(),
  value: z.union([z.string(), z.bigint(), z.number(), z.boolean()])
});

export type Attribute = z.infer<typeof AttributeSchema>;

export const BaseMetadataSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 chars'),
  description: z.string().optional()
});

export const TokenNameSchema = z
  .string()
  .trim()
  .min(3, 'Name must have at least 3 chars')
  .max(48, 'Name can be 48 chars at most');

export const TokenSymbolSchema = z
  .string()
  .trim()
  .min(2, 'Symbol must have at least 2 chars')
  .max(12, 'Symbol can be 12 chars at most');

export const ImageUrlSchema = z
  .union([z.literal(''), z.string().trim().url('Image must be a URL')])
  .optional();

export const ExternalUrlSchema = z
  .union([z.literal(''), z.string().trim().url('External link must be a URL')])
  .optional();

// Reading version of MetadataSchema that tries to remove invalid data.
export const MetadataSchema = BaseMetadataSchema.extend({
  image: ImageUrlSchema.catch(''),
  external_url: ExternalUrlSchema.catch('')
});

export type Metadata = z.infer<typeof MetadataSchema>;

export const AttributesMetadataSchema = MetadataSchema.extend({
  attributes: z.array(AttributeSchema).optional()
});

export type AttributesMetadata = z.infer<typeof AttributesMetadataSchema>;

function getValue(attributes: Array<Attribute>, name: string): unknown {
  return attributes
    .filter((a) => a.trait_type === name)
    .map((a) => a.value)
    .find(() => true);
}

export type AttributeExtractor<T> = {
  bigint: (name: KeyOfType<T, BigNumberish>) => bigint;
  string: (name: KeyOfType<T, string>) => string;
  number: (name: KeyOfType<T, number>) => number;
  address: (name: KeyOfType<T, address>) => Address;
  boolean: (name: KeyOfType<T, boolean>) => boolean;
};

export function fromAttributes<T>(attributes: Array<Attribute>): AttributeExtractor<T> {
  return {
    bigint: (name: KeyOfType<T, BigNumberish>) => getBigint(attributes, String(name)),
    string: (name: KeyOfType<T, string>) => getString(attributes, String(name)),
    number: (name: KeyOfType<T, number>) => getNumber(attributes, String(name)),
    address: (name: KeyOfType<T, address>) => getAddress(attributes, String(name)),
    boolean: (name: KeyOfType<T, boolean>) => getBoolean(attributes, String(name))
  };
}

function getBigint(attributes: Array<Attribute>, name: string): bigint {
  return z.coerce.bigint().parse(getValue(attributes, name));
}

function getString(attributes: Array<Attribute>, name: string): string {
  return z.string().parse(getValue(attributes, name));
}

function getAddress(attributes: Array<Attribute>, name: string): Address {
  // TODO Fixme
  return asChecksumAddress(AddressSchema.parse(getValue(attributes, name)));
}

function getNumber(attributes: Array<Attribute>, name: string): number {
  return z.coerce.number().parse(getValue(attributes, name));
}

function getBoolean(attributes: Array<Attribute>, name: string): boolean {
  return z.boolean().parse(getValue(attributes, name));
}
