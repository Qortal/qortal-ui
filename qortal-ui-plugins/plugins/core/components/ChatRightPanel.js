import { LitElement, html, css } from "lit"
import { render } from "lit/html.js"
import { get, translate } from "lit-translate"
import { Epml } from "../../../epml"
import { getUserNameFromAddress } from "../../utils/getUserNameFromAddress"
import snackbar from "./snackbar.js"
import "@material/mwc-button"
import "@material/mwc-dialog"
import "@polymer/paper-spinner/paper-spinner-lite.js"
import "@material/mwc-icon"
import "./WrapperModal"

const parentEpml = new Epml({ type: "WINDOW", source: window.parent })

class ChatRightPanel extends LitElement {
	static get properties() {
		return {
			isLoading: { type: Boolean },
			openUserInfo: { type: Boolean },
			leaveGroupObj: { type: Object },
			error: { type: Boolean },
			message: { type: String },
			chatHeads: { type: Array },
			groupAdmin: { attribute: false },
			groupMembers: { attribute: false },
			selectedHead: { type: Object },
            toggle: { attribute: false },
            getMoreMembers:{ attribute: false },
            setOpenPrivateMessage: { attribute: false },
            openTipUser: { type: Boolean },
            userName: { type: String },
            chatEditor: { type: Object },
            walletBalance: { type: Number }
		}
	}

	constructor() {
		super()
		this.isLoading = false
		this.openUserInfo = false
		this.leaveGroupObj = {}
		this.leaveFee = 0.001
		this.error = false
		this.message = ""
		this.chatHeads = []
		this.groupAdmin = []
		this.groupMembers = []
        this.observerHandler = this.observerHandler.bind(this)
        this.viewElement = ''
        this.downObserverElement = ''
        this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
        this.openTipUser = false
        this.userName = {}
	}

    static get styles() {
    return css`
        .top-bar-icon {
            cursor: pointer;
            height: 18px;
            width: 18px;
            transition: 0.2s all;
        }

        .top-bar-icon:hover {
            color: var(--black);
        }

        .modal-button {
            font-family: Roboto, sans-serif;
            font-size: 16px;
            color: var(--mdc-theme-primary);
            background-color: transparent;
            padding: 8px 10px;
            border-radius: 5px;
            border: none;
            transition: all 0.3s ease-in-out;
        }

        .close-row {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            height: 50px;
            flex:0

        }

        .container-body {
            width: 100%;
            display: flex; 
            flex-direction: column; 
            flex-grow: 1; 
            overflow:auto;
            margin-top: 5px;
            padding: 0px 6px;
            box-sizing: border-box;
        }

        .container-body::-webkit-scrollbar-track {
            background-color: whitesmoke;
            border-radius: 7px;
        }
        
        .container-body::-webkit-scrollbar {
            width: 6px;
            border-radius: 7px;
            background-color: whitesmoke;
        }
        
        .container-body::-webkit-scrollbar-thumb {
            background-color: rgb(180, 176, 176);
            border-radius: 7px;
            transition: all 0.3s ease-in-out;
        }

        .container-body::-webkit-scrollbar-thumb:hover {
            background-color: rgb(148, 146, 146);
            cursor: pointer;
        }   

        p {
            color: var(--black);
            margin: 0px;
            padding: 0px;
            word-break: break-all;
        }

        .container {
            display: flex;
            width: 100%;
            flex-direction: column;
            height: 100%;
        }

        .chat-right-panel-label {
            font-family: Montserrat, sans-serif;
            color: var(--group-header);
            padding: 5px;
            font-size: 13px;
            user-select: none;
        }

        .group-info {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 10px;
        }

        .group-name {
            font-family: Raleway, sans-serif;
            font-size: 20px;
            color: var(--chat-bubble-msg-color);
            text-align: center;
            user-select: none;
        }

        .group-description {
            font-family: Roboto, sans-serif;
            color: var(--chat-bubble-msg-color);
            letter-spacing: 0.3px;
            font-weight: 300;
            font-size: 14px;
            margin-top: 15px;
            word-break: break-word;
            user-select: none;
        }

        .group-subheader {
            font-family: Montserrat, sans-serif;
            font-size: 14px;
            color: var(--chat-bubble-msg-color);
        }

        .group-data {
            font-family: Roboto, sans-serif;
            letter-spacing: 0.3px;
            font-weight: 300;
            font-size: 14px;
            color: var(--chat-bubble-msg-color);
        }
        
        .user-info-header {
            font-family: Montserrat, sans-serif;
            text-align: center;
            font-size: 25px;
            color: var(--chat-bubble-msg-color);
            margin-bottom: 10px;
            padding: 10px 0;
            user-select: none;
        }

        .send-message-button {
            font-family: Roboto, sans-serif;
            letter-spacing: 0.3px;
            font-weight: 300;
            padding: 8px 5px;
            border-radius: 3px;
            text-align: center;
            color: var(--mdc-theme-primary);
            transition: all 0.3s ease-in-out;
        }

        .send-message-button:hover {
        cursor: pointer;
        background-color: #03a8f485;
        }

        .close-icon {
            position: absolute;
            top: 3px;
            right: 5px;
            color: #676b71;
            width: 14px;
            transition: all 0.1s ease-in-out;
        }

        .close-icon:hover {
            cursor: pointer;
            color: #494c50;
        }

        .tip-user-header {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid whitesmoke;
            gap: 25px;
        }

        .tip-user-header-font {
            font-family: Montserrat, sans-serif;
            font-size: 20px;
            color: var(--chat-bubble-msg-color);
        }

        .tip-user-body {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 20px 10px;
            flex-direction: column;
            gap: 15px;
        }

        .tip-input {
            width: 300px;
            margin-bottom: 15px;
            outline: 0;
            border-width: 0 0 2px;
            border-color: var(--mdc-theme-primary);
            background-color: transparent;
            padding: 10px;
            font-family: Roboto, sans-serif;
            font-size: 15px;
            color: var(--chat-bubble-msg-color);
        }

        .tip-input::selection {
            background-color: var(--mdc-theme-primary);
            color: white;   
        }

        .tip-input::placeholder {
            opacity: 0.9;
            color: var(--black);
        }

    `
    }

