// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @notice provides a version
 */
interface Versioned {

  /**
    * @notice Returns a version
    */
  function getVersion() external view returns (string memory);
}
