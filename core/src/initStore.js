import { store } from './store'
import { doLoadConfigFromAPI } from './redux/config/config-actions'
import { doInitWorkers, doLoadNodeConfig } from './redux/app/app-actions'
import { doLoadNotificationConfig } from './redux/user/user-actions'
import { initApi } from 'qortal-ui-crypto'
import './persistState'

initApi(store)

const workerInitChecker = () => {
	const state = store.getState()

	if (store.getState().app.nodeConfig.knownNodes.length === 0) {
		store.dispatch(doLoadNodeConfig())
	}

	if (state.config.loaded) {
		store.dispatch(doLoadNodeConfig())

		if (state.app.workers.ready) {
			workerInitSubscription()
		} else {
			if (!state.app.workers.loading) store.dispatch(doInitWorkers(state.config.crypto.kdfThreads, state.config.user.constants.workerURL))
		}
	}
}

workerInitChecker()

const workerInitSubscription = store.subscribe(workerInitChecker)

if (!store.getState().config.loaded) {
	store.dispatch(doLoadConfigFromAPI())
	store.dispatch(doLoadNodeConfig())
}

if (!store.getState().user.loaded) {
	store.dispatch(doLoadNotificationConfig())
}