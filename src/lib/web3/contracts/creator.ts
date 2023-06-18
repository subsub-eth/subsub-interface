import { z } from 'zod';

export const CreatorMetadataSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 chars'),
  description: z.string().optional(),
  image: z.union([z.literal(''), z.string().trim().url()]).optional(),
  external_url: z.union([z.literal(''), z.string().trim().url()]).optional(),
});

export type CreatorMetadata = z.infer<typeof CreatorMetadataSchema>;
