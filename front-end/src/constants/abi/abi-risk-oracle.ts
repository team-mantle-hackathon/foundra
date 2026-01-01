export const riskOracleAbi = [
    {
        "type": "constructor",
        "inputs": [
            { "name": "_oracleAddress", "type": "address", "internalType": "address" },
            { "name": "_minConfidence", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "ADMIN_ROLE",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "ASSESSOR_ROLE",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "DEFAULT_ADMIN_ROLE",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "ORACLE_ROLE",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "fulfillRiskAssessment",
        "inputs": [
            { "name": "requestId", "type": "bytes32", "internalType": "bytes32" },
            { "name": "projectId", "type": "uint256", "internalType": "uint256" },
            { "name": "grade", "type": "string", "internalType": "string" },
            { "name": "score", "type": "uint256", "internalType": "uint256" },
            { "name": "confidence", "type": "uint256", "internalType": "uint256" },
            {
                "name": "_factors",
                "type": "tuple",
                "internalType": "struct IRiskOracle.AssessmentFactors",
                "components": [
                    { "name": "developerScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "locationScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "marketScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "financialScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "collateralScore", "type": "uint256", "internalType": "uint256" }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getAssessmentFactors",
        "inputs": [{ "name": "projectId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct IRiskOracle.AssessmentFactors",
                "components": [
                    { "name": "developerScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "locationScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "marketScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "financialScore", "type": "uint256", "internalType": "uint256" },
                    { "name": "collateralScore", "type": "uint256", "internalType": "uint256" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRiskAssessment",
        "inputs": [{ "name": "projectId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct IRiskOracle.RiskAssessment",
                "components": [
                    { "name": "grade", "type": "string", "internalType": "string" },
                    { "name": "score", "type": "uint256", "internalType": "uint256" },
                    { "name": "confidence", "type": "uint256", "internalType": "uint256" },
                    { "name": "timestamp", "type": "uint256", "internalType": "uint256" },
                    { "name": "isValid", "type": "bool", "internalType": "bool" },
                    { "name": "dataHash", "type": "string", "internalType": "string" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRoleAdmin",
        "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }],
        "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getValidGrades",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string[]", "internalType": "string[]" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "gradeToScore",
        "inputs": [{ "name": "grade", "type": "string", "internalType": "string" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "grantAssessorRole",
        "inputs": [{ "name": "assessor", "type": "address", "internalType": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "grantRole",
        "inputs": [
            { "name": "role", "type": "bytes32", "internalType": "bytes32" },
            { "name": "account", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "hasRole",
        "inputs": [
            { "name": "role", "type": "bytes32", "internalType": "bytes32" },
            { "name": "account", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "invalidateAssessment",
        "inputs": [{ "name": "projectId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "isGradeValid",
        "inputs": [{ "name": "grade", "type": "string", "internalType": "string" }],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "minConfidence",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "oracleAddress",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    { "type": "function", "name": "pause", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
    {
        "type": "function",
        "name": "paused",
        "inputs": [],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "renounceRole",
        "inputs": [
            { "name": "role", "type": "bytes32", "internalType": "bytes32" },
            { "name": "callerConfirmation", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "requestNonce",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "requestRiskAssessment",
        "inputs": [
            { "name": "projectId", "type": "uint256", "internalType": "uint256" },
            { "name": "developer", "type": "address", "internalType": "address" },
            { "name": "projectData", "type": "string", "internalType": "string" }
        ],
        "outputs": [{ "name": "requestId", "type": "bytes32", "internalType": "bytes32" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "revokeAssessorRole",
        "inputs": [{ "name": "assessor", "type": "address", "internalType": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "revokeRole",
        "inputs": [
            { "name": "role", "type": "bytes32", "internalType": "bytes32" },
            { "name": "account", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "scoreToGrade",
        "inputs": [{ "name": "score", "type": "uint256", "internalType": "uint256" }],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "setMinConfidence",
        "inputs": [{ "name": "_minConfidence", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setOracleAddress",
        "inputs": [{ "name": "newOracle", "type": "address", "internalType": "address" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    { "type": "function", "name": "unpause", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
    {
        "type": "function",
        "name": "updateRiskAssessment",
        "inputs": [
            { "name": "projectId", "type": "uint256", "internalType": "uint256" },
            { "name": "newGrade", "type": "string", "internalType": "string" },
            { "name": "newScore", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "OracleUpdated",
        "inputs": [
            { "name": "oldOracle", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "newOracle", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Paused",
        "inputs": [{ "name": "account", "type": "address", "indexed": false, "internalType": "address" }],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RiskAssessmentRequested",
        "inputs": [
            { "name": "projectId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "requester", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RiskAssessmentUpdated",
        "inputs": [
            { "name": "projectId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "grade", "type": "string", "indexed": false, "internalType": "string" },
            { "name": "score", "type": "uint256", "indexed": false, "internalType": "uint256" },
            { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoleAdminChanged",
        "inputs": [
            { "name": "role", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
            { "name": "previousAdminRole", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
            { "name": "newAdminRole", "type": "bytes32", "indexed": true, "internalType": "bytes32" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoleGranted",
        "inputs": [
            { "name": "role", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
            { "name": "account", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoleRevoked",
        "inputs": [
            { "name": "role", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
            { "name": "account", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Unpaused",
        "inputs": [{ "name": "account", "type": "address", "indexed": false, "internalType": "address" }],
        "anonymous": false
    },
    { "type": "error", "name": "AccessControlBadConfirmation", "inputs": [] },
    {
        "type": "error",
        "name": "AccessControlUnauthorizedAccount",
        "inputs": [
            { "name": "account", "type": "address", "internalType": "address" },
            { "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }
        ]
    },
    { "type": "error", "name": "EnforcedPause", "inputs": [] },
    { "type": "error", "name": "ExpectedPause", "inputs": [] }
] as const