---
title: Quick Start
sidebar_position: 1
---

# Quick Start

This guide sets up the smart contracts and frontend for local development.

## Prerequisites

- Node.js 22 or newer
- Foundry
- Git

## Installation

```bash
git clone https://github.com/team-mantle-hackathon/foundra.git
cd foundra

cd smart-contract
forge install

cd ../front-end
npm install
```

## Smart Contract Development

```bash
cd smart-contract

forge build
anvil

export PRIVATE_KEY=0xYOUR_ANVIL_PRIVATE_KEY
forge script script/DeployMockUSDC.s.sol --rpc-url http://localhost:8545 --broadcast

export MOCK_USDC_ADDRESS=0xYOUR_MOCK_USDC_ADDRESS
export WITNESS_ADDRESS=0xYOUR_WITNESS_ADDRESS

cast send $MOCK_USDC_ADDRESS \
  "mintWhole(address,uint256)" 0xYOUR_ADDRESS 1000 \
  --private-key $PRIVATE_KEY \
  --rpc-url http://localhost:8545

forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

## Frontend Development

```bash
cd front-end
npm run dev
```

## Testing

```bash
cd smart-contract
forge test -vvv
```
