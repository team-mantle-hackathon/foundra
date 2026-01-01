// export const protocolAbi = [
//   {
//       "type": "constructor",
//       "inputs": [
//           { "name": "_minInvestment", "type": "uint256", "internalType": "uint256" },
//           { "name": "_protocolFee", "type": "uint256", "internalType": "uint256" },
//           { "name": "_treasury", "type": "address", "internalType": "address" }
//       ],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "ADMIN_ROLE",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "DEFAULT_ADMIN_ROLE",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "RISK_ASSESSOR_ROLE",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "approveDeveloper",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "approveProject",
//       "inputs": [{ "name": "projectId", "type": "uint256", "internalType": "uint256" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "approveVaultPool",
//       "inputs": [{ "name": "vaultAddress", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "disburseVaultFunds",
//       "inputs": [{ "name": "vaultAddress", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "getDeveloperInfo",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [
//           {
//               "name": "",
//               "type": "tuple",
//               "internalType": "struct IProtocolRegistry.DeveloperInfo",
//               "components": [
//                   { "name": "developerAddress", "type": "address", "internalType": "address" },
//                   { "name": "companyName", "type": "string", "internalType": "string" },
//                   { "name": "registrationNumber", "type": "string", "internalType": "string" },
//                   { "name": "businessLicense", "type": "string", "internalType": "string" },
//                   { "name": "isApproved", "type": "bool", "internalType": "bool" },
//                   { "name": "isActive", "type": "bool", "internalType": "bool" },
//                   { "name": "registrationTime", "type": "uint256", "internalType": "uint256" },
//                   { "name": "totalProjectsCreated", "type": "uint256", "internalType": "uint256" },
//                   { "name": "totalProjectsCompleted", "type": "uint256", "internalType": "uint256" },
//                   { "name": "totalDefaulted", "type": "uint256", "internalType": "uint256" }
//               ]
//           }
//       ],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "getDeveloperProjects",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "getProjectProposal",
//       "inputs": [{ "name": "projectId", "type": "uint256", "internalType": "uint256" }],
//       "outputs": [
//           {
//               "name": "",
//               "type": "tuple",
//               "internalType": "struct IProtocolRegistry.ProjectProposal",
//               "components": [
//                   { "name": "developer", "type": "address", "internalType": "address" },
//                   { "name": "projectName", "type": "string", "internalType": "string" },
//                   { "name": "location", "type": "string", "internalType": "string" },
//                   { "name": "estimatedBudget", "type": "uint256", "internalType": "uint256" },
//                   { "name": "requestedAmount", "type": "uint256", "internalType": "uint256" },
//                   { "name": "estimatedDuration", "type": "uint256", "internalType": "uint256" },
//                   { "name": "documents", "type": "string", "internalType": "string" },
//                   { "name": "aiRiskGrade", "type": "string", "internalType": "string" },
//                   { "name": "aiRiskScore", "type": "uint256", "internalType": "uint256" },
//                   { "name": "isApproved", "type": "bool", "internalType": "bool" },
//                   { "name": "proposalTime", "type": "uint256", "internalType": "uint256" }
//               ]
//           }
//       ],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "getRoleAdmin",
//       "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }],
//       "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "getTotalProjects",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "getVaultAddress",
//       "inputs": [{ "name": "projectId", "type": "uint256", "internalType": "uint256" }],
//       "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "grantRole",
//       "inputs": [
//           { "name": "role", "type": "bytes32", "internalType": "bytes32" },
//           { "name": "account", "type": "address", "internalType": "address" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "hasRole",
//       "inputs": [
//           { "name": "role", "type": "bytes32", "internalType": "bytes32" },
//           { "name": "account", "type": "address", "internalType": "address" }
//       ],
//       "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "isDeveloperActive",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "isDeveloperApproved",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "minInvestment",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
//       "stateMutability": "view"
//   },
//   { "type": "function", "name": "pause", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
//   {
//       "type": "function",
//       "name": "paused",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "projectToVault",
//       "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
//       "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "proposeProject",
//       "inputs": [
//           { "name": "projectName", "type": "string", "internalType": "string" },
//           { "name": "location", "type": "string", "internalType": "string" },
//           { "name": "estimatedBudget", "type": "uint256", "internalType": "uint256" },
//           { "name": "requestedAmount", "type": "uint256", "internalType": "uint256" },
//           { "name": "estimatedDuration", "type": "uint256", "internalType": "uint256" },
//           { "name": "documents", "type": "string", "internalType": "string" }
//       ],
//       "outputs": [{ "name": "projectId", "type": "uint256", "internalType": "uint256" }],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "protocolFee",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "reactivateDeveloper",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "recordProjectCompletion",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "recordProjectDefault",
//       "inputs": [{ "name": "developer", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "registerDeveloper",
//       "inputs": [
//           { "name": "companyName", "type": "string", "internalType": "string" },
//           { "name": "registrationNumber", "type": "string", "internalType": "string" },
//           { "name": "businessLicense", "type": "string", "internalType": "string" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "registerVault",
//       "inputs": [
//           { "name": "projectId", "type": "uint256", "internalType": "uint256" },
//           { "name": "vaultAddress", "type": "address", "internalType": "address" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "rejectProject",
//       "inputs": [
//           { "name": "projectId", "type": "uint256", "internalType": "uint256" },
//           { "name": "reason", "type": "string", "internalType": "string" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "renounceRole",
//       "inputs": [
//           { "name": "role", "type": "bytes32", "internalType": "bytes32" },
//           { "name": "callerConfirmation", "type": "address", "internalType": "address" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "revokeRole",
//       "inputs": [
//           { "name": "role", "type": "bytes32", "internalType": "bytes32" },
//           { "name": "account", "type": "address", "internalType": "address" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "riskOracle",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "setMinInvestment",
//       "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "setProtocolFee",
//       "inputs": [{ "name": "bps", "type": "uint256", "internalType": "uint256" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "setRiskOracle",
//       "inputs": [{ "name": "oracle", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "setTreasury",
//       "inputs": [{ "name": "_treasury", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "setVaultFactory",
//       "inputs": [{ "name": "factory", "type": "address", "internalType": "address" }],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "supportsInterface",
//       "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }],
//       "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "function",
//       "name": "suspendDeveloper",
//       "inputs": [
//           { "name": "developer", "type": "address", "internalType": "address" },
//           { "name": "reason", "type": "string", "internalType": "string" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "treasury",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
//       "stateMutability": "view"
//   },
//   { "type": "function", "name": "unpause", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
//   {
//       "type": "function",
//       "name": "updateAIRiskAssessment",
//       "inputs": [
//           { "name": "projectId", "type": "uint256", "internalType": "uint256" },
//           { "name": "riskGrade", "type": "string", "internalType": "string" },
//           { "name": "riskScore", "type": "uint256", "internalType": "uint256" }
//       ],
//       "outputs": [],
//       "stateMutability": "nonpayable"
//   },
//   {
//       "type": "function",
//       "name": "vaultFactory",
//       "inputs": [],
//       "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
//       "stateMutability": "view"
//   },
//   {
//       "type": "event",
//       "name": "DeveloperApproved",
//       "inputs": [
//           { "name": "developer", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "approver", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "DeveloperRegistered",
//       "inputs": [
//           { "name": "developer", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "companyName", "type": "string", "indexed": false, "internalType": "string" },
//           { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "DeveloperSuspended",
//       "inputs": [
//           { "name": "developer", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "reason", "type": "string", "indexed": false, "internalType": "string" },
//           { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "Paused",
//       "inputs": [{ "name": "account", "type": "address", "indexed": false, "internalType": "address" }],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "ProjectApproved",
//       "inputs": [
//           { "name": "projectId", "type": "uint256", "indexed": true, "internalType": "uint256" },
//           { "name": "approver", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "riskGrade", "type": "string", "indexed": false, "internalType": "string" },
//           { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "ProjectProposed",
//       "inputs": [
//           { "name": "projectId", "type": "uint256", "indexed": true, "internalType": "uint256" },
//           { "name": "developer", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "projectName", "type": "string", "indexed": false, "internalType": "string" },
//           { "name": "requestedAmount", "type": "uint256", "indexed": false, "internalType": "uint256" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "ProjectRejected",
//       "inputs": [
//           { "name": "projectId", "type": "uint256", "indexed": true, "internalType": "uint256" },
//           { "name": "reason", "type": "string", "indexed": false, "internalType": "string" },
//           { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "RoleAdminChanged",
//       "inputs": [
//           { "name": "role", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
//           { "name": "previousAdminRole", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
//           { "name": "newAdminRole", "type": "bytes32", "indexed": true, "internalType": "bytes32" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "RoleGranted",
//       "inputs": [
//           { "name": "role", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
//           { "name": "account", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "RoleRevoked",
//       "inputs": [
//           { "name": "role", "type": "bytes32", "indexed": true, "internalType": "bytes32" },
//           { "name": "account", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }
//       ],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "Unpaused",
//       "inputs": [{ "name": "account", "type": "address", "indexed": false, "internalType": "address" }],
//       "anonymous": false
//   },
//   {
//       "type": "event",
//       "name": "VaultCreated",
//       "inputs": [
//           { "name": "projectId", "type": "uint256", "indexed": true, "internalType": "uint256" },
//           { "name": "vaultAddress", "type": "address", "indexed": true, "internalType": "address" },
//           { "name": "developer", "type": "address", "indexed": true, "internalType": "address" }
//       ],
//       "anonymous": false
//   },
//   { "type": "error", "name": "AccessControlBadConfirmation", "inputs": [] },
//   {
//       "type": "error",
//       "name": "AccessControlUnauthorizedAccount",
//       "inputs": [
//           { "name": "account", "type": "address", "internalType": "address" },
//           { "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }
//       ]
//   },
//   { "type": "error", "name": "EnforcedPause", "inputs": [] },
//   { "type": "error", "name": "ExpectedPause", "inputs": [] },
//   { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
// ] as const

