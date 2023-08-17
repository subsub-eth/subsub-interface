import { z } from 'zod';

import { ethers } from 'ethers';

export type Hash = string;

export const address = z.custom<`0x${string}`>((val) => {
  return ethers.isAddress(val);
});

// TODO address validation
// TODO validations
export const AttributeSchema = z.object({
  trait_type: z.string(),
  value: z.union([z.string(), z.bigint()])
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
