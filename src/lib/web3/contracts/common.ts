import { z } from 'zod';

import { ethers } from 'ethers';

export const address = z.custom<`0x${string}`>((val) => {
  return ethers.isAddress(val);
});

export const MetadataSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 chars'),
  description: z.string().optional(),
  image: z.union([z.literal(''), z.string().trim().url('Image must be a URL')]).optional(),
  external_url: z
    .union([z.literal(''), z.string().trim().url('External link must be a URL')])
    .optional()
});

export type Metadata = z.infer<typeof MetadataSchema>;

