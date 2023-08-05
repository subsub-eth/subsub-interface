<script lang="ts">
  import SubscriptionTeaser from '$lib/components/subscription/SubscriptionTeaser.svelte';
  import type { PageData } from './$types';
  import SubscriptionDeposit from '$lib/components/subscription/action/SubscriptionDeposit.svelte';
  import SubscriptionWithdrawal from '$lib/components/subscription/action/SubscriptionWithdrawal.svelte';
  import EthersContext from '$lib/components/util/EthersContext.svelte';
  import SubscriptionContractContext from '$lib/components/util/SubscriptionContractContext.svelte';
  import CurrentAccountContext from '$lib/components/util/CurrentAccountContext.svelte';
  import SubscriptionMetadataContext from '$lib/components/subscription/SubscriptionMetadataContext.svelte';
  import { cancel, renew, withdraw, tip } from '$lib/web3/contracts/subscription';
  import SubscriptionContractMetadataContext from '$lib/components/subscription/SubscriptionContractMetadataContext.svelte';
  import Erc20Context from '$lib/components/util/ERC20Context.svelte';
  import { approveFunc } from '$lib/components/subscription/action/subscription-events';

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
              <Erc20Context
                address={tokenAddr}
                {ethersSigner}
                {currentAccount}
                spender={addr}
                let:token
                let:balance
                let:allowance
                let:update={updateErc20}
              >
                {@const doUpdate = async () =>
                  await Promise.all([updateErc20(), updateTokenMetadata()]).then(() => {})}
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
              </Erc20Context>
            </CurrentAccountContext>
          </div>
        </div>
      </SubscriptionMetadataContext>
    </SubscriptionContractMetadataContext>
  </SubscriptionContractContext>
</EthersContext>
