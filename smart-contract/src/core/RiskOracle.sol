// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interfaces/IRiskOracle.sol";

/**
 * @title RiskOracle
 * @notice Oracle for AI-powered risk assessment of real estate projects
 * @dev Integrates with off-chain AI service via Chainlink or custom oracle
 */
contract RiskOracle is IRiskOracle, AccessControl, Pausable {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ASSESSOR_ROLE = keccak256("ASSESSOR_ROLE");

    // State variables
    mapping(uint256 => RiskAssessment) private assessments;
    mapping(uint256 => AssessmentFactors) private factors;
    mapping(bytes32 => uint256) private requestIdToProjectId;

    uint256 public minConfidence;
    address public oracleAddress;
    uint256 public requestNonce;

    // Valid risk grades
    mapping(string => bool) private validGrades;
    string[] private gradesList;

    constructor(address _oracleAddress, uint256 _minConfidence) {
        require(_oracleAddress != address(0), "Invalid oracle");
        require(_minConfidence <= 100, "Invalid confidence");

        oracleAddress = _oracleAddress;
        minConfidence = _minConfidence;

        // Initialize valid grades
        _initializeGrades();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, _oracleAddress);
    }

    function _initializeGrades() internal {
        string[4] memory grades = ["A", "B", "C", "D"];

        for (uint256 i = 0; i < grades.length; i++) {
            validGrades[grades[i]] = true;
            gradesList.push(grades[i]);
        }
    }

    // ============================================
    // Main Functions
    // ============================================

    function requestRiskAssessment(
        uint256 projectId,
        address developer,
        string calldata projectData
    ) external whenNotPaused returns (bytes32 requestId) {
        require(projectId > 0, "Invalid project ID");
        require(developer != address(0), "Invalid developer");

        // Generate unique request ID
        requestId = keccak256(
            abi.encodePacked(
                projectId,
                developer,
                block.timestamp,
                requestNonce++
            )
        );

        requestIdToProjectId[requestId] = projectId;

        emit RiskAssessmentRequested(projectId, msg.sender, block.timestamp);

        return requestId;
    }

    function fulfillRiskAssessment(
        bytes32 requestId,
        uint256 projectId,
        string calldata grade,
        uint256 score,
        uint256 confidence,
        AssessmentFactors calldata _factors
    ) external onlyRole(ORACLE_ROLE) whenNotPaused {
        require(
            requestIdToProjectId[requestId] == projectId,
            "Invalid request"
        );
        require(isGradeValid(grade), "Invalid grade");
        require(score <= 100, "Invalid score");
        require(confidence >= minConfidence, "Confidence too low");
        require(confidence <= 100, "Invalid confidence");

        // Validate factors
        require(_factors.developerScore <= 100, "Invalid developer score");
        require(_factors.locationScore <= 100, "Invalid location score");
        require(_factors.marketScore <= 100, "Invalid market score");
        require(_factors.financialScore <= 100, "Invalid financial score");
        require(_factors.collateralScore <= 100, "Invalid collateral score");

        // Store assessment
        assessments[projectId] = RiskAssessment({
            grade: grade,
            score: score,
            confidence: confidence,
            timestamp: block.timestamp,
            isValid: true,
            dataHash: ""
        });

        // Store factors
        factors[projectId] = _factors;

        emit RiskAssessmentUpdated(projectId, grade, score, block.timestamp);
    }

    function updateRiskAssessment(
        uint256 projectId,
        string calldata newGrade,
        uint256 newScore
    ) external onlyRole(ASSESSOR_ROLE) {
        require(assessments[projectId].isValid, "No assessment exists");
        require(isGradeValid(newGrade), "Invalid grade");
        require(newScore <= 100, "Invalid score");

        assessments[projectId].grade = newGrade;
        assessments[projectId].score = newScore;
        assessments[projectId].timestamp = block.timestamp;

        emit RiskAssessmentUpdated(
            projectId,
            newGrade,
            newScore,
            block.timestamp
        );
    }

    // ============================================
    // View Functions
    // ============================================

    function getRiskAssessment(
        uint256 projectId
    ) external view returns (RiskAssessment memory) {
        return assessments[projectId];
    }

    function getAssessmentFactors(
        uint256 projectId
    ) external view returns (AssessmentFactors memory) {
        return factors[projectId];
    }

    function isGradeValid(string calldata grade) public view returns (bool) {
        return validGrades[grade];
    }

    function scoreToGrade(uint256 score) external pure returns (string memory) {
        require(score <= 100, "Invalid score");

        if (score >= 80) return "A";
        if (score >= 60) return "B";
        if (score >= 40) return "C";
        return "D";
    }

    function gradeToScore(
        string calldata grade
    ) external pure returns (uint256) {
        bytes32 gradeHash = keccak256(abi.encodePacked(grade));

        if (gradeHash == keccak256("A")) return 90;
        if (gradeHash == keccak256("B")) return 70;
        if (gradeHash == keccak256("C")) return 50;
        if (gradeHash == keccak256("D")) return 30;

        revert("Invalid grade");
    }

    function getValidGrades() external view returns (string[] memory) {
        return gradesList;
    }

    // ============================================
    // Admin Functions
    // ============================================

    function setOracleAddress(address newOracle) external onlyRole(ADMIN_ROLE) {
        require(newOracle != address(0), "Invalid oracle");

        address oldOracle = oracleAddress;
        oracleAddress = newOracle;

        _revokeRole(ORACLE_ROLE, oldOracle);
        _grantRole(ORACLE_ROLE, newOracle);

        emit OracleUpdated(oldOracle, newOracle, block.timestamp);
    }

    function setMinConfidence(
        uint256 _minConfidence
    ) external onlyRole(ADMIN_ROLE) {
        require(_minConfidence <= 100, "Invalid confidence");
        minConfidence = _minConfidence;
    }

    function grantAssessorRole(address assessor) external onlyRole(ADMIN_ROLE) {
        _grantRole(ASSESSOR_ROLE, assessor);
    }

    function revokeAssessorRole(
        address assessor
    ) external onlyRole(ADMIN_ROLE) {
        _revokeRole(ASSESSOR_ROLE, assessor);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function invalidateAssessment(
        uint256 projectId
    ) external onlyRole(ADMIN_ROLE) {
        assessments[projectId].isValid = false;
    }
}
