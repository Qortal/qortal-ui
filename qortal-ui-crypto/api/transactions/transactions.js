import PaymentTransaction from './PaymentTransaction.js'
import RegisterNameTransaction from './names/RegisterNameTransaction.js'
import SellNameTransacion from './names/SellNameTransacion.js'
import CancelSellNameTransacion from './names/CancelSellNameTransacion.js'
import BuyNameTransacion from './names/BuyNameTransacion.js'
import MessageTransaction from './MessageTransaction.js'
import ChatTransaction from './chat/ChatTransaction.js'
import GroupChatTransaction from './chat/GroupChatTransaction.js'
import PublicizeTransaction from './PublicizeTransaction.js'
import CreateGroupTransaction from './groups/CreateGroupTransaction.js'
import AddGroupAdminTransaction from './groups/AddGroupAdminTransaction.js'
import RemoveGroupAdminTransaction from './groups/RemoveGroupAdminTransaction.js'
import GroupBanTransaction from './groups/GroupBanTransaction.js'
import CancelGroupBanTransaction from './groups/CancelGroupBanTransaction.js'
import GroupKickTransaction from './groups/GroupKickTransaction.js'
import GroupInviteTransaction from './groups/GroupInviteTransaction.js'
import CancelGroupInviteTransaction from './groups/CancelGroupInviteTransaction.js'
import JoinGroupTransaction from './groups/JoinGroupTransaction.js'
import LeaveGroupTransaction from './groups/LeaveGroupTransaction.js'
import RewardShareTransaction from './reward-share/RewardShareTransaction.js'
import RemoveRewardShareTransaction from './reward-share/RemoveRewardShareTransaction.js'
import TransferPrivsTransaction from './TransferPrivsTransaction.js'

export const transactionTypes = {
	2: PaymentTransaction,
	3: RegisterNameTransaction,
	5: SellNameTransacion,
	6: CancelSellNameTransacion,
	7: BuyNameTransacion,
	17: MessageTransaction,
	18: ChatTransaction,
	181: GroupChatTransaction,
	19: PublicizeTransaction,
	22: CreateGroupTransaction,
	24: AddGroupAdminTransaction,
	25: RemoveGroupAdminTransaction,
	26: GroupBanTransaction,
	27: CancelGroupBanTransaction,
	28: GroupKickTransaction,
	29: GroupInviteTransaction,
	30: CancelGroupInviteTransaction,
	31: JoinGroupTransaction,
	32: LeaveGroupTransaction,
	38: RewardShareTransaction,
	381: RemoveRewardShareTransaction,
	40: TransferPrivsTransaction
}
