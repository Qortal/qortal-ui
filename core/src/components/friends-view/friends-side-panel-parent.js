import {css, html, LitElement} from 'lit'
import '@material/mwc-icon'
import './friends-side-panel.js'
import '@vaadin/tooltip'
import {translate} from '../../../translate'

class FriendsSidePanelParent extends LitElement {
	static get properties() {
		return {
			isOpen: {type: Boolean},
			hasNewFeed: {type: Boolean}
		}
	}

	constructor() {
		super()
		this.isOpen = false
		this.hasNewFeed = false
	}

	static styles = css`
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16px;
			border-bottom: 1px solid #e0e0e0;
		}

		.content {
			padding: 16px;
		}
		.close {
			visibility: hidden;
			position: fixed;
			z-index: -100;
			right: -1000px;
		}

		.parent-side-panel {
			transform: translateX(100%); /* start from outside the right edge */
    		transition: transform 0.3s ease-in-out;
		}
		.parent-side-panel.open {
			transform: translateX(0); /* slide in to its original position */

		}
	`

	setHasNewFeed(val){
		this.hasNewFeed = val
	}

	render() {
		return html`
			<mwc-icon
				id="friends-icon"
				@click=${()=> {
					this.isOpen = !this.isOpen
					if(this.isOpen && this.hasNewFeed) {
						localStorage.setItem('lastSeenFeed', Date.now())
						this.hasNewFeed = false
						this.shadowRoot.querySelector("friends-side-panel").selected = 'feed'
					}
				}} style="color: ${this.hasNewFeed ? 'green' : 'var(--black)'}; cursor:pointer;user-select:none"
			>
				group
			</mwc-icon>
			<vaadin-tooltip
				for="friends-icon"
				position="bottom"
				hover-delay=${400}
				hide-delay=${1}
				text=${translate('friends.friend12')}
			>
			</vaadin-tooltip>
			<friends-side-panel .setHasNewFeed=${(val)=> this.setHasNewFeed(val)} ?isOpen=${this.isOpen} .setIsOpen=${(val)=> this.isOpen = val}></friends-side-panel>

		`
	}
}

customElements.define('friends-side-panel-parent', FriendsSidePanelParent)
