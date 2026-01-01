// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IProtocolRegistry
 * @notice Central registry for protocol management
 * @dev Manages developers, projects, and protocol configuration
 */
interface IProtocolRegistry {
    enum ProjectStatus {
        Pending,
        Active,
        Cancelled,
        Rejected,
        Completed
    }

    // Structs
    struct DeveloperInfo {
        address developerAddress;
        string companyName;
        string registrationNumber;
        string businessLicense; // IPFS hash
        bool isApproved;
        bool isActive;
        uint256 registrationTime;
        uint256 totalProjectsCreated;
        uint256 totalProjectsCompleted;
        uint256 totalDefaulted;
    }

    struct ProjectInput {
        string projectName;
        string location;
        uint256 estimatedBudget;
        uint256 requestedAmount;
        uint256 estimatedDuration;
        string documents; // IPFS hash
        ProjectStatus status;
        string aiRiskGrade;
        uint256 aiRiskScore; // 0-100
        uint256 targetAPY;
    }

    struct ProjectProposal {
        address developer;
        string projectName;
        string location;
        uint256 estimatedBudget;
        uint256 requestedAmount;
        uint256 estimatedDuration;
        string documents; // IPFS hash
        ProjectStatus status;
        string aiRiskGrade;
        uint256 aiRiskScore; // 0-100
        uint256 targetAPY;
        uint256 proposalTime;
    }

    // Events
    event DeveloperRegistered(
        address indexed developer,
        string companyName,
        uint256 timestamp
    );

    event DeveloperApproved(
        address indexed developer,
        address indexed approver,
        uint256 timestamp
    );

    event DeveloperSuspended(
        address indexed developer,
        string reason,
        uint256 timestamp
    );

    event ProjectProposed(
        uint256 indexed projectId,
        address indexed developer,
        string projectName,
        uint256 requestedAmount
    );

    event ProjectApproved(
        uint256 indexed projectId,
        address indexed approver,
        string riskGrade,
        uint256 timestamp
    );

    event ProjectUpdated(uint256 indexed projectId, address indexed developer);

    event ProjectRejected(
        uint256 indexed projectId,
        string reason,
        uint256 timestamp
    );
    
    event ProjectCancelled(
        uint256 indexed _projectId,
        address indexed _vaultAddress,
        string reason,
        ProjectStatus status,
        uint256 timestamp
    );

    event VaultCreated(
        uint256 indexed projectId,
        address indexed vaultAddress,
        address indexed developer
    );
    
    event VaultDisbursed(
        uint256 indexed _projectId,
        address indexed _vaultAddress,
        uint256 timestamp
    );

    function checkUserVerified(address developer) external view returns (bool);

    // Developer management
    function registerDeveloper(
        string calldata companyName,
        string calldata registrationNumber,
        string calldata businessLicense
    ) external;

    function approveDeveloper(address developer) external;

    function suspendDeveloper(
        address developer,
        string calldata reason
    ) external;

    function reactivateDeveloper(address developer) external;

    // Project management
    function proposeProject(
        ProjectInput calldata input
    ) external returns (uint256 projectId);

    function updateAIRiskAssessment(
        uint256 projectId,
        string calldata riskGrade,
        uint256 riskScore
    ) external;

    function _registerVault(uint256 projectId, address vaultAddress) external;

    function approveProject(uint256 projectId) external;

    function rejectProject(uint256 projectId, string calldata reason) external;

    // View functions
    function isDeveloperApproved(
        address developer
    ) external view returns (bool);

    function isDeveloperActive(address developer) external view returns (bool);

    function getDeveloperInfo(
        address developer
    ) external view returns (DeveloperInfo memory);

    function getProjectProposal(
        uint256 projectId
    ) external view returns (ProjectProposal memory);

    function getTotalProjects() external view returns (uint256);

    function getDeveloperProjects(
        address developer
    ) external view returns (uint256[] memory);

    // Protocol config
    function setMinInvestment(uint256 amount) external;

    function setProtocolFee(uint256 bps) external;

    function setVaultFactory(address factory) external;

    function setRiskOracle(address oracle) external;

    function minInvestment() external view returns (uint256);
}
