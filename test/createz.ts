const Createz = artifacts.require("Createz");

contract("Createz coin", async accounts => {
  it("should be minted with a 1000 initial supply", async () => {
    const totalSupply: number = 1000;
    const token = await Createz.deployed();
    const supply = await token.totalSupply();
    const userBalance = await token.balanceOf(accounts[0]);
    assert.equal(supply.valueOf(), totalSupply);
    assert.equal(userBalance.toNumber(), totalSupply);
  })

})
