<script lang="ts">
  import { createForm } from 'felte';

  import NumberInput from '../form/NumberInput.svelte';
  import TextInput from '../form/TextInput.svelte';
  import { type MintProps, MintPropsSchema } from '$lib/web3/contracts/subscription';
  import { validator } from '@felte/validator-zod';
  import { reporter } from '@felte/reporter-svelte';
  import { createEventDispatcher } from 'svelte';
  import { ERC20__factory, type Subscription } from '@createz/contracts/types/ethers-contracts';
  import { ethersSigner, matchEvents } from '$lib/web3/ethers';

  // TODO handle approval/permit, permit2?

  export let subContract: Subscription;
  export let currentAccount: string;

  const dispatch = createEventDispatcher();
  let formDisabled = false;

  $: ({ form } = createForm<MintProps>({
    async onSubmit(val) {
      console.log('submitted', val);

      try {
        formDisabled = true;
        // TODO approval workflow
        if (val.amount > 0) {
          const [tokenAddr] = await subContract.settings();
          const token = ERC20__factory.connect(tokenAddr, $ethersSigner);
          const apprTx = await token.approve(await subContract.getAddress(), val.amount);
          await apprTx.wait();
        }

        const tx = await subContract.mint(val.amount, val.multiplier, val.message ?? '');
        dispatch('txSubmitted', tx.hash);

        // TODO dirty hack until there is a fix
        const receipt = await (await (await tx.wait())?.getTransaction())?.wait();

        console.log('receipt', receipt);
        // debugger;
        const logs = receipt?.logs;
        const res = await matchEvents(
          logs as [],
          subContract,
          subContract.filters.Transfer('0x0000000000000000000000000000000000000000', currentAccount)
        );
        if (res[0]) {
          const tokenId = res[0].args.tokenId;
          dispatch('minted', tokenId);
        }
      } catch (err) {
        console.error('An error occurred', err);
        dispatch('txFailed', err);
      } finally {
        formDisabled = false;
      }
    },
    transform: (value: any) => {
      if (value.amount || value.amount === 0) value.amount = BigInt(value.amount);

      return value as MintProps;
    },
    extend: [validator({ schema: MintPropsSchema }), reporter]
  }));
</script>

<div>
  <form use:form>
    <NumberInput name="amount" label="Amount" required />
    <NumberInput name="multiplier" label="Multiplier" required />
    <TextInput name="message" label="Message" />

    <div>
      <button type="submit" disabled={formDisabled}>create</button>
    </div>
  </form>
</div>
