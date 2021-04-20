// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./CreatorVault.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract CreatorVaultFactory is Context {

  IERC20 public immutable token;

  event VaultCreation(
    address indexed _from,
    address indexed _newContract
  );

  constructor(address _token) {
    token = IERC20(_token);
  }

  function create(address _creator) public returns (CreatorVault vault){

    // TODO remember the addresses of all vaults
    // Does a creator want to have multiple vaults? save create => array[vault]
    // Maintaining x amount of contract instances is a bad idea
    vault = new CreatorVault(_creator, address(token));

    emit VaultCreation(_msgSender(), address(vault));
  }

}
