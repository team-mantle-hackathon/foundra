// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IProtocolRegistry.sol";
import "../interfaces/IRiskOracle.sol";
import "../interfaces/IVaultFactory.sol";
import "../interfaces/IRWAVault.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title ProtocolRegistry
 * @notice Central registry for managing developers, projects, and protocol configuration
 */
contract ProtocolRegistry is
    IProtocolRegistry,
    AccessControl,
    Pausable,
    ReentrancyGuard
{
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant RISK_ASSESSOR_ROLE =
        keccak256("RISK_ASSESSOR_ROLE");

    // State variables
    mapping(address => DeveloperInfo) private developers;
    mapping(uint256 => ProjectProposal) private projects;
    mapping(address => uint256[]) private developerProjects;
    mapping(uint256 => address) public projectToVault;
    mapping(address => bool) public isVerified;

    uint256 private projectCounter;
    uint256 public minInvestment;
    uint256 public protocolFee; // In basis points

    address public vaultFactory;
    address public riskOracle;
    address public treasury;
    address public witness;

    // Events from interface already defined

    constructor(
        uint256 _minInvestment,
        uint256 _protocolFee,
        address _treasury,
        address _witness
    ) {
        require(_treasury != address(0), "Invalid treasury");
        require(_protocolFee <= 1000, "Fee too high"); // Max 10%

        minInvestment = _minInvestment;
        protocolFee = _protocolFee;
        treasury = _treasury;
        witness = _witness;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // ============================================
    // Verify Identity
    // ============================================

    function verifyProof(bytes32 claimId, bytes calldata signature) external {
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, claimId));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(
            messageHash
        );

        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        require(signer == witness, "Error! Signature Invalid!");

        isVerified[msg.sender] = true;
    }

    function checkUserVerified(address account) external view returns (bool) {
        return isVerified[account];
    }

    // ============================================
    // Developer Management
    // ============================================

    function registerDeveloper(
        string calldata companyName,
        string calldata registrationNumber,
        string calldata businessLicense
    ) external whenNotPaused {
        require(bytes(companyName).length > 0, "Invalid company name");
        require(bytes(registrationNumber).length > 0, "Invalid registration");
        require(!developers[msg.sender].isActive, "Already registered");

        developers[msg.sender] = DeveloperInfo({
            developerAddress: msg.sender,
            companyName: companyName,
            registrationNumber: registrationNumber,
            businessLicense: businessLicense,
            isApproved: false,
            isActive: true,
            registrationTime: block.timestamp,
            totalProjectsCreated: 0,
            totalProjectsCompleted: 0,
            totalDefaulted: 0
        });

        emit DeveloperRegistered(msg.sender, companyName, block.timestamp);
    }

    function approveDeveloper(address developer) external onlyRole(ADMIN_ROLE) {
        require(developers[developer].isActive, "Developer not registered");
        require(!developers[developer].isApproved, "Already approved");

        developers[developer].isApproved = true;

        emit DeveloperApproved(developer, msg.sender, block.timestamp);
    }

    function suspendDeveloper(
        address developer,
        string calldata reason
    ) external onlyRole(ADMIN_ROLE) {
        require(developers[developer].isActive, "Not active");

        developers[developer].isActive = false;

        emit DeveloperSuspended(developer, reason, block.timestamp);
    }

    function reactivateDeveloper(
        address developer
    ) external onlyRole(ADMIN_ROLE) {
        require(developers[developer].isApproved, "Not approved");
        require(!developers[developer].isActive, "Already active");

        developers[developer].isActive = true;
    }

    // ============================================
    // Project Management
    // ============================================

    function proposeProject(
        ProjectInput calldata input
    ) external whenNotPaused returns (uint256 projectId) {
        require(isVerified[msg.sender], "Developer not approved KYC");
        require(developers[msg.sender].isApproved, "Developer not approved");
        require(developers[msg.sender].isActive, "Developer not active");
        require(bytes(input.projectName).length > 0, "Invalid project name");
        require(input.requestedAmount > 0, "Invalid amount");
        require(
            input.requestedAmount <= input.estimatedBudget,
            "Amount exceeds budget"
        );
        require(input.estimatedDuration >= 30 days, "Duration too short");

        projectId = ++projectCounter;

        projects[projectId] = ProjectProposal({
            developer: msg.sender,
            projectName: input.projectName,
            location: input.location,
            estimatedBudget: input.estimatedBudget,
            requestedAmount: input.requestedAmount,
            estimatedDuration: input.estimatedDuration,
            documents: input.documents,
            status: ProjectStatus.Pending,
            aiRiskGrade: input.aiRiskGrade,
            aiRiskScore: input.aiRiskScore,
            targetAPY: input.targetAPY,
            proposalTime: block.timestamp
        });

        developerProjects[msg.sender].push(projectId);
        developers[msg.sender].totalProjectsCreated++;

        emit ProjectProposed(
            projectId,
            msg.sender,
            input.projectName,
            input.requestedAmount
        );

        // if (riskOracle != address(0)) {
        //     IRiskOracle(riskOracle).requestRiskAssessment(
        //         projectId,
        //         msg.sender,
        //         documents
        //     );
        // }

        return projectId;
    }

    function updateProject(
        uint projectId_,
        string calldata projectName,
        string calldata location,
        uint256 estimatedBudget,
        uint256 requestedAmount,
        uint256 estimatedDuration,
        string calldata documents
    ) external whenNotPaused {
        require(
            projects[projectId_].status == ProjectStatus.Pending,
            "Project Only can be updated when pending"
        );
        require(projects[projectId_].developer == msg.sender, "Not Developer");
        require(developers[msg.sender].isApproved, "Developer not approved");
        require(developers[msg.sender].isActive, "Developer not active");
        require(bytes(projectName).length > 0, "Invalid project name");
        require(requestedAmount > 0, "Invalid amount");
        require(requestedAmount <= estimatedBudget, "Amount exceeds budget");
        require(estimatedDuration >= 30 days, "Duration too short");

        projects[projectId_].projectName = projectName;
        projects[projectId_].location = location;
        projects[projectId_].estimatedBudget = estimatedBudget;
        projects[projectId_].requestedAmount = requestedAmount;
        projects[projectId_].estimatedDuration = estimatedDuration;
        projects[projectId_].documents = documents;

        emit ProjectUpdated(projectId_, msg.sender);
    }

    function updateAIRiskAssessment(
        uint256 projectId,
        string calldata riskGrade,
        uint256 riskScore
    ) external onlyRole(RISK_ASSESSOR_ROLE) {
        require(
            projectId > 0 && projectId <= projectCounter,
            "Invalid project"
        );
        require(bytes(riskGrade).length > 0, "Invalid grade");
        require(riskScore <= 100, "Invalid score");

        projects[projectId].aiRiskGrade = riskGrade;
        projects[projectId].aiRiskScore = riskScore;
    }

    function _registerVault(uint256 projectId, address vaultAddress) external {
        require(msg.sender == vaultFactory, "Only factory");
        require(
            projects[projectId].status == ProjectStatus.Active,
            "Project not approved"
        );
        require(projectToVault[projectId] == address(0), "Vault exists");

        projectToVault[projectId] = vaultAddress;

        emit VaultCreated(
            projectId,
            vaultAddress,
            projects[projectId].developer
        );
    }

    function approveProject(uint256 projectId) external onlyRole(ADMIN_ROLE) {
        require(
            projectId > 0 && projectId <= projectCounter,
            "Invalid project"
        );
        require(
            projects[projectId].status == ProjectStatus.Pending,
            "Project is not pending"
        );
        require(
            bytes(projects[projectId].aiRiskGrade).length > 0,
            "No risk grade"
        );
        require(vaultFactory != address(0), "Vault factory not set");

        projects[projectId].status = ProjectStatus.Active;

        IVaultFactory(vaultFactory).createVault(
            projectId,
            projects[projectId].targetAPY,
            projects[projectId].estimatedDuration
        );

        emit ProjectApproved(
            projectId,
            msg.sender,
            projects[projectId].aiRiskGrade,
            block.timestamp
        );
    }

    function rejectProject(
        uint256 projectId,
        string calldata reason
    ) external onlyRole(ADMIN_ROLE) {
        require(
            projectId > 0 && projectId <= projectCounter,
            "Invalid project"
        );
        require(
            projects[projectId].status == ProjectStatus.Pending,
            "Project is not pending"
        );

        projects[projectId].status = ProjectStatus.Rejected;

        emit ProjectRejected(projectId, reason, block.timestamp);
    }

    // ============================================
    // View Functions
    // ============================================

    function isDeveloperApproved(
        address developer
    ) external view returns (bool) {
        return developers[developer].isApproved;
    }

    function isDeveloperActive(address developer) external view returns (bool) {
        return developers[developer].isActive;
    }

    function getDeveloperInfo(
        address developer
    ) external view returns (DeveloperInfo memory) {
        return developers[developer];
    }

    function getProjectProposal(
        uint256 projectId
    ) external view returns (ProjectProposal memory) {
        require(
            projectId > 0 && projectId <= projectCounter,
            "Invalid project"
        );
        return projects[projectId];
    }

    function getTotalProjects() external view returns (uint256) {
        return projectCounter;
    }

    function getDeveloperProjects(
        address developer
    ) external view returns (uint256[] memory) {
        return developerProjects[developer];
    }

    function getVaultAddress(
        uint256 projectId
    ) external view returns (address) {
        return projectToVault[projectId];
    }

    // ============================================
    // Protocol Configuration
    // ============================================

    function setMinInvestment(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount > 0, "Invalid amount");
        minInvestment = amount;
    }

    function setProtocolFee(uint256 bps) external onlyRole(ADMIN_ROLE) {
        require(bps <= 1000, "Fee too high"); // Max 10%
        protocolFee = bps;
    }

    function setVaultFactory(address _factory) external onlyRole(ADMIN_ROLE) {
        require(_factory != address(0), "Invalid factory");
        vaultFactory = _factory;
    }

    function setRiskOracle(address _oracle) external onlyRole(ADMIN_ROLE) {
        require(_oracle != address(0), "Invalid oracle");
        riskOracle = _oracle;
        _grantRole(RISK_ASSESSOR_ROLE, _oracle);
    }

    function setTreasury(address _treasury) external onlyRole(ADMIN_ROLE) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // ============================================
    // Vault Management
    // ============================================

    /**
     * @notice Disburse Funds
     * @param _vaultAddress Address of the vault to disburse from
     */

    function disburseVaultFunds(
        address _vaultAddress
    ) external onlyRole(ADMIN_ROLE) {
        require(_vaultAddress != address(0), "Invalid vault address");

        IRWAVault(_vaultAddress).disburseFunds();
    }

    /**
     * @notice Cancel Vault and project
     * @param _projectId of the project vault
     * @param _vaultAddress Address of the vault
     */
    function cancelVaultProject(
        uint256 _projectId,
        address _vaultAddress,
        string calldata reason
    ) external onlyRole(ADMIN_ROLE) {
        require(_vaultAddress != address(0), "Invalid vault address");
        require(projectToVault[_projectId] == _vaultAddress, "Vault mismatch");

        IRWAVault(_vaultAddress).cancelPool();

        projects[_projectId].status = ProjectStatus.Cancelled;

        emit ProjectCancelled(
            _projectId,
            _vaultAddress,
            reason,
            ProjectStatus.Cancelled,
            block.timestamp
        );
    }

    // ============================================
    // Project Statistics Updates
    // ============================================

    function recordProjectCompletion(address developer) external {
        require(msg.sender == vaultFactory, "Only factory");
        developers[developer].totalProjectsCompleted++;
    }

    function recordProjectDefault(address developer) external {
        require(msg.sender == vaultFactory, "Only factory");
        developers[developer].totalDefaulted++;
    }
}
