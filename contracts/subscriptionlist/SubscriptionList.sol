// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "solidity-linked-list/contracts/StructuredLinkedList.sol";

library SubscriptionList {

  using StructuredLinkedList for StructuredLinkedList.List;

  struct List {
    // linked list to navigate subscriptionEnds mapping
    StructuredLinkedList.List expirations;
    // _currentBlock() => number of users' subsription that end on this block
    mapping(uint => uint) expirationCount;

    // number of active subscriptions
    // TODO make a public view function that calculates the actual active subs
    uint activeSubscriptions;
  }

  /**
    * @notice returns the head of the list
    * @param self the list that is being read
    * @return bool if the value exists, the position, the value. Value and
    * position are 0 if the entry does not exist
    */
  function head(List storage self) internal view returns(bool, uint, uint) {
    if (!self.expirations.listExists()) {
      return (false, 0, 0);
    }

    (bool exists, uint head) = self.expirations.getNextNode(0);

    return (exists, head, self.expirationCount[head]);
  }

  /**
    * @notice returns the next value after pos
    * @param self the list that is being read
    * @param pos the position before the next value
    * @return bool if the value exists, the position, the value. Value and
    * position are 0 if the entry does not exist
    */
  function next(List storage self, uint pos) internal view returns(bool, uint, uint) {
    require(pos > 0, "position needs to be larger than 0");
    if (!self.expirations.listExists()) {
      return (false, 0, 0);
    }

    (bool exists, uint next) = self.expirations.getNextNode(pos);

    if (exists && next > 0) {
      return (exists, next, self.expirationCount[next]);
    }

    return (false, 0, 0);
  }

  /**
    * @notice remove a number of subs
    * @param self the list that is being modified
    * @param pos the position that is being reduced
    * @param value the amount of subs to remove
    * @return returns success and the removed key-value pair
    */
  function remove(List storage self, uint pos, uint value) internal returns(bool, uint, uint) {
    require(pos > 0);

    (bool exists, , ) = self.expirations.getNode(pos);

    if (exists) {
      uint subs = self.expirationCount[pos];
      require(subs >= value);

      if (subs == value) {
        // all subs removed
        self.expirations.remove(pos);
        delete self.expirationCount[pos];
      } else {
        // decrease number of subs
        self.expirationCount[pos] -= value;
      }

      self.activeSubscriptions -= value;
      return (exists, pos, self.expirationCount[pos]);
    }

    return (false, 0, 0);
  }

  /**
    * @notice inserts a value at postition pos BEFORE position beforePos
    * @param self the list that is being modified
    * @param afterPos position to insert the new key-value pair before
    * @param pos position of the new value
    * @param value the new value
    * @return returns success and the new key-value pair
    */
  function insertBefore(List storage self, uint afterPos, uint pos, uint value) internal returns (bool, uint, uint) {
    require(pos > 0, "position needs to be larger than 0");
    require(value > 0, "value must be larger than 0");
    require(afterPos > pos, "new position must be smaller than afterPos");
    if (!self.expirations.listExists()) {
      return (false, 0, 0);
    }

    (bool afterExists, , ) = self.expirations.getNode(afterPos);
    if (afterExists) {
      self.expirations.insertBefore(afterPos, pos);
      self.expirationCount[pos] = value;

      self.activeSubscriptions += value;

      return (true, pos, value);
    }

    return (false, 0, 0);
  }

  /**
    * @notice appends a value with a position at the END of the list, thus 
    * pos is the NEW END of the list
    * @param self the list that is being modified
    * @param pos new position of key-value pair
    * @param value new value
    * @return returns success and the new key-value pair
    */
  function append(List storage self, uint pos, uint value) internal returns (bool, uint, uint) {
    require(self.expirationCount[pos] == 0);
    require(value > 0, "value must be larger than 0");

    // check linked list tail
    (bool tailExists, uint tailPosition) = self.expirations.getPreviousNode(0);
    if (tailExists) {
      require(tailPosition < pos);
    }

    self.expirations.pushBack(pos);
    self.expirationCount[pos] = value;
    self.activeSubscriptions += value;

    return (true, pos, value);
  }

  /**
    * @notice adds a number of subs to an existing position
    * @param self the list that is being modified
    * @param pos position to modify
    * @param value value to increase the number of subs by
    * @return returns success and the updated key-value pair
    */
  function add(List storage self, uint pos, uint value) internal returns (bool, uint, uint) {
    require(pos > 0, "pos has to be larger than 0, because 0 is the meta head");
    require(value > 0, "value must be larger than 0");

    uint subs = self.expirationCount[pos];
    require(subs > 0, "subs is 0, the given position does not exists");

    uint newSubs = subs + value;
    self.expirationCount[pos] = newSubs;
    self.activeSubscriptions += value;

    return (true, pos, newSubs);
  }
}
