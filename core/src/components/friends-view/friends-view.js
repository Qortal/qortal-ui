import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import { connect } from 'pwa-helpers';

import '@material/mwc-button';
import '@material/mwc-dialog';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@polymer/paper-progress/paper-progress.js';
import '@material/mwc-icon';
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/button';
import './ChatSideNavHeads';
import '../../../../plugins/plugins/core/components/ChatSearchResults'
import './add-friends-modal'

import {
	use,
	get,
	translate,
	translateUnsafeHTML,
	registerTranslateConfig,
} from 'lit-translate';
import { store } from '../../store';
import { friendsViewStyles } from './friends-view-css';
import { parentEpml } from '../show-plugin';

class FriendsView extends connect(store)(LitElement) {
	static get properties() {
		return {
			error: { type: Boolean },
			toggle: { attribute: false },
			userName: { type: String },
			errorMessage: { type: String },
			successMessage: { type: String },
			setUserName: { attribute: false },
			friendList: { type: Array },
			userSelected: { type: Object },
			isLoading: {type: Boolean},
			userFoundModalOpen: {type: Boolean},
			userFound: { type: Array},
			isOpenAddFriendsModal: {type: Boolean},
			editContent: {type: Object}
		};
	}
	static get styles() {
		return [friendsViewStyles];
	}

	constructor() {
		super();
		this.error = false;
		this.observerHandler = this.observerHandler.bind(this);
		this.viewElement = '';
		this.downObserverElement = '';
		this.myAddress =
			window.parent.reduxStore.getState().app.selectedAddress.address;
		this.errorMessage = '';
		this.successMessage = '';
		this.friendList = [{
		
				name: "Phil"
			
		}];
		this.userSelected = {};
		this.isLoading = false;
		this.userFoundModalOpen = false
		this.userFound = [];
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.isOpenAddFriendsModal = false
		this.editContent = null
		this.addToFriendList = this.addToFriendList.bind(this)
	}

	getNodeUrl() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}
	getMyNode() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode;
	}

	getMoreFriends() {}

	firstUpdated() {
		this.viewElement = this.shadowRoot.getElementById('viewElement');
		this.downObserverElement =
			this.shadowRoot.getElementById('downObserver');
		this.elementObserver();
	}

	elementObserver() {
		const options = {
			root: this.viewElement,
			rootMargin: '0px',
			threshold: 1,
		};
		// identify an element to observe
		const elementToObserve = this.downObserverElement;
		// passing it a callback function
		const observer = new IntersectionObserver(
			this.observerHandler,
			options
		);
		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve);
	}

	observerHandler(entries) {
		if (!entries[0].isIntersecting) {
			return;
		} else {
			if (this.friendList.length < 20) {
				return;
			}
			this.getMoreFriends();
		}
	}

	async userSearch() {
		const nameValue = this.shadowRoot.getElementById('sendTo').value
			if(!nameValue) {
				this.userFound = []
				this.userFoundModalOpen = true
				return;
			}
			try {
				const url = `${this.nodeUrl}/names/${nameValue}`
				const res = await fetch(url) 
				const result = await res.json()
				if (result.error === 401) {
					this.userFound = []
				} else {
					this.userFound = [
						...this.userFound, 
						result,
					  ];
				}
				this.userFoundModalOpen = true;
			} catch (error) {
				// let err4string = get("chatpage.cchange35");
				// parentEpml.request('showSnackBar', `${err4string}`)
			}
		}

		getApiKey() {
			const apiNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			let apiKey = apiNode.apiKey
			return apiKey
		}

		async myFollowName(name) {
			let items = [
				name
			]
			let namesJsonString = JSON.stringify({ "items": items })
	
			let ret = await parentEpml.request('apiCall', {
				url: `/lists/followedNames?apiKey=${this.getApiKey()}`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: `${namesJsonString}`
			})
	
			if (ret === true) {
				this.myFollowedNames = this.myFollowedNames.filter(item => item != name)
				this.myFollowedNames.push(name)
			} else {
				let err3string = get("appspage.schange22")
				parentEpml.request('showSnackBar', `${err3string}`)
			}
			return ret
		}
	addToFriendList(val){
		if(this.editContent){
			const findFriend = this.friendList.findIndex(item=> item.name === val.name)
			if(findFriend !== -1){
				const copyList = [...this.friendList]
				copyList[findFriend] = val
				this.friendList = copyList
				
			}
			
		} else {
			this.friendList = [...this.friendList, val]
		}
		if(val.willFollow){
			this.myFollowName(val.name)
		}
		
		this.userSelected = {};
		this.isLoading = false;
		this.isOpenAddFriendsModal = false
		this.editContent = null
	}
	openEditFriend(val){
		this.isOpenAddFriendsModal = true
		this.userSelected = val
		this.editContent = val
	}

	onClose(){
		console.log('hello100')
		this.isLoading = false;
		this.isOpenAddFriendsModal = false
		this.editContent = null
		this.userSelected = {}
	}

	render() {
		console.log('friends', this.userSelected);
		return html`
			<div class="container">
				<div id="viewElement" class="container-body" style=${"position: relative"}>
					<p class="group-name">My Friends</p>
					<div class="search-field">
                                <input 
                                    type="text"
                                    class="name-input" 
                                    ?disabled=${this.isLoading} 
                                    id="sendTo" 
                                    placeholder="${translate("friends.friend1")}" 
                                    value=${this.userSelected.name ? this.userSelected.name: ''}
                                    @keypress=${(e) => {
                                        if(e.key === 'Enter'){
											this.userSearch()
										}
                                    }}
                                />
                                                               
                                    <vaadin-icon 
                                        @click=${this.userSearch}
                                        slot="icon" 
                                        icon="vaadin:open-book"
                                        class="search-icon">
                                    </vaadin-icon>
                                
                            </div>
					<div class="search-results-div">
                            <chat-search-results 
                                .onClickFunc=${(result) => {
                                    this.userSelected = result;
									this.isOpenAddFriendsModal = true
							
								console.log({result});
                                    this.userFound = [];
                                    this.userFoundModalOpen = false;
                                }}
                                .closeFunc=${() => {
                                    this.userFoundModalOpen = false;
                                    this.userFound = [];
                                }}
                                .searchResults=${this.userFound}
                                ?isOpen=${this.userFoundModalOpen}
                                ?loading=${this.isLoading}>
                            </chat-search-results>
                        </div>
					<br />

					${this.friendList.map((item) => {
						return html`<chat-side-nav-heads
							activeChatHeadUrl=""
							.setActiveChatHeadUrl=${(val) => {
							
							}}
							.chatInfo=${item}
							.openEditFriend=${(val)=> this.openEditFriend(val)}
						></chat-side-nav-heads>`;
					})}
					<div id="downObserver"></div>
				</div>
			</div>
			<add-friends-modal
                ?isOpen=${this.isOpenAddFriendsModal} 
				.setIsOpen=${(val)=> {
					this.isOpenAddFriendsModal = val
				}}
                .userSelected=${this.userSelected}
				.onSubmit=${(val)=> this.addToFriendList(val)}
                .editContent=${this.editContent}
				.onClose=${()=> this.onClose()}
            >
            </add-friends-modal>
		`;
	}
}

customElements.define('friends-view', FriendsView);
