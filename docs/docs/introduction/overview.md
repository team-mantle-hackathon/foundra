---
title: Overview
sidebar_position: 1
---

# Overview

Foundra is a real estate construction financing protocol that lets developers raise capital on-chain while giving investors transparent access to project-based lending.

## 1-Minute Protocol Flow

**Problem**: Construction projects depend on traditional banks, which can be slow and opaque.

**Solution**: Foundra creates a vault per project, governed by a registry and risk oracle.

**How it works**:

1. Developer registers and submits a project
2. Risk oracle provides a project grade
3. Admin approval opens fundraising
4. Investors deposit USDC and receive shares
5. Developer draws funds and repays over time
6. Investors withdraw after completion

## Core Roles

- **Developer**: submits projects and manages repayments
- **Investor**: deposits into project vaults and earns yield
- **Admin/Oracle**: approves projects and assigns risk grades

## Pool States

| State       | Description                     |
| ----------- | ------------------------------- |
| Pending     | Awaiting admin approval         |
| Fundraising | Open for investments            |
| Active      | Target reached, funds disbursed |
| Repaying    | Developer making repayments     |
| Completed   | Fully repaid                    |
| Defaulted   | Payment overdue                 |
| Cancelled   | Refunded to investors           |

## Key Pool Parameters

| Parameter        | Description            |
| ---------------- | ---------------------- |
| Target Raise     | Funding goal amount    |
| Target APY       | Expected annual yield  |
| Tenor            | Investment duration    |
| Min Investment   | Minimum deposit amount |
| AI Risk Grade    | A, B, C, or D rating   |
| Project Details  | Developer info         |

## Technology Stack

- Smart contracts: Solidity ^0.8.20, Foundry, OpenZeppelin 4.x
- Frontend: React 19, Vite 7.x, TailwindCSS 4.x, TypeScript 5.9
- Web3: wagmi 2.x, viem 2.x, RainbowKit 2.x
- Backend: Supabase Edge Functions
- KYC: Reclaim Protocol ZK proofs
