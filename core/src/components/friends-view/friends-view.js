import {html, LitElement} from 'lit';
import {connect} from 'pwa-helpers';

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

import {translate,} from '../../../translate'
import {store} from '../../store';
import {friendsViewStyles} from './friends-view-css';
import {parentEpml} from '../show-plugin';

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
			editContent: {type: Object},
			mySelectedFeeds: {type: Array},
			refreshFeed: {attribute: false},
			closeSidePanel: {attribute: false, type: Object},
			openSidePanel: {attribute:false, type: Object}
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
		this.friendList = [];
		this.userSelected = {};
		this.isLoading = false;
		this.userFoundModalOpen = false
		this.userFound = [];
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.isOpenAddFriendsModal = false
		this.editContent = null
		this.addToFriendList = this.addToFriendList.bind(this)
		this._updateFriends = this._updateFriends.bind(this)
		this._updateFeed = this._updateFeed.bind(this)
		this._addFriend = this._addFriend.bind(this)

	}

	getNodeUrl() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			]

		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}
	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
			]
	}

	getMoreFriends() {}

	firstUpdated() {
		this.viewElement = this.shadowRoot.getElementById('viewElement');
		this.downObserverElement =
			this.shadowRoot.getElementById('downObserver');
		this.elementObserver();
		this.mySelectedFeeds = JSON.parse(localStorage.getItem('friends-my-selected-feeds') || "[]")
		this.friendList = JSON.parse(localStorage.getItem('friends-my-friend-list') || "[]")




	}

	_updateFriends(event) {
		this.friendList = event.detail
	}
	_updateFeed(event) {
		this.mySelectedFeeds = event.detail
		this.requestUpdate()
	}
	_addFriend(event){
		const name = event.detail;
		const findFriend = this.friendList.find((friend)=> friend.name === name)
		if(findFriend){
			this.editContent = {...findFriend, mySelectedFeeds: this.mySelectedFeeds}
			this.userSelected = findFriend;

		} else {
			this.userSelected = {
				name
			};
		}

		this.isOpenAddFriendsModal = true
		this.openSidePanel()
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('friends-my-friend-list-event', this._updateFriends)
		window.addEventListener('friends-my-selected-feeds-event', this._updateFeed)
		window.addEventListener('add-friend', this._addFriend)
	}

	disconnectedCallback() {
		window.removeEventListener('friends-my-friend-list-event', this._updateFriends)
		window.removeEventListener('friends-my-selected-feeds-event', this._updateFeed)
		window.removeEventListener('add-friend', this._addFriend)

		super.disconnectedCallback()
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
						result
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
			return apiNode.apiKey
		}

		async myFollowName(name) {
			let items = [
				name
			]
			let namesJsonString = JSON.stringify({ "items": items })

			return await parentEpml.request('apiCall', {
				url: `/lists/followedNames?apiKey=${this.getApiKey()}`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: `${namesJsonString}`
			})
		}

		async unFollowName(name) {
			let items = [
				name
			]
			let namesJsonString = JSON.stringify({ "items": items })

			return await parentEpml.request('apiCall', {
				url: `/lists/followedNames?apiKey=${this.getApiKey()}`,
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: `${namesJsonString}`
			})
		}
	async addToFriendList(val, isRemove){
		const copyVal = {...val}
		delete copyVal.mySelectedFeeds
		if(isRemove){
			this.friendList = this.friendList.filter((item)=> item.name !== copyVal.name)
		}else if(this.editContent){
			const findFriend = this.friendList.findIndex(item=> item.name === copyVal.name)
			if(findFriend !== -1){
				const copyList = [...this.friendList]
				copyList[findFriend] = copyVal
				this.friendList = copyList

			}

		} else {
			this.friendList = [...this.friendList, copyVal]
		}
		if(!copyVal.willFollow || isRemove) {
			await this.unFollowName(copyVal.name)
		} else if(copyVal.willFollow){
			await this.myFollowName(copyVal.name)
		}
		this.setMySelectedFeeds(val.mySelectedFeeds)
		await new Promise((res)=> {
			setTimeout(()=> {
				res()
			},50)
		})
		this.userSelected = {};
		this.shadowRoot.getElementById('sendTo').value = ''
		this.isLoading = false;
		this.isOpenAddFriendsModal = false
		this.editContent = null
		this.setMyFriends(this.friendList)
		if(!isRemove && this.friendList.length === 1){
			this.refreshFeed()
		}
	}
	setMyFriends(friendList){
		localStorage.setItem('friends-my-friend-list', JSON.stringify(friendList));
		const tempSettingsData= JSON.parse(localStorage.getItem('temp-settings-data') || "{}")
		const newTemp = {
			...tempSettingsData,
			userLists: {
				data: [friendList],
				timestamp: Date.now()
			}
		}

		localStorage.setItem('temp-settings-data', JSON.stringify(newTemp));
		this.dispatchEvent(
			new CustomEvent('temp-settings-data-event', {
			  bubbles: true,
			  composed: true
			}),
		  );

	}
	setMySelectedFeeds(mySelectedFeeds){
		this.mySelectedFeeds = mySelectedFeeds
		const tempSettingsData= JSON.parse(localStorage.getItem('temp-settings-data') || "{}")
		const newTemp = {
			...tempSettingsData,
			friendsFeed: {
				data: mySelectedFeeds,
				timestamp: Date.now()
			}
		}

		localStorage.setItem('temp-settings-data', JSON.stringify(newTemp));
		localStorage.setItem('friends-my-selected-feeds', JSON.stringify(mySelectedFeeds));
	}
	openEditFriend(val){
		this.isOpenAddFriendsModal = true
		this.userSelected = val
		this.editContent = {...val, mySelectedFeeds: this.mySelectedFeeds}
	}

	onClose(){
		this.isLoading = false;
		this.isOpenAddFriendsModal = false
		this.editContent = null
		this.userSelected = {}
	}

	render() {
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
                                        icon="vaadin:search"
                                        class="search-icon">
                                    </vaadin-icon>

                            </div>
					<div class="search-results-div">
                            <chat-search-results
                                .onClickFunc=${(result) => {
                                    this.userSelected = result;
									this.isOpenAddFriendsModal = true

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


					${this.friendList.map((item) => {
						return html`<chat-side-nav-heads
							activeChatHeadUrl=""
							.setActiveChatHeadUrl=${(val) => {

							}}
							.chatInfo=${item}
							.openEditFriend=${(val)=> this.openEditFriend(val)}
							.closeSidePanel=${this.closeSidePanel}
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
				.onSubmit=${(val, isRemove)=> this.addToFriendList(val, isRemove)}
                .editContent=${this.editContent}
				.onClose=${()=> this.onClose()}
				.mySelectedFeeds=${this.mySelectedFeeds}
            >
            </add-friends-modal>
		`;
	}
}

customElements.define('friends-view', FriendsView);
