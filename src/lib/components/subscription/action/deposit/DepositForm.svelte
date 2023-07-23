<script lang="ts">
    import { DepositPropsSchema, type DepositProps } from "$lib/web3/contracts/subscription";
    import { reporter } from "@felte/reporter-svelte";
    import { validator } from "@felte/validator-zod";
    import { createForm } from "felte";
    import { createEventDispatcher } from "svelte";
    import type { ApprovalDispatch, ApprovalEvents, DepositDispatch, DepositEvents, DepositSubscriptionEvents, TxFailedEvents } from "../subscription-events";
    import NumberInput from "$lib/components/form/NumberInput.svelte";
    import TextInput from "$lib/components/form/TextInput.svelte";

  export let allowance: bigint;
  export let balance: bigint;
  export let submitLabel: string;
  export let approve: (amount: bigint, dispatch: ApprovalDispatch) => Promise<bigint>;
  export let deposit: (amount: bigint, message: string,  dispatch: DepositDispatch) => Promise<[bigint, string]>;

  const depositDispatch = createEventDispatcher<DepositEvents>();
  const approvalDispatch = createEventDispatcher<ApprovalEvents>();
  const failDispatch = createEventDispatcher<TxFailedEvents>();
  let formDisabled = false;

  $: ({ form, data } = createForm<DepositProps>({
    async onSubmit(val) {
      console.log('submitted', val);

      try {
        formDisabled = true;
        if (approvalMode) {
          await approve(val.amount, approvalDispatch);
        } else {
          await deposit(val.amount, val.message ?? '', depositDispatch);
        }
      } catch (err) {
        console.error('An error occurred', err);
        failDispatch('txFailed', err);
      } finally {
        formDisabled = false;
      }
    },
    transform: (value: any) => {
      if (value.amount || value.amount === 0) value.amount = BigInt(value.amount);

      return value as DepositProps;
    },
    extend: [validator({ schema: DepositPropsSchema }), reporter]
  }));

  $: approvalMode = allowance < $data?.amount;

</script>


<div>
  <form use:form>
    <div>current balance: {balance}</div>
    <NumberInput name="amount" label="Amount" value={0} required />
    <TextInput name="message" label="Message" disabled={approvalMode} />

    <div>
      <button type="submit" disabled={formDisabled}>{approvalMode ? 'Approve' : submitLabel}</button>
    </div>
  </form>
</div>
