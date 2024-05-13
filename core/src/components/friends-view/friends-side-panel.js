import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { translate } from '../../../translate'
import { friendsSidePanelStyles } from '../../styles/core-css'
import './friends-view'
import './friends-feed'
import '@material/mwc-icon'

class FriendsSidePanel extends connect(store)(LitElement) {
	static get properties() {
		return {
			setIsOpen: { attribute: false },
			isOpen: { type: Boolean },
			selected: { type: String },
			setHasNewFeed: { attribute: false },
			closeSidePanel: { attribute: false, type: Object },
			openSidePanel: { attribute: false, type: Object }
		}
	}

	static get styles() {
		return [friendsSidePanelStyles]
	}

	constructor() {
		super()
		this.selected = 'friends'
		this.closeSidePanel = this.closeSidePanel.bind(this)
		this.openSidePanel = this.openSidePanel.bind(this)
	}

	render() {
		return html`
			<div class="parent">
				<div class="header">
					<div style="display:flex;align-items:center;gap:10px">
						<span @click=${() => this.selected = 'friends'} class="${this.selected === 'friends' ? 'active' : 'default'}">${translate('friends.friend12')}</span>
						<span @click=${() => this.selected = 'feed'} class="${this.selected === 'feed' ? 'active' : 'default'}">${translate('friends.friend13')}</span>
					</div>
					<div style="display:flex;gap:15px;align-items:center">
						<mwc-icon @click=${() => { this.refreshFeed(); }} style="color: var(--black); cursor:pointer;">
							refresh
						</mwc-icon>
						<mwc-icon style="cursor:pointer" @click=${() => { this.setIsOpen(false); }}>
							close
						</mwc-icon>
					</div>
				</div>
				<div class="content">
					<div class="${this.selected === 'friends' ? 'active-content' : 'default-content'}">
						<friends-view .openSidePanel=${this.openSidePanel} .closeSidePanel=${this.closeSidePanel} .refreshFeed=${() => this.refreshFeed()}></friends-view>
					</div>
					<div class="${this.selected === 'feed' ? 'active-content' : 'default-content'}">
						<friends-feed .setHasNewFeed=${(val) => this.setHasNewFeed(val)}></friends-feed>
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		// ...
	}

	refreshFeed() {
		this.shadowRoot.querySelector('friends-feed').refresh()
	}

	closeSidePanel() {
		this.setIsOpen(false)
	}

	openSidePanel() {
		this.setIsOpen(true)
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

window.customElements.define('friends-side-panel', FriendsSidePanel)