	firstUpdated() {
        this.viewElement = this.shadowRoot.getElementById('viewElement');
        this.downObserverElement = this.shadowRoot.getElementById('downObserver');
        this.elementObserver();
        this.fetchWalletDetails();
    }

    async updated(changedProperties) {
        if (changedProperties && changedProperties.has('selectedHead')) {
            if (this.selectedHead !== {}) {             
                const userName = await getUserNameFromAddress(this.selectedHead.address);
                this.userName = userName;
            }
        }
    }

	timeIsoString(timestamp) {
		let myTimestamp = timestamp === undefined ? 1587560082346 : timestamp
		let time = new Date(myTimestamp)
		return time.toISOString()
	}

	resetDefaultSettings() {
		this.error = false
		this.message = ""
		this.isLoading = false
	}

	renderErr9Text() {
		return html`${translate("grouppage.gchange49")}`
	}

	async confirmRelationship(reference) {
		let interval = null
		let stop = false
		const getAnswer = async () => {


			if (!stop) {
				stop = true
				try {
					let myRef = await parentEpml.request("apiCall", {
                        type: "api",
                        url: `/transactions/reference/${reference}`,
                    })
					if (myRef && myRef.type) {
						clearInterval(interval)
						this.isLoading = false
						this.openUserInfo = false
					}
				} catch (error) {}
				stop = false
			}
		}
		interval = setInterval(getAnswer, 5000)
	}

	async unitFee(txType) {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const url = `${nodeUrl}/transactions/unitfee?txType=${txType}`;
        let fee = null;

        try {
            const res = await fetch(url);
            const data = await res.json();
            fee = (Number(data) / 1e8).toFixed(3);
        } catch (error) {
            fee = null;
        }
  
      return fee;
    }

	async getLastRef() {
		let myRef = await parentEpml.request("apiCall", {
			type: "api",
			url: `/addresses/lastreference/${this.selectedAddress.address}`,
		})
		return myRef;
	}

	getTxnRequestResponse(txnResponse, reference) {
		if (txnResponse === true) {
			this.message = this.renderErr9Text()
			this.error = false
			this.confirmRelationship(reference)
		} else {
			this.error = true
			this.message = ""
			throw new Error(txnResponse)
		}
	}

