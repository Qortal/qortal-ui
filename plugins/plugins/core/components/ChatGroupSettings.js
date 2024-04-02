import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@material/mwc-icon'
import './WrapperModal'
import {get, translate} from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatGroupSettings extends LitElement {
  static get properties() {
    return {
      isLoading: { type: Boolean },
      isOpenLeaveModal: {type: Boolean},
      leaveGroupObj: { type: Object },
      error: {type: Boolean},
      message: {type: String},
      chatHeads: {type: Array},
      setActiveChatHeadUrl: {attribute: false}
    }
  }

  constructor() {
    super()
    this.isLoading = false;
    this.isOpenLeaveModal = false
    this.leaveGroupObj = {}
    this.leaveFee = 0.001
    this.error = false
    this.message = ''
    this.chatHeads = []
  }

  static get styles() {
    return css`
      .top-bar-icon {
            cursor: pointer;
            height: 18px;
            width: 18px;
            transition: .2s all;
        }

        .top-bar-icon:hover {
            color: var(--black)
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

  firstUpdated() {

    }

    timeIsoString(timestamp) {
        let myTimestamp = timestamp === undefined ? 1587560082346 : timestamp
        let time = new Date(myTimestamp)
        return time.toISOString()
    }

    resetDefaultSettings() {
        this.error = false
        this.message = ''
        this.isLoading = false
    }

    renderErr9Text() {
        return html`${translate("grouppage.gchange49")}`
    }

    async confirmRelationship() {


		let interval = null
		let stop = false
		const getAnswer = async () => {
			const currentChats = this.chatHeads

			if (!stop) {
				stop = true;
				try {
                    const findGroup = currentChats.find((item)=> item.groupId === this.leaveGroupObj.groupId)
					if (!findGroup) {
						clearInterval(interval)
						this.isLoading = false
                        this.isOpenLeaveModal= false
                        this.setActiveChatHeadUrl('')
					}

				} catch (error) {
				}
				stop = false
			}
		};
		interval = setInterval(getAnswer, 5000);
	}

    async _convertToPrivate(groupId) {
        // Reset Default Settings...
        this.resetDefaultSettings()
        const leaveFeeInput = this.leaveFee

        this.isLoading = true

        // Get Last Ref
        const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
        };

        const validateReceiver = async () => {
            let lastRef = await getLastRef();
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }
        const convertBytesForSigning = async (transactionBytesBase58) => {
			return await parentEpml.request("apiCall", {
				type: "api",
				method: "POST",
				url: `/transactions/convert`,
				body: `${transactionBytesBase58}`,
			})
        }


        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {
            let groupdialog3 = get("transactions.groupdialog3")
            let groupdialog4 = get("transactions.groupdialog4")

            const body = {
                "timestamp": Date.now(),
                "reference": lastRef,
                "fee": leaveFeeInput,
                "ownerPublicKey": window.parent.Base58.encode(window.parent.reduxStore.getState().app.selectedAddress.keyPair.publicKey),
                "groupId": groupId,
                "newOwner": "QdR4bQ1fJFnSZgswtW27eE8ToXwHqUQyaU",
                "newIsOpen": false,
                "newDescription": "my group for accounts I like",
                "newApprovalThreshold": "NONE",
                "newMinimumBlockDelay": 5,
            "newMaximumBlockDelay": 60
              }
              console.log('STRING3')
            // const bodyToString = JSON.stringify(body)
            // let transactionBytes = await parentEpml.request("apiCall", {
			// 	type: "api",
			// 	method: "POST",
			// 	url: `/groups/update`,
			// 	body: bodyToString,
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
			// })
            // console.log({transactionBytes})
            // const readforsign = await convertBytesForSigning(transactionBytes)
            // // const res = await signAndProcess(transactionBytes)
            // const body2 = {
            //     "privateKey": window.parent.Base58.encode(window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey),
            //     "transactionBytes": readforsign
            //   }
            //   const bodyToString2 = JSON.stringify(body2)
            // let signTransaction = await parentEpml.request("apiCall", {
			// 	type: "api",
			// 	method: "POST",
			// 	url: `/transactions/sign`,
			// 	body: bodyToString2,
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
			// })
            // let processTransaction = await parentEpml.request("apiCall", {
			// 	type: "api",
			// 	method: "POST",
			// 	url: `/transactions/process`,
			// 	body: signTransaction,
			// })
            // return processTransaction
            console.log('this.selectedAddress.nonce', this.selectedAddress.nonce)
			return await parentEpml.request('transaction', {
				type: 23,
				nonce: this.selectedAddress.nonce,
				params: {
					_groupId: groupId,
					lastReference: lastRef,
					fee: leaveFeeInput,
					"newOwner": "QdR4bQ1fJFnSZgswtW27eE8ToXwHqUQyaU",
					"newIsOpen": false,
					"newDescription": "my group for accounts I like",
					"newApprovalThreshold": "NONE",
					"newMinimumBlockDelay": 5,
					"newMaximumBlockDelay": 60
				}
			})
        }

        const getTxnRequestResponse = (txnResponse) => {

          if (txnResponse === true) {
                this.message = this.renderErr9Text()
                this.error = false
                this.confirmRelationship()
            } else {
                this.error = true
                this.message = ""
                throw new Error(txnResponse)
            }
        }
        await validateReceiver()
    }

  render() {
    console.log('leaveGroupObj', this.leaveGroupObj)
    return html`
         <vaadin-icon @click=${()=> {
            this.isOpenLeaveModal = true
         }} class="top-bar-icon" style="margin: 0px 20px" icon="vaadin:cog" slot="icon"></vaadin-icon>
         <!-- Leave Group Dialog -->
         <wrapper-modal
                .removeImage=${() => {
                    if(this.isLoading) return
                    this.isOpenLeaveModal = false
                } }
                style=${(this.isOpenLeaveModal) ? "display: block" : "display: none"}>
                    <div style="text-align:center">
                        <h1>${translate("grouppage.gchange35")}</h1>
                        <hr>
                    </div>
                    <
                    <button @click=${() => this._convertToPrivate(this.leaveGroupObj.groupId, this.leaveGroupObj.groupName)}> Convert a public group to private</button>

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
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
                            ${this.message}
                        </span>
                    </div>


                    <button
                    @click=${() => {
                        this.isOpenLeaveModal= false
                    }}
                    class="modal-button"
                        ?disabled="${this.isLoading}"

                    >
                    ${translate("general.close")}
                    </button>
                </wrapper-modal >
    `;
  }
}

customElements.define('chat-group-settings', ChatGroupSettings);
