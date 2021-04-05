// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Createz is Context, AccessControlEnumerable, ERC20Burnable {

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor() ERC20("Createz Token", "CRZ") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

    _setupRole(MINTER_ROLE, _msgSender());

    mint(_msgSender(), 1000);
  }

  function mint(address to, uint256 amount) public virtual {
    require(hasRole(MINTER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have minter role to mint");
    _mint(to, amount);
  }
}
