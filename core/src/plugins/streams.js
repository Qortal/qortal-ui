import { store } from '../store'
import { EpmlStream } from 'epml'

const LOGIN_STREAM_NAME = 'logged_in'
const CONFIG_STREAM_NAME = 'config'
const SELECTED_ADDRESS_STREAM_NAME = 'selected_address'
const APP_INFO_STATE = 'app_info_state'
const CHAT_HEADS_STREAM_NAME = 'chat_heads'
const NODE_CONFIG_STREAM_NAME = 'node_config'
const CHAT_LAST_SEEN = 'chat_last_seen'
const SIDE_EFFECT_ACTION = 'side_effect_action'
const PROFILE_DATA_ACTION = 'profile_data_action'
const COIN_BALANCES_ACTION = 'coin_balances'

export const loggedInStream = new EpmlStream(LOGIN_STREAM_NAME, () => store.getState().app.loggedIn)
export const configStream = new EpmlStream(CONFIG_STREAM_NAME, () => store.getState().config)
export const selectedAddressStream = new EpmlStream(SELECTED_ADDRESS_STREAM_NAME, () => store.getState().app.selectedAddress)
export const appInfoStateStream = new EpmlStream(APP_INFO_STATE, () => store.getState().app.appInfo)
export const chatHeadsStateStream = new EpmlStream(CHAT_HEADS_STREAM_NAME, () => store.getState().app.chatHeads)
export const nodeConfigStream = new EpmlStream(NODE_CONFIG_STREAM_NAME, () => store.getState().app.nodeConfig)
export const chatLastSeenStream = new EpmlStream(CHAT_LAST_SEEN, () => store.getState().app.chatLastSeen)
export const sideEffectActionStream = new EpmlStream(SIDE_EFFECT_ACTION, () => store.getState().app.sideEffectAction)
export const profileDataActionStream = new EpmlStream(SIDE_EFFECT_ACTION, () => store.getState().app.profileData)
export const coinBalancesActionStream = new EpmlStream(COIN_BALANCES_ACTION, () => store.getState().app.coinBalances)

let oldState = {
	app: {}
}

store.subscribe(() => {
	const state = store.getState()

	if (oldState.app.loggedIn !== state.app.loggedIn) {
		loggedInStream.emit(state.app.loggedIn)
	}

	if (oldState.config !== state.config) {
		configStream.emit(state.config)
	}

	if (oldState.app.nodeConfig !== state.app.nodeConfig) {
		nodeConfigStream.emit(state.app.nodeConfig)
	}

	if (oldState.app.chatLastSeen !== state.app.chatLastSeen) {
		chatLastSeenStream.emit(state.app.chatLastSeen)
	}

	if (oldState.app.selectedAddress !== state.app.selectedAddress) {
		selectedAddressStream.emit({
			address: state.app.selectedAddress.address,
			color: state.app.selectedAddress.color,
			nonce: state.app.selectedAddress.nonce,
			textColor: state.app.selectedAddress.textColor
		})
	}

	if (oldState.app.chatHeads !== state.app.chatHeads) {
		chatHeadsStateStream.emit(state.app.chatHeads)
	}

	if (oldState.app.appInfo !== state.app.appInfo) {
		appInfoStateStream.emit(state.app.appInfo)
	}
	if (oldState.app.sideEffectAction !== state.app.sideEffectAction) {
		sideEffectActionStream.emit(state.app.sideEffectAction)
	}
	if (oldState.app.profileDataActionStream !== state.app.profileDataActionStream) {
		profileDataActionStream.emit(state.app.profileData)
	}
	if (oldState.app.coinBalances !== state.app.coinBalances) {
		coinBalancesActionStream.emit(state.app.coinBalances)
	}

	oldState = state
})