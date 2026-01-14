---
title: Testnet Deployment
sidebar_position: 1
---

# Testnet Deployment (Mantle Sepolia)

This deployment flow uses Foundry scripts and requires a funded wallet.

## Environment Variables

```env
PRIVATE_KEY=your_private_key
RPC_URL=https://rpc.sepolia.mantle.xyz
ETHERSCAN_API_KEY=your_api_key
```

## Deploy Steps

```bash
cd smart-contract

cp .env.example .env
# Edit .env with your private key and RPC URL

forge script script/DeployMockUSDC.s.sol \
  --rpc-url mantle_sepolia \
  --verify \
  --broadcast \
  -vvvv

export MOCK_USDC_ADDRESS=0xYOUR_MOCK_USDC_ADDRESS
export WITNESS_ADDRESS=0xYOUR_WITNESS_ADDRESS

cast send $MOCK_USDC_ADDRESS \
  "mintWhole(address,uint256)" YOUR_ADDRESS 1000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL

forge script script/Deploy.s.sol:Deploy \
  --rpc-url mantle_sepolia \
  --verify \
  --broadcast \
  -vvvv
```
