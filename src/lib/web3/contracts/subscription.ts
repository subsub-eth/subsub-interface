import { z } from 'zod';

// TODO validations
export const AttributesSchema = z.object({
  trait_type: z.string(),
  value: z.union([z.string(), z.bigint()])
});

export const SubscriptionContractMetadataSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 chars'),
  description: z.string().optional(),
  image: z.union([z.literal(''), z.string().trim().url('Image must be a URL')]).optional(),
  external_url: z
    .union([z.literal(''), z.string().trim().url('External link must be a URL')])
    .optional(),
  attributes: z.array(AttributesSchema)
});

export type SubscriptionContractMetadata = z.infer<typeof SubscriptionContractMetadataSchema>;

export const SubscriptionTokenMetadataSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().trim().url().optional(),
  external_url: z.string().trim().url().optional(),
  attributes: z.array(AttributesSchema)
});

export type SubscriptionTokenMetadata = z.infer<typeof SubscriptionTokenMetadataSchema>;
