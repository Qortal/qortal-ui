import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { translate } from '../../../translate'
import { friendsSidePanelParentStyles } from '../../styles/core-css'
import './friends-side-panel'
import '@material/mwc-icon'
import '@vaadin/tooltip'

class FriendsSidePanelParent extends connect(store)(LitElement) {
	static get properties() {
		return {
			isOpen: { type: Boolean },
			hasNewFeed: { type: Boolean }
		}
	}

	static get styles() {
		return [friendsSidePanelParentStyles]
	}

	constructor() {
		super()
		this.isOpen = false
		this.hasNewFeed = false
	}

	render() {
		return html`
			<mwc-icon
				id="friends-icon"
				@click=${() => {
					this.isOpen = !this.isOpen
					if (this.isOpen && this.hasNewFeed) {
						localStorage.setItem('lastSeenFeed', Date.now())
						this.hasNewFeed = false
						this.shadowRoot.querySelector("friends-side-panel").selected = 'feed'
					}
				}}
				style="color: ${this.hasNewFeed ? 'green' : 'var(--black)'}; cursor:pointer;user-select:none"
			>
				group
			</mwc-icon>
			<vaadin-tooltip
				for="friends-icon"
				position="bottom"
				hover-delay=${400}
				hide-delay=${1}
				text=${translate('friends.friend12')}
			></vaadin-tooltip>
			<friends-side-panel .setHasNewFeed=${(val) => this.setHasNewFeed(val)} ?isOpen=${this.isOpen} .setIsOpen=${(val) => this.isOpen = val}></friends-side-panel>
		`
	}

	firstUpdated() {
		// ...
	}

	setHasNewFeed(val) {
		this.hasNewFeed = val
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

window.customElements.define('friends-side-panel-parent', FriendsSidePanelParent)