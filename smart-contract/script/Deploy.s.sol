// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProtocolRegistry.sol";
import "../src/core/VaultFactory.sol";
import "../src/core/RiskOracle.sol";

contract Deploy is Script {
    // Default configuration
    uint256 constant MIN_INVESTMENT = 6_500_000; // 6.5 USDC = ~100,000 IDR
    uint256 constant PROTOCOL_FEE = 100; // 1% in basis points
    uint256 constant MIN_CONFIDENCE = 70; // 70% minimum confidence

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Get addresses from env
        address stablecoin = vm.envAddress("MOCK_USDC_ADDRESS");
        address treasury = vm.envOr("TREASURY_ADDRESS", deployer);
        address witness = vm.envAddress("WITNESS_ADDRESS");
        address oracleService = vm.envOr("ORACLE_SERVICE_ADDRESS", deployer);

        console.log("=== Deploying RWA Lending Protocol (FIXED) ===\n");
        console.log("Deployer:", deployer);
        console.log("Stablecoin:", stablecoin);
        console.log("Treasury:", treasury);
        console.log("Witness:", witness);
        console.log("\n");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy ProtocolRegistry
        console.log("Deploying ProtocolRegistry...");
        ProtocolRegistry registry = new ProtocolRegistry(
            MIN_INVESTMENT,
            PROTOCOL_FEE,
            treasury,
            witness
        );
        console.log("ProtocolRegistry deployed at:", address(registry));

        // 2. Deploy RiskOracle
        console.log("Deploying RiskOracle...");
        RiskOracle oracle = new RiskOracle(oracleService, MIN_CONFIDENCE);
        console.log("RiskOracle deployed at:", address(oracle));

        // 3. Deploy VaultFactory
        console.log("Deploying VaultFactory...");
        VaultFactory factory = new VaultFactory(address(registry), stablecoin);
        console.log("VaultFactory deployed at:", address(factory));

        // 4. Configure Registry
        console.log("Configuring protocol...");
        registry.setVaultFactory(address(factory));
        registry.setRiskOracle(address(oracle));

        // 5. Grant roles to deployer (for testing)
        console.log("Granting roles...");
        bytes32 RISK_ASSESSOR_ROLE = keccak256("RISK_ASSESSOR_ROLE");
        registry.grantRole(RISK_ASSESSOR_ROLE, deployer);

        vm.stopBroadcast();

        // Print summary
        console.log("\n=== Deployment Complete (FIXED) ===");
        console.log("ProtocolRegistry:", address(registry));
        console.log("RiskOracle:", address(oracle));
        console.log("VaultFactory:", address(factory));
        console.log("Stablecoin:", stablecoin);
        console.log("Treasury:", treasury);
        console.log("Min Investment:", MIN_INVESTMENT);
        console.log("Protocol Fee:", PROTOCOL_FEE, "bps");
        console.log("\nRISK_ASSESSOR_ROLE granted to:", deployer);
        console.log("\n=== IMPORTANT ===");
        console.log("Update .env with these addresses:");
        console.log("REGISTRY_ADDRESS=", address(registry));
        console.log("FACTORY_ADDRESS=", address(factory));
        console.log("ORACLE_ADDRESS=", address(oracle));
    }
}
