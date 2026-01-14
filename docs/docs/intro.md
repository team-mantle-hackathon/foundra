---
title: Foundra
slug: /
sidebar_position: 1
---

# Foundra

Welcome to Foundra, a real estate construction financing protocol that combines on-chain vaults with risk assessment and KYC verification.

## 30-Second Overview

**Problem**: Construction projects struggle to access financing, while investors lack transparent, structured access to real estate lending.

**Solution**: Foundra creates ERC-4626 vaults per project, with a registry, factory, and risk oracle that enable structured fundraising and repayments.

**Innovation**:

- On-chain vaults per project (ERC-4626)
- AI-assisted risk grading via a risk oracle
- ZK-KYC verification hooks for privacy-preserving compliance

**Current scope**:

- Core smart contracts (ProtocolRegistry, VaultFactory, RWAVault, RiskOracle)
- Mock USDC for testing and local development
- Frontend app and Edge Functions for AI risk and ZK proof verification

---

## What is Foundra?

Foundra connects developers and investors in a transparent lending flow. Developers submit projects, receive a risk grade, and raise funds through a dedicated vault. Investors deposit stablecoins, receive shares, and earn yield based on project performance.

## Quick Start

### For Developers

1. Register a developer profile
2. Submit a project with details and documents
3. Receive a risk grade from the oracle
4. Get approval and open the vault for fundraising
5. Access funds when the target is reached

[Go to Developer Guide ->](./developer-guide/quick-start)

### For Investors

1. Complete ZK-KYC verification
2. Browse pools by risk grade and APY
3. Deposit USDC into the project vault
4. Track yield and withdraw after maturity

[Go to User Flows ->](./core-flow/user-flows)

---

## Key Features

- ERC-4626 vaults for tokenized lending pools
- Risk grading with an oracle workflow
- Pool states for clear project lifecycle tracking
- ZK-KYC proof verification hooks
- Modular contracts with a registry and factory

---

## Architecture at a Glance

```
Protocol Layer
  - ProtocolRegistry
  - VaultFactory
  - RiskOracle

Vault Layer
  - RWAVault per project (ERC-4626)
```

---

## Learn More

- [Overview](./introduction/overview)
- [Smart Contracts](./smart-contracts/overview)
- [Developer Guide](./developer-guide/quick-start)
- [Deployment](./deployment/testnet)
- [Security](./security/overview)

---

## Technology Stack

- Smart contracts: Solidity ^0.8.20, Foundry, OpenZeppelin 4.x
- Frontend: React 19, Vite 7.x, TailwindCSS 4.x, TypeScript 5.9
- Web3: wagmi 2.x, viem 2.x, RainbowKit 2.x
- Backend: Supabase Edge Functions
- KYC: Reclaim Protocol ZK proofs
