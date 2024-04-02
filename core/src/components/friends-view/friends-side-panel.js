import {css, html, LitElement} from 'lit';
import '@material/mwc-icon';
import './friends-view'
import './friends-feed'
import {translate} from '../../../translate'

class FriendsSidePanel extends LitElement {
    static get properties() {
		return {
			setIsOpen: { attribute: false},
			isOpen: {type: Boolean},
			selected: {type: String},
			setHasNewFeed: {attribute: false},
			closeSidePanel: {attribute: false, type: Object},
			openSidePanel: {attribute: false, type: Object}
		};
	}

	constructor(){
		super()
		this.selected = 'friends'
		this.closeSidePanel = this.closeSidePanel.bind(this)
		this.openSidePanel = this.openSidePanel.bind(this)

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
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			overflow: auto;
		}
		.content::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .content::-webkit-scrollbar {
        width: 12px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .content::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }
		.parent {
			display: flex;
			flex-direction: column;
			height: 100%;
		}

		.active {
			font-size: 16px;
    background: var(--black);
    color: var(--white);
    padding: 5px;
    border-radius: 2px;
	cursor: pointer;
		}

		.default {
			font-size: 16px;
    color: var(--black);
    padding: 5px;
    border-radius: 2px;
	cursor: pointer;
		}

		.default-content {
			visibility: hidden;
			position: absolute;
    z-index: -50;
		}

	`;

	refreshFeed(){

			this.shadowRoot.querySelector('friends-feed').refresh()


	}

	closeSidePanel(){
		this.setIsOpen(false)
	}
	openSidePanel(){
		this.setIsOpen(true)
	}

	render() {
		return html`
			<div class="parent">
			<div class="header">
				<div style="display:flex;align-items:center;gap:10px">
				<span @click=${()=> this.selected = 'friends'} class="${this.selected === 'friends' ? 'active' : 'default'}">${translate('friends.friend12')}</span>
				<span @click=${()=> this.selected = 'feed'} class="${this.selected === 'feed' ? 'active' : 'default'}">${translate('friends.friend13')}</span>
		</div>
		<div style="display:flex;gap:15px;align-items:center">
		<mwc-icon @click=${()=> {
                this.refreshFeed()
            }} style="color: var(--black); cursor:pointer;">refresh</mwc-icon>
				<mwc-icon style="cursor:pointer" @click=${()=> {
                    this.setIsOpen(false)
                }}>close</mwc-icon>
		</div>

			</div>
			<div class="content">
				<div class="${this.selected === 'friends' ? 'active-content' : 'default-content'}">
				<friends-view .openSidePanel=${this.openSidePanel} .closeSidePanel=${this.closeSidePanel} .refreshFeed=${()=>this.refreshFeed()}></friends-view>
				</div>
				<div class="${this.selected === 'feed' ? 'active-content' : 'default-content'}">
				<friends-feed .setHasNewFeed=${(val)=> this.setHasNewFeed(val)}></friends-feed>
				</div>



		</div>
			</div>
			</div>
		`;
	}

}

customElements.define('friends-side-panel', FriendsSidePanel);
