// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IRWAVault.sol";
import "../interfaces/IProtocolRegistry.sol";

/**
 * @title RWAVault
 * @notice ERC-4626 compliant vault for RWA lending pools
 * @dev Each vault represents one real estate development project
 */
contract RWAVault is
    ERC4626,
    AccessControl,
    Pausable,
    ReentrancyGuard,
    IRWAVault
{
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");
    bytes32 public constant PROTOCOL_ROLE = keccak256("PROTOCOL_ROLE");

    // State variables
    PoolInfo private _poolInfo;
    RepaymentInfo private _repaymentInfo;

    address public immutable protocol;
    address public immutable developer;
    uint256 public immutable createdAt;
    uint256 public endTime;

    uint256 public totalYieldGenerated;
    uint256 public protocolFee; // In basis points (e.g., 100 = 1%)

    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public lastDepositTime;

    // Constants
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant SECONDS_PER_YEAR = 365 days;

    /**
     * @dev Constructor
     * @param _asset The underlying asset (USDC)
     * @param _name Name of the vault shares token
     * @param _symbol Symbol of the vault shares token
     * @param _developer Address of the developer
     * @param _targetRaise Target raise amount
     * @param _targetAPY Target APY in basis points
     * @param _tenor Duration in seconds
     * @param _minInvestment Minimum investment amount
     * @param _riskGrade AI risk grade
     * @param _projectDetails IPFS hash or JSON string
     */
    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        address _developer,
        address _protocol,
        uint256 _targetRaise,
        uint256 _targetAPY,
        uint256 _tenor,
        uint256 _minInvestment,
        string memory _riskGrade,
        string memory _projectDetails
    ) ERC20(_name, _symbol) ERC4626(_asset) {
        require(_developer != address(0), "Invalid developer");
        require(_protocol != address(0), "Invalid protocol");
        require(_targetRaise > 0, "Invalid target raise");
        require(_targetAPY > 0 && _targetAPY <= 5000, "Invalid APY"); // Max 50%
        require(_tenor >= 30 days && _tenor <= 730 days, "Invalid tenor"); // 1 month to 2 years
        require(_minInvestment > 0, "Invalid min investment");

        protocol = _protocol;
        developer = _developer;
        createdAt = block.timestamp;
        protocolFee = 100; // 1% default

        _poolInfo = PoolInfo({
            developer: _developer,
            targetRaise: _targetRaise,
            currentRaise: 0,
            targetAPY: _targetAPY,
            tenor: _tenor,
            startTime: createdAt,
            endTime: 0,
            minInvestment: _minInvestment,
            riskGrade: _riskGrade,
            state: PoolState.Fundraising,
            projectDetails: _projectDetails
        });

        _repaymentInfo = RepaymentInfo({
            totalRepaid: 0,
            totalOwed: 0,
            lastRepaymentTime: 0,
            nextDueDate: 0
        });

        _grantRole(DEFAULT_ADMIN_ROLE, protocol);
        _grantRole(ADMIN_ROLE, protocol);
        _grantRole(DEVELOPER_ROLE, _developer);
        _grantRole(PROTOCOL_ROLE, protocol);

        emit PoolCreated(
            _developer,
            _targetRaise,
            _targetAPY,
            _tenor,
            _riskGrade
        );
    }

    modifier onlyVerified(address _investor) {
        require(
            IProtocolRegistry(protocol).checkUserVerified(_investor),
            "Not Verified"
        );
        _;
    }

    // ============================================
    // ERC-4626 Overrides
    // ============================================

    /**
     * @dev Override deposit to add pool state checks and minimum investment
     */
    function deposit(
        uint256 assets,
        address receiver
    )
        public
        virtual
        override(ERC4626, IERC4626)
        whenNotPaused
        nonReentrant
        onlyVerified(msg.sender)
        returns (uint256)
    {
        require(_poolInfo.state == PoolState.Fundraising, "Not in fundraising");
        require(assets >= _poolInfo.minInvestment, "Below minimum investment");

        uint256 shares = super.deposit(assets, receiver);

        userDeposits[receiver] += assets;
        lastDepositTime[receiver] = block.timestamp;
        _poolInfo.currentRaise += assets;

        emit FundsDeposited(receiver, assets, shares);

        // Check if target reached
        if (_poolInfo.currentRaise >= _poolInfo.targetRaise) {
            _transitionState(PoolState.Active);
        }

        return shares;
    }

    /**
     * @dev Override withdraw to check maturity
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    )
        public
        virtual
        override(ERC4626, IERC4626)
        nonReentrant
        onlyVerified(msg.sender)
        returns (uint256)
    {
        require(
            _poolInfo.state == PoolState.Completed ||
                _poolInfo.state == PoolState.Cancelled,
            "Vault not matured"
        );

        return super.withdraw(assets, receiver, owner);
    }

    /**
     * @dev Override redeem with same checks
     */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    )
        public
        virtual
        override(ERC4626, IERC4626)
        nonReentrant
        onlyVerified(msg.sender)
        returns (uint256)
    {
        require(
            _poolInfo.state == PoolState.Completed ||
                _poolInfo.state == PoolState.Cancelled,
            "Vault not matured"
        );

        return super.redeem(shares, receiver, owner);
    }

    /**
     * @dev Calculate total assets including accrued yield
     */
    function totalAssets()
        public
        view
        virtual
        override(ERC4626, IERC4626)
        returns (uint256)
    {
        uint256 baseAssets = IERC20(asset()).balanceOf(address(this));

        if (
            _poolInfo.state == PoolState.Active ||
            _poolInfo.state == PoolState.Repaying
        ) {
            return baseAssets + _calculateAccruedYield();
        }

        return baseAssets;
    }

    // ============================================
    // IRWAVault Implementation
    // ============================================

    function getPoolInfo() external view returns (PoolInfo memory) {
        return _poolInfo;
    }

    function getRepaymentInfo() external view returns (RepaymentInfo memory) {
        return _repaymentInfo;
    }

    function calculateYield(address investor) external view returns (uint256) {
        if (totalSupply() == 0) return 0;

        uint256 investorShares = balanceOf(investor);
        uint256 totalYield = _calculateAccruedYield();

        return (totalYield * investorShares) / totalSupply();
    }

    function timeUntilMaturity() external view returns (uint256) {
        if (_poolInfo.endTime == 0) return 0;
        if (block.timestamp >= _poolInfo.endTime) return 0;
        return _poolInfo.endTime - block.timestamp;
    }

    function isMatured() external view returns (bool) {
        return _poolInfo.endTime > 0 && block.timestamp >= _poolInfo.endTime;
    }

    // ============================================
    // State Transitions
    // ============================================

    function disburseFunds() external onlyRole(ADMIN_ROLE) {
        require(_poolInfo.state == PoolState.Active, "Invalid state");
        require(
            _poolInfo.currentRaise >= _poolInfo.targetRaise,
            "Target not reached"
        );

        uint256 amount = _poolInfo.currentRaise;
        uint256 fee = (amount * protocolFee) / BASIS_POINTS;
        uint256 disbursement = amount - fee;

        _poolInfo.endTime = block.timestamp + _poolInfo.tenor;
        _repaymentInfo.totalOwed = amount + _calculateExpectedYield(amount);
        _repaymentInfo.nextDueDate = _poolInfo.endTime;

        IERC20(asset()).safeTransfer(developer, disbursement);
        IERC20(asset()).safeTransfer(protocol, fee);

        _transitionState(PoolState.Repaying);
        emit FundsDisbursed(developer, disbursement);
    }

    function extendFundraising(
        uint256 additionalTime
    ) external onlyRole(ADMIN_ROLE) {
        require(_poolInfo.state == PoolState.Fundraising, "Not fundraising");
        _poolInfo.tenor += additionalTime;
    }

    function cancelPool() external onlyRole(ADMIN_ROLE) {
        require(
            _poolInfo.state == PoolState.Fundraising ||
                _poolInfo.state == PoolState.Pending,
            "Cannot cancel"
        );
        _transitionState(PoolState.Cancelled);
    }

    function declareDefault() external onlyRole(ADMIN_ROLE) {
        require(_poolInfo.state == PoolState.Repaying, "Not repaying");
        require(block.timestamp > _repaymentInfo.nextDueDate, "Not overdue");
        _transitionState(PoolState.Defaulted);
        emit DefaultDeclared(
            block.timestamp,
            _repaymentInfo.totalOwed - _repaymentInfo.totalRepaid
        );
    }

    // ============================================
    // Repayment Functions
    // ============================================

    function repay(
        uint256 amount
    ) external onlyRole(DEVELOPER_ROLE) nonReentrant {
        require(_poolInfo.state == PoolState.Repaying, "Not in repayment");
        require(amount > 0, "Invalid amount");

        uint256 remaining = _repaymentInfo.totalOwed -
            _repaymentInfo.totalRepaid;
        uint256 repayment = amount > remaining ? remaining : amount;

        IERC20(asset()).safeTransferFrom(msg.sender, address(this), repayment);

        _repaymentInfo.totalRepaid += repayment;
        _repaymentInfo.lastRepaymentTime = block.timestamp;
        totalYieldGenerated += repayment > _poolInfo.currentRaise
            ? repayment - _poolInfo.currentRaise
            : 0;

        emit RepaymentMade(msg.sender, repayment, block.timestamp);

        if (_repaymentInfo.totalRepaid >= _repaymentInfo.totalOwed) {
            _transitionState(PoolState.Completed);
        }
    }

    function finalizeRepayment() external onlyRole(ADMIN_ROLE) {
        require(_poolInfo.state == PoolState.Repaying, "Not repaying");
        require(
            _repaymentInfo.totalRepaid >= _repaymentInfo.totalOwed,
            "Not fully repaid"
        );
        _transitionState(PoolState.Completed);
    }

    // ============================================
    // Admin Functions
    // ============================================

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function updateRiskGrade(
        string calldata newGrade
    ) external onlyRole(ADMIN_ROLE) {
        _poolInfo.riskGrade = newGrade;
    }

    function setProtocolFee(uint256 newFee) external onlyRole(PROTOCOL_ROLE) {
        require(newFee <= 500, "Fee too high"); // Max 5%
        protocolFee = newFee;
    }

    // ============================================
    // Internal Functions
    // ============================================

    function _transitionState(PoolState newState) internal {
        PoolState oldState = _poolInfo.state;
        _poolInfo.state = newState;
        emit PoolStateChanged(oldState, newState);
    }

    function _calculateAccruedYield() internal view returns (uint256) {
        if (_poolInfo.currentRaise == 0 || _poolInfo.startTime == 0) return 0;

        uint256 principal = _poolInfo.currentRaise;
        uint256 timeElapsed = block.timestamp - _poolInfo.startTime;
        uint256 expectedYield = _calculateExpectedYield(principal);

        // Pro-rate yield based on time elapsed
        uint256 accruedYield = (expectedYield * timeElapsed) / _poolInfo.tenor;

        return accruedYield;
    }

    function _calculateExpectedYield(
        uint256 principal
    ) internal view returns (uint256) {
        return
            (principal * _poolInfo.targetAPY * _poolInfo.tenor) /
            (BASIS_POINTS * SECONDS_PER_YEAR);
    }
}
