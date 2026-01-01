// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/mockUSDC/MockUSDC.sol";

/**
 * @title DeployMockUSDC
 * @notice Deploy Mock USDC for testing
 */
contract DeployMockUSDC is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== Deploying Mock USDC ===\n");
        console.log("Deployer:", deployer);
        console.log("\n");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();

        vm.stopBroadcast();

        console.log("\n=== Mock USDC Deployed! ===\n");
        console.log("Mock USDC Address:", address(usdc));
        console.log(
            "\nDeployer Balance:",
            usdc.balanceOf(deployer) / 10 ** 6,
            "USDC"
        );
        console.log("\n");
        console.log("Add to .env:");
        console.log("MOCK_USDC_ADDRESS=", address(usdc));
        console.log("\n");
        console.log("Verify on Etherscan:");
        console.log("https://sepolia.etherscan.io/address/", address(usdc));
        console.log("\n");

        // Show useful commands
        console.log("=== Useful Commands ===\n");
        console.log("# Mint to yourself:");
        console.log(
            "cast send",
            address(usdc),
            '"mintWhole(address,uint256)" YOUR_ADDRESS 1000 --private-key $PRIVATE_KEY --rpc-url $SEPOLIA_RPC_URL'
        );
        console.log("\n# Check balance:");
        console.log(
            "cast call",
            address(usdc),
            '"balanceOf(address)(uint256)" YOUR_ADDRESS --rpc-url $SEPOLIA_RPC_URL'
        );
        console.log("\n# Approve for vault:");
        console.log(
            "cast send",
            address(usdc),
            '"approve(address,uint256)" $VAULT_ADDRESS 1000000000 --private-key $PRIVATE_KEY --rpc-url $SEPOLIA_RPC_URL'
        );
        console.log("\n");
    }
}
