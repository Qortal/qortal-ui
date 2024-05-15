// Qortal TX types
const TX_TYPES = {
	1: "Genesis",
	2: "Payment",
	3: "Name registration",
	4: "Name update",
	5: "Sell name",
	6: "Cancel sell name",
	7: "Buy name",
	8: "Create poll",
	9: "Vote in poll",
	10: "Arbitrary",
	11: "Issue asset",
	12: "Transfer asset",
	13: "Create asset order",
	14: "Cancel asset order",
	15: "Multi-payment transaction",
	16: "Deploy AT",
	17: "Message",
	18: "Chat",
	19: "Publicize",
	20: "Airdrop",
	21: "AT",
	22: "Create group",
	23: "Update group",
	24: "Add group admin",
	25: "Remove group admin",
	26: "Group ban",
	27: "Cancel group ban",
	28: "Group kick",
	29: "Group invite",
	30: "Cancel group invite",
	31: "Join group",
	32: "Leave group",
	33: "Group approval",
	34: "Set group",
	35: "Update asset",
	36: "Account flags",
	37: "Enable forging",
	38: "Reward share",
	39: "Account level",
	40: "Transfer privs",
	41: "Presence"
}

// Qortal error codes
const ERROR_CODES = {
	1: "Valid OK",
	2: "Invalid address",
	3: "Negative amount",
	4: "Negative fee",
	5: "No balance",
	6: "Invalid reference",
	7: "Invalid time length",
	8: "Invalid value length",
	9: "Name already registered",
	10: "Name does not exist",
	11: "Invalid name owner",
	12: "Name already for sale",
	13: "Name not for sale",
	14: "Name buyer already owner",
	15: "Invalid amount",
	16: "Invalid seller",
	17: "Name not lowercase",
	18: "Invalid description length",
	19: "Invalid options length",
	20: "Invalid option length",
	21: "Duplicate option",
	22: "Poll already created",
	23: "Poll already has votes",
	24: "Poll does not exist",
	25: "Option does not exist",
	26: "Already voted for that option",
	27: "Invalid data length",
	28: "Invalid quantity",
	29: "Asset does not exist",
	30: "Invalid return",
	31: "Have equals want",
	32: "Order does not exist",
	33: "Invalid order creator",
	34: "Invalid payments length",
	35: "Negative price",
	36: "Invalid creation bytes",
	37: "Invalid tags length",
	38: "Invalid type length",
	39: "Invalid AT transaction",
	40: "Insufficient fee",
	41: "Asset does not match AT",

	43: "Asset already exists",
	44: "Missing creator",
	45: "Timestamp too old",
	46: "Timestamp too new",
	47: "Too many unconfirmed",
	48: "Group already exists",
	49: "Group does not exist",
	50: "Invalid group owner",
	51: "Already group member",
	52: "Group owner can not leave",
	53: "Not group member",
	54: "Already group admin",
	55: "Not group admin",
	56: "Invalid lifetime",
	57: "Invite unknown",
	58: "Ban exists",
	59: "Ban unknown",
	60: "Banned from group",
	61: "Join request",
	62: "Invalid group approval threshold",
	63: "Group ID mismatch",
	64: "Invalid group ID",
	65: "Transaction unknown",
	66: "Transaction already confirmed",
	67: "Invalid TX group",
	68: "TX group ID mismatch",
	69: "Multiple names forbidden",
	70: "Invalid asset owner",
	71: "AT is finished",
	72: "No flag permission",
	73: "Not minting accout",

	77: "Invalid rewardshare percent",
	78: "Public key unknown",
	79: "Invalid public key",
	80: "AT unknown",
	81: "AT already exists",
	82: "Group approval not required",
	83: "Group approval decided",
	84: "Maximum reward shares",
	85: "Transaction already exists",
	86: "No blockchain lock",
	87: "Order already closed",
	88: "Clock not synced",
	89: "Asset not spendable",
	90: "Account can not reward share",
	91: "Self share exists",
	92: "Account already exists",
	93: "Invalid group block delay",
	94: "Incorrect nonce",
	95: "Invalid timestamp signature",
	96: "Address blocked",
	97: "Name blocked",
	98: "Group approval required",
	99: "Account not transferable",
	100: "Transfer privs disabled",
	101: "Name registration temporary disabled",

	999: "Invalid but OK",
	1000: "Not yet released",
	1001: "Not supported"
}

// Qortal 8 decimals
const QORT_DECIMALS = 1e8

// Q for Qortal
const ADDRESS_VERSION = 58

// Proxy for api calls
const PROXY_URL = "/proxy/"

// Chat reference timestamp
const CHAT_REFERENCE_FEATURE_TRIGGER_TIMESTAMP = 1674316800000

// Dynamic fee timestamp
const DYNAMIC_FEE_TIMESTAMP = 1692118800000


// Used as a salt for all Qora addresses. Salts used for storing your private keys in local storage will be randomly generated
const STATIC_SALT = new Uint8Array([54, 190, 201, 206, 65, 29, 123, 129, 147, 231, 180, 166, 171, 45, 95, 165, 78, 200, 208, 194, 44, 207, 221, 146, 45, 238, 68, 68, 69, 102, 62, 6])
const BCRYPT_ROUNDS = 10 // Remember that the total work spent on key derivation is BCRYPT_ROUNDS * KDF_THREADS
const BCRYPT_VERSION = "2a"
const STATIC_BCRYPT_SALT = `$${BCRYPT_VERSION}$${BCRYPT_ROUNDS}$IxVE941tXVUD4cW0TNVm.O`
const KDF_THREADS = 16

export { TX_TYPES, ERROR_CODES, QORT_DECIMALS, PROXY_URL, STATIC_SALT, ADDRESS_VERSION, KDF_THREADS, STATIC_BCRYPT_SALT, CHAT_REFERENCE_FEATURE_TRIGGER_TIMESTAMP, DYNAMIC_FEE_TIMESTAMP }
