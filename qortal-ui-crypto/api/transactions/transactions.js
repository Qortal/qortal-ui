import PaymentTransaction from './PaymentTransaction.js'
import MessageTransaction from './MessageTransaction.js'
import RegisterNameTransaction from './names/RegisterNameTransaction.js'
import ChatTransaction from './chat/ChatTransaction.js'
import GroupChatTransaction from './chat/GroupChatTransaction.js';
import RewardShareTransaction from './reward-share/RewardShareTransaction.js'
import RemoveRewardShareTransaction from './reward-share/RemoveRewardShareTransaction.js'
import CreateGroupTransaction from './groups/CreateGroupTransaction.js';
import JoinGroupTransaction from './groups/JoinGroupTransaction.js'
import UpdateGroupTransaction from './groups/UpdateGroupTransaction.js'
import LeaveGroupTransaction from './groups/LeaveGroupTransaction.js'
import PublicizeTransaction from './PublicizeTransaction.js'
import AddGroupAdminTransaction from './groups/AddGroupAdminTransaction.js'
import RemoveGroupAdminTransaction from './groups/RemoveGroupAdminTransaction.js'

export const transactionTypes = {
    2: PaymentTransaction,
    3: RegisterNameTransaction,
    17: MessageTransaction,
    18: ChatTransaction,
    181: GroupChatTransaction,
    19: PublicizeTransaction,
    22: CreateGroupTransaction,
    23: UpdateGroupTransaction,
    24: AddGroupAdminTransaction,
    25: RemoveGroupAdminTransaction,
    31: JoinGroupTransaction,
    32: LeaveGroupTransaction,
    38: RewardShareTransaction,
    381: RemoveRewardShareTransaction
}
