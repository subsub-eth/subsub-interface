<script lang="ts">
  import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';
  import type { PageData } from './$types';
  import SubscriptionDeposit from '$lib/components/subscription/action/SubscriptionDeposit.svelte';
  import SubscriptionWithdrawal from '$lib/components/subscription/action/SubscriptionWithdrawal.svelte';
  import { cancel, renew, withdraw, tip } from '$lib/web3/contracts/subscription';
  import {
    CurrentAccountContext,
    ERC20AllowanceContext,
    ERC20BalanceContext,
    ERC20Context,
    EthersContext,
    SubscriptionContractContext,
    SubscriptionContractMetadataContext,
    SubscriptionMetadataContext
  } from '$lib/components/context/web3';
  import { approveFunc } from '$lib/web3/contracts/erc20';

  export let data: PageData;

  const addr = data.subscriptionAddr;
  const tokenId = data.tokenId;
</script>

<h1>Subscription Details</h1>

<EthersContext let:ethersSigner>
  <SubscriptionContractContext {ethersSigner} address={addr} let:subscriptionContract>
    <SubscriptionContractMetadataContext
      contract={subscriptionContract}
      let:metadata={contractMetadata}
    >
      <SubscriptionMetadataContext
        contract={subscriptionContract}
        {tokenId}
        let:metadata={tokenMetadata}
        let:update={updateTokenMetadata}
      >
        {@const tokenAddr =
          '' + contractMetadata.attributes?.find((e) => e.trait_type === 'token')?.value}
        <div>
          <div>
            <!-- LEFT -->
            <!-- TODO proper details -->
            <SubscriptionTeaser contractAddress={addr} {tokenId} metadata={tokenMetadata} />
            <!-- Subscription token details -->
            <!-- sub contract details -->
            <!-- Contract owner teaser -->
          </div>

          <div>
            <!-- RIGHT -->

            <!-- subscription controls -->
            <!-- deposit(renew) / tip -->
            <!-- withdraw / cancel -->
            <CurrentAccountContext let:currentAccount>
              <ERC20Context address={tokenAddr} {ethersSigner} let:token>
                <ERC20BalanceContext
                  {token}
                  account={currentAccount}
                  let:balance
                  let:update={updateBalance}
                >
                  <ERC20AllowanceContext
                    {token}
                    account={currentAccount}
                    spender={addr}
                    let:allowance
                    let:update={updateAllowance}
                  >
                    {@const doUpdate = async () =>
                      await Promise.all([
                        updateBalance(),
                        updateAllowance(),
                        updateTokenMetadata()
                      ]).then(() => {})}
                    <SubscriptionDeposit
                      {allowance}
                      {balance}
                      approve={approveFunc(token, addr)}
                      renew={renew(subscriptionContract, tokenId)}
                      tip={tip(subscriptionContract, tokenId)}
                      updateData={doUpdate}
                    />
                    {@const withdrawable = BigInt(
                      tokenMetadata.attributes?.find((e) => e.trait_type === 'withdrawable')?.value
                    )}
                    {@const deposited = BigInt(
                      tokenMetadata.attributes?.find((e) => e.trait_type === 'deposited')?.value
                    )}
                    <SubscriptionWithdrawal
                      withdraw={withdraw(subscriptionContract, tokenId)}
                      cancel={cancel(subscriptionContract, tokenId)}
                      {withdrawable}
                      {deposited}
                      updateData={doUpdate}
                    />
                  </ERC20AllowanceContext>
                </ERC20BalanceContext>
              </ERC20Context>
            </CurrentAccountContext>
          </div>
        </div>
      </SubscriptionMetadataContext>
    </SubscriptionContractMetadataContext>
  </SubscriptionContractContext>
</EthersContext>
