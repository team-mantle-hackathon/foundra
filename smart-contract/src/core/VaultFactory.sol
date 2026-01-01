// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../vault/RWAVault.sol";
import "../interfaces/IProtocolRegistry.sol";

/**
 * @title VaultFactory
 * @notice Factory contract for creating RWA lending vaults
 */
contract VaultFactory is AccessControl, Pausable {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROTOCOL_ROLE = keccak256("PROTOCOL_ROLE");

    // State variables
    IProtocolRegistry public immutable registry;
    IERC20 public immutable stablecoin; // USDC or other stablecoin

    address[] public allVaults;
    mapping(address => address[]) public developerVaults;
    mapping(uint256 => address) public projectIdToVault;

    // Events
    event VaultCreated(
        address indexed vaultAddress,
        uint256 indexed projectId,
        address indexed developer,
        uint256 targetRaise,
        uint256 targetAPY,
        string riskGrade
    );

    event VaultTemplateUpdated(address oldTemplate, address newTemplate);

    constructor(address _registry, address _stablecoin) {
        require(_registry != address(0), "Invalid registry");
        require(_stablecoin != address(0), "Invalid stablecoin");

        registry = IProtocolRegistry(_registry);
        stablecoin = IERC20(_stablecoin);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        _grantRole(PROTOCOL_ROLE, _registry);
    }

    /**
     * @notice Create a new RWA lending vault
     * @param _projectId The approved project ID
     * @param _targetAPY Target APY in basis points
     * @param _tenor Duration in seconds
     * @return vaultAddress Address of the created vault
     */
    function createVault(
        uint256 _projectId,
        uint256 _targetAPY,
        uint256 _tenor
    )
        external
        whenNotPaused
        onlyRole(PROTOCOL_ROLE)
        returns (address vaultAddress)
    {
        // Get project proposal from registry
        IProtocolRegistry.ProjectProposal memory proposal = registry
            .getProjectProposal(_projectId);

        // Validate project
        require(
            proposal.status == IProtocolRegistry.ProjectStatus.Active,
            "Project not active"
        );
        require(
            registry.isDeveloperActive(proposal.developer),
            "Developer not active"
        );
        require(
            projectIdToVault[_projectId] == address(0),
            "Vault already exists"
        );
        require(bytes(proposal.aiRiskGrade).length > 0, "No risk grade");

        // Validate parameters
        require(_targetAPY > 0 && _targetAPY <= 5000, "Invalid APY"); // Max 50%
        require(_tenor >= 30 days && _tenor <= 730 days, "Invalid tenor");

        // Generate vault name and symbol
        string memory vaultName = string(
            abi.encodePacked("FOUNDRA - ", proposal.projectName)
        );
        string memory vaultSymbol = string(
            abi.encodePacked("FDRA", _toString(_projectId))
        );

        // Deploy new vault
        RWAVault vault = new RWAVault(
            stablecoin,
            vaultName,
            vaultSymbol,
            proposal.developer,
            address(registry),
            proposal.requestedAmount,
            _targetAPY,
            _tenor,
            registry.minInvestment(),
            proposal.aiRiskGrade,
            proposal.documents
        );

        vaultAddress = address(vault);

        // Record in mappings
        allVaults.push(vaultAddress);
        developerVaults[msg.sender].push(vaultAddress);
        projectIdToVault[_projectId] = vaultAddress;

        // Register vault in registry
        registry._registerVault(_projectId, vaultAddress);

        emit VaultCreated(
            vaultAddress,
            _projectId,
            msg.sender,
            proposal.requestedAmount,
            _targetAPY,
            proposal.aiRiskGrade
        );

        return vaultAddress;
    }

    /**
     * @notice Get all vaults created by a developer
     */
    function getDeveloperVaults(
        address _developer
    ) external view returns (address[] memory) {
        return developerVaults[_developer];
    }

    /**
     * @notice Get total number of vaults
     */
    function getTotalVaults() external view returns (uint256) {
        return allVaults.length;
    }

    /**
     * @notice Get vault address for a project
     */
    function getVaultByProject(
        uint256 _projectId
    ) external view returns (address) {
        return projectIdToVault[_projectId];
    }

    /**
     * @notice Get paginated list of vaults
     */
    function getVaults(
        uint256 start,
        uint256 count
    ) external view returns (address[] memory) {
        require(start < allVaults.length, "Start out of bounds");

        uint256 end = start + count;
        if (end > allVaults.length) {
            end = allVaults.length;
        }

        uint256 resultCount = end - start;
        address[] memory result = new address[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = allVaults[start + i];
        }

        return result;
    }

    /**
     * @notice Get vault info batch
     */
    function getVaultInfoBatch(
        address[] calldata vaultAddresses
    ) external view returns (IRWAVault.PoolInfo[] memory) {
        IRWAVault.PoolInfo[] memory infos = new IRWAVault.PoolInfo[](
            vaultAddresses.length
        );

        for (uint256 i = 0; i < vaultAddresses.length; i++) {
            IRWAVault vault = IRWAVault(vaultAddresses[i]);
            infos[i] = vault.getPoolInfo();
        }

        return infos;
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

    // ============================================
    // Internal Helpers
    // ============================================

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
