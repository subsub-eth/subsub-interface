<script lang="ts">
  import { createForm } from 'felte';

  import NumberInput from '../form/NumberInput.svelte';
  import TextInput from '../form/TextInput.svelte';
  import { type MintProps, MintPropsSchema, type DepositProps, DepositPropsSchema } from '$lib/web3/contracts/subscription';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import { createEventDispatcher } from 'svelte';
  import {
    type ERC20,
    type Subscription
  } from '@createz/contracts/types/ethers-contracts';
  import { matchEvents } from '$lib/web3/ethers';
  import { ZeroAddress } from 'ethers';
    import type { RenewSubscriptionEvents } from './subscription-events';

  export let subContract: Subscription;
  export let subId: bigint;
  export let currentAccount: string;
  export let allowance: bigint;
  export let balance: bigint;
  export let token: ERC20;

  const dispatch = createEventDispatcher<RenewSubscriptionEvents>();
  let formDisabled = false;

  let needsApproval = true;

  const doApprove = async (val: DepositProps) => {
    if (val.amount > 0 && token) {
      const apprTx = await token.approve(await subContract.getAddress(), val.amount);
      dispatch('approvalTxSubmitted', apprTx.hash);
      const receipt = await apprTx.wait();
      dispatch('approved', receipt?.hash);
      allowance = await token.allowance(currentAccount, await subContract.getAddress());
    } else {
      throw new Error('Approval of 0 amount or token not found');
    }
  };

  const doRenew = async (val: DepositProps) => {
    const tx = await subContract.renew(subId, val.amount, val.message ?? '');
    dispatch('renewTxSubmitted', tx.hash);

    // TODO dirty hack until there is a fix
    const receipt = await (await (await tx.wait())?.getTransaction())?.wait();

    console.log('receipt', receipt);
    // debugger;
    const logs = receipt?.logs;
    const res = await matchEvents(
      logs as [],
      subContract,
      subContract.filters.SubscriptionRenewed(subId)
    );
    if (res[0]) {
      const tokenId = res[0].args.tokenId;
      dispatch('renewed', tokenId);
    }
  };

  let action = doApprove;

  // soften cyclic dependency
  const setAction = (func: (val: DepositProps) => Promise<void>) => action = func;

  $: ({ form, data } = createForm<DepositProps>({
    async onSubmit(val) {
      console.log('submitted', val);

      try {
        formDisabled = true;
        await action(val);
      } catch (err) {
        console.error('An error occurred', err);
        dispatch('txFailed', err);
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

  $: needsApproval = allowance < $data.amount;

  $: {
    if (needsApproval) {
      setAction(doApprove);
    } else {
      setAction(doRenew);
    }
  }

</script>

<div>
  <form use:form>
    <div>current balance: {balance}</div>
    <NumberInput name="amount" label="Amount" value={0} required />
    <TextInput name="message" label="Message" disabled={needsApproval} />

    <div>
      {#if needsApproval}
        <button type="submit" disabled={formDisabled}>approve</button>
      {:else}
        <button type="submit" disabled={formDisabled}>renew</button>
      {/if}
    </div>
  </form>
</div>
