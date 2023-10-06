import { LitElement, html, css } from 'lit';
import '@material/mwc-icon';
import './friends-side-panel.js';
class FriendsSidePanelParent extends LitElement {
	static get properties() {
		return {
			isOpen: {type: Boolean}
		};
	}
	

	constructor() {
		super();
		this.isOpen = false
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
	`;

	render() {
		return html`
			<mwc-icon @click=${()=> {
				this.isOpen = !this.isOpen
			}} style="color: var(--black); cursor:pointer"
				>group</mwc-icon
			>
			<friends-side-panel ?isOpen=${this.isOpen} .setIsOpen=${(val)=> this.isOpen = val}></friends-side-panel>
			
			
		`;
	}


}

customElements.define('friends-side-panel-parent', FriendsSidePanelParent);
