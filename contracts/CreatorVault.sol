// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "solidity-linked-list/contracts/StructuredLinkedList.sol";

contract CreatorVault is Ownable {

  // TODO refactor block.number calls with internal method

  using SafeERC20 for IERC20;
  using StructuredLinkedList for StructuredLinkedList.List;

  uint private _stateUpdated;
  // TODO idea: move to separate contract for simplicity and portability
  // linked list to navigate subscriptionEnds mapping
  StructuredLinkedList.List private subscriptionEndList;
  // block number => number of users' subsription that end on this block
  mapping(uint => uint) private subscriptionEnds;

  // number of active subscriptions
  // TODO make a public view function that calculates the actual active subs
  uint public activeSubscriptions = 0;

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

    _stateUpdated = block.number;
  }


  // TODO change to public?
  function creatorFeePerBlock() public view returns (uint) {
    return _creatorFeePerBlock;
  }

  function updateState() public returns (bool) {
    require(_stateUpdated <= block.number);
    if (_stateUpdated == block.number) {
      // do not update multiple times within same block
      return false;
    }


    if (!subscriptionEndList.listExists()) {
      _stateUpdated = block.number;
      return true;
    }

    // update subscription list => how many subs did end?
    // update sub counter
    // update creator claimable earnings

    (uint subsEnded, uint creatorEarnings) = _getStateUpdate();

    // actually update state
    activeSubscriptions -= subsEnded;
    _claimableEarnings += creatorEarnings;

    // clean up sub list
    (bool headExists, uint head) = subscriptionEndList.getNextNode(0);
    while (headExists && head <= block.number) {
      subscriptionEndList.remove(head);
      delete(subscriptionEnds[head]);
      (headExists, head) = subscriptionEndList.getNextNode(0);
    }

    _stateUpdated = block.number;
    return true;
  }


  /**
    what are the changes from previous to current state?
  */
  function _getStateUpdate() private view returns (uint subsEnded,
                                                   uint creatorEarnings) {

    if (!subscriptionEndList.listExists()) {
      return (0, 0);
    }

    (bool nodeExists, uint currentNode) = subscriptionEndList.getNextNode(0);
    uint claimedBlock = _stateUpdated;
    uint activeSubs = activeSubscriptions;

    while(nodeExists && currentNode <= block.number) {
      creatorEarnings += activeSubs * (currentNode - claimedBlock);

      activeSubs -= subscriptionEnds[currentNode];
      claimedBlock = currentNode;
      (nodeExists, currentNode) = subscriptionEndList.getNextNode(currentNode);
    }

    creatorEarnings += activeSubs * (block.number - claimedBlock);
    subsEnded = activeSubscriptions - activeSubs;
  }

  /**
    returns the remaining deposit of a user
  */
  function depositOf(address _user) public view returns (uint userBalance) {
    // TODO when does payment actually happen? start or end of block?
    UserDeposit storage userDeposit = deposits[_user];

    uint paidAmount = (block.number - userDeposit.blocktime) * _creatorFeePerBlock;

    if (paidAmount > userDeposit.amount) {
      return 0;
    }

    return userDeposit.amount - paidAmount;
  }

  function deposit(uint _amount) public returns (bool success){
    // TODO some sort of minimum amount
    // TODO handle deleted node from sublist
    // TODO handle activeSubscriptions in a centralized method
    // TODO update creator claim

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
      _removeSubscription(existingDeposit.amount, existingDeposit.blocktime);
    }

    // store initial/updated deposit
    deposits[user] = UserDeposit({
      blocktime: block.number,
      amount: newAmount,
      // TODO
      initialBlock: 0,
      totalAmount: 0
    });

    // calculate end of subscription
    // TODO handle updated deposit
    // TODO emit some event
    // TODO throw exception
    success = _addSubscription(newAmount, block.number);
  }

  function _subEndBlock(uint _tokenAmount, uint _depositBlock) private view returns (uint endBlock) {
    // TODO cuts off remaining value => what to do with that?
    uint subBlocks = _tokenAmount / _creatorFeePerBlock;
    endBlock = _depositBlock + subBlocks;
  }

  function _addSubscription(uint _tokenAmount, uint _depositBlock) private returns (bool) {
    uint endBlock = _subEndBlock(_tokenAmount, _depositBlock);

    bool exists = subscriptionEndList.nodeExists(endBlock);
    if (subscriptionEndList.listExists()) {
      subscriptionEndList.pushBack(endBlock);
    } else if (!exists) {
      // create new entry
      (bool nExists, uint nPrev, uint nNext) = subscriptionEndList.getNode(0);
      uint currentNode = nNext;
      while (nExists && endBlock < currentNode) {
        (nExists, nPrev, nNext) = subscriptionEndList.getNode(currentNode);
        currentNode = nNext;
      }

      subscriptionEndList.insertBefore(currentNode, endBlock);
    }
    // else an entry does already exist

    subscriptionEnds[endBlock] = subscriptionEnds[endBlock] + 1;
    activeSubscriptions++;

    // TODO actually use and/or throw exception
    return true;
  }

  function _removeSubscription(uint _tokenAmount, uint _depositBlock) private returns (bool) {
    uint endBlock = _subEndBlock(_tokenAmount, _depositBlock);

    uint subs = subscriptionEnds[endBlock];
    if (subs <= 1) {
      delete subscriptionEnds[endBlock];
      subscriptionEndList.remove(endBlock);
    } else {
      subscriptionEnds[endBlock] = subs - 1;
    }

    activeSubscriptions--;

    // TODO
    return true;
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

}
