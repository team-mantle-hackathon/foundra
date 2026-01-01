// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVaultFactory {
    function createVault(
        uint256 _projectId,
        uint256 _targetAPY,
        uint256 _tenor
    ) external returns (address);
}
