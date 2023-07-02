import { z } from 'zod';

export const SubscriptionContractPropsSchema = z.object({
  name: z.string().trim().min(3, 'Name must have at least 3 chars').max(48, 'Name can be 48 chars at most'),
  symbol: z.string().trim().min(2, 'Symbol must have at least 2 chars').max(12, 'Symbol can be 12 chars at most'),
});

export type SubscriptionContractProps = z.infer<typeof SubscriptionContractPropsSchema>;
