// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/vault/RWAVault.sol";
import "../src/core/ProtocolRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract RWAVaultTest is Test {
    RWAVault public vault;
    MockUSDC public usdc;
    ProtocolRegistry public registry;

    address public admin = address(1);
    address public developer = address(2);
    address public investor1 = address(3);
    address public investor2 = address(4);
    address public treasury = address(5);

    uint256 constant TARGET_RAISE = 1_000_000 * 1e6; // 1M USDC
    uint256 constant TARGET_APY = 1200; // 12%
    uint256 constant TENOR = 365 days;
    uint256 constant MIN_INVESTMENT = 6_500_000; // 6.5 USDC = ~100,000 IDR

    function setUp() public {
        // Deploy mock USDC
        usdc = new MockUSDC();

        // Deploy vault as protocol
        vm.startPrank(admin);

        vault = new RWAVault(
            IERC20(address(usdc)),
            "RWA Vault Test",
            "rwVaultTest",
            developer,
            admin,
            TARGET_RAISE,
            TARGET_APY,
            TENOR,
            MIN_INVESTMENT,
            "A",
            "ipfs://test-project"
        );

        vm.stopPrank();

        // Mint USDC to investors
        usdc.mint(investor1, 10_000_000 * 1e6);
        usdc.mint(investor2, 10_000_000 * 1e6);
        usdc.mint(developer, 10_000_000 * 1e6);
    }

    function testInitialState() public {
        IRWAVault.PoolInfo memory info = vault.getPoolInfo();

        assertEq(info.developer, developer);
        assertEq(info.targetRaise, TARGET_RAISE);
        assertEq(info.targetAPY, TARGET_APY);
        assertEq(info.tenor, TENOR);
        assertEq(info.minInvestment, MIN_INVESTMENT);
        assertEq(info.currentRaise, 0);
        assertTrue(info.state == IRWAVault.PoolState.Pending);
    }

    function testApprovePool() public {
        vm.prank(admin);
        vault.approvePool();

        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        assertTrue(info.state == IRWAVault.PoolState.Fundraising);
        assertGt(info.startTime, 0);
    }

    function testDepositSuccess() public {
        // Approve pool first
        vm.prank(admin);
        vault.approvePool();

        // Investor deposits (above minimum of 6.5 USDC)
        uint256 depositAmount = 10 * 1e6; // 10 USDC

        vm.startPrank(investor1);
        usdc.approve(address(vault), depositAmount);
        uint256 shares = vault.deposit(depositAmount, investor1);
        vm.stopPrank();

        assertGt(shares, 0);
        assertEq(vault.balanceOf(investor1), shares);

        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        assertEq(info.currentRaise, depositAmount);
    }

    function testDepositBelowMinimum() public {
        vm.prank(admin);
        vault.approvePool();

        uint256 depositAmount = 5 * 1e6; // 5 USDC - Below minimum of 6.5 USDC

        vm.startPrank(investor1);
        usdc.approve(address(vault), depositAmount);

        vm.expectRevert("Below minimum investment");
        vault.deposit(depositAmount, investor1);
        vm.stopPrank();
    }

    function testDepositWhenNotFundraising() public {
        uint256 depositAmount = 10 * 1e6; // 10 USDC

        vm.startPrank(investor1);
        usdc.approve(address(vault), depositAmount);

        vm.expectRevert("Not in fundraising");
        vault.deposit(depositAmount, investor1);
        vm.stopPrank();
    }

    function testFullFundraisingCycle() public {
        // 1. Approve pool
        vm.prank(admin);
        vault.approvePool();

        // 2. Multiple investors deposit to reach target
        uint256 deposit1 = 600_000 * 1e6; // 600k USDC
        vm.startPrank(investor1);
        usdc.approve(address(vault), deposit1);
        vault.deposit(deposit1, investor1);
        vm.stopPrank();

        uint256 deposit2 = 400_000 * 1e6; // 400k USDC
        vm.startPrank(investor2);
        usdc.approve(address(vault), deposit2);
        vault.deposit(deposit2, investor2);
        vm.stopPrank();

        // 3. Check state transitioned to Active
        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        assertTrue(info.state == IRWAVault.PoolState.Active);
        assertEq(info.currentRaise, TARGET_RAISE);
    }

    function testDisburseFunds() public {
        // Setup: reach target
        vm.prank(admin);
        vault.approvePool();

        vm.startPrank(investor1);
        usdc.approve(address(vault), TARGET_RAISE);
        vault.deposit(TARGET_RAISE, investor1);
        vm.stopPrank();

        // Disburse funds
        uint256 developerBalanceBefore = usdc.balanceOf(developer);

        vm.prank(admin);
        vault.disburseFunds();

        uint256 developerBalanceAfter = usdc.balanceOf(developer);
        uint256 fee = (TARGET_RAISE * 100) / 10000; // 1% fee
        uint256 expectedDisbursement = TARGET_RAISE - fee;

        assertEq(
            developerBalanceAfter - developerBalanceBefore,
            expectedDisbursement
        );

        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        assertTrue(info.state == IRWAVault.PoolState.Repaying);
        assertGt(info.endTime, 0);
    }

    function testRepayment() public {
        // Setup: disburse funds
        vm.prank(admin);
        vault.approvePool();

        vm.startPrank(investor1);
        usdc.approve(address(vault), TARGET_RAISE);
        vault.deposit(TARGET_RAISE, investor1);
        vm.stopPrank();

        vm.prank(admin);
        vault.disburseFunds();

        // Developer repays
        IRWAVault.RepaymentInfo memory repaymentInfo = vault.getRepaymentInfo();
        uint256 totalOwed = repaymentInfo.totalOwed;

        vm.startPrank(developer);
        usdc.approve(address(vault), totalOwed);
        vault.repay(totalOwed);
        vm.stopPrank();

        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        assertTrue(info.state == IRWAVault.PoolState.Completed);
    }

    function testPartialRepayment() public {
        // Setup
        vm.prank(admin);
        vault.approvePool();

        vm.startPrank(investor1);
        usdc.approve(address(vault), TARGET_RAISE);
        vault.deposit(TARGET_RAISE, investor1);
        vm.stopPrank();

        vm.prank(admin);
        vault.disburseFunds();

        // Partial repayment
        uint256 partialAmount = 500_000 * 1e6;

        vm.startPrank(developer);
        usdc.approve(address(vault), partialAmount);
        vault.repay(partialAmount);
        vm.stopPrank();

        IRWAVault.RepaymentInfo memory repaymentInfo = vault.getRepaymentInfo();
        assertEq(repaymentInfo.totalRepaid, partialAmount);

        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        assertTrue(info.state == IRWAVault.PoolState.Repaying);
    }

    function testWithdrawAfterCompletion() public {
        // Complete full cycle
        vm.prank(admin);
        vault.approvePool();

        uint256 depositAmount = TARGET_RAISE;
        vm.startPrank(investor1);
        usdc.approve(address(vault), depositAmount);
        uint256 shares = vault.deposit(depositAmount, investor1);
        vm.stopPrank();

        vm.prank(admin);
        vault.disburseFunds();

        // Repay with yield
        IRWAVault.RepaymentInfo memory repaymentInfo = vault.getRepaymentInfo();
        vm.startPrank(developer);
        usdc.approve(address(vault), repaymentInfo.totalOwed);
        vault.repay(repaymentInfo.totalOwed);
        vm.stopPrank();

        // Withdraw
        uint256 balanceBefore = usdc.balanceOf(investor1);

        vm.prank(investor1);
        vault.redeem(shares, investor1, investor1);

        uint256 balanceAfter = usdc.balanceOf(investor1);
        assertGt(balanceAfter, balanceBefore);
    }

    function testCannotWithdrawBeforeMaturity() public {
        vm.prank(admin);
        vault.approvePool();

        vm.startPrank(investor1);
        usdc.approve(address(vault), TARGET_RAISE);
        uint256 shares = vault.deposit(TARGET_RAISE, investor1);
        vm.stopPrank();

        vm.prank(investor1);
        vm.expectRevert("Vault not matured");
        vault.redeem(shares, investor1, investor1);
    }

    function testCancelPool() public {
        vm.prank(admin);
        vault.approvePool();

        vm.startPrank(investor1);
        usdc.approve(address(vault), 100 * 1e6); // 100 USDC
        vault.deposit(100 * 1e6, investor1);
        vm.stopPrank();

        vm.prank(admin);
        vault.cancelPool();

        IRWAVault.PoolInfo memory info = vault.getPoolInfo();
        assertTrue(info.state == IRWAVault.PoolState.Cancelled);
    }

    function testPauseUnpause() public {
        vm.prank(admin);
        vault.pause();

        vm.prank(admin);
        vault.approvePool();

        vm.startPrank(investor1);
        usdc.approve(address(vault), 100 * 1e6); // 100 USDC
        vm.expectRevert("Pausable: paused");
        vault.deposit(100 * 1e6, investor1);
        vm.stopPrank();

        vm.prank(admin);
        vault.unpause();

        vm.startPrank(investor1);
        vault.deposit(100 * 1e6, investor1);
        vm.stopPrank();
    }
}
