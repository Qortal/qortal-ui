import { store } from '../store.js'
import { EpmlStream } from 'epml'

const LOGIN_STREAM_NAME = 'logged_in'
const CONFIG_STREAM_NAME = 'config'
const SELECTED_ADDRESS_STREAM_NAME = 'selected_address'
// const APP_INFO_STATE = 'app_info_state'
const CHAT_HEADS_STREAM_NAME = 'chat_heads'
const NODE_CONFIG_STREAM_NAME = 'node_config'
const COPY_MENU_SWITCH = 'copy_menu_switch'
const FRAME_PASTE_MENU_SWITCH = 'frame_paste_menu_switch'

export const loggedInStream = new EpmlStream(LOGIN_STREAM_NAME, () => store.getState().app.loggedIn)
export const configStream = new EpmlStream(CONFIG_STREAM_NAME, () => store.getState().config)
export const selectedAddressStream = new EpmlStream(SELECTED_ADDRESS_STREAM_NAME, () => store.getState().app.selectedAddress)
// export const appInfoStateStream = new EpmlStream(APP_INFO_STATE, () => store.getState().app.appInfo)
export const chatHeadsStateStream = new EpmlStream(CHAT_HEADS_STREAM_NAME, () => store.getState().app.chatHeads)
export const nodeConfigStream = new EpmlStream(NODE_CONFIG_STREAM_NAME, () => store.getState().app.nodeConfig)
export const copyMenuSwitchStream = new EpmlStream(COPY_MENU_SWITCH, () => store.getState().app.copyMenuSwitch)
export const framePasteMenuSwitchStream = new EpmlStream(FRAME_PASTE_MENU_SWITCH, () => store.getState().app.framePasteMenuSwitch)


let oldState = {
    app: {}
}

store.subscribe(() => {
    const state = store.getState()

    if (oldState.app.loggedIn !== state.app.loggedIn) {
        loggedInStream.emit(state.app.loggedIn)
    }
    // This one may be a little on the heavy side...AHHH, NEED TO MOVE STORAGE OF ENCRYPTED SEED. DONE <3
    if (oldState.config !== state.config) {
        configStream.emit(state.config)
    }

    if (oldState.app.nodeConfig !== state.app.nodeConfig) {
        nodeConfigStream.emit(state.app.nodeConfig)
    }

    if (oldState.app.copyMenuSwitch !== state.app.copyMenuSwitch) {
        copyMenuSwitchStream.emit(state.app.copyMenuSwitch)
    }

    if (oldState.app.framePasteMenuSwitch !== state.app.framePasteMenuSwitch) {
        framePasteMenuSwitchStream.emit(state.app.framePasteMenuSwitch)
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

    // if (oldState.app.appInfo !== state.app.appInfo) {
    //     appInfoStateStream.emit(state.app.appInfo)
    // }
    oldState = state
})
