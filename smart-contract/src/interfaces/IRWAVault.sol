// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC4626.sol";

/**
 * @title IRWAVault
 * @notice Interface for RWA lending vault with ERC-4626 compliance
 * @dev Extends IERC4626 with RWA-specific functionality
 */
interface IRWAVault is IERC4626 {
    // Enums
    enum PoolState {
        Pending, // Waiting admin approval
        Fundraising, // Open for investments
        Active, // Funds disbursed to developer
        Repaying, // Developer making repayments
        Completed, // Fully repaid
        Defaulted, // Payment overdue
        Cancelled // Refunded to investors
    }

    // Structs
    struct PoolInfo {
        address developer;
        uint256 targetRaise;
        uint256 currentRaise;
        uint256 targetAPY; // In basis points (e.g., 1200 = 12%)
        uint256 tenor; // Duration in seconds
        uint256 startTime;
        uint256 endTime;
        uint256 minInvestment;
        string riskGrade; // AI risk grade (A, A-, B, B-, etc.)
        PoolState state;
        string projectDetails; // IPFS hash or JSON
    }

    struct RepaymentInfo {
        uint256 totalRepaid;
        uint256 totalOwed;
        uint256 lastRepaymentTime;
        uint256 nextDueDate;
    }

    // Events
    event PoolCreated(
        address indexed developer,
        uint256 targetRaise,
        uint256 targetAPY,
        uint256 tenor,
        string riskGrade
    );

    event PoolStateChanged(PoolState oldState, PoolState newState);

    event FundsDeposited(
        address indexed investor,
        uint256 assets,
        uint256 shares
    );

    event FundsDisbursed(address indexed developer, uint256 amount);

    event RepaymentMade(
        address indexed developer,
        uint256 amount,
        uint256 timestamp
    );

    event YieldDistributed(uint256 amount, uint256 timestamp);

    event DefaultDeclared(uint256 timestamp, uint256 amountOwed);

    // View functions
    function getPoolInfo() external view returns (PoolInfo memory);

    function getRepaymentInfo() external view returns (RepaymentInfo memory);

    function calculateYield(address investor) external view returns (uint256);

    function timeUntilMaturity() external view returns (uint256);

    function isMatured() external view returns (bool);

    // State transition functions
    function disburseFunds() external;

    function extendFundraising(uint256 additionalTime) external;

    function cancelPool() external;

    function declareDefault() external;

    // Repayment functions
    function repay(uint256 amount) external;

    function finalizeRepayment() external;

    // Admin functions
    function pause() external;

    function unpause() external;

    function updateRiskGrade(string calldata newGrade) external;
}
