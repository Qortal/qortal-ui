import PaymentTransaction from './PaymentTransaction'
import RegisterNameTransaction from './names/RegisterNameTransaction'
import UpdateNameTransaction from './names/UpdateNameTransaction'
import SellNameTransacion from './names/SellNameTransacion'
import CancelSellNameTransacion from './names/CancelSellNameTransacion'
import BuyNameTransacion from './names/BuyNameTransacion'
import MessageTransaction from './MessageTransaction'
import ChatTransaction from './chat/ChatTransaction'
import GroupChatTransaction from './chat/GroupChatTransaction'
import PublicizeTransaction from './PublicizeTransaction'
import CreateGroupTransaction from './groups/CreateGroupTransaction'
import UpdateGroupTransaction from './groups/UpdateGroupTransaction'
import AddGroupAdminTransaction from './groups/AddGroupAdminTransaction'
import RemoveGroupAdminTransaction from './groups/RemoveGroupAdminTransaction'
import GroupBanTransaction from './groups/GroupBanTransaction'
import CancelGroupBanTransaction from './groups/CancelGroupBanTransaction'
import GroupKickTransaction from './groups/GroupKickTransaction'
import GroupInviteTransaction from './groups/GroupInviteTransaction'
import CancelGroupInviteTransaction from './groups/CancelGroupInviteTransaction'
import JoinGroupTransaction from './groups/JoinGroupTransaction'
import LeaveGroupTransaction from './groups/LeaveGroupTransaction'
import RewardShareTransaction from './reward-share/RewardShareTransaction'
import RemoveRewardShareTransaction from './reward-share/RemoveRewardShareTransaction'
import TransferPrivsTransaction from './TransferPrivsTransaction'
import DeployAtTransaction from './DeployAtTransaction'
import VoteOnPollTransaction from './polls/VoteOnPollTransaction'
import CreatePollTransaction from './polls/CreatePollTransaction'

export const transactionTypes = {
	2: PaymentTransaction,
	3: RegisterNameTransaction,
	4: UpdateNameTransaction,
	5: SellNameTransacion,
	6: CancelSellNameTransacion,
	7: BuyNameTransacion,
	8: CreatePollTransaction,
	9: VoteOnPollTransaction,
	16: DeployAtTransaction,
	17: MessageTransaction,
	18: ChatTransaction,
	181: GroupChatTransaction,
	19: PublicizeTransaction,
	22: CreateGroupTransaction,
	23: UpdateGroupTransaction,
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
