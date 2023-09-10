<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { toast } from '@zerodevx/svelte-toast';
  import {
    CurrentAccountContext,
    ERC20AllowanceContext,
    ERC20BalanceContext,
    ERC20Context,
    EthersContext,
    SubscriptionContractContext,
    SubscriptionContractMetadataContext
  } from '$lib/components/context/web3';
  import MintSubscriptionForm from '$lib/components/subscription/action/MintSubscriptionForm.svelte';
  import { mint } from '$lib/web3/contracts/subscription';
  import { approveFunc } from '$lib/web3/contracts/erc20';

  export let data: PageData;

  const addr = data.subscriptionAddr;

  const onMinted = async (ev: CustomEvent<[bigint, string]>) => {
    const [id, hash] = ev.detail;
    toast.push(`New Subscription minted: ${id} in ${hash}`, { pausable: true });
    goto($page.url.pathname + '../' + id);
  };

  const toastMessage = (message: string) => toast.push(message, { pausable: true });
</script>

<h1>Mint new Subscription Token</h1>

<EthersContext let:ethersSigner>
  <SubscriptionContractContext address={addr} {ethersSigner} let:subscriptionContract>
    <SubscriptionContractMetadataContext contract={subscriptionContract} let:metadata>
      <CurrentAccountContext let:currentAccount>
        <ERC20Context address={metadata.token} {ethersSigner} let:token>
          <ERC20AllowanceContext
            {token}
            account={currentAccount}
            spender={addr}
            let:allowance
            let:update={updateAllowance}
          >
            <ERC20BalanceContext
              {token}
              account={currentAccount}
              let:balance
              let:update={updateBalance}
            >
              {@const update = async () => {
                await updateAllowance();
                await updateBalance();
              }}
              <MintSubscriptionForm
                {allowance}
                {balance}
                mint={mint(subscriptionContract, currentAccount)}
                approve={approveFunc(token, addr)}
                {update}
                on:minted={onMinted}
                on:approved={(ev) => toastMessage(`Amount approved`)}
                on:mintTxSubmitted={(ev) => toast.push(`Mint Transaction submitted: ${ev.detail}`)}
                on:approvalTxSubmitted={(ev) =>
                  toast.push(`Approval Transaction submitted: ${ev.detail}`)}
                on:txFailed={(ev) =>
                  toast.push(`Transaction failed: ${ev.detail}`, {
                    pausable: true,
                    theme: {
                      '--toastBackground': 'red',
                      '--toastColor': 'white',
                      '--toastBarBackground': 'fuchsia'
                    }
                  })}
              ></MintSubscriptionForm>
            </ERC20BalanceContext>
          </ERC20AllowanceContext>
        </ERC20Context>
      </CurrentAccountContext>
    </SubscriptionContractMetadataContext>
  </SubscriptionContractContext>
</EthersContext>