export const protocolAbi = [{"type":"constructor","inputs":[{"name":"_minInvestment","type":"uint256","internalType":"uint256"},{"name":"_protocolFee","type":"uint256","internalType":"uint256"},{"name":"_treasury","type":"address","internalType":"address"},{"name":"_witness","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"ADMIN_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"DEFAULT_ADMIN_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"RISK_ASSESSOR_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"_registerVault","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"},{"name":"vaultAddress","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"approveDeveloper","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"approveProject","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"cancelVaultProject","inputs":[{"name":"_projectId","type":"uint256","internalType":"uint256"},{"name":"_vaultAddress","type":"address","internalType":"address"},{"name":"reason","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"checkUserVerified","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"disburseVaultFunds","inputs":[{"name":"_vaultAddress","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getDeveloperInfo","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"tuple","internalType":"struct IProtocolRegistry.DeveloperInfo","components":[{"name":"developerAddress","type":"address","internalType":"address"},{"name":"companyName","type":"string","internalType":"string"},{"name":"registrationNumber","type":"string","internalType":"string"},{"name":"businessLicense","type":"string","internalType":"string"},{"name":"isApproved","type":"bool","internalType":"bool"},{"name":"isActive","type":"bool","internalType":"bool"},{"name":"registrationTime","type":"uint256","internalType":"uint256"},{"name":"totalProjectsCreated","type":"uint256","internalType":"uint256"},{"name":"totalProjectsCompleted","type":"uint256","internalType":"uint256"},{"name":"totalDefaulted","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getDeveloperProjects","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getProjectProposal","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple","internalType":"struct IProtocolRegistry.ProjectProposal","components":[{"name":"developer","type":"address","internalType":"address"},{"name":"projectName","type":"string","internalType":"string"},{"name":"location","type":"string","internalType":"string"},{"name":"estimatedBudget","type":"uint256","internalType":"uint256"},{"name":"requestedAmount","type":"uint256","internalType":"uint256"},{"name":"estimatedDuration","type":"uint256","internalType":"uint256"},{"name":"documents","type":"string","internalType":"string"},{"name":"status","type":"uint8","internalType":"enum IProtocolRegistry.ProjectStatus"},{"name":"aiRiskGrade","type":"string","internalType":"string"},{"name":"aiRiskScore","type":"uint256","internalType":"uint256"},{"name":"targetAPY","type":"uint256","internalType":"uint256"},{"name":"proposalTime","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getRoleAdmin","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"getTotalProjects","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getVaultAddress","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"grantRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"hasRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"isDeveloperActive","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"isDeveloperApproved","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"isVerified","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"minInvestment","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"pause","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"paused","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"projectToVault","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"proposeProject","inputs":[{"name":"input","type":"tuple","internalType":"struct IProtocolRegistry.ProjectInput","components":[{"name":"projectName","type":"string","internalType":"string"},{"name":"location","type":"string","internalType":"string"},{"name":"estimatedBudget","type":"uint256","internalType":"uint256"},{"name":"requestedAmount","type":"uint256","internalType":"uint256"},{"name":"estimatedDuration","type":"uint256","internalType":"uint256"},{"name":"documents","type":"string","internalType":"string"},{"name":"status","type":"uint8","internalType":"enum IProtocolRegistry.ProjectStatus"},{"name":"aiRiskGrade","type":"string","internalType":"string"},{"name":"aiRiskScore","type":"uint256","internalType":"uint256"},{"name":"targetAPY","type":"uint256","internalType":"uint256"}]}],"outputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"protocolFee","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"reactivateDeveloper","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"recordProjectCompletion","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"recordProjectDefault","inputs":[{"name":"developer","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"registerDeveloper","inputs":[{"name":"companyName","type":"string","internalType":"string"},{"name":"registrationNumber","type":"string","internalType":"string"},{"name":"businessLicense","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"rejectProject","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"},{"name":"reason","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"renounceRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"callerConfirmation","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"revokeRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"riskOracle","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"setMinInvestment","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setProtocolFee","inputs":[{"name":"bps","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setRiskOracle","inputs":[{"name":"_oracle","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setTreasury","inputs":[{"name":"_treasury","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setVaultFactory","inputs":[{"name":"_factory","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"suspendDeveloper","inputs":[{"name":"developer","type":"address","internalType":"address"},{"name":"reason","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"treasury","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"unpause","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateAIRiskAssessment","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"},{"name":"riskGrade","type":"string","internalType":"string"},{"name":"riskScore","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateProject","inputs":[{"name":"projectId_","type":"uint256","internalType":"uint256"},{"name":"projectName","type":"string","internalType":"string"},{"name":"location","type":"string","internalType":"string"},{"name":"estimatedBudget","type":"uint256","internalType":"uint256"},{"name":"requestedAmount","type":"uint256","internalType":"uint256"},{"name":"estimatedDuration","type":"uint256","internalType":"uint256"},{"name":"documents","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"vaultFactory","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"verifyProof","inputs":[{"name":"claimId","type":"bytes32","internalType":"bytes32"},{"name":"signature","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"witness","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"event","name":"DeveloperApproved","inputs":[{"name":"developer","type":"address","indexed":true,"internalType":"address"},{"name":"approver","type":"address","indexed":true,"internalType":"address"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"DeveloperRegistered","inputs":[{"name":"developer","type":"address","indexed":true,"internalType":"address"},{"name":"companyName","type":"string","indexed":false,"internalType":"string"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"DeveloperSuspended","inputs":[{"name":"developer","type":"address","indexed":true,"internalType":"address"},{"name":"reason","type":"string","indexed":false,"internalType":"string"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Paused","inputs":[{"name":"account","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProjectApproved","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"approver","type":"address","indexed":true,"internalType":"address"},{"name":"riskGrade","type":"string","indexed":false,"internalType":"string"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ProjectCancelled","inputs":[{"name":"_projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"_vaultAddress","type":"address","indexed":true,"internalType":"address"},{"name":"reason","type":"string","indexed":false,"internalType":"string"},{"name":"status","type":"uint8","indexed":false,"internalType":"enum IProtocolRegistry.ProjectStatus"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ProjectProposed","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"developer","type":"address","indexed":true,"internalType":"address"},{"name":"projectName","type":"string","indexed":false,"internalType":"string"},{"name":"requestedAmount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ProjectRejected","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"reason","type":"string","indexed":false,"internalType":"string"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ProjectUpdated","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"developer","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleAdminChanged","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"previousAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"newAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"RoleGranted","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleRevoked","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"Unpaused","inputs":[{"name":"account","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"VaultCreated","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"vaultAddress","type":"address","indexed":true,"internalType":"address"},{"name":"developer","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"VaultDisbursed","inputs":[{"name":"_projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"_vaultAddress","type":"address","indexed":true,"internalType":"address"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"AccessControlBadConfirmation","inputs":[]},{"type":"error","name":"AccessControlUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"neededRole","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"ECDSAInvalidSignature","inputs":[]},{"type":"error","name":"ECDSAInvalidSignatureLength","inputs":[{"name":"length","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ECDSAInvalidSignatureS","inputs":[{"name":"s","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"EnforcedPause","inputs":[]},{"type":"error","name":"ExpectedPause","inputs":[]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}] as const;