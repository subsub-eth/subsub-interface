import { z } from 'zod';

// TODO validations
export const SubscriptionContractMetadataSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 chars'),
  description: z.string().optional(),
  image: z.union([z.literal(''), z.string().trim().url('Image must be a URL')]).optional(),
  external_url: z
    .union([z.literal(''), z.string().trim().url('External link must be a URL')])
    .optional()
});

export type SubscriptionContractMetadata = z.infer<typeof SubscriptionContractMetadataSchema>;
