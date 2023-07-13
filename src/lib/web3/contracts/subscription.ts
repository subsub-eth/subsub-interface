import { z } from 'zod';

export const MintPropsSchema = z.object({
  amount: z.bigint().min(0n, "Amount must be larger or equal to 0"),
  multiplier: z.number().min(100, "Multiplier must be larger or equal to 100").max(100_000, "Mutliplier must be less or equal to 100,000"),
  message: z.string().optional()
})

export type MintProps = z.infer<typeof MintPropsSchema>
