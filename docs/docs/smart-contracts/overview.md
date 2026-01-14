---
title: Smart Contracts
sidebar_position: 1
---

# Smart Contracts

Foundra is built around a registry, a vault factory, and a per-project ERC-4626 vault.

## Core Contracts

| Contract            | Description                                           | Key Functions                                           |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| ProtocolRegistry    | Central registry for developers, projects, approvals  | registerDeveloper, proposeProject, approveProject       |
| VaultFactory        | Factory for creating lending pool vaults              | createVault, getVaultsByDeveloper                       |
| RWAVault            | ERC-4626 vault per project                            | deposit, withdraw, makeRepayment                        |
| RiskOracle          | AI risk grade integration                             | requestRiskAssessment, fulfillRiskAssessment            |

## Interfaces

```
src/interfaces/
  IProtocolRegistry.sol
  IRWAVault.sol
  IRiskOracle.sol
  IVaultFactory.sol
```

## Mock USDC

Mock USDC is included for local testing and testnet deployments. It uses 6 decimals and provides helper mint functions for development.

## Deployment Scripts

```
script/
  Deploy.s.sol
  DeployMockUSDC.s.sol
  RenounceDeployerRoles.s.sol
  TestCompleteFlow.s.sol
  TransferToSafe.s.sol
```

The main deployment flow expects `MOCK_USDC_ADDRESS` and `WITNESS_ADDRESS` to be set.
