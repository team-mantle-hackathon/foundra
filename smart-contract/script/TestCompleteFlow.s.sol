// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProtocolRegistry.sol";
import "../src/core/VaultFactory.sol";
import "../src/core/RiskOracle.sol";
import "../src/vault/RWAVault.sol";
import "../src/interfaces/IProtocolRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TestCompleteFlow
 * @notice Script to test complete lending cycle after deployment
 */
contract TestCompleteFlow is Script {
    // Deployed contract addresses (loaded from .env)
    address REGISTRY_ADDRESS = vm.envAddress("REGISTRY_ADDRESS");
    address FACTORY_ADDRESS = vm.envAddress("FACTORY_ADDRESS");
    address ORACLE_ADDRESS = vm.envAddress("ORACLE_ADDRESS");
    address USDC_ADDRESS = vm.envAddress("MOCK_USDC_ADDRESS");

    // Test accounts
    address admin;
    address developer;
    address investor1;
    address investor2;

    function run() external {
        // For testing, use single private key for all roles
        // In production, these would be different accounts
        uint256 pk = vm.envUint("PRIVATE_KEY");

        admin = vm.addr(pk);
        developer = vm.addr(pk);
        investor1 = vm.addr(pk);
        investor2 = vm.addr(pk);

        console.log("=== Testing Complete Lending Flow ===\n");
        console.log("Test Account (all roles):", admin);
        console.log("Registry:", REGISTRY_ADDRESS);
        console.log("Factory:", FACTORY_ADDRESS);
        console.log("Oracle:", ORACLE_ADDRESS);
        console.log("Mock USDC:", USDC_ADDRESS);
        console.log("\n");

        // Step 1: Developer Registration
        testDeveloperRegistration(pk);

        // Step 2: Admin Approves Developer
        testAdminApproveDeveloper(pk);

        // Step 3: Developer Proposes Project
        uint256 projectId = testProjectProposal(pk);

        // Step 4: Admin/Oracle Sets Risk Assessment
        testRiskAssessment(pk, projectId);

        // Step 5: Admin Approves Project
        testProjectApproval(pk, projectId);

        // Step 6: Developer Creates Vault
        address vaultAddress = testVaultCreation(pk, projectId);

        // Step 7: Admin Approves Pool
        testPoolApproval(pk, vaultAddress);

        // Step 8: Investors Deposit
        testInvestorDeposits(pk, vaultAddress);

        // Step 9: Admin Disburses Funds
        testFundsDisbursement(pk, vaultAddress);

        // Step 10: Developer Repays
        testDeveloperRepayment(pk, vaultAddress);

        // Step 11: Investor Withdraws
        testInvestorWithdrawal(pk, vaultAddress);

        console.log("\n=== Test Complete! All steps passed ===");
    }

    function testDeveloperRegistration(uint256 developerPK) internal {
        console.log("Step 1: Developer Registration");

        vm.startBroadcast(developerPK);

        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        registry.registerDeveloper(
            "PT. Properti Sejahtera",
            "1234567890",
            "ipfs://QmBusinessLicense123"
        );

        vm.stopBroadcast();
        console.log("  SUCCESS: Developer registered:", developer);
    }

    function testAdminApproveDeveloper(uint256 adminPK) internal {
        console.log("\nStep 2: Admin Approves Developer");

        vm.startBroadcast(adminPK);

        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        registry.approveDeveloper(developer);

        vm.stopBroadcast();
        console.log("  SUCCESS: Developer approved");
    }

    function testProjectProposal(
        uint256 developerPK
    ) internal returns (uint256) {
        console.log("\nStep 3: Developer Proposes Project");

        vm.startBroadcast(developerPK);

        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);

        IProtocolRegistry.ProjectInput memory input = IProtocolRegistry
            .ProjectInput({
                projectName: "Green Valley Residence",
                location: "Jakarta Selatan",
                estimatedBudget: 200_000_000,
                requestedAmount: 100_000_000,
                estimatedDuration: 365 days,
                documents: "ipfs://QmProjectDocs123",
                status: IProtocolRegistry.ProjectStatus.Pending,
                aiRiskGrade: "A",
                aiRiskScore: 80,
                targetAPY: 1250
            });

        uint256 projectId = registry.proposeProject(input);

        vm.stopBroadcast();
        console.log("  SUCCESS: Project proposed, ID:", projectId);
        return projectId;
    }

    function testRiskAssessment(uint256 adminPK, uint256 projectId) internal {
        console.log("\nStep 4: Setting Risk Assessment");

        vm.startBroadcast(adminPK);

        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        registry.updateAIRiskAssessment(
            projectId,
            "A-", // Risk grade
            87 // Risk score
        );

        vm.stopBroadcast();
        console.log("  SUCCESS: Risk assessment set: A- (87)");
    }

    function testProjectApproval(uint256 adminPK, uint256 projectId) internal {
        console.log("\nStep 5: Admin Approves Project");

        vm.startBroadcast(adminPK);

        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        registry.approveProject(projectId);

        vm.stopBroadcast();
        console.log("  SUCCESS: Project approved");
    }

    function testVaultCreation(
        uint256 developerPK,
        uint256 projectId
    ) internal returns (address) {
        console.log("\nStep 6: Developer Creates Vault");

        vm.startBroadcast(developerPK);

        VaultFactory factory = VaultFactory(FACTORY_ADDRESS);
        address vaultAddress = factory.createVault(
            projectId,
            1200, // 12% APY
            365 days, // 1 year tenor
            msg.sender
        );

        vm.stopBroadcast();
        console.log("  SUCCESS: Vault created:", vaultAddress);
        return vaultAddress;
    }

    function testPoolApproval(uint256 adminPK, address vaultAddress) internal {
        console.log("\nStep 7: Admin Approves Pool");

        vm.startBroadcast(adminPK);

        // Call via Registry (which has ADMIN_ROLE on vault)
        ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
        registry.approveVaultPool(vaultAddress);

        vm.stopBroadcast();
        console.log("  SUCCESS: Pool approved and fundraising started");
    }

    function testInvestorDeposits(
        uint256 investorPK,
        address vaultAddress
    ) internal {
        console.log("\nStep 8: Investor Deposits");

        vm.startBroadcast(investorPK);

        IERC20 usdc = IERC20(USDC_ADDRESS);
        RWAVault vault = RWAVault(vaultAddress);

        uint256 depositAmount = 100_000_000; // 100 USDC

        // Approve USDC
        usdc.approve(vaultAddress, depositAmount);

        // Deposit
        vault.deposit(depositAmount, investor1);

        vm.stopBroadcast();
        console.log("  SUCCESS: Investor deposited 100 USDC");
        console.log("  SUCCESS: Shares received:", vault.balanceOf(investor1));
    }

    function testFundsDisbursement(
        uint256 adminPK,
        address vaultAddress
    ) internal {
        console.log("\nStep 9: Admin Disburses Funds");

        vm.startBroadcast(adminPK);

        RWAVault vault = RWAVault(vaultAddress);

        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        console.log("  Current raise:", info.currentRaise);
        console.log("  Target raise:", info.targetRaise);

        if (info.currentRaise >= info.targetRaise) {
            // Call via Registry (which has ADMIN_ROLE on vault)
            ProtocolRegistry registry = ProtocolRegistry(REGISTRY_ADDRESS);
            registry.disburseVaultFunds(vaultAddress);
            console.log("  SUCCESS: Funds disbursed to developer");
        } else {
            console.log("  WARNING: Target not reached, cannot disburse yet");
        }

        vm.stopBroadcast();
    }

    function testDeveloperRepayment(
        uint256 developerPK,
        address vaultAddress
    ) internal {
        console.log("\nStep 10: Developer Repays");

        vm.startBroadcast(developerPK);

        IERC20 usdc = IERC20(USDC_ADDRESS);
        RWAVault vault = RWAVault(vaultAddress);

        IRWAVault.RepaymentInfo memory repaymentInfo = vault.getRepaymentInfo();
        uint256 totalOwed = repaymentInfo.totalOwed;

        console.log("  Total owed:", totalOwed);

        // Approve and repay
        usdc.approve(vaultAddress, totalOwed);
        vault.repay(totalOwed);

        vm.stopBroadcast();
        console.log("  SUCCESS: Developer repaid full amount");
    }

    function testInvestorWithdrawal(
        uint256 investorPK,
        address vaultAddress
    ) internal {
        console.log("\nStep 11: Investor Withdraws");

        vm.startBroadcast(investorPK);

        RWAVault vault = RWAVault(vaultAddress);
        IERC20 usdc = IERC20(USDC_ADDRESS);

        uint256 shares = vault.balanceOf(investor1);
        uint256 balanceBefore = usdc.balanceOf(investor1);

        // Redeem all shares
        vault.redeem(shares, investor1, investor1);

        uint256 balanceAfter = usdc.balanceOf(investor1);
        uint256 received = balanceAfter - balanceBefore;

        vm.stopBroadcast();

        console.log("  SUCCESS: Investor withdrew:", received);
        console.log(
            "  SUCCESS: Profit:",
            received > 100_000_000 ? received - 100_000_000 : 0
        );
    }
}
