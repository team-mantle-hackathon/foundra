// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProtocolRegistry.sol";
import "../src/core/VaultFactory.sol";
import "../src/core/RiskOracle.sol";

/**
 * @title TransferToSafe
 * @notice Script to transfer admin roles from deployer to Gnosis Safe multi-sig
 * @dev IMPORTANT: Test thoroughly before renouncing roles!
 */
contract TransferToSafe is Script {
    // Contract addresses (set after deployment)
    address REGISTRY_ADDRESS = vm.envAddress("REGISTRY_ADDRESS");
    address FACTORY_ADDRESS = vm.envAddress("FACTORY_ADDRESS");
    address ORACLE_ADDRESS = vm.envAddress("ORACLE_ADDRESS");

    // Safe address
    address SAFE_ADDRESS = vm.envAddress("SAFE_ADDRESS");

    // Role identifiers
    bytes32 constant DEFAULT_ADMIN_ROLE =
        0x0000000000000000000000000000000000000000000000000000000000000000;
    bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 constant RISK_ASSESSOR_ROLE = keccak256("RISK_ASSESSOR_ROLE");

    function run() external {
        uint256 deployerPK = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPK);

        console.log("=== Transferring Admin Rights to Safe ===\n");
        console.log("Deployer:", deployer);
        console.log("Safe:", SAFE_ADDRESS);
        console.log("\n");

        // Step 1: Grant roles to Safe
        grantRolesToSafe(deployerPK);

        // Step 2: Verify Safe has roles
        verifyRoles();

        // Step 3: Ask for confirmation before revoking
        console.log("\n=== IMPORTANT ===");
        console.log("Safe now has admin roles.");
        console.log(
            "Please TEST that Safe can execute admin functions before proceeding!"
        );
        console.log("\nTo renounce deployer roles, run:");
        console.log(
            "  forge script script/RenounceDeployerRoles.s.sol --broadcast\n"
        );
    }

    function grantRolesToSafe(uint256 deployerPK) internal {
        console.log("Step 1: Granting roles to Safe...\n");

        vm.startBroadcast(deployerPK);

        // Grant roles to Registry
        console.log("Granting roles to Registry...");
        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);

        if (!registry.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)) {
            registry.grantRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS);
            console.log(unicode"  ✓ DEFAULT_ADMIN_ROLE granted");
        } else {
            console.log(unicode"  → DEFAULT_ADMIN_ROLE already granted");
        }

        if (!registry.hasRole(ADMIN_ROLE, SAFE_ADDRESS)) {
            registry.grantRole(ADMIN_ROLE, SAFE_ADDRESS);
            console.log(unicode"  ✓ ADMIN_ROLE granted");
        } else {
            console.log(unicode"  → ADMIN_ROLE already granted");
        }

        // Grant roles to Factory
        console.log("\nGranting roles to Factory...");
        VaultFactory factory = VaultFactory(FACTORY_ADDRESS);

        if (!factory.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)) {
            factory.grantRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS);
            console.log(unicode"  ✓ DEFAULT_ADMIN_ROLE granted");
        } else {
            console.log(unicode"  → DEFAULT_ADMIN_ROLE already granted");
        }

        if (!factory.hasRole(ADMIN_ROLE, SAFE_ADDRESS)) {
            factory.grantRole(ADMIN_ROLE, SAFE_ADDRESS);
            console.log(unicode"  ✓ ADMIN_ROLE granted");
        } else {
            console.log(unicode"  → ADMIN_ROLE already granted");
        }

        // Grant roles to Oracle
        console.log("\nGranting roles to Oracle...");
        RiskOracle oracle = RiskOracle(ORACLE_ADDRESS);

        if (!oracle.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)) {
            oracle.grantRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS);
            console.log(unicode"  ✓ DEFAULT_ADMIN_ROLE granted");
        } else {
            console.log(unicode"  → DEFAULT_ADMIN_ROLE already granted");
        }

        if (!oracle.hasRole(ADMIN_ROLE, SAFE_ADDRESS)) {
            oracle.grantRole(ADMIN_ROLE, SAFE_ADDRESS);
            console.log(unicode"  ✓ ADMIN_ROLE granted");
        } else {
            console.log(unicode"  → ADMIN_ROLE already granted");
        }

        vm.stopBroadcast();
    }

    function verifyRoles() internal view {
        console.log("\nStep 2: Verifying roles...\n");

        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        VaultFactory factory = VaultFactory(FACTORY_ADDRESS);
        RiskOracle oracle = RiskOracle(ORACLE_ADDRESS);

        // Check Registry
        console.log("Registry roles:");
        console.log(
            "  DEFAULT_ADMIN_ROLE:",
            registry.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)
                ? unicode"✓"
                : unicode"✗"
        );
        console.log(
            "  ADMIN_ROLE:",
            registry.hasRole(ADMIN_ROLE, SAFE_ADDRESS) ? unicode"✓" : unicode"✗"
        );

        // Check Factory
        console.log("\nFactory roles:");
        console.log(
            "  DEFAULT_ADMIN_ROLE:",
            factory.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)
                ? unicode"✓"
                : unicode"✗"
        );
        console.log(
            "  ADMIN_ROLE:",
            factory.hasRole(ADMIN_ROLE, SAFE_ADDRESS) ? unicode"✓" : unicode"✗"
        );

        // Check Oracle
        console.log("\nOracle roles:");
        console.log(
            "  DEFAULT_ADMIN_ROLE:",
            oracle.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)
                ? unicode"✓"
                : unicode"✗"
        );
        console.log(
            "  ADMIN_ROLE:",
            oracle.hasRole(ADMIN_ROLE, SAFE_ADDRESS) ? unicode"✓" : unicode"✗"
        );
    }
}
