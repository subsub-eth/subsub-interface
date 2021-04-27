// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SubscriptionList.sol";

contract SubscriptionContainer {

  using SubscriptionList for SubscriptionList.List;

  SubscriptionList.List private list;

  function head() public view returns(bool, uint, uint) {
    return list.head();
  }

  function next(uint pos) public view returns(bool, uint, uint) {
    return list.next(pos);
  }

  function remove(uint pos, uint value) public returns(bool, uint, uint) {
    return list.remove(pos, value);
  }

  function insertBefore(uint beforePos, uint pos, uint value) public returns (bool, uint, uint) {
    return list.insertBefore(beforePos, pos, value);
  }

  function append(uint pos, uint value) public returns (bool, uint, uint) {
    return list.append(pos, value);
  }

  function add(uint pos, uint value) public returns(bool, uint, uint) {
    return list.add(pos, value);
  }

  function activeSubscriptions() public view returns (uint) {
    return list.activeSubscriptions;
  }
}
