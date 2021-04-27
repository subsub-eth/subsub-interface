// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "solidity-linked-list/contracts/StructuredLinkedList.sol";
import "./subscriptionlist/SubscriptionList.sol";

import "./Blockaware.sol";

contract CreatorVault is Ownable, Blockaware {

  // TODO refactor _currentBlock() calls with internal method

  using SafeERC20 for IERC20;
  using SubscriptionList for SubscriptionList.List;
  using StructuredLinkedList for StructuredLinkedList.List;

  uint private _stateUpdated;
  SubscriptionList.List private subList;

  uint private _claimableEarnings = 0;

  struct UserDeposit {
    // last block of last deposit
    uint blocktime;
    // total amount of tokens at last deposit
    uint amount;
    // TODO implement
    // block of first ever deposit
    uint initialBlock;
    // total amount of tokens ever deposited
    uint totalAmount;
  }

  // The token this contract does accept
  IERC20 private immutable token;

  uint private _creatorFeePerBlock;

  // initial deposits of supporters
  mapping(address => UserDeposit) private deposits;

  constructor(address _creator, address _token) {

    token = IERC20(_token);
    transferOwnership(_creator);
    // TODO hardcoded for now
    _creatorFeePerBlock = 1;

    _stateUpdated = _currentBlock();
  }


  // TODO change to public?
  function creatorFeePerBlock() public view returns (uint) {
    return _creatorFeePerBlock;
  }

  function updateState() public returns (bool) {
    require(_stateUpdated <= _currentBlock());
    if (_stateUpdated == _currentBlock()) {
      // do not update multiple times within same block
      return false;
    }

    (bool listNotEmpty, , ) = subList.head();
    if (!listNotEmpty) {
      _stateUpdated = _currentBlock();
      return true;
    }

    // update subscription list => how many subs did end?
    // update sub counter
    // update creator claimable earnings

    (, uint creatorEarnings) = _getStateUpdate();

    // actually update state
    _claimableEarnings += creatorEarnings;

    // clean up sub list
    (bool headExists, uint head, uint value) = subList.head();
    while (headExists && head <= _currentBlock()) {
      subList.remove(head, value);
      (headExists, head, value) = subList.head();
    }

    _stateUpdated = _currentBlock();
    return true;
  }


  /**
    what are the changes from previous to current state?
  */
  function _getStateUpdate() private view returns (uint subsEnded,
                                                   uint creatorEarnings) {

    (bool listNotEmpty, , ) = subList.head();
    if (!listNotEmpty) {
      return (0, 0);
    }

    (bool nodeExists, uint currentNode, uint subsExpiring) = subList.head();
    uint claimedBlock = _stateUpdated;
    uint activeSubs = subList.activeSubscriptions;

    while(nodeExists && currentNode <= _currentBlock()) {
      creatorEarnings += activeSubs * (currentNode - claimedBlock);

      activeSubs -= subsExpiring;
      claimedBlock = currentNode;
      (nodeExists, currentNode, subsExpiring) = subList.next(currentNode);
    }

    creatorEarnings += activeSubs * (_currentBlock() - claimedBlock);
    subsEnded = subList.activeSubscriptions - activeSubs;
  }

  /**
    returns the remaining deposit of a user
  */
  function depositOf(address _user) public view returns (uint userBalance) {
    // TODO when does payment actually happen? start or end of block?
    UserDeposit storage userDeposit = deposits[_user];

    uint paidAmount = (_currentBlock() - userDeposit.blocktime) * _creatorFeePerBlock;

    if (paidAmount > userDeposit.amount) {
      return 0;
    }

    return userDeposit.amount - paidAmount;
  }

  function deposit(uint _amount) public returns (bool success){
    // TODO some sort of minimum amount
    // TODO handle deleted node from sublist

    updateState();

    address user = _msgSender();

    token.safeTransferFrom(user, address(this), _amount);

    UserDeposit storage existingDeposit = deposits[user];

    // existing/remaining deposit value
    uint existing = depositOf(user);
    uint newAmount = existing + _amount;

    // TODO handle from last claim/update block
    if (existingDeposit.blocktime > 0) {
      // remove existing sub list entry
      uint endBlock = _subEndBlock(existingDeposit.amount, existingDeposit.blocktime);
      subList.remove(endBlock, 1);
    }

    // store initial/updated deposit
    deposits[user] = UserDeposit({
      blocktime: _currentBlock(),
      amount: newAmount,
      // TODO
      initialBlock: 0,
      totalAmount: 0
    });

    // calculate end of subscription
    // TODO handle updated deposit
    // TODO emit some event
    // TODO throw exception
    uint endBlock = _subEndBlock(newAmount, _currentBlock());
    (success, , ) = subList.add(endBlock, 1);
  }

  function _subEndBlock(uint _tokenAmount, uint _depositBlock) private view returns (uint endBlock) {
    // TODO cuts off remaining value => what to do with that?
    uint subBlocks = _tokenAmount / _creatorFeePerBlock;
    endBlock = _depositBlock + subBlocks;
  }

  function creatorEarnings() public view returns (uint earnings) {

    (, uint creatorEarnings) = _getStateUpdate();

    earnings = _claimableEarnings + creatorEarnings;
  }

  function creatorWithdraw() public {
    // TODO is there a good case for making this function creator only?
    // transfer earnings of creator to the creator

    // drop nodes from the sublist -> clean up
    // update last claim block
    updateState();
    // transfer tokens

    token.transfer(owner(), _claimableEarnings);
    _claimableEarnings = 0;
  }

  function activeSubscriptions() public view returns (uint) {
    return subList.activeSubscriptions;
  }

}
