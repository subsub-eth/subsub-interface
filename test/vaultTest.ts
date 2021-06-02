import BN from 'bn.js';
import {
  CreatezInstance,
  BlockdeterminedCreatorVaultInstance,
} from '../types/truffle-contracts';
import {
  UserDeposited
} from '../types/truffle-contracts/BlockdeterminedCreatorVault';

import { findFirstEvent } from './helper';

const Createz = artifacts.require("Createz");
const CreatorVault = artifacts.require("BlockdeterminedCreatorVault");
const CreatorVaultFactory = artifacts.require("CreatorVaultFactory");

const assertUserDeposited = (deposited: UserDeposited, v: {
  user: string,
  amount: BN,
  newDeposit: BN,
  allTimeDeposit: BN,
  initialDepositAt: BN,
}) => {
    assert.isOk(deposited.args.user == v.user);
    assert.isOk(deposited.args.amount.eq(v.amount));
    assert.isOk(deposited.args.newDeposit.eq(v.newDeposit));
    assert.isOk(deposited.args.allTimeDeposit.eq(v.allTimeDeposit));
    assert.isOk(deposited.args.initialDepositAt.eq(v.initialDepositAt));
}

contract("CreatorVault", async accounts => {

  const creator = accounts[1];
  const user = accounts[0];

  const deploy: () => Promise<[CreatezInstance,
    BlockdeterminedCreatorVaultInstance]> = async () => {
      const token = await Createz.deployed();

      const vault = await CreatorVault.new(creator, token.address);

      assert.equal(await vault.owner(), creator);

      return [token, vault];
    }

  contract("deposit", async () => {
    it("should create a new vault instance with 0 deposit", async () => {
      const [token, vault] = await deploy();
      const s = await vault.depositOf(user);
      const total = await token.balanceOf(vault.address);
      assert.isOk(s.eq(new BN(0)));
      assert.isOk(total.eq(new BN(0)));
    });


    it("should deposit from user to contract", async () => {
      const [token, vault] = await deploy();
      const amount = new BN(1000);

      await token.approve(vault.address, amount);
      const deposit = await vault.deposit(amount, {from: user});

      const vaultBalance = await token.balanceOf(vault.address);
      const userDeposit = await vault.depositOf(user);

      assert.isOk(vaultBalance.eq(amount));
      assert.isOk(vaultBalance.eq(userDeposit));

      const deposited =
        findFirstEvent<UserDeposited>(deposit.logs, "UserDeposited")

      assertUserDeposited(deposited, {
        user: user,
        amount: amount,
        newDeposit: amount,
        allTimeDeposit: amount,
        initialDepositAt: new BN(0)
      })

    });


    it("should deposit an additional from user to contract", async () => {
      const [token, vault] = await deploy();
      const amount = new BN(1000);
      const additionalAmount = new BN(100);

      await token.approve(vault.address, amount.add(additionalAmount));
      await vault.deposit(amount, {from: user});

      const vaultBalance = await token.balanceOf(vault.address);
      const userDeposit = await vault.depositOf(user);

      assert.isOk(vaultBalance.eq(amount));
      assert.isOk(vaultBalance.eq(userDeposit));
      await vault.setCurrentBlock(1);

      await vault.deposit(additionalAmount, {from: user});
      const updatedDeposit = await vault.depositOf(user);

      // just 1 block passed since deposit
      assert.isOk(amount.add(additionalAmount).sub(new BN(1)).eq(updatedDeposit));
    });

    it("should create earnings for the creator", async () => {
      const [token, vault] = await deploy();
      const amount = new BN(1000);

      await token.approve(vault.address, amount);
      await vault.deposit(amount, {from: user});
      assert.equal((await vault.getActiveSubscriptions()).toNumber(), 1);

      // create some random transaction
      await vault.setCurrentBlock(1);
      assert.equal((await vault.getActiveSubscriptions()).toNumber(), 1);

      const potentialEarnings = await vault.creatorEarnings();

      assert.isOk(potentialEarnings.eq(new BN(1)), `earnings is ${potentialEarnings.toString()}`);

      await vault.setCurrentBlock(2);
      await vault.creatorWithdraw();
      const updatedCreatorBalance = await token.balanceOf(creator);
      assert.isOk(updatedCreatorBalance.eq(potentialEarnings.add(new BN(1))),
        `Creator balance is actually ${updatedCreatorBalance.toNumber()}`);

    });
  })

})
