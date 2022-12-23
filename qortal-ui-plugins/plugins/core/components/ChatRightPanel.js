import { LitElement, html, css } from "lit"
import { render } from "lit/html.js"
import { get, translate } from "lit-translate"
import { Epml } from "../../../epml"
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
			isOpenLeaveModal: { type: Boolean },
			leaveGroupObj: { type: Object },
			error: { type: Boolean },
			message: { type: String },
			chatHeads: { type: Array },
			groupAdmin: { attribute: false },
			groupMembers: { attribute: false },
			selectedHead: { type: Object },
            toggle: {attribute: false},
            getMoreMembers:{attribute: false}
		}
	}

	constructor() {
		super()
		this.isLoading = false
		this.isOpenLeaveModal = false
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
                margin-top: 15px;
                padding: 0px 5px;
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
		`
	}

	firstUpdated() {
        this.viewElement = this.shadowRoot.getElementById('viewElement');
        this.downObserverElement = this.shadowRoot.getElementById('downObserver');
        this.elementObserver();
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
						this.isOpenLeaveModal = false
					}
				} catch (error) {}
				stop = false
			}
		}
		interval = setInterval(getAnswer, 5000)
	}

	async unitFee(txType) {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=${txType}`
        let fee = null

        try {
            const res = await fetch(url)
            const data = await res.json()
            fee = (Number(data) / 1e8).toFixed(3)
        } catch (error) {
            fee = null
        }
  
      return fee
    }

	async getLastRef() {
		let myRef = await parentEpml.request("apiCall", {
			type: "api",
			url: `/addresses/lastreference/${this.selectedAddress.address}`,
		})
		return myRef
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
	render() {
        console.log('this.groupMembers', this.groupMembers)
        const owner = this.groupAdmin.filter((admin)=> admin.address === this.leaveGroupObj.owner)
		return html`
        <div class="container">
        <div class="close-row" style="margin-top: 15px">
        <vaadin-icon class="top-bar-icon" @click=${()=> this.toggle(false)} style="margin: 0px 10px" icon="vaadin:close" slot="icon"></vaadin-icon>
        </div>
        <div id="viewElement" class="container-body">
            <p style="font-size: 20px;">${this.leaveGroupObj && this.leaveGroupObj.groupName}</p>
                <p style="font-size: 14px;margin-top: 5px">${this.leaveGroupObj && this.leaveGroupObj.description}</p>
                <p style="font-size: 14px;margin-top: 10px">Members: ${this.leaveGroupObj && this.leaveGroupObj.memberCount}</p>

                <p style="font-size: 14px;margin-top: 5px">Date created : ${new Date(this.leaveGroupObj.created).toLocaleDateString("en-US")}</p>
                <br />
                <p class="chat-right-panel-label">Group Owner</p>
                ${owner.map((item) => {
					return html`<chat-side-nav-heads
						activeChatHeadUrl=""
						.setActiveChatHeadUrl=${(val) => {}}
						chatInfo=${JSON.stringify(item)}
					></chat-side-nav-heads>`
				})}
                <p class="chat-right-panel-label">Admins</p>
                ${this.groupAdmin.map((item) => {
					return html`<chat-side-nav-heads
						activeChatHeadUrl=""
						.setActiveChatHeadUrl=${(val) => {}}
						chatInfo=${JSON.stringify(item)}
					></chat-side-nav-heads>`
				})}
                <p class="chat-right-panel-label">Members</p>
                ${this.groupMembers.map((item) => {
					return html`<chat-side-nav-heads
						activeChatHeadUrl=""
						.setActiveChatHeadUrl=${(val) => {
							console.log({ val })
							this.selectedHead = val
							this.isOpenLeaveModal = true
						}}
						chatInfo=${JSON.stringify(item)}
					></chat-side-nav-heads>`
				})}
                <div id='downObserver'></div>
            </div>

         <wrapper-modal 
                .removeImage=${() => {
					if (this.isLoading) return
					this.isOpenLeaveModal = false
				}} 
                style=${
					this.isOpenLeaveModal ? "display: block" : "display: none"
				}>
                    <div style="text-align:center">
                        <h1>${translate("grouppage.gchange35")}</h1>
                        <hr>
                    </div>
                    
                    <button @click=${() =>
						this._addAdmin(
							this.leaveGroupObj.groupId
						)}>Promote to Admin</button>
                     <button @click=${() =>
						this._removeAdmin(
							this.leaveGroupObj.groupId
						)}>Remove as Admin</button>
                    <div style="text-align:right; height:36px;">
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
                        <span ?hidden=${this.message === ""} style="${
			this.error ? "color:red;" : ""
		}">
                            ${this.message}
                        </span>
                    </div>
                    
                  
                    <button
                    @click=${() => {
						this.isOpenLeaveModal = false
					}}
                    class="modal-button"
                        ?disabled="${this.isLoading}"
                    
                    >
                    ${translate("general.close")}
                    </button>
                </wrapper-modal >
                </div>
                </div>
    `
	}
}

customElements.define("chat-right-panel", ChatRightPanel)
