// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRiskOracle
 * @notice Oracle interface for AI-powered risk assessment
 * @dev Integrates with off-chain AI model for project risk evaluation
 */
interface IRiskOracle {
    // Structs
    struct RiskAssessment {
        string grade; // A+, A, A-, B+, B, B-, C+, C, C-, D
        uint256 score; // 0-100
        uint256 confidence; // 0-100
        uint256 timestamp;
        bool isValid;
        string dataHash; // Hash of data used for assessment
    }

    struct AssessmentFactors {
        uint256 developerScore; // Developer track record
        uint256 locationScore; // Project location quality
        uint256 marketScore; // Market conditions
        uint256 financialScore; // Financial health
        uint256 collateralScore; // Collateral quality
    }

    // Events
    event RiskAssessmentRequested(
        uint256 indexed projectId,
        address indexed requester,
        uint256 timestamp
    );

    event RiskAssessmentUpdated(
        uint256 indexed projectId,
        string grade,
        uint256 score,
        uint256 timestamp
    );

    event OracleUpdated(
        address indexed oldOracle,
        address indexed newOracle,
        uint256 timestamp
    );

    // Main functions
    function requestRiskAssessment(
        uint256 projectId,
        address developer,
        string calldata projectData
    ) external returns (bytes32 requestId);

    function fulfillRiskAssessment(
        bytes32 requestId,
        uint256 projectId,
        string calldata grade,
        uint256 score,
        uint256 confidence,
        AssessmentFactors calldata factors
    ) external;

    function updateRiskAssessment(
        uint256 projectId,
        string calldata newGrade,
        uint256 newScore
    ) external;

    // View functions
    function getRiskAssessment(
        uint256 projectId
    ) external view returns (RiskAssessment memory);

    function getAssessmentFactors(
        uint256 projectId
    ) external view returns (AssessmentFactors memory);

    function isGradeValid(string calldata grade) external view returns (bool);

    function scoreToGrade(uint256 score) external pure returns (string memory);

    function gradeToScore(
        string calldata grade
    ) external pure returns (uint256);

    // Admin functions
    function setOracleAddress(address newOracle) external;

    function setMinConfidence(uint256 minConfidence) external;

    function pause() external;

    function unpause() external;
}
