import BN from 'bn.js';


const Createz = artifacts.require("Createz");

contract("Createz coin", async accounts => {
  it("should be minted with a 1000 initial supply", async () => {
    const totalSupply = new BN(1000).mul(new BN(10).pow(new BN(18)));
    const token = await Createz.deployed();
    const supply = await token.totalSupply();
    const userBalance = await token.balanceOf(accounts[0] + "");
    assert.ok(supply.eq(totalSupply), `total supply of ${totalSupply}`);
    assert.ok(userBalance.eq(totalSupply), `all minted tokens belong to admin`);
  })

})
