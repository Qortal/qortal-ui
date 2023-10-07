import { LitElement, html, css } from 'lit';
import '@material/mwc-icon';
import './friends-view'
import './friends-feed'
class FriendsSidePanel extends LitElement {
    static get properties() {
		return {
			setIsOpen: { attribute: false},
			isOpen: {type: Boolean}
		};
	}
	
	static styles = css`
		:host {
			display: block;
    position: fixed;
    top: 55px;
    right: 0px;
    width: 420px;
    max-width: 95%;
    height: calc(100vh - 55px);
    background-color: var(--white);
    border-left: 1px solid rgb(224, 224, 224);
    overflow-y: auto;
    z-index: 1;
	transform: translateX(100%); /* start from outside the right edge */
    		transition: transform 0.3s ease-in-out;
		}
		:host([isOpen]) {
			transform: unset; /* slide in to its original position */
    }

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
	`;

	render() {
		return html`
			<div class="header">
				<span>Panel Title</span>
				<mwc-icon style="cursor:pointer" @click=${()=> {
                    this.setIsOpen(false)
                }}>close</mwc-icon>
			</div>
			<div class="content">
            <friends-view></friends-view>
			<friends-feed></friends-feed>

		</div>
			</div>
		`;
	}

}

customElements.define('friends-side-panel', FriendsSidePanel);
