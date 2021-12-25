"use strict";
// This needs a total makeover. 

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

    21: 'AT',

    22: 'Create group',
    23: 'Update group',
    24: 'Add group admin',
    25: 'Remove group admin',
    26: 'Group ban',
    27: 'Cancel group ban',
    28: 'Group kick',
    29: 'Group invite',
    30: 'Cancel group invite',
    31: 'Join group',
    32: 'Leave group',
    33: 'Group approval',
    34: 'Set group',

    35: 'Update asset',

    36: 'Account flags',

    37: 'Enable forging',
    38: 'Reward share',
    39: 'Account level',
}

// Qortal errors
// OK(1),
// INVALID_ADDRESS(2),
// NEGATIVE_AMOUNT(3),
// NEGATIVE_FEE(4),
// NO_BALANCE(5),
// INVALID_REFERENCE(6),
// INVALID_NAME_LENGTH(7),
// INVALID_VALUE_LENGTH(8),
// NAME_ALREADY_REGISTERED(9),
// NAME_DOES_NOT_EXIST(10),
// INVALID_NAME_OWNER(11),
// NAME_ALREADY_FOR_SALE(12),
// NAME_NOT_FOR_SALE(13),
// BUYER_ALREADY_OWNER(14),
// INVALID_AMOUNT(15),
// INVALID_SELLER(16),
// NAME_NOT_LOWER_CASE(17),
// INVALID_DESCRIPTION_LENGTH(18),
// INVALID_OPTIONS_COUNT(19),
// INVALID_OPTION_LENGTH(20),
// DUPLICATE_OPTION(21),
// POLL_ALREADY_EXISTS(22),
// POLL_DOES_NOT_EXIST(24),
// POLL_OPTION_DOES_NOT_EXIST(25),
// ALREADY_VOTED_FOR_THAT_OPTION(26),
// INVALID_DATA_LENGTH(27),

// INVALID_QUANTITY(28),
// ASSET_DOES_NOT_EXIST(29),
// INVALID_RETURN(30),
// HAVE_EQUALS_WANT(31),
// ORDER_DOES_NOT_EXIST(32),
// INVALID_ORDER_CREATOR(33),
// INVALID_PAYMENTS_COUNT(34),
// NEGATIVE_PRICE(35),
// INVALID_CREATION_BYTES(36),
// INVALID_TAGS_LENGTH(37),
// INVALID_AT_TYPE_LENGTH(38),

// INVALID_AT_TRANSACTION(39),

// INSUFFICIENT_FEE(40),
// ASSET_DOES_NOT_MATCH_AT(41),
// ASSET_ALREADY_EXISTS(43),
// MISSING_CREATOR(44),
// TIMESTAMP_TOO_OLD(45),
// TIMESTAMP_TOO_NEW(46),
// TOO_MANY_UNCONFIRMED(47),
// GROUP_ALREADY_EXISTS(48),
// GROUP_DOES_NOT_EXIST(49),
// INVALID_GROUP_OWNER(50),
// ALREADY_GROUP_MEMBER(51),
// GROUP_OWNER_CANNOT_LEAVE(52),
// NOT_GROUP_MEMBER(53),
// ALREADY_GROUP_ADMIN(54),
// NOT_GROUP_ADMIN(55),
// INVALID_LIFETIME(56),
// INVITE_UNKNOWN(57),
// BAN_EXISTS(58),
// BAN_UNKNOWN(59),
// BANNED_FROM_GROUP(60),
// JOIN_REQUEST_EXISTS(61),
// INVALID_GROUP_APPROVAL_THRESHOLD(62),
// GROUP_ID_MISMATCH(63),
// INVALID_GROUP_ID(64),
// TRANSACTION_UNKNOWN(65),
// TRANSACTION_ALREADY_CONFIRMED(66),
// INVALID_TX_GROUP_ID(67),
// TX_GROUP_ID_MISMATCH(68),
// MULTIPLE_NAMES_FORBIDDEN(69),
// INVALID_ASSET_OWNER(70),
// AT_IS_FINISHED(71),
// NO_FLAG_PERMISSION(72),
// NOT_MINTING_ACCOUNT(73),
// INVALID_REWARD_SHARE_PERCENT(77),
// PUBLIC_KEY_UNKNOWN(78),
// INVALID_PUBLIC_KEY(79),
// AT_UNKNOWN(80),
// AT_ALREADY_EXISTS(81),
// GROUP_APPROVAL_NOT_REQUIRED(82),
// GROUP_APPROVAL_DECIDED(83),
// MAXIMUM_REWARD_SHARES(84),
// TRANSACTION_ALREADY_EXISTS(85),
// NO_BLOCKCHAIN_LOCK(86),
// ORDER_ALREADY_CLOSED(87),
// CLOCK_NOT_SYNCED(88),
// ASSET_NOT_SPENDABLE(89),
// ACCOUNT_CANNOT_REWARD_SHARE(90),
// NOT_YET_RELEASED(1000);

