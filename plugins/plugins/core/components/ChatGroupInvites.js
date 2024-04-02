import {css, html, LitElement} from "lit"
import {Epml} from "../../../epml"
import "@material/mwc-button"
import "@material/mwc-dialog"
import "@polymer/paper-spinner/paper-spinner-lite.js"
import "@material/mwc-icon"
import "./WrapperModal"
import {translate} from '../../../../core/translate'

const parentEpml = new Epml({ type: "WINDOW", source: window.parent })

class ChatGroupInvites extends LitElement {
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
		`
	}

	firstUpdated() {}

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

	async getLastRef() {
		return await parentEpml.request("apiCall", {
			type: "api",
			url: `/addresses/lastreference/${this.selectedAddress.address}`,
		})
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
		return await parentEpml.request("apiCall", {
			type: "api",
			method: "POST",
			url: `/transactions/convert`,
			body: `${transactionBytesBase58}`,
		})
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
		// Reset Default Settings...
		this.resetDefaultSettings()
		const leaveFeeInput = this.leaveFee

		this.isLoading = true

		// Get Last Ref

		const validateReceiver = async () => {
			let lastRef = await this.getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)
			this.getTxnRequestResponse(myTransaction, lastRef )
		}

		// Make Transaction Request
		const makeTransactionRequest = async (lastRef) => {
			const body = {
				timestamp: Date.now(),
				reference: lastRef,
				fee: leaveFeeInput,
				ownerPublicKey: window.parent.Base58.encode(
					window.parent.reduxStore.getState().app.selectedAddress
						.keyPair.publicKey
				),
				groupId: groupId,
				member: this.selectedHead.address,
			}
			const bodyToString = JSON.stringify(body)
			let transactionBytes = await parentEpml.request("apiCall", {
				type: "api",
				method: "POST",
				url: `/groups/addadmin`,
				body: bodyToString,
				headers: {
					"Content-Type": "application/json",
				},
			})
			const readforsign = await this.convertBytesForSigning(
				transactionBytes
			)
			const body2 = {
				privateKey: window.parent.Base58.encode(
					window.parent.reduxStore.getState().app.selectedAddress
						.keyPair.privateKey
				),
				transactionBytes: readforsign,
			}
			const bodyToString2 = JSON.stringify(body2)
			let signTransaction = await this.signTx(bodyToString2)
			return await this.process(signTransaction)
		}

		await validateReceiver()
	}

    async _removeAdmin(groupId) {
		// Reset Default Settings...
		this.resetDefaultSettings()
		const leaveFeeInput = this.leaveFee

		this.isLoading = true

		// Get Last Ref

		const validateReceiver = async () => {
			let lastRef = await this.getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)
			this.getTxnRequestResponse(myTransaction, lastRef)
		}

		// Make Transaction Request
		const makeTransactionRequest = async (lastRef) => {
			const body = {
				timestamp: Date.now(),
				reference: lastRef,
				fee: leaveFeeInput,
				ownerPublicKey: window.parent.Base58.encode(
					window.parent.reduxStore.getState().app.selectedAddress
						.keyPair.publicKey
				),
				groupId: groupId,
				admin: this.selectedHead.address,
			}
			const bodyToString = JSON.stringify(body)
			let transactionBytes = await parentEpml.request("apiCall", {
				type: "api",
				method: "POST",
				url: `/groups/removeadmin`,
				body: bodyToString,
				headers: {
					"Content-Type": "application/json",
				},
			})
			const readforsign = await this.convertBytesForSigning(
				transactionBytes
			)
			const body2 = {
				privateKey: window.parent.Base58.encode(
					window.parent.reduxStore.getState().app.selectedAddress
						.keyPair.privateKey
				),
				transactionBytes: readforsign,
			}
			const bodyToString2 = JSON.stringify(body2)
			let signTransaction = await this.signTx(bodyToString2)
			return await this.process(signTransaction)
		}

		await validateReceiver()
	}

	render() {
		console.log("leaveGroupObj", this.leaveGroupObj)
		return html`
           <vaadin-icon @click=${()=> {
            this.isOpenLeaveModal = true
         }} class="top-bar-icon" style="margin: 0px 20px" icon="vaadin:users" slot="icon"></vaadin-icon>

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
    `
	}
}

customElements.define("chat-right-panel", ChatGroupInvites)
