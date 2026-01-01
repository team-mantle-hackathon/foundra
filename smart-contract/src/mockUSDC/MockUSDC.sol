// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Mock USDC token for testing RWA Lending Protocol
 * @dev 6 decimals (like real USDC), anyone can mint for testing
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant DECIMALS = 6;

    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint 100M USDC to deployer for initial testing
        _mint(msg.sender, 100_000_000 * 10**DECIMALS);
    }

    /**
     * @notice Override decimals to match real USDC (6 decimals)
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Mint tokens - anyone can mint for testing!
     * @param to Address to mint to
     * @param amount Amount to mint (in base units, 6 decimals)
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @notice Convenient mint with whole numbers (automatically converts to 6 decimals)
     * @param to Address to mint to
     * @param amountInWholeTokens Amount in whole USDC (e.g., 100 = 100 USDC)
     */
    function mintWhole(address to, uint256 amountInWholeTokens) external {
        _mint(to, amountInWholeTokens * 10**DECIMALS);
    }

    /**
     * @notice Burn tokens
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @notice Owner can mint (for admin control if needed)
     */
    function ownerMint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