const ERROR_CODES = {
    1: "Valid OK",
    2: "Invalid address",
    3: "Negative amount",
    4: "Nagative fee",
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

    39: 'Invalid AT transaction',

    40: "Insufficient fee",

    41: "Asset does not match AT",

    43: 'Asset already exists',
    44: 'Missing creator',
    45: 'Timestamp too old',
    46: 'Timestamp too new',
    47: 'Too many unconfirmed',
    48: 'Group already exists',
    49: 'Group does not exist',
    50: 'Invalid group owner',
    51: 'Already group memeber',
    52: 'Group owner can not leave',
    53: 'Not group member',
    54: 'Already group admin',
    55: 'Not group admin',
    56: 'Invalid lifetime',
    57: 'Invite unknown',
    58: 'Ban exists', // total crap mistakes by the nigerian scammer
    59: 'Ban unknown', // its fucking Ban not Ben
    60: 'Banned from group',
    61: 'Join request',
    62: 'Invalid group approval threshold',
    63: 'Group ID mismatch',
    64: 'Invalid group ID',
    65: 'Transaction unknown',
    66: 'Transaction already confirmed',
    67: 'Invalid TX group',
    68: 'TX group ID mismatch',
    69: 'Multiple names forbidden',
    70: 'Invalid asset owner',
    71: 'AT is finished',
    72: 'No flag permission',
    73: 'Not minting accout',

    77: 'Invalid rewardshare percent',
    78: 'Public key unknown',
    79: 'Invalid public key',
    80: 'AT unknown',
    81: 'AT already exists',
    82: 'Group approval not required',
    83: 'Group approval decided',
    84: 'Maximum reward shares',
    85: 'Transaction already exists',
    86: 'No blockchain lock',
    87: 'Order already closed',
    88: 'Clock not synced',
    89: 'Asset not spendable',
    90: 'Account can not reward share',

    1000: "Not yet released."
}

const QORT_DECIMALS = 1e8

const PROXY_URL = "/proxy/" // Proxy for api calls

const ADDRESS_VERSION = 58;  // Q for Qora
// const ADDRESS_VERSION = 46;  // K for Karma

// Used as a salt for all qora addresses. Salts used for storing your private keys in local storage will be randomly generated
const STATIC_SALT = new Uint8Array([54, 190, 201, 206, 65, 29, 123, 129, 147, 231, 180, 166, 171, 45, 95, 165, 78, 200, 208, 194, 44, 207, 221, 146, 45, 238, 68, 68, 69, 102, 62, 6])
const BCRYPT_ROUNDS = 10 // Remember that the total work spent on key derivation is BCRYPT_ROUNDS * KDF_THREADS
const BCRYPT_VERSION = "2a"
const STATIC_BCRYPT_SALT = `$${BCRYPT_VERSION}$${BCRYPT_ROUNDS}$IxVE941tXVUD4cW0TNVm.O`
// const PBKDF2_ROUNDS = Math.pow(2,17) // Deprecated

const KDF_THREADS = 16 // 16 Threads seems like a good number :) . No you dumbass nigerian. Its not ! -_-

export { TX_TYPES, ERROR_CODES, QORT_DECIMALS, PROXY_URL, STATIC_SALT, ADDRESS_VERSION, KDF_THREADS, STATIC_BCRYPT_SALT }

//const TX_TYPES =  {
//    GENESIS_TRANSACTION: 1,
//    PAYMENT_TRANSACTION: 2,
//
//    REGISTER_NAME_TRANSACTION: 3,
//    UPDATE_NAME_TRANSACTION: 4,
//    SELL_NAME_TRANSACTION: 5,
//    CANCEL_SELL_NAME_TRANSACTION: 6,
//    BUY_NAME_TRANSACTION: 7,
//
//    CREATE_POLL_TRANSACTION: 8,
//    VOTE_ON_POLL_TRANSACTION: 9,
//
//    ARBITRARY_TRANSACTION: 10,
//
//    ISSUE_ASSET_TRANSACTION: 11,
//    TRANSFER_ASSET_TRANSACTION: 12,
//    CREATE_ORDER_TRANSACTION: 13,
//    CANCEL_ORDER_TRANSACTION: 14,
//    MULTI_PAYMENT_TRANSACTION: 15,
//
//    DEPLOY_AT_TRANSACTION: 16,
//
//    MESSAGE_TRANSACTION: 17
//};