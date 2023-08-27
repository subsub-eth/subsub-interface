import { z } from 'zod';

import { ethers } from 'ethers';

export type Hash = string;

export const AddressSchema = z.custom<`0x${string}`>((val) => {
  return ethers.isAddress(val);
});

export type address = z.infer<typeof AddressSchema>;

export const AttributeSchema = z.object({
  trait_type: z.string(),
  value: z.union([z.string(), z.bigint(), z.number()])
});

export type Attribute = z.infer<typeof AttributeSchema>;

export const MetadataSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 chars'),
  description: z.string().optional(),
  image: z.union([z.literal(''), z.string().trim().url('Image must be a URL')]).optional(),
  external_url: z
    .union([z.literal(''), z.string().trim().url('External link must be a URL')])
    .optional()
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

export type AttributeExtractor = {
  bigint: (name: string) => bigint;
  string: (name: string) => string;
  number: (name: string) => number;
  address: (name: string) => address;
};

export function fromAttributes(attributes: Array<Attribute>): AttributeExtractor {
  return {
    bigint: (name: string) => getBigint(attributes, name),
    string: (name: string) => getString(attributes, name),
    number: (name: string) => getNumber(attributes, name),
    address: (name: string) => getAddress(attributes, name)
  };
}

function getBigint(attributes: Array<Attribute>, name: string): bigint {
  return z.coerce.bigint().parse(getValue(attributes, name));
}

function getString(attributes: Array<Attribute>, name: string): string {
  return z.string().parse(getValue(attributes, name));
}

function getAddress(attributes: Array<Attribute>, name: string): address {
  return AddressSchema.parse(getValue(attributes, name));
}

function getNumber(attributes: Array<Attribute>, name: string): number {
  return z.coerce.number().parse(getValue(attributes, name));
}
