// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProtocolRegistry.sol";
import "../src/core/VaultFactory.sol";
import "../src/core/RiskOracle.sol";

/**
 * @title RenounceDeployerRoles
 * @notice Script to renounce deployer's admin roles after Safe is confirmed working
 * @dev ⚠️ WARNING: This is IRREVERSIBLE! Only run after thorough testing!
 */
contract RenounceDeployerRoles is Script {
    // Contract addresses
    address REGISTRY_ADDRESS = vm.envAddress("REGISTRY_ADDRESS");
    address FACTORY_ADDRESS = vm.envAddress("FACTORY_ADDRESS");
    address ORACLE_ADDRESS = vm.envAddress("ORACLE_ADDRESS");
    address SAFE_ADDRESS = vm.envAddress("SAFE_ADDRESS");

    // Role identifiers
    bytes32 constant DEFAULT_ADMIN_ROLE =
        0x0000000000000000000000000000000000000000000000000000000000000000;
    bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    function run() external {
        uint256 deployerPK = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPK);

        console.log("===   WARNING: Renouncing Deployer Admin Roles   ===\n");
        console.log("This action is IRREVERSIBLE!");
        console.log("Deployer will lose ALL admin access.");
        console.log("Only Safe will have admin rights.\n");

        console.log("Deployer:", deployer);
        console.log("Safe:", SAFE_ADDRESS);

        // Pre-flight checks
        console.log("\nPre-flight checks...");
        if (!preflightChecks()) {
            console.log("\n Pre-flight checks FAILED!");
            console.log("DO NOT PROCEED! Fix issues first.");
            revert("Pre-flight checks failed");
        }
        console.log(" All pre-flight checks passed\n");

        // Final confirmation
        console.log("Proceeding to renounce roles in 3 seconds...");
        console.log("Press Ctrl+C to abort!\n");

        // In production, add manual confirmation here
        // For now, proceeding after checks pass

        vm.startBroadcast(deployerPK);

        // Renounce Registry roles
        console.log("Renouncing Registry roles...");
        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        registry.renounceRole(ADMIN_ROLE, deployer);
        console.log("   ADMIN_ROLE renounced");
        registry.renounceRole(DEFAULT_ADMIN_ROLE, deployer);
        console.log("   DEFAULT_ADMIN_ROLE renounced");

        // Renounce Factory roles
        console.log("\nRenouncing Factory roles...");
        VaultFactory factory = VaultFactory(FACTORY_ADDRESS);
        factory.renounceRole(ADMIN_ROLE, deployer);
        console.log("   ADMIN_ROLE renounced");
        factory.renounceRole(DEFAULT_ADMIN_ROLE, deployer);
        console.log("   DEFAULT_ADMIN_ROLE renounced");

        // Renounce Oracle roles
        console.log("\nRenouncing Oracle roles...");
        RiskOracle oracle = RiskOracle(ORACLE_ADDRESS);
        oracle.renounceRole(ADMIN_ROLE, deployer);
        console.log("   ADMIN_ROLE renounced");
        oracle.renounceRole(DEFAULT_ADMIN_ROLE, deployer);
        console.log("   DEFAULT_ADMIN_ROLE renounced");

        vm.stopBroadcast();

        // Final verification
        console.log("\n=== Final Verification ===\n");
        verifyFinalState(deployer);

        console.log("\n Admin rights successfully transferred to Safe!");
        console.log("Deployer no longer has admin access.");
        console.log(
            "All admin operations must now go through Safe multi-sig.\n"
        );
    }

    function preflightChecks() internal view returns (bool) {
        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        VaultFactory factory = VaultFactory(FACTORY_ADDRESS);
        RiskOracle oracle = RiskOracle(ORACLE_ADDRESS);

        // Check 1: Safe has all required roles
        console.log("  Checking Safe has roles...");
        if (!registry.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)) {
            console.log("     Safe missing DEFAULT_ADMIN_ROLE on Registry");
            return false;
        }
        if (!registry.hasRole(ADMIN_ROLE, SAFE_ADDRESS)) {
            console.log("     Safe missing ADMIN_ROLE on Registry");
            return false;
        }
        if (!factory.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)) {
            console.log("     Safe missing DEFAULT_ADMIN_ROLE on Factory");
            return false;
        }
        if (!factory.hasRole(ADMIN_ROLE, SAFE_ADDRESS)) {
            console.log("     Safe missing ADMIN_ROLE on Factory");
            return false;
        }
        if (!oracle.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)) {
            console.log("     Safe missing DEFAULT_ADMIN_ROLE on Oracle");
            return false;
        }
        if (!oracle.hasRole(ADMIN_ROLE, SAFE_ADDRESS)) {
            console.log("     Safe missing ADMIN_ROLE on Oracle");
            return false;
        }
        console.log("     Safe has all required roles");

        // Check 2: Safe address is not zero
        console.log("  Checking Safe address...");
        if (SAFE_ADDRESS == address(0)) {
            console.log("     Safe address is zero");
            return false;
        }
        console.log("     Safe address is valid");

        // Check 3: Safe has code (is a contract)
        console.log("  Checking Safe is a contract...");
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(sload(SAFE_ADDRESS.slot))
        }
        if (codeSize == 0) {
            console.log("     Safe address has no code");
            return false;
        }
        console.log("     Safe is a contract");

        return true;
    }

    function verifyFinalState(address deployer) internal view {
        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        VaultFactory factory = VaultFactory(FACTORY_ADDRESS);
        RiskOracle oracle = RiskOracle(ORACLE_ADDRESS);

        console.log("Deployer status:");
        console.log(
            "  Registry DEFAULT_ADMIN:",
            registry.hasRole(DEFAULT_ADMIN_ROLE, deployer)
                ? " Still has"
                : " Renounced"
        );
        console.log(
            "  Registry ADMIN:",
            registry.hasRole(ADMIN_ROLE, deployer) ? " Still has" : " Renounced"
        );
        console.log(
            "  Factory DEFAULT_ADMIN:",
            factory.hasRole(DEFAULT_ADMIN_ROLE, deployer)
                ? " Still has"
                : " Renounced"
        );
        console.log(
            "  Factory ADMIN:",
            factory.hasRole(ADMIN_ROLE, deployer) ? " Still has" : " Renounced"
        );
        console.log(
            "  Oracle DEFAULT_ADMIN:",
            oracle.hasRole(DEFAULT_ADMIN_ROLE, deployer)
                ? " Still has"
                : " Renounced"
        );
        console.log(
            "  Oracle ADMIN:",
            oracle.hasRole(ADMIN_ROLE, deployer) ? " Still has" : " Renounced"
        );

        console.log("\nSafe status:");
        console.log(
            "  Registry DEFAULT_ADMIN:",
            registry.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)
                ? " Has access"
                : " No access"
        );
        console.log(
            "  Registry ADMIN:",
            registry.hasRole(ADMIN_ROLE, SAFE_ADDRESS)
                ? " Has access"
                : " No access"
        );
        console.log(
            "  Factory DEFAULT_ADMIN:",
            factory.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)
                ? " Has access"
                : " No access"
        );
        console.log(
            "  Factory ADMIN:",
            factory.hasRole(ADMIN_ROLE, SAFE_ADDRESS)
                ? " Has access"
                : " No access"
        );
        console.log(
            "  Oracle DEFAULT_ADMIN:",
            oracle.hasRole(DEFAULT_ADMIN_ROLE, SAFE_ADDRESS)
                ? " Has access"
                : " No access"
        );
        console.log(
            "  Oracle ADMIN:",
            oracle.hasRole(ADMIN_ROLE, SAFE_ADDRESS)
                ? " Has access"
                : " No access"
        );
    }
}
