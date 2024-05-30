import { NAVIGATE, NETWORK_CONNECTION_STATUS } from './app-action-types'

export * from './actions/login'
export * from './actions/init-worker'
export * from './actions/plugins'
export * from './actions/app-core'
export * from './actions/node-config'

export const doNavigate = loca => {
	return (dispatch, getState) => {
		dispatch(navigate(loca))
	}
}

const navigate = loca => {
	return {
		type: NAVIGATE,
		url: loca.pathname
	}
}

export const updateNetworkConnectionStatus = status => {
	return {
		type: NETWORK_CONNECTION_STATUS,
		payload: status
	}
}