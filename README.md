# FOUNDRA - Real Estate On Chain Construction Financing

## Overview
Decentralized lending protocol untuk pembiayaan konstruksi real estate di Indonesia. Protocol ini menghubungkan developer properti dengan investor melalui tokenized lending pools dengan compliance built-in.

## Key Features
- 🏗️ Construction financing for project owner property
- 🤖 AI-powered risk assessment (A, B, C, D)
- 🔐 ZK-KYC integration (via Binance, etc.)
- 📊 Pool-based lending with APY targets
- 🏦 Standardized vault interface (ERC-4626)

## Token Standards Used
- **ERC-4626**: Tokenized vault standard untuk lending pools

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Protocol Layer                       │
├─────────────────────────────────────────────────────────┤
│  ProtocolRegistry  │  VaultFactory  │  RiskOracle       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  RWA Vault 1 │    │  RWA Vault 2 │    │  RWA Vault N │
│  (ERC-4626)  │    │  (ERC-4626)  │    │  (ERC-4626)  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────────────────────────┘
```

## Smart Contracts Structure

### Core Contracts
- `ProtocolRegistry.sol` - Manage developers, projects, approvals
- `VaultFactory.sol` - Factory untuk create lending pools
- `RWAVault.sol` - ERC-4626 vault per project (main lending logic)
- `RiskOracle.sol` - AI risk grade integration

### Interfaces
- `IRWAVault.sol`
- `IProtocolRegistry.sol`
- `IRiskOracle.sol`
- `IVaultFactory.sol`

## User Flows

### Developer Flow
1. Register with company info
2. Do ZK-KYC (via Binance Integration)
3. Do KYC Manual for detail identity verification
4. Submit project details (location, budget, timeline) + AI Grading Risk
5. Wait for admin approval
6. Project approved → Vault created
7. Start fundraising
8. Receive funds ketika target tercapai
9. Repay with flexible before due date

### Investor Flow
1. Complete ZK-KYC (via Binance integration)
2. Browse available pools (filter by risk grade, APY, tenor)
3. Deposit USDC (min 100,000 IDR equivalent)
4. Receive vault shares (ERC-4626 token vault as shares)
5. Earn yield proportional to holdings
6. Withdraw after maturity, completed, or cancelled

## Pool States
- `Pending` - Waiting admin approval
- `Fundraising` - Open untuk investments
- `Active` - Target reached, funds disbursed
- `Repaying` - Developer making repayments
- `Completed` - Fully repaid
- `Defaulted` - Payment overdue
- `Cancelled` - Refunded to investors

## Project States
- `Pending` - Waiting admin approval
- `Active` - Active Project as long the Pool also not cancelled
- `Cancelled` - Project Cancelled also with pool
- `Rejected` - Admin rejecting Proposal Project
- `Completed` - Project completed the fundraising, disbursed, and repaying

## Key Parameters per Pool
- Target raise amount
- Target APY
- Tenor (duration)
- Minimum investment
- AI Risk Grade (A, B, C, D)
- Developer info & collateral details

## Security Features
- Multi-sig admin controls (Future Implementation)
- Pausable in emergency
- Rate limiting
- Reentrancy guards

## Technology Stack
- Solidity ^0.8.20
- Foundry (build & test)
- OpenZeppelin Contracts
- ERC-4626 (Vault standard)

## Development Setup

```bash
# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Deploy (testnet)
forge script script/Deploy.s.sol:Deploy --rpc-url mantle_sepolia --verify --broadcast -vvvv
```

## Testing
```bash
# Run all tests
forge test -vvv

# Run specific test
forge test --match-test testDeposit -vvv

# Gas report
forge test --gas-report
```

## License
MIT
