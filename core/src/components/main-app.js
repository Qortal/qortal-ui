import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store'
import { installRouter } from 'pwa-helpers/router'
import { doNavigate } from '../redux/app/app-actions'
import { loadPlugins } from '../plugins/load-plugins'
import isElectron from 'is-electron'
import './login-view/login-view'
import './app-view'
import '../plugins/streams'
import '../styles/app-styles'

installRouter((location) => store.dispatch(doNavigate(location)))

class MainApp extends connect(store)(LitElement) {
	static get properties() {
		return {
			name: { type: String },
			loggedIn: { type: Boolean }
		}
	}

	render() {
		return html`${this.renderViews(this.loggedIn)}`
	}

	connectedCallback() {
		super.connectedCallback()
		this.initial = 0

		if (!isElectron()) {
		} else {
			window.addEventListener('contextmenu', (event) => {
				event.preventDefault()
				window.electronAPI.showMyMenu()
			})
		}
	}

	/**
	 * Dynamic renderViews method to introduce conditional rendering of views based on user's logged in state.
	 * @param {Boolean} isLoggedIn
	 */
	renderViews(isLoggedIn) {
		if (isLoggedIn) {
			return html`<app-view></app-view>`
		} else {
			return html`<login-view></login-view>`
		}
	}

	_loadPlugins() {
		loadPlugins()
	}

	stateChanged(state) {
		this.loggedIn = state.app.loggedIn
		if (this.loggedIn === true && this.initial === 0) {
			this.initial = this.initial + 1
			this._loadPlugins()
		}
		document.title = state.config.coin.name
	}
}

window.customElements.define('main-app', MainApp)