const Createz = artifacts.require("Createz");
const CreatorVaultFactory = artifacts.require("CreatorVaultFactory");
const CreatorVault = artifacts.require("CreatorVault");

module.exports = function (deployer) {
  // create the token first
  deployer.deploy(Createz).then(function(token) {
    // create the vault factory and add the token
    return deployer.deploy(CreatorVaultFactory, token.address);
  });
};