	async convertBytesForSigning(transactionBytesBase58) {
		let convertedBytes = await parentEpml.request("apiCall", {
			type: "api",
			method: "POST",
			url: `/transactions/convert`,
			body: `${transactionBytesBase58}`,
		})
		return convertedBytes
	}

    async signTx(body){
        return  await parentEpml.request("apiCall", {
            type: "api",
            method: "POST",
            url: `/transactions/sign`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
   
    async process(body){
        return  await parentEpml.request("apiCall", {
            type: "api",
            method: "POST",
            url: `/transactions/process`,
            body: body,
        })
    }
	async _addAdmin(groupId) {
		this.resetDefaultSettings()
    
        const leaveFeeInput = await this.unitFee('ADD_GROUP_ADMIN')
        if(!leaveFeeInput){
            throw Error()
        }
        this.isLoading = true

        // Get Last Ref
        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        const validateReceiver = async () => {
            let lastRef = await getLastRef();
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {
            let groupdialog3 = get("transactions.groupdialog3")
            let groupdialog4 = get("transactions.groupdialog4")
            let myTxnrequest = await parentEpml.request('transaction', {
                type: 24,
                nonce: this.selectedAddress.nonce,
                params: {
					_groupId: groupId,
                    fee: leaveFeeInput,
                    member: this.selectedHead.address,
                    lastReference: lastRef
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {

            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderErr9Text()
                this.error = false
                this.confirmRelationship()
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
	}

    async _removeAdmin(groupId) {
		this.resetDefaultSettings()
    
        const leaveFeeInput = await this.unitFee('REMOVE_GROUP_ADMIN')
        if(!leaveFeeInput){
            throw Error()
        }
        this.isLoading = true

        // Get Last Ref
        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        const validateReceiver = async () => {
            let lastRef = await getLastRef();
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {
            let groupdialog3 = get("transactions.groupdialog3")
            let groupdialog4 = get("transactions.groupdialog4")
            let myTxnrequest = await parentEpml.request('transaction', {
                type: 25,
                nonce: this.selectedAddress.nonce,
                params: {
					_groupId: groupId,
                    fee: leaveFeeInput,
                    member: this.selectedHead.address,
                    lastReference: lastRef
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {

            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderErr9Text()
                this.error = false
                this.confirmRelationship()
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
	}

    elementObserver() {
        const options = {
            root: this.viewElement,
            rootMargin: '0px',
            threshold: 1
        }
        // identify an element to observe
        const elementToObserve = this.downObserverElement;
        // passing it a callback function
        const observer = new IntersectionObserver(this.observerHandler, options);
        // call `observe()` on that MutationObserver instance,
        // passing it the element to observe, and the options object
        observer.observe(elementToObserve);
        }
        observerHandler(entries) {
            if (!entries[0].isIntersecting) {
                return
            } else {
                if(this.groupMembers.length < 20){
                    return
                }
                console.log('this.leaveGroupObjp', this.leaveGroupObj)
                this.getMoreMembers(this.leaveGroupObj.groupId)
            }
        }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    async fetchWalletDetails() {
        parentEpml.request('apiCall', {
            url: `/addresses/balance/${this.myAddress}?apiKey=${this.getApiKey()}`,
        })
        .then((res) => {
            if (isNaN(Number(res))) {
                let snack4string = get("grouppage.gchange60")
                parentEpml.request('showSnackBar', `${snack4string}`)
            } else {
                    this.walletBalance = Number(res).toFixed(8);
            }
        })					 
    }

	render() {
        console.log('this.groupMembers', this.groupMembers);
        console.log(20, "Chat Right Panel Here");
        const owner = this.groupAdmin.filter((admin)=> admin.address === this.leaveGroupObj.owner)
		return html`
        <div class="container">
            <div class="close-row" style="margin-top: 15px">
                <vaadin-icon class="top-bar-icon" @click=${()=> this.toggle(false)} style="margin: 0px 10px" icon="vaadin:close" slot="icon"></vaadin-icon>
            </div>
            <div id="viewElement" class="container-body">
                <p class="group-name">${this.leaveGroupObj && this.leaveGroupObj.groupName}</p> 
                <div class="group-info">
                    <p class="group-description">${this.leaveGroupObj && this.leaveGroupObj.description}</p>
                    <p class="group-subheader">Members: <span class="group-data">${this.leaveGroupObj && this.leaveGroupObj.memberCount}</span></p>
        
                    <p class="group-subheader">Date created : <span class="group-data">${new Date(this.leaveGroupObj.created).toLocaleDateString("en-US")}</span></p>
                </div>
                <br />
                <p class="chat-right-panel-label">GROUP OWNER</p>
                ${owner.map((item) => {
                    return html`<chat-side-nav-heads
                        activeChatHeadUrl=""
                        .setActiveChatHeadUrl=${(val) => {
                            if (val.address === this.myAddress) return;
                            console.log({ val });
                            this.selectedHead = val;
                            this.openUserInfo = true;
                        }}
                        chatInfo=${JSON.stringify(item)}
                    ></chat-side-nav-heads>`
                })}
                <p class="chat-right-panel-label">ADMINS</p>
                ${this.groupAdmin.map((item) => {
                    return html`<chat-side-nav-heads
                        activeChatHeadUrl=""
                        .setActiveChatHeadUrl=${(val) => {
                            if (val.address === this.myAddress) return;
                            console.log({ val });
                            this.selectedHead = val;
                            this.openUserInfo = true;
                        }}
                        chatInfo=${JSON.stringify(item)}
                    ></chat-side-nav-heads>`
                })}
                <p class="chat-right-panel-label">MEMBERS</p>
                ${this.groupMembers.map((item) => {
                    return html`<chat-side-nav-heads
                        activeChatHeadUrl=""
                        .setActiveChatHeadUrl=${(val) => {
                            if (val.address === this.myAddress) return;
                            console.log({ val });
                            this.selectedHead = val;
                            this.openUserInfo = true;
                        }}
                        chatInfo=${JSON.stringify(item)}
                    ></chat-side-nav-heads>`
                })}
                <div id='downObserver'></div>
            </div>

         <wrapper-modal 
            .onClickFunc=${() => {
                if (this.isLoading) return
                this.openUserInfo = false
            }} 
            style=${
                this.openUserInfo ? "display: block" : "display: none"
            }>
            <div style=${"position: relative;"}>
                <vaadin-icon
                class="close-icon"
                icon="vaadin:close-big"
                slot="icon"
                @click=${() => {
                    this.openUserInfo = false
                }}
                ?disabled="${this.isLoading}">
                </vaadin-icon>
                <div class="user-info-header">
                ${translate("grouppage.gchange35")}
                </div>
                <div 
                    class="send-message-button" 
                    @click="${() => {
                        this.setOpenPrivateMessage({
                            name: this.userName,
                            open: true   
                        })
                        this.openUserInfo = false
                    }   
                }">
                    ${translate("grouppage.gchange56")}
                </div>
                    <div 
                    style=${"margin-top: 5px;"} 
                    class="send-message-button" 
                    @click=${() => {
                        this.openTipUser = true
                        this.openUserInfo = false
                        this.chatEditor.disable();
                    }}>
                        ${translate("grouppage.gchange57")}
                    </div>
                <div ?hidden="${!this.isLoading || this.message === ""}" style="text-align: right; height: 36px;">
                    <span ?hidden="${!this.isLoading}">
                        <!-- loading message -->
                        ${translate("grouppage.gchange36")} &nbsp;
                        <paper-spinner-lite
                            style="margin-top:12px;"
                            ?active="${this.isLoading}"
                            alt="Leaving"
                        >
                        </paper-spinner-lite>
                    </span>
                    <span 
                    ?hidden=${this.message === ""} 
                    style="${this.error ? "color:red;" : ""}">
                        ${this.message}
                    </span>
                </div>
            </div>
            </wrapper-modal>
            <wrapper-modal
            .onClickFunc=${() => {
                this.openTipUser = false;
                this.chatEditor.enable();
            }}
             style=${this.openTipUser ? "display: block" : "display: none"}>
                <div class="tip-user-header">      
                    <img src="/img/qort.png" width="32" height="32">
                    <p class="tip-user-header-font">${translate("grouppage.gchange55")} ${this.userName}</p>
                </div>
                <div class="tip-user-body">
                    <p class="tip-available">${translate("grouppage.gchange59")}: ${this.walletBalance} QORT</p>
                    <input class="tip-input" type="number" placeholder="${translate("grouppage.gchange58")}" />
                </div>
            </wrapper-modal>
        </div>
    </div>
    `
	}
}

customElements.define("chat-right-panel", ChatRightPanel)
