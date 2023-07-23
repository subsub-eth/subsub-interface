import { z } from 'zod';

export const DepositPropsSchema = z.object({
  amount: z.bigint().min(0n, "Amount must be larger or equal to 0"),
  message: z.string().optional()
})

export type DepositProps = z.infer<typeof DepositPropsSchema>

export const MintPropsSchema = DepositPropsSchema.extend({
  multiplier: z.number().min(100, "Multiplier must be larger or equal to 100").max(100_000, "Mutliplier must be less or equal to 100,000"),
})

export type MintProps = z.infer<typeof MintPropsSchema>
