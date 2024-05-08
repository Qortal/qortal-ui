import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { setNewTab } from '../../redux/app/app-actions'
import { get } from '../../../translate'
import { beginnerChecklistStyles } from '../../styles/core-css'
import ShortUniqueId from 'short-unique-id'
import '../notification-view/popover'
import '../../../../plugins/plugins/core/components/TimeAgo'
import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@vaadin/item'
import '@vaadin/list-box'

class BeginnerChecklist extends connect(store)(LitElement) {
	static get properties() {
		return {
			notifications: { type: Array },
			showChecklist: { type: Boolean },
			isSynced: { type: Boolean },
			hasName: { type: Boolean },
			hasTourFinished: { type: Boolean },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [beginnerChecklistStyles]
	}

	constructor() {
		super()
		this.showChecklist = false
		this.initialFetch = false
		this.isSynced = false
		this.hasName = null
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
		this.hasTourFinished = null
		this._controlTourFinished = this._controlTourFinished.bind(this)
		this.uid = new ShortUniqueId()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return this.hasName === false || this.hasTourFinished === false ?
			html`
				<div class="layout">
					<popover-component for="popover-checklist" message=${get('tour.tour16')}></popover-component>
					<div id="popover-checklist" @click=${() => this._toggleChecklist()}>
						<mwc-icon id="checklist-general-icon" style=${`color: ${!this.hasName ? 'red' : 'var(--black)'}; cursor:pointer;user-select:none`}>
							checklist
						</mwc-icon>
						<vaadin-tooltip for="checklist-general-icon" position="bottom" hover-delay=${400} hide-delay=${1} text=${get('tour.tour16')}></vaadin-tooltip>
					</div>
					<div id="checklist-panel" class="popover-panel" style="visibility:${this.showChecklist ? 'visibile' : 'hidden'}" tabindex="0" @blur=${this.handleBlur}>
						<div class="list">
							<div class="task-list-item">
								<p>Are you synced?</p>
								${this.syncPercentage === 100 ?
									html`
										<mwc-icon id="checklist-general-icon" style="color: green; user-select:none">
											task_alt
										</mwc-icon>
									`
									: html`
										<mwc-icon id="checklist-general-icon" style="color: red; user-select:none">
											radio_button_unchecked
										</mwc-icon>
									`
								}
							</div>
							<div
								class="task-list-item"
								style="cursor:pointer"
								@click=${() => {
									store.dispatch(
										setNewTab({
											url: `group-management`,
											id: this.uid.rnd(),
											myPlugObj: {
												url: 'name-registration',
												domain: 'core',
												page: 'name-registration/index.html',
												title: 'Name Registration',
												icon: 'vaadin:user-check',
												mwcicon: 'manage_accounts',
												pluginNumber: 'plugin-qCmtXAQmtu',
												menus: [],
												parent: false
											},
											openExisting: true
										})
									);
									this.handleBlur();
								}}
							>
								<p>Do you have a name registered?</p>
								${this.hasName ?
									html`
										<mwc-icon id="checklist-general-icon" style="color: green; user-select:none">
											task_alt
										</mwc-icon>
									` : html`
										<mwc-icon id="checklist-general-icon" style="color: red; user-select:none">
											radio_button_unchecked
										</mwc-icon>
									`
								}
							</div>
						</div>
					</div>
				</div>
			`
		: ''
	}

	firstUpdated() {
		this.address = store.getState().app.selectedAddress.address
		this.hasTourFinished = JSON.parse(localStorage.getItem(`hasViewedTour-${this.address}`) || 'null')
	}

	_controlTourFinished() {
		this.hasTourFinished = true
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('send-tour-finished', this._controlTourFinished)
	}

	disconnectedCallback() {
		window.removeEventListener('send-tour-finished', this._controlTourFinished)
		super.disconnectedCallback()
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
	}

	async getName(recipient) {
		try {
			if (!recipient) return ''

			const endpoint = `${this.nodeUrl}/names/address/${recipient}`
			const res = await fetch(endpoint)
			const getNames = await res.json()

			this.hasName = Array.isArray(getNames) && getNames.length > 0
		} catch (error) {
			return ''
		}
	}

	stateChanged(state) {
		if (state.app.nodeStatus && state.app.nodeStatus.syncPercent !== this.syncPercentage) {
			this.syncPercentage = state.app.nodeStatus.syncPercent

			if (!this.hasAttempted && state.app.selectedAddress && state.app.nodeStatus.syncPercent === 100) {
				this.hasAttempted = true
				this.getName(state.app.selectedAddress.address)
			}
		}

		if (state.app.accountInfo &&
			state.app.accountInfo.names.length && state.app.nodeStatus && state.app.nodeStatus.syncPercent === 100 &&
			this.hasName === false && this.hasAttempted && state.app.accountInfo && state.app.accountInfo.names &&
			state.app.accountInfo.names.length > 0
		) {
			this.hasName = true
		}
	}

	handleBlur() {
		setTimeout(() => {
			if (!this.shadowRoot.contains(document.activeElement)) {
				this.showChecklist = false
			}
		}, 0)
	}

	_toggleChecklist() {
		this.showChecklist = !this.showChecklist

		if (this.showChecklist) {
			requestAnimationFrame(() => {
				this.shadowRoot.getElementById('checklist-panel').focus()
			})
		}
	}

	// Standard functions
	getApiKey() {
		const coreNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return coreNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('beginner-checklist', BeginnerChecklist